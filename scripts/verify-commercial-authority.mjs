import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { canonicalItems, clientSelections } from "../supabase/functions/submit-request/commercial-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const authority = JSON.parse(read("data/primex-product-library.json"));
const plannerHtml = read("planner/index.html");
const planner = read("planner/app.js");
const requestRoute = read("order-request/index.html");
const edge = read("supabase/functions/submit-request/index.ts");
const pricingMigration = read("supabase/migrations/20260817183000_commercial_pricing_review_v45g.sql");
const finance = read("finance/index.html");

const expected = new Map([
  ["GHKCU50", 35], ["BPC10", 40], ["MOTSC40", 65], ["DSIP5", 40], ["NAD500", 50],
  ["AMINO1MQ50", 85], ["SET-WOLV10", 85], ["SET-GLOW70", 120], ["SET-KLOW80", 165],
  ["RTA20", 150], ["BPC40", 60], ["TB50010", 50], ["KPV10", 45], ["TA110", 55], ["SS31_30", 75],
]);
const products = authority.products;
assert.equal(authority.metadata.schemaVersion, "primex-public-commercial-authority.v2");
assert.equal(authority.metadata.authorityVersion, "PX-COMMERCIAL-2026-08-17.2");
assert.equal(products.length, 15);
assert.equal(new Set(products.map((product) => product.productCode)).size, 15);
for (const [code, price] of expected) {
  const product = products.find((row) => row.productCode === code);
  assert(product, `Missing ${code}`);
  assert.equal(product.publicPrice, price, `${code} public price`);
  assert.equal(product.activeForNewRequest, true, `${code} active state`);
}
const publicAuthorityKeys = new Set();
const collectKeys = (value) => {
  if (Array.isArray(value)) return value.forEach(collectKeys);
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) { publicAuthorityKeys.add(key.toLowerCase()); collectKeys(child); }
};
collectKeys(authority);
for (const forbidden of ["supplierCost", "supplierPackPriceUsd", "margin", "loadedCost", "modelledLoadedCostGbp", "existingPrice", "closePrice"]) {
  assert(!publicAuthorityKeys.has(forbidden.toLowerCase()), `Public authority leaks ${forbidden}`);
}

const set = (code) => products.find((product) => product.productCode === code);
assert.equal(set("SET-KLOW80").displayName, "Klow");
assert.deepEqual(set("SET-KLOW80").components, [
  { productCode: "GHKCU50", quantity: 1 },
  { productCode: "BPC10", quantity: 1 },
  { productCode: "TB50010", quantity: 1 },
  { productCode: "KPV10", quantity: 1 },
]);
assert.deepEqual(set("SET-WOLV10").components.map((row) => row.productCode), ["BPC10", "TB50010"]);
assert.deepEqual(set("SET-GLOW70").components.map((row) => row.productCode), ["GHKCU50", "BPC10", "TB50010"]);
assert(!set("SET-KLOW80").components.some((row) => row.productCode === "BPC40"));

assert(planner.includes('const COMMERCIAL_AUTHORITY_URL = "../data/primex-product-library.json"'));
assert(planner.includes('const EMAIL = "orders@primexbiolabs.co.uk"'));
assert(planner.includes("window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`"));
assert(planner.includes("PrimeX has not received your request until you press Send"));
assert(planner.includes("Name: ${form.name}"));
assert(planner.includes("Requested products:\\n${itemLines}"));
assert(planner.includes("Indicative total: £${total()}"));
assert(plannerHtml.includes('id="emailRequest"'));
assert(plannerHtml.includes('id="copyRequest" class="fallback-action" type="button" hidden'));
assert(plannerHtml.includes("Your email app will open with the details ready — press Send to submit it."));
assert(!planner.includes("REQUEST_INTAKE_URL"), "Emergency Planner must not contain the cloud intake endpoint");
assert(!planner.includes("submitCloudRequest"), "Emergency Planner must not submit requests to the cloud intake");

assert(requestRoute.includes('window.location.replace("../planner/")'));
assert(!/BPC-157|KPV 10mg|£\d|STRUCT_/.test(requestRoute), "Retired Request Hub still exposes commercial content");

assert(edge.includes("commercial_authority_versions"));
assert(edge.includes("commercial_product_authority"));
assert(edge.includes("submittedVersion !== authorityVersion"));
assert(edge.includes('source: "PrimeX Early Access stand-in"'));
assert(!edge.includes("ALLOWED_PRODUCTS"));

const authorityMap = new Map(products.map((product) => [product.productCode, {
  authority_version: authority.metadata.authorityVersion,
  product_code: product.productCode,
  display_name: product.displayName,
  strength: product.strength,
  supply_format: product.supplyFormat,
  product_kind: product.productKind,
  public_price: product.publicPrice,
  price_mode: product.priceMode,
  active_for_new_request: product.activeForNewRequest,
  components: product.components,
}]));
assert.deepEqual(clientSelections([{ productCode: "BPC10", qty: 1 }, { productCode: "bpc10", qty: 2 }]), [{ productCode: "BPC10", qty: 3 }]);
for (const tampered of [
  { productCode: "BPC10", qty: 1, price: 1 },
  { productCode: "BPC10", qty: 1, standardCataloguePrice: 45 },
  { productCode: "BPC10", qty: 1, requestedName: "Something else" },
  { productCode: "SET-KLOW80", qty: 1, components: [] },
]) assert.throws(() => clientSelections([tampered]), (error) => error.status === 409);
for (const code of ["GHKCU100", "CAGRI5", "STRUCT_TISSUE_REPAIR_RECOVERY"]) {
  assert.throws(() => canonicalItems([{ productCode: code, qty: 1 }], authorityMap, authority.metadata.authorityVersion), (error) => error.status === 409);
}
const canonicalBpc40 = canonicalItems([{ productCode: "BPC40", qty: 1 }], authorityMap, authority.metadata.authorityVersion)[0];
assert.equal(canonicalBpc40.standardCataloguePrice, 60);
assert.equal(canonicalBpc40.requestedName, "BPC-157");
const canonicalKlow = canonicalItems([{ productCode: "SET-KLOW80", qty: 1 }], authorityMap, authority.metadata.authorityVersion)[0];
assert.equal(canonicalKlow.components.length, 4);
assert.equal(canonicalKlow.authorityVersion, authority.metadata.authorityVersion);

assert.equal(products.filter((product) => product.activeForNewRequest).length, 15, "Active public authority count");
for (const retired of ["GHKCU100", "CAGRI5", "STRUCT_TISSUE_REPAIR_RECOVERY"]) assert(!products.some((product) => product.productCode === retired), `${retired} remains in public authority`);
assert(pricingMigration.includes("enable row level security"));
assert(pricingMigration.includes("p.role in ('admin', 'finance')"));
assert(pricingMigration.includes("revoke all on table public.commercial_price_review_private from anon, authenticated"));
assert(!pricingMigration.includes("grant select on table public.commercial_price_review_private to anon"));

const productRulesSource = finance.match(/const PRODUCT_RULES=({[\s\S]*?\n});\nconst COMMERCIAL_AUTHORITY_VERSION/)?.[1];
const structureRulesSource = finance.match(/const STRUCTURE_RULES=({[\s\S]*?\n});\n\/\/ Operator selection only/)?.[1];
assert(productRulesSource && structureRulesSource, "Finance rule blocks not found");
const PRODUCT_RULES = vm.runInNewContext(`(${productRulesSource})`);
const STRUCTURE_RULES = vm.runInNewContext(`(${structureRulesSource})`);
const financeProducts = {
  GHKCU50: 35, BPC10: 40, MOTSC40: 65, DSIP5: 40, NAD500: 50, AMINO50: 85,
  RTA20: 150, BPC40: 60, TB50010: 50, KPV10: 45, TA110: 55, SS31_30: 75,
};
for (const [id, standard] of Object.entries(financeProducts)) {
  assert.equal(PRODUCT_RULES[id].standard, standard, `${id} public tier`);
  assert.equal(PRODUCT_RULES[id].existing, null, `${id} protected existing tier is not embedded`);
  assert.equal(PRODUCT_RULES[id].internal, null, `${id} protected close tier is not embedded`);
}
const financeSets = {SET_WOLV10: 85, SET_GLOW70: 120, SET_KLOW80: 165};
for (const [id, standard] of Object.entries(financeSets)) {
  assert.equal(STRUCTURE_RULES[id].prices.standard, standard, `${id} public tier`);
  assert.equal(STRUCTURE_RULES[id].prices.existing, null, `${id} protected existing tier is not embedded`);
  assert.equal(STRUCTURE_RULES[id].prices.internal, null, `${id} protected close tier is not embedded`);
}
for (const id of ["BAC3_ITEM", "BAC10_ITEM", "U100_SUPPORT", "WIPES10_SUPPORT"]) {
  assert.equal(PRODUCT_RULES[id].standard, null, `${id} automatic support charge`);
}
for (const id of ["GHKCU100", "CAGRI5", "TESA10", "MT2_10", "EPI10", "SEMAX_AUDIT", "SELANK_AUDIT", "SERMORELIN_AUDIT", "NAD1000", "CJC_DAC5", "CJC_NODAC10", "IPA10"]) {
  assert.equal(PRODUCT_RULES[id].newQuoteEligible, false, `${id} new quote eligibility`);
  assert.equal(PRODUCT_RULES[id].standard, null, `${id} historical price`);
}
assert.equal(JSON.stringify(STRUCTURE_RULES.SET_KLOW80.contents), JSON.stringify([["GHKCU50", 1], ["BPC10", 1], ["TB50010", 1], ["KPV10", 1]]));
for (const id of ["PLAN_METABOLIC", "PLAN_TISSUE_REPAIR", "PLAN_GUT_INTEGRITY", "PLAN_IMMUNE_MODULATION", "RTA20_2", "RTA20_3", "REC_ENTRY", "REC_CONT", "GUT_PAIR"]) {
  assert.equal(STRUCTURE_RULES[id].prices.standard, null, `${id} retired public price`);
  assert.equal(STRUCTURE_RULES[id].prices.internal, null, `${id} retired private price`);
}
assert(finance.includes("const ACTIVE_NEW_QUOTE_STRUCTURE_IDS=['SET_WOLV10','SET_GLOW70','SET_KLOW80']"));
assert(finance.includes("client.from('commercial_price_review_private')"));
assert(finance.includes("applyProtectedCommercialTiers(pricingReviewState.rows)"));
assert(finance.includes("pricingReviewAccessAllowed()"));
assert(finance.includes("['admin','finance'].includes(p.role)"));
assert(finance.includes("requestItemAuthorityCurrent(item,req)"));
assert(finance.includes("if(p)return {ok:true,label:'Current product / price',pid,legacyKnown:true"));
assert(finance.includes("Older request - product not recognised"));
assert(finance.includes("requestStructurePriceClear(item,structureRule)"));
assert(finance.includes("price=Number(p.standard)"));
assert(!finance.includes("price=Number(item.standardCataloguePrice);"));

for (const source of [...finance.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).filter((script) => script.trim())) {
  new vm.Script(source);
}

const standaloneTotal = (components) => components.reduce((sum, component) => sum + expected.get(component.productCode) * component.quantity, 0);
assert.equal(standaloneTotal(set("SET-WOLV10").components) - set("SET-WOLV10").publicPrice, 5);
assert.equal(standaloneTotal(set("SET-GLOW70").components) - set("SET-GLOW70").publicPrice, 5);
assert.equal(standaloneTotal(set("SET-KLOW80").components) - set("SET-KLOW80").publicPrice, 5);

console.log("Commercial authority verification passed: v2 public prices, two-tier rule, Retatrutide exception, protected review RLS, canonical intake, retired-route handoff, and separate-vial sets.");
