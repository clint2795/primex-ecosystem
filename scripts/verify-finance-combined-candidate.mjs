import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const publishedR5e = path.join(root, "finance-request-resolution-review/index.html");
const source = fs.existsSync(publishedR5e)
  ? fs.readFileSync(publishedR5e, "utf8")
  : read("finance/index.html");
const candidate = read("finance-completion-review/index.html");

assert(candidate.includes("PX-ROUTE-R5F Combined Completion Review"), "R5F title marker missing");
assert(candidate.includes("PX-ROUTE-R5F COMBINED REVIEW"), "R5F loading marker missing");
assert(candidate.includes("PX-ROUTE-R5F JS OK"), "R5F ready marker missing");
assert(candidate.includes('<script src="../finance/config.js"></script>'), "R5F route-safe Finance config path missing");

const normalise = (html) => html
  .replace("PX-ROUTE-R5F Combined Completion Review", "PX-ROUTE-R5E Request Resolution Review")
  .replace("PX-ROUTE-R5F COMBINED REVIEW", "PX-ROUTE-R5E REVIEW")
  .replace("PX-ROUTE-R5F JS OK", "PX-ROUTE-R5E JS OK")
  .replace(/<script src="(?:\.\.\/finance\/)?config\.js"><\/script>/, '<script src="__FINANCE_CONFIG__"></script>');

assert.equal(normalise(candidate), normalise(source), "R5F candidate differs from cumulative R5E source beyond its route path and visible fingerprint");

for (const sourceBlock of [...candidate.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter((script) => script.trim())) {
  new vm.Script(sourceBlock);
}

console.log("R5F combined-candidate verification passed: cumulative R5A-R5E source preserved with only the protected route path and fingerprint changed.");
