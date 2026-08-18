#!/usr/bin/env node
/**
 * 列宾 · 验收
 *
 * 列宾到 DESIGN.md 就停，但没人检查最后做出来的页面跟当初选的那一版还是不是一回事。
 * 这个脚本回答两个问题：
 *   1. 这跟你选的还是同一个东西吗   —— 样张截图和落地页截图并排，你自己看
 *   2. 有没有那种一眼看不出、但确实错了的事 —— 六项体检，全是踩过的坑
 *
 *   node scripts/verify-page.mjs --url http://localhost:8000 --proof proof.png --out verify/
 *
 * 「看代码」不等于验证。这个脚本会真的开浏览器、真的截图、真的量。
 * 量不准的它会说量不准，不会编一个数字给你。
 *
 * 需要 playwright（没有会告诉你怎么装）。装不了就退回肉眼——
 * 把落地页截图和样张并排贴回对话里，这条路任何环境都走得通。
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const URL_IN = arg("--url", "");
const PROOF = arg("--proof", "");
const OUT = resolve(arg("--out", "verify"));
const VIEWPORTS = [{ n: "mobile", w: 390, h: 844 }, { n: "tablet", w: 768, h: 1024 }, { n: "desktop", w: 1280, h: 900 }];

if (!URL_IN) {
  console.error("\n用法：node scripts/verify-page.mjs --url <地址或本地 html> [--proof 样张截图.png] [--out verify/] [--exe <chrome 路径>]\n");
  process.exit(2);
}
const target = /^https?:\/\//.test(URL_IN) ? URL_IN : pathToFileURL(resolve(URL_IN)).href;

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { try { ({ chromium } = await import("playwright-core")); } catch {
  console.error(`
✗ 没找到 playwright。

  装：  npm i -D playwright && npx playwright install chromium

  装不了也不影响走完流程 —— 退回肉眼那条路：
  把落地页截图和你选中那一版的样张并排贴回对话里，让人回答
  「这跟我当初选的还是同一个东西吗」。这一问才是验收的核心，
  下面那六项体检是附赠的。
`);
  process.exit(2);
} }

mkdirSync(OUT, { recursive: true });
const F = { must: [], should: [], note: [], skipped: [] };
const add = (bucket, title, detail) => F[bucket].push({ title, detail });

const EXE = arg("--exe", process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "");
let browser;
try { browser = await chromium.launch(EXE ? { executablePath: EXE } : {}); }
catch (e) {
  console.error(`
✗ 浏览器起不来：${String(e.message).split("\n")[0]}

  多半是 playwright 的版本和机器上已有的 Chromium 对不上。两条路：
    npx playwright install chromium
  或者直接指一个现成的：
    node scripts/verify-page.mjs --url ... --exe /path/to/chrome
    （也认 PLAYWRIGHT_CHROMIUM_EXECUTABLE 环境变量）

  两条都走不通就退回肉眼：把落地页截图和样张并排贴回对话里。
`);
  process.exit(2);
}
const bytes = new Map();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push("JS 异常：" + e.message));
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push("console.error：" + m.text().slice(0, 160)); });
page.on("response", async (r) => {
  try { const h = r.headers()["content-length"]; if (h) bytes.set(r.url(), +h); } catch {}
});

await page.goto(target, { waitUntil: "networkidle" }).catch(() => page.goto(target));
await page.waitForTimeout(1200);

/* ── 1. 横向滚动 ── */
const hScroll = await page.evaluate(() => {
  const d = document.documentElement;
  return d.scrollWidth > d.clientWidth + 1 ? d.scrollWidth - d.clientWidth : 0;
});
if (hScroll) add("must", "整页横向滚动", `body 比视口宽 ${hScroll}px。桌面上不明显，手机上是灾难。`);

/* ── 2. 控制台 ── */
if (consoleErrors.length)
  add("must", "控制台有报错", consoleErrors.slice(0, 6).join("\n    "));

/* ── 3 & 4. 图片：被拉变形 / 超规格 ── */
const imgs = await page.evaluate(() => [...document.images].map((i) => ({
  src: i.currentSrc || i.src,
  natW: i.naturalWidth, natH: i.naturalHeight,
  cw: Math.round(i.getBoundingClientRect().width), ch: Math.round(i.getBoundingClientRect().height),
  fit: getComputedStyle(i).objectFit,
})));
for (const im of imgs) {
  const name = im.src.replace(/^.*\//, "").slice(0, 60) || "(inline)";
  if (!im.natW || !im.cw || !im.ch) continue;
  if (im.fit === "fill" || im.fit === "none") continue;
  if (im.fit === "cover" || im.fit === "contain") { /* 裁切是有意的，跳过形变检查 */ }
  else {
    const want = im.natW / im.natH, got = im.cw / im.ch;
    if (Math.abs(want - got) / want > 0.02)
      add("must", "图片被拉变形", `${name}\n    原始 ${im.natW}×${im.natH}（比例 ${want.toFixed(3)}），实际显示 ${im.cw}×${im.ch}（${got.toFixed(3)}）\n    常见原因：CSS 只写了 width，HTML 的 height 属性还在生效。加 height:auto。`);
  }
  if (im.natW > im.cw * 3) {
    const kb = bytes.get(im.src);
    add("should", "图片规格远超显示尺寸",
      `${name}\n    原始宽 ${im.natW}px，显示宽 ${im.cw}px${kb ? `，传输 ${(kb / 1024).toFixed(0)} KB` : ""}\n    二倍屏够用的宽度是 ${im.cw * 2}px。`);
  }
}

/* ── 5. 正文对比度 ── */
const contrast = await page.evaluate(() => {
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const parse = (s) => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 4).map(Number) : null; };
  const over = (fg, bg) => { const a = fg[3] ?? 1; return [0, 1, 2].map((i) => Math.round(a * fg[i] + (1 - a) * bg[i])); };
  const ratio = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
  const bad = [], skipped = [];
  for (const el of document.querySelectorAll("*")) {
    let txt = "";
    for (const n of el.childNodes) if (n.nodeType === 3) txt += n.textContent;
    txt = txt.trim();
    if (txt.length < 2) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const fg = parse(cs.color); if (!fg) continue;
    if ((fg[3] ?? 1) < 0.999) { skipped.push({ txt: txt.slice(0, 28), why: "文字本身半透明" }); continue; }
    // 往上找第一层不透明的底
    let bg = null, node = el, gradient = false;
    while (node && node !== document.documentElement.parentNode) {
      const s = getComputedStyle(node);
      if (s.backgroundImage && s.backgroundImage !== "none") { gradient = true; break; }
      const b = parse(s.backgroundColor);
      if (b && (b[3] ?? 1) > 0.999) { bg = b; break; }
      if (b && (b[3] ?? 1) > 0) { gradient = true; break; }   // 半透明叠底，本工具算不准
      node = node.parentElement;
    }
    if (gradient || !bg) { skipped.push({ txt: txt.slice(0, 28), why: gradient ? "底是渐变/图/半透明" : "找不到不透明底色" }); continue; }
    if (cs.webkitTextFillColor === "rgba(0, 0, 0, 0)" || cs.color === "rgba(0, 0, 0, 0)") {
      skipped.push({ txt: txt.slice(0, 28), why: "文字用了 background-clip:text" }); continue;
    }
    const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const got = ratio(over(fg, bg), bg);
    if (got < need) bad.push({ txt: txt.slice(0, 34), got: +got.toFixed(2), need, size: Math.round(size),
      fg: cs.color, bg: `rgb(${bg.join(",")})`, tag: el.tagName.toLowerCase(), cls: (el.className || "").toString().slice(0, 40) });
  }
  const seen = new Set(), uniq = [];
  for (const b of bad) { const k = b.fg + b.bg + b.size; if (!seen.has(k)) { seen.add(k); uniq.push(b); } }
  const sk = new Set(); const su = [];
  for (const s of skipped) { if (!sk.has(s.why)) { sk.add(s.why); su.push(s); } }
  return { bad: uniq.slice(0, 12), total: bad.length, skipped: su, skippedTotal: skipped.length };
});
for (const b of contrast.bad)
  add("should", `对比度不足 ${b.got}:1（需 ${b.need}）`,
    `${b.tag}${b.cls ? "." + b.cls.split(/\s+/)[0] : ""} · ${b.size}px · 「${b.txt}」\n    ${b.fg} on ${b.bg}`);
if (contrast.skippedTotal)
  F.skipped.push({ title: `${contrast.skippedTotal} 处文字没量`, detail: contrast.skipped.map((s) => `底/字的情况：${s.why}（例：「${s.txt}」）`).join("\n    ") + "\n    这些要靠眼睛，工具不猜。" });

/* ── 6. 关掉 JS 还剩什么 ── */
const withJs = await page.evaluate(() => document.body.innerText.replace(/\s+/g, "").length);
const ctxNo = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
const pNo = await ctxNo.newPage();
await pNo.goto(target, { waitUntil: "load" }).catch(() => {});
await pNo.waitForTimeout(600);
const noJs = await pNo.evaluate(() => document.body.innerText.replace(/\s+/g, "").length).catch(() => 0);
await ctxNo.close();
const keep = withJs ? Math.round((noJs / withJs) * 100) : 0;
if (keep < 50)
  add("should", "关掉 JS 后基本是空的", `开 JS ${withJs} 字，关 JS ${noJs} 字（剩 ${keep}%）。\n    落地页靠客户端渲染，首屏白屏和搜索引擎抓取都会受影响。`);
else F.note.push({ title: "关掉 JS 仍可读", detail: `${keep}% 的正文在没有 JS 时也在。` });

/* ── 截图 ── */
const shots = [];
for (const v of VIEWPORTS) {
  await page.setViewportSize({ width: v.w, height: v.h });
  await page.waitForTimeout(500);
  const f = join(OUT, `shot-${v.n}-${v.w}.png`);
  await page.screenshot({ path: f, fullPage: true });
  shots.push(f);
}

/* ── 样张 vs 落地页 并排 ── */
let sideBySide = "";
if (PROOF) {
  if (!existsSync(PROOF)) console.warn(`  · 找不到样张截图 ${PROOF}，跳过并排`);
  else {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(400);
    const shotB64 = (await page.screenshot({ fullPage: false })).toString("base64");
    const proofB64 = readFileSync(PROOF).toString("base64");
    const cmp = await ctx.newPage();
    await cmp.setViewportSize({ width: 1400, height: 80 });
    await cmp.setContent(`<body style="margin:0;background:#2A271D;font:13px/1.6 -apple-system,sans-serif;color:#F0ECE0">
      <div style="display:flex;gap:2px;align-items:flex-start">
        <figure style="margin:0;flex:1"><figcaption style="padding:8px 12px">当初选中的样张</figcaption>
          <img src="data:image/png;base64,${proofB64}" style="width:100%;display:block"></figure>
        <figure style="margin:0;flex:1"><figcaption style="padding:8px 12px">现在做出来的页面（1280 首屏）</figcaption>
          <img src="data:image/png;base64,${shotB64}" style="width:100%;display:block"></figure>
      </div></body>`);
    await cmp.waitForTimeout(400);
    sideBySide = join(OUT, "side-by-side.png");
    await cmp.screenshot({ path: sideBySide, fullPage: true });
    await cmp.close();
  }
}
await browser.close();

/* ── 报告 ── */
const sec = (t, arr) => arr.length ? `\n## ${t}\n\n` + arr.map((f) => `- **${f.title}**\n    ${f.detail}`).join("\n\n") + "\n" : "";
const report = `# 验收报告

- 页面：\`${target}\`
- 时间：${new Date().toISOString().slice(0, 16).replace("T", " ")}
- 截图：${shots.map((s) => "`" + s.replace(OUT + "/", "") + "`").join("、")}
${sideBySide ? "- 并排：`side-by-side.png`\n" : ""}
## 先回答这一问

**这跟你当初选的那一版，还是同一个东西吗？**

${sideBySide ? "看 `side-by-side.png`。" : "把样张和上面的桌面截图并排看。"}不追求像素一致——样张是定尺画布，真页面是响应式的。
要看的是气质有没有走样：留白的比例、字的轻重、主色出现的次数和位置。

下面那些是附赠的体检，回答不了上面这一问。
${sec("必修 · 这是错的", F.must)}${sec("该修 · 这是欠的", F.should)}${sec("记一笔", F.note)}${sec("没量到的（工具不猜）", F.skipped)}
---
${F.must.length ? `**${F.must.length} 项必修**，` : "没有必修项，"}${F.should.length} 项该修。
由 \`scripts/verify-page.mjs\` 生成。它只查得了机器查得了的东西——「像不像当初选的那一版」只有人能答。
`;
writeFileSync(join(OUT, "REPORT.md"), report, "utf8");

console.log("\n" + "─".repeat(56));
console.log(`验收报告：${join(OUT, "REPORT.md")}`);
if (sideBySide) console.log(`样张并排：${sideBySide}`);
for (const f of F.must) console.log(`  ✗ 必修  ${f.title}`);
for (const f of F.should) console.log(`  !  该修  ${f.title}`);
if (!F.must.length && !F.should.length) console.log("  ✓ 六项体检没查出问题");
console.log(`\n还有一问机器答不了：这跟你当初选的那一版，还是同一个东西吗？`);
console.log("─".repeat(56) + "\n");
process.exit(F.must.length ? 1 : 0);
