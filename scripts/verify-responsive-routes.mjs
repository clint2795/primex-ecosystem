import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const nodeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
if (!nodeModules) throw new Error("CODEX_PRIMARY_RUNTIME_NODE_MODULES is not set");
const { chromium } = await import(pathToFileURL(path.join(nodeModules, "playwright", "index.mjs")));

const browser = await chromium.launch({ headless: true });
const sizes = [
  { width: 320, height: 760 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
];

try {
  for (const viewport of sizes) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/planner/", { waitUntil: "networkidle" });
    await page.waitForSelector("#featured .product-card");
    assert.equal(await page.locator("#featured .product-card").count(), 4);
    const counts = {};
    for (const drawer of ["beyond", "sets", "wider"]) {
      await page.locator(`[data-drawer="${drawer}"]`).click();
      counts[drawer] = await page.locator("#drawerGrid .product-card").count();
      await page.locator(`[data-drawer="${drawer}"]`).click();
    }
    assert.deepEqual(counts, { beyond: 2, sets: 3, wider: 6 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, `Planner horizontal overflow at ${viewport.width}px`);
    assert.deepEqual(errors, [], `Planner errors at ${viewport.width}px: ${errors.join(" | ")}`);
    await page.close();
  }

  const planner = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await planner.goto("http://127.0.0.1:4173/planner/", { waitUntil: "networkidle" });
  await planner.locator('[data-drawer="sets"]').click();
  const klowCard = planner.locator('#drawerGrid .product-card:has([data-add="SET-KLOW80"])');
  assert((await klowCard.textContent()).includes("Klow"));
  assert((await klowCard.textContent()).includes("KPV 10mg"));
  await klowCard.locator('[data-add="SET-KLOW80"]').click();
  const payload = await planner.evaluate(() => requestPayload("PX-260817-TEST"));
  assert.equal(payload.authorityVersion, "PX-COMMERCIAL-2026-08-17.2");
  assert.deepEqual(payload.items, [{ productCode: "SET-KLOW80", qty: 1 }]);
  assert.equal(Object.keys(payload.items[0]).sort().join(","), "productCode,qty");
  await planner.locator('[data-drawer="wider"]').click();
  const bpc40 = planner.locator('#drawerGrid .product-card:has([data-add="BPC40"])');
  assert((await bpc40.textContent()).includes("£60"));
  await planner.close();

  const moved = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await moved.goto("http://127.0.0.1:4173/order-request/", { waitUntil: "domcontentloaded" });
  await moved.waitForURL("**/planner/");
  assert.equal(new URL(moved.url()).pathname, "/planner/");
  await moved.close();

  for (const viewport of sizes) {
    const page = await browser.newPage({ viewport });
    await page.route("https://cdn.jsdelivr.net/**", (route) => route.abort());
    await page.goto("http://127.0.0.1:4173/finance/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.getElementById("bootBadge")?.textContent?.includes("JS OK"));
    await page.locator('button[data-view="stock"]').click();
    const cards = page.locator(".stock-card-detail");
    assert((await cards.count()) > 1);
    await cards.nth(0).locator("summary").click();
    assert.equal(await cards.nth(0).getAttribute("open"), "");
    assert.equal((await cards.nth(0).locator(".stock-open-label").textContent()).trim(), "STOCK ITEM OPEN");
    assert((await cards.nth(0).locator(".stock-card-toggle-open").textContent()).includes("Close item"));
    assert((await cards.nth(0).locator(".stock-close-button").textContent()).includes("Close"));
    await cards.nth(1).locator("summary").click();
    assert.equal(await page.locator(".stock-card-detail[open]").count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, `Finance horizontal overflow at ${viewport.width}px`);
    await page.close();
  }

  console.log("Responsive route verification passed at 320px, 390px, tablet and desktop.");
} finally {
  await browser.close();
}
