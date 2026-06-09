// Automated accessibility audit: run axe-core against key pages in both themes.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core");
const axeSource = fs.readFileSync(axePath, "utf8");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const pages = [
  { url: "/", theme: "dark" },
  { url: "/", theme: "light" },
  { url: "/projects/quant-platform", theme: "dark" },
  { url: "/resume", theme: "dark" },
];

const browser = await chromium.launch();
let totalSerious = 0;

for (const p of pages) {
  const ctx = await browser.newContext({ colorScheme: p.theme === "light" ? "light" : "dark" });
  await ctx.addInitScript((theme) => {
    try {
      localStorage.setItem("theme", theme);
      sessionStorage.setItem("booted", "1");
    } catch {}
  }, p.theme);
  const page = await ctx.newPage();
  await page.goto(BASE + p.url, { waitUntil: "load", timeout: 90000 });
  await page.waitForSelector("main", { timeout: 30000 });
  await page.waitForTimeout(800); // let entrance transitions settle
  await page.evaluate(axeSource);
  const results = await page.evaluate(async () => {
    // @ts-ignore – axe injected above
    return await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
  });
  const impactful = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  totalSerious += impactful.length;
  console.log(`\n=== ${p.url} [${p.theme}] — ${results.violations.length} violations (${impactful.length} serious/critical) ===`);
  for (const v of results.violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    console.log(`     ${v.nodes[0]?.target?.join(" ")}`);
  }
  await ctx.close();
}

await browser.close();
console.log(`\nDONE — ${totalSerious} serious/critical issues across pages.`);
