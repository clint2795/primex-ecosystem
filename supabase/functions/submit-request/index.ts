// PrimeX Commercial Authority & Price Integrity intake.
// New public requests contain productCode + qty only.
// Every commercial field stored below is resolved server-side from the current authority.

import {
  HttpError,
  canonicalItems,
  canonicalRequestRef,
  cleanText,
  clientSelections,
} from "./commercial-contract.mjs";

const MAX_BODY_BYTES = 50_000;

type IntakeRequest = {
  requestId?: unknown;
  authorityVersion?: unknown;
  customer?: {
    name?: unknown;
    email?: unknown;
    whatsapp?: unknown;
    contact?: unknown;
    preferredContact?: unknown;
  };
  items?: unknown[];
  requestNotes?: unknown;
  publicSafeNotes?: unknown;
};

type AuthorityProduct = {
  authority_version: string;
  product_code: string;
  display_name: string;
  strength: string;
  supply_format: string;
  product_kind: "single_vial" | "research_set";
  public_price: number | string;
  price_mode: "fixed";
  active_for_new_request: boolean;
  components: Array<{ productCode: string; quantity: number }>;
};

function configuredOrigins(): string[] {
  return cleanText(Deno.env.get("REQUEST_INTAKE_ALLOWED_ORIGINS"), 2000)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function responseOrigin(request: Request): string {
  const origin = request.headers.get("origin") || "";
  const configured = configuredOrigins();
  if (!configured.length) return "*";
  return configured.includes(origin) ? origin : "";
}

function corsHeaders(request: Request): HeadersInit {
  const origin = responseOrigin(request);
  return {
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function json(request: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) });
}

function requireAllowedOrigin(request: Request): void {
  if (configuredOrigins().length && !responseOrigin(request)) {
    throw new HttpError(403, "Request origin is not allowed");
  }
}

function unwrapRequest(body: unknown): IntakeRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "Request body must be an object");
  const object = body as Record<string, unknown>;
  const wrapped = object.request && typeof object.request === "object" && !Array.isArray(object.request)
    ? object.request
    : object;
  return wrapped as IntakeRequest;
}

function sanitisedCustomer(intake: IntakeRequest) {
  const customer = intake.customer || {};
  const result = {
    name: cleanText(customer.name, 160),
    email: cleanText(customer.email, 254),
    whatsapp: cleanText(customer.whatsapp, 80),
    contact: cleanText(customer.contact, 254),
    preferredContact: cleanText(customer.preferredContact, 80),
  };
  if (!result.email && !result.whatsapp && !result.contact) throw new HttpError(400, "Email or WhatsApp/contact is required");
  return result;
}

function databaseHeaders(serviceRoleKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "apikey": serviceRoleKey,
    "Authorization": `Bearer ${serviceRoleKey}`,
  };
}

async function databaseJson<T>(
  projectUrl: string,
  serviceRoleKey: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${projectUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...databaseHeaders(serviceRoleKey),
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    console.error("PrimeX database request failed", response.status, body);
    throw new HttpError(500, "Request service is temporarily unavailable");
  }
  return body as T;
}

async function currentAuthorityVersion(projectUrl: string, serviceRoleKey: string): Promise<string> {
  const rows = await databaseJson<Array<{ authority_version: string }>>(
    projectUrl,
    serviceRoleKey,
    "commercial_authority_versions?select=authority_version&is_current=eq.true&limit=2",
  );
  if (rows.length !== 1 || !rows[0].authority_version) throw new HttpError(503, "Current product authority is unavailable");
  return rows[0].authority_version;
}

async function authorityProducts(
  projectUrl: string,
  serviceRoleKey: string,
  authorityVersion: string,
  selections: Array<{ productCode: string; qty: number }>,
): Promise<Map<string, AuthorityProduct>> {
  const codes = selections.map(({ productCode }) => productCode).join(",");
  const path = [
    "commercial_product_authority",
    "?select=authority_version,product_code,display_name,strength,supply_format,product_kind,public_price,price_mode,active_for_new_request,components",
    `&authority_version=eq.${encodeURIComponent(authorityVersion)}`,
    "&active_for_new_request=eq.true",
    `&product_code=in.(${codes})`,
  ].join("");
  const rows = await databaseJson<AuthorityProduct[]>(projectUrl, serviceRoleKey, path);
  return new Map(rows.map((product) => [product.product_code, product]));
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    try {
      requireAllowedOrigin(request);
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 403;
      return json(request, status, { ok: false, error: "Request origin is not allowed" });
    }
  }
  if (request.method !== "POST") return json(request, 405, { ok: false, error: "POST required" });

  try {
    requireAllowedOrigin(request);
    const projectUrl = cleanText(Deno.env.get("PRIME_SUPABASE_URL"), 500);
    const serviceRoleKey = cleanText(Deno.env.get("PRIME_SUPABASE_SERVICE_ROLE_KEY"), 1000);
    if (!projectUrl || !serviceRoleKey) throw new HttpError(500, "Request intake is not configured");

    const raw = await request.text();
    if (!raw) throw new HttpError(400, "Request body is empty");
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) throw new HttpError(413, "Request body too large");

    const intake = unwrapRequest(JSON.parse(raw));
    const requestRef = canonicalRequestRef(intake.requestId);
    const customer = sanitisedCustomer(intake);
    const selections = clientSelections(Array.isArray(intake.items) ? intake.items : []);
    const authorityVersion = await currentAuthorityVersion(projectUrl, serviceRoleKey);
    const submittedVersion = cleanText(intake.authorityVersion, 100);
    if (!submittedVersion || submittedVersion !== authorityVersion) {
      throw new HttpError(409, "Product information has changed. Refresh the PrimeX page and rebuild the request.");
    }

    const products = await authorityProducts(projectUrl, serviceRoleKey, authorityVersion, selections);
    const items = canonicalItems(selections, products, authorityVersion);
    const existing = await databaseJson<Array<{ id: string }>>(
      projectUrl,
      serviceRoleKey,
      `quote_requests?select=id&request_ref=eq.${encodeURIComponent(requestRef)}&limit=2`,
    );
    if (existing.length) return json(request, 200, { ok: true, request_ref: requestRef, authority_version: authorityVersion, created: false, duplicate: true });

    const receivedAt = new Date().toISOString();
    const sanitisedRequest = {
      requestId: requestRef,
      receivedAt,
      source: "PrimeX Early Access stand-in",
      status: "new",
      authorityVersion,
      customer,
      items,
      requestNotes: cleanText(intake.requestNotes, 4000),
      publicSafeNotes: cleanText(intake.publicSafeNotes, 1000),
    };
    const rows = await databaseJson<Array<{ id: string }>>(
      projectUrl,
      serviceRoleKey,
      "quote_requests?select=id",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          customer_id: null,
          request_ref: requestRef,
          request_status: "new",
          request_source: "PrimeX Early Access stand-in",
          requested_items: items,
          request_note: [sanitisedRequest.requestNotes, sanitisedRequest.publicSafeNotes].filter(Boolean).join("\n"),
          payload: sanitisedRequest,
          created_by: null,
        }),
      },
    );
    if (!rows[0]?.id) throw new HttpError(500, "Request could not be saved");
    return json(request, 201, { ok: true, request_ref: requestRef, authority_version: authorityVersion, created: true, duplicate: false });
  } catch (error) {
    if (!(error instanceof HttpError)) console.error("PrimeX request intake failed", error);
    const status = error instanceof HttpError ? error.status : 400;
    const message = error instanceof HttpError ? error.message : "Request could not be processed";
    return json(request, status, { ok: false, error: message });
  }
});
