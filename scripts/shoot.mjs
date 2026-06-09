// Visual feedback loop: screenshot the running dev server at several
// viewports + themes so the design can be reviewed against real pixels.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", ".screenshots");
fs.mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE_URL || "http://localhost:3000";

const shots = [
  { name: "home-desktop-dark", path: "/", theme: "dark", w: 1280, h: 900, full: true },
  { name: "hero-desktop-dark", path: "/", theme: "dark", w: 1280, h: 900, full: false },
  { name: "palette-desktop-dark", path: "/", theme: "dark", w: 1280, h: 900, full: false, palette: true },
  { name: "writing-desktop-dark", path: "/", theme: "dark", w: 1280, h: 900, scrollTo: "#writing" },
  { name: "github-desktop-dark", path: "/", theme: "dark", w: 1280, h: 900, scrollTo: "#github" },
  { name: "contact-desktop-dark", path: "/", theme: "dark", w: 1280, h: 900, scrollTo: "#contact" },
  { name: "home-mobile-dark", path: "/", theme: "dark", w: 390, h: 844, full: true },
  { name: "resume-desktop-dark", path: "/resume", theme: "dark", w: 1280, h: 1000, full: true },
];

async function settleReveals(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let y = 0;
        const step = () => {
          window.scrollBy(0, Math.round(window.innerHeight * 0.8));
          y += window.innerHeight * 0.8;
          if (y < document.body.scrollHeight) setTimeout(step, 120);
          else {
            window.scrollTo(0, 0);
            setTimeout(resolve, 350);
          }
        };
        step();
      }),
  );
  await page.waitForTimeout(700);
}

const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 1,
    colorScheme: s.theme === "light" ? "light" : "dark",
  });
  await ctx.addInitScript((theme) => {
    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("crt", "off");
      sessionStorage.setItem("booted", "1");
    } catch {}
  }, s.theme);
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + s.path, { waitUntil: "load", timeout: 90000 });
    await page.waitForSelector("main", { timeout: 30000 });
    if (s.palette) {
      await page.waitForTimeout(600);
      await page.keyboard.press("Control+KeyK");
      await page.waitForTimeout(500);
    } else if (s.scrollTo) {
      await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "start" }), s.scrollTo);
      await page.waitForTimeout(1200);
    } else if (s.full) {
      await settleReveals(page);
    } else {
      await page.waitForTimeout(1600);
    }
    await page.screenshot({ path: path.join(OUT, s.name + ".png"), fullPage: !!s.full });
    console.log("shot:", s.name);
  } catch (err) {
    console.error("FAILED:", s.name, err.message);
  } finally {
    await ctx.close();
  }
}
await browser.close();
console.log("done →", OUT);
