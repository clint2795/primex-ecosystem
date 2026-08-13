import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// PrimeX request intake v185A candidate.
// Production deploy is intentionally separate from this branch commit.
// Required Edge Function secrets:
// - PRIME_SUPABASE_URL
// - PRIME_SUPABASE_SERVICE_ROLE_KEY
// Optional:
// - REQUEST_INTAKE_ALLOWED_ORIGINS: comma-separated origins, defaults to *

const MAX_BODY_BYTES = 100_000;
const MAX_ITEMS = 50;
const MAX_ITEM_QTY = 99;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const DUPLICATE_LOOKBACK_LIMIT = 30;

const REQUEST_PRODUCT_CODES = new Set([
  "RTA20", "BPC10", "BPC40", "TB50010", "KPV10", "TA110", "NAD500", "AMINO1MQ50",
  "DSIP5", "GHKCU50", "GHKCU100", "CAGRI5", "TESA10", "MT2_10", "EPI10",
  "MOTSC40", "SS31_30", "SEMAX_AUDIT", "SELANK_AUDIT", "SERMORELIN_AUDIT",
  "SET-WOLV10", "SET-GLOW70", "SET-KLOW80",
]);
const LEGACY_PRODUCT_CODES = new Set(["AMINO50", "RTA20_OBSERVATION", "MANUAL", "MANUAL_REVIEW"]);
const REQUEST_STRUCTURE_CODES = new Set([
  "STRUCT_METABOLIC_REGULATION",
  "STRUCT_TISSUE_REPAIR_RECOVERY",
  "STRUCT_INFLAMMATION_GUT_INTEGRITY",
  "STRUCT_IMMUNE_MODULATION",
]);

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

function normalizedText(value: unknown): string {
  return cleanText(value).replace(/\s+/g, " ").toLowerCase();
}

function fallbackRequestRef(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `PXREQ-${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
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

function legacyPlannerCode(code: string): boolean {
  return /^(RTA20|BPC10|TB50010|KPV10|TA110|NAD500|AMINO1MQ50|AMINO50|FOUNDATION)_[A-Z0-9_]+$/.test(code);
}

function validateItems(items: unknown[]): string | null {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!item || typeof item !== "object" || Array.isArray(item)) return `Item ${i + 1} must be an object`;
    const row = item as Record<string, unknown>;
    const code = cleanText(row.productCode || row.code || row.structureCode).toUpperCase();
    if (!code) return `Item ${i + 1} productCode is required`;
    const allowed = REQUEST_PRODUCT_CODES.has(code) || LEGACY_PRODUCT_CODES.has(code) || REQUEST_STRUCTURE_CODES.has(code) || legacyPlannerCode(code);
    if (!allowed) return `Item ${i + 1} has an unsupported productCode`;
    const rawQty = row.qty ?? row.quantity ?? 1;
    const qty = Number(rawQty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_ITEM_QTY) return `Item ${i + 1} quantity must be an integer from 1 to ${MAX_ITEM_QTY}`;
  }
  return null;
}

function requestFingerprint(req: IntakeRequest): string {
  const c = req.customer || {};
  const items = Array.isArray(req.items) ? req.items : [];
  const normalizedItems = items.map((item) => {
    const row = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
    return {
      code: normalizedText(row.productCode || row.code || row.structureCode),
      structureCode: normalizedText(row.structureCode),
      rangeCode: normalizedText(row.rangeCode),
      name: normalizedText(row.requestedName || row.title || row.name || row.label),
      strength: normalizedText(row.requestedStrength || row.strength || row.period),
      qty: Number(row.qty ?? row.quantity ?? 1) || 1,
      support: normalizedText(row.supportPreference),
      note: normalizedText(row.publicSafeNotes || row.note),
    };
  }).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  return JSON.stringify({
    name: normalizedText(c.name),
    email: normalizedText(c.email),
    whatsapp: normalizedText(c.whatsapp || c.contact),
    preferredContact: normalizedText(c.preferredContact),
    items: normalizedItems,
    requestNotes: normalizedText(req.requestNotes),
  });
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
    const itemError = validateItems(items);
    if (itemError) return json(request, 400, { ok: false, error: itemError });

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
      return json(request, 200, { ok: true, request_ref: requestRef, created: false, duplicate: true, duplicate_reason: "request_ref" });
    }

    const cutoff = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const recent = await supabase
      .from("quote_requests")
      .select("request_ref,payload,created_at")
      .eq("request_source", "Request Hub")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(DUPLICATE_LOOKBACK_LIMIT);

    if (recent.error) throw new Error(`Recent request lookup failed: ${recent.error.message}`);
    const fingerprint = requestFingerprint(intake);
    const duplicate = (recent.data || []).find((row) => {
      try {
        return requestFingerprint(unwrapRequest(row.payload)) === fingerprint;
      } catch (_) {
        return false;
      }
    });

    if (duplicate?.request_ref) {
      return json(request, 200, {
        ok: true,
        request_ref: duplicate.request_ref,
        created: false,
        duplicate: true,
        duplicate_reason: "recent_identical_request",
      });
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

    if (inserted.error) {
      if (inserted.error.code === "23505" || /duplicate|unique/i.test(inserted.error.message || "")) {
        return json(request, 200, { ok: true, request_ref: requestRef, created: false, duplicate: true, duplicate_reason: "unique_constraint" });
      }
      throw new Error(`Request insert failed: ${inserted.error.message}`);
    }

    return json(request, 200, { ok: true, request_ref: requestRef, created: true, duplicate: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request intake failed";
    return json(request, 400, { ok: false, error: message });
  }
});
