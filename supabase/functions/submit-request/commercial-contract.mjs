// Pure commercial-intake contract shared by the Edge Function and build tests.
// No browser-supplied commercial field is accepted as authority.

export const MAX_ITEMS = 15;
export const MAX_ITEM_QTY = 99;

const CODE_PATTERN = /^[A-Z0-9_-]{2,40}$/;
const REQUEST_REF_PATTERN = /^[A-Z0-9-]{6,80}$/;
const CLIENT_COMMERCIAL_FIELDS = [
  "standardCataloguePrice",
  "cataloguePrice",
  "standardPrice",
  "price",
  "priceMode",
  "requestedName",
  "displayName",
  "name",
  "requestedStrength",
  "strength",
  "contents",
  "components",
];

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function cleanText(value, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function fallbackRequestRef() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `PXREQ-${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export function canonicalRequestRef(value) {
  const supplied = cleanText(value, 80).toUpperCase();
  if (!supplied) return fallbackRequestRef();
  if (!REQUEST_REF_PATTERN.test(supplied)) throw new HttpError(400, "Request reference format is invalid");
  return supplied;
}

export function clientSelections(items) {
  if (!items.length) throw new HttpError(400, "No request items supplied");
  if (items.length > MAX_ITEMS) throw new HttpError(400, `Maximum ${MAX_ITEMS} items allowed`);

  const combined = new Map();
  items.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new HttpError(400, `Item ${index + 1} must be an object`);
    const prohibited = CLIENT_COMMERCIAL_FIELDS.find((field) => Object.prototype.hasOwnProperty.call(item, field));
    if (prohibited) throw new HttpError(409, "Product information has changed. Refresh the PrimeX page and rebuild the request.");

    const productCode = cleanText(item.productCode ?? item.code, 40).toUpperCase();
    if (!CODE_PATTERN.test(productCode)) throw new HttpError(400, `Item ${index + 1} has an invalid productCode`);
    const qty = Number(item.qty ?? item.quantity ?? 1);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_ITEM_QTY) {
      throw new HttpError(400, `Item ${index + 1} quantity must be an integer from 1 to ${MAX_ITEM_QTY}`);
    }
    const totalQty = (combined.get(productCode) || 0) + qty;
    if (totalQty > MAX_ITEM_QTY) throw new HttpError(400, `Total quantity for ${productCode} exceeds ${MAX_ITEM_QTY}`);
    combined.set(productCode, totalQty);
  });
  return [...combined].map(([productCode, qty]) => ({ productCode, qty }));
}

export function canonicalItems(selections, products, authorityVersion) {
  return selections.map(({ productCode, qty }) => {
    const product = products.get(productCode);
    if (!product || product.active_for_new_request !== true) {
      throw new HttpError(409, `${productCode} is not available for a new request. Refresh the PrimeX page.`);
    }
    const price = Number(product.public_price);
    if (!Number.isFinite(price) || price <= 0 || product.price_mode !== "fixed") throw new HttpError(503, `Approved price unavailable for ${productCode}`);
    return {
      productCode: product.product_code,
      requestedName: product.display_name,
      requestedStrength: product.strength,
      supplyFormat: product.supply_format,
      productKind: product.product_kind,
      qty,
      standardCataloguePrice: price,
      priceMode: "fixed",
      authorityVersion,
      components: Array.isArray(product.components) ? product.components : [],
      publicSafeNotes: product.product_kind === "research_set" ? "Separate identified component vials" : "",
    };
  });
}
