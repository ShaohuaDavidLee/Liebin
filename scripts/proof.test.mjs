#!/usr/bin/env node
/**
 * scripts/proof.mjs 的最小自检：该出的出，该拦的拦。
 *   node scripts/proof.test.mjs
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCRIPT = join(ROOT, "scripts", "proof.mjs");
const CELL = "<h1>工位</h1><p>把今天要干的三件事钉在屏幕上</p><button>钉住今天</button>";

const cfg = {
  product: "工位",
  axis: { name: "取舍程度", why: "参考是网址，缺的是意图与取舍" },
  screens: ["首屏", "钉住今天", "空状态"],
  variants: [
    { name: "贴着做", tag: "贴着参考", desc: "结构密度节奏都搬过来" },
    { name: "取其神", tag: "只取味道", desc: "味道留下，版面重排" },
    { name: "反着来", tag: "刻意偏离", desc: "参考怎么做它偏不那么做" },
  ],
};

function run(dir) {
  return spawnSync(process.execPath, [SCRIPT, "--in", dir, "--out", join(dir, "out.html")], {
    encoding: "utf8",
  });
}

function writeProof(dir, { config = cfg, cells = {}, skip = [] } = {}) {
  writeFileSync(join(dir, "proof.json"), JSON.stringify(config, null, 2));
  for (let v = 1; v <= 3; v++) {
    for (let s = 1; s <= 3; s++) {
      const name = `v${v}s${s}.html`;
      if (skip.includes(name)) continue;
      writeFileSync(join(dir, name), cells[name] ?? CELL);
    }
  }
}

let failed = 0;
function check(name, ok, detail) {
  if (ok) console.log("  ✓ " + name);
  else {
    console.error("  ✗ " + name + (detail ? "\n    " + detail : ""));
    failed++;
  }
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-ok-"));
  writeProof(dir);
  const r = run(dir);
  const out = join(dir, "out.html");
  check("合法输入出文件", r.status === 0 && existsSync(out), r.stderr);
  const html = existsSync(out) ? readFileSync(out, "utf8") : "";
  check("外壳含三问和三个变体名", /另外两个/.test(html) && /贴着做/.test(html) && /取其神/.test(html) && /反着来/.test(html));
  check("画布默认 1280×880", /--stage-w:1280px/.test(html) && /--stage-h:880px/.test(html));
  rmSync(dir, { recursive: true });
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-lorem-"));
  writeProof(dir, { cells: { "v1s1.html": "<p>Lorem ipsum dolor sit amet</p>" } });
  const r = run(dir);
  check("Lorem ipsum 不出文件", r.status === 1 && !existsSync(join(dir, "out.html")));
  check("Lorem ipsum 说明原因", /Lorem ipsum/.test(r.stderr));
  rmSync(dir, { recursive: true });
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-todo-"));
  writeProof(dir, { cells: { "v2s3.html": "<p>空状态待补充</p>" } });
  const r = run(dir);
  check("「待补充」不出文件", r.status === 1 && /待补充/.test(r.stderr));
  rmSync(dir, { recursive: true });
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-mention-"));
  writeProof(dir, { cells: {
    "v1s1.html": "<h1>列宾</h1><p>别写占位文字，也不许 Lorem ipsum —— 真实文案才会暴露问题</p>",
  } });
  const r = run(dir);
  check("在「讲」占位文字不算犯规", r.status === 0 && existsSync(join(dir, "out.html")));
  rmSync(dir, { recursive: true });
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-missing-"));
  writeProof(dir, { skip: ["v3s2.html"] });
  const r = run(dir);
  check("缺一屏不出文件", r.status === 1 && /v3s2/.test(r.stderr));
  rmSync(dir, { recursive: true });
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-two-"));
  writeFileSync(join(dir, "proof.json"), JSON.stringify({ ...cfg, variants: cfg.variants.slice(0, 2) }));
  const r = run(dir);
  check("两个变体不出文件", r.status === 1 && /要正好 3 个变体/.test(r.stderr));
  rmSync(dir, { recursive: true });
}

{
  const dir = mkdtempSync(join(tmpdir(), "liebin-proof-oldnames-"));
  writeProof(dir, {
    config: {
      ...cfg,
      variants: [
        { name: "照搬", tag: "贴着参考", desc: "旧名字" },
        { name: "取气", tag: "只取气质", desc: "旧名字" },
        { name: "反手", tag: "刻意偏离", desc: "旧名字" },
      ],
    },
  });
  const r = run(dir);
  check("旧名字不出文件", r.status === 1 && /贴着做/.test(r.stderr) && !existsSync(join(dir, "out.html")));
  rmSync(dir, { recursive: true });
}

if (failed) {
  console.error("\n" + failed + " 项未过");
  process.exit(1);
}
console.log("\n✓ scripts/proof.mjs 自检通过");
