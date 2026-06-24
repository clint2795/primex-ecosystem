import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Required Edge Function secrets:
// - PRIME_SUPABASE_URL
// - PRIME_SUPABASE_SERVICE_ROLE_KEY
// Optional:
// - REQUEST_INTAKE_ALLOWED_ORIGINS: comma-separated origins, defaults to *

const MAX_BODY_BYTES = 100_000;
const MAX_ITEMS = 50;

type IntakeRequest = {
  requestId?: string;
  receivedAt?: string;
  source?: string;
  status?: string;
  customer?: {
    name?: string;
    email?: string;
    whatsapp?: string;
    contact?: string;
    preferredContact?: string;
  };
  items?: unknown[];
  requestNotes?: string;
  publicSafeNotes?: string;
};

function allowedOrigin(req: Request): string {
  const origin = req.headers.get("origin") || "";
  const configured = (Deno.env.get("REQUEST_INTAKE_ALLOWED_ORIGINS") || "").trim();
  if (!configured) return "*";
  const origins = configured.split(",").map((x) => x.trim()).filter(Boolean);
  return origins.includes(origin) ? origin : origins[0] || "*";
}

function corsHeaders(req: Request): HeadersInit {
  return {
    "Access-Control-Allow-Origin": allowedOrigin(req),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function json(req: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(req) });
}

function cleanText(value: unknown): string {
  return String(value || "").trim();
}

function fallbackRequestRef(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `PXREQ-${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
}

function unwrapRequest(body: unknown): IntakeRequest {
  if (!body || typeof body !== "object") throw new Error("Request body must be an object.");
  const obj = body as Record<string, unknown>;
  const wrapped = obj.request && typeof obj.request === "object" ? obj.request : obj;
  return wrapped as IntakeRequest;
}

function contactPresent(req: IntakeRequest): boolean {
  const c = req.customer || {};
  return !!(cleanText(c.email) || cleanText(c.whatsapp) || cleanText(c.contact));
}

function requestNote(req: IntakeRequest): string {
  return [req.requestNotes, req.publicSafeNotes].map(cleanText).filter(Boolean).join("\n");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, 405, { ok: false, error: "POST required" });

  const url = cleanText(Deno.env.get("PRIME_SUPABASE_URL"));
  const serviceRoleKey = cleanText(Deno.env.get("PRIME_SUPABASE_SERVICE_ROLE_KEY"));
  if (!url || !serviceRoleKey) return json(request, 500, { ok: false, error: "Request intake is not configured" });

  try {
    const raw = await request.text();
    if (!raw) return json(request, 400, { ok: false, error: "Request body is empty" });
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json(request, 413, { ok: false, error: "Request body too large" });

    const body = JSON.parse(raw);
    const intake = unwrapRequest(body);
    const requestRef = cleanText(intake.requestId) || fallbackRequestRef();
    const items = Array.isArray(intake.items) ? intake.items : null;

    if (!requestRef) return json(request, 400, { ok: false, error: "requestId is required" });
    if (!contactPresent(intake)) return json(request, 400, { ok: false, error: "Email or WhatsApp/contact is required" });
    if (!items || !items.length) return json(request, 400, { ok: false, error: "No request items supplied" });
    if (items.length > MAX_ITEMS) return json(request, 400, { ok: false, error: `Maximum ${MAX_ITEMS} items allowed` });

    const supabase = createClient(url, serviceRoleKey, {
      global: {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const existing = await supabase
      .from("quote_requests")
      .select("id")
      .eq("request_ref", requestRef)
      .maybeSingle();

    if (existing.error) throw new Error(`Request lookup failed: ${existing.error.message}`);
    if (existing.data?.id) {
      return json(request, 200, { ok: true, request_ref: requestRef, created: false, duplicate: true });
    }

    const payload = {
      customer_id: null,
      request_ref: requestRef,
      request_status: "new",
      request_source: "Request Hub",
      requested_items: items,
      request_note: requestNote(intake),
      payload: intake,
      created_by: null,
    };

    const inserted = await supabase
      .from("quote_requests")
      .insert(payload)
      .select("id")
      .single();

    if (inserted.error) throw new Error(`Request insert failed: ${inserted.error.message}`);
    return json(request, 200, { ok: true, request_ref: requestRef, created: true, duplicate: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request intake failed";
    return json(request, 400, { ok: false, error: message });
  }
});
