#!/usr/bin/env node
/**
 * 列宾 · 样张脚手架
 *
 * 三变体 × 三屏的外壳每次都一样：三列并排、scale 缩放、切屏、放大、底部确认表单。
 * 这部分是机械的，不该每次让模型重写一遍 —— 重写一遍就多一次踩坑的机会。
 * 你只写 9 个 HTML 片段（那才是定制的部分），外壳交给这个脚本。
 *
 *   node scripts/proof.mjs --in proof/ --out proof.html
 *
 * proof/ 里要有：
 *   proof.json           轴、三个变体名、三屏名
 *   v1s1.html … v3s3.html   9 个片段（变体序号 × 屏序号），每个是一屏的完整渲染
 *
 * 它会拦下三件事，拦不过就不出文件：
 *   - 片段里有占位文字（Lorem ipsum / 标题标题 / TODO / 占位）
 *   - 不是正好 3 变体 × 3 屏
 *   - 变体名不是固定的「贴着做 / 取其神 / 反着来」（轴可以变，名字不许另起）
 *
 * 无依赖，Node 18+。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const IN = resolve(arg("--in", "proof"));
const OUT = resolve(arg("--out", "proof.html"));

const die = (msg) => { console.error("\n✗ " + msg + "\n"); process.exit(1); };

/* ── 读配置 ── */
const cfgPath = join(IN, "proof.json");
if (!existsSync(cfgPath)) die(`找不到 ${cfgPath}\n  先建一个，最小形态见 references/variants.md`);
let cfg;
try { cfg = JSON.parse(readFileSync(cfgPath, "utf8")); }
catch (e) { die(`${cfgPath} 不是合法 JSON：${e.message}`); }

const { product = "未命名", axis = {}, screens = [], variants = [] } = cfg;
if (!axis.name) die("proof.json 缺 axis.name。三个变体必须沿一条能用一句话说清的轴排开——说不清就别渲染。");
if (!axis.why) die("proof.json 缺 axis.why。要写清这条轴为什么是它（你缺哪类信息，就沿哪条轴分）。");
if (variants.length !== 3) die(`要正好 3 个变体，现在有 ${variants.length} 个。\n  一个方案只能换来「嗯挺好的」，两个不够拉开差异，四个以上没人看得完。`);
if (screens.length !== 3) die(`要正好 3 屏，现在有 ${screens.length} 个。\n  首屏定气质，操作屏看功能压力，空状态屏看撑不撑得住——第三屏是最容易被跳过、也最该有的那一屏。`);

/* ── 读 9 个片段，顺手拦占位文字 ── */
const PLACEHOLDER = [
  [/lorem\s+ipsum/i, "Lorem ipsum"],
  [/标题标题/, "「标题标题」"],
  [/正文正文/, "「正文正文」"],
  [/占位(文字|符|内容)/, "「占位…」"],
  [/\bTODO\b/, "TODO"],
  [/\bTBD\b/, "TBD"],
  [/xxx+/i, "xxx"],
  [/待补充|待填|请替换/, "「待补充 / 待填 / 请替换」"],
];
const cells = [], offences = [];
for (let v = 0; v < 3; v++) {
  cells[v] = [];
  for (let s = 0; s < 3; s++) {
    const f = join(IN, `v${v + 1}s${s + 1}.html`);
    if (!existsSync(f)) die(`缺片段 ${f}\n  「${variants[v]?.name ?? v + 1}」的第 ${s + 1} 屏（${screens[s] ?? ""}）还没写。三屏一个都不能少。`);
    const html = readFileSync(f, "utf8");
    if (!html.trim()) die(`${f} 是空的。`);
    for (const [re, label] of PLACEHOLDER)
      if (re.test(html)) offences.push(`  ${f} 里有 ${label}`);
    cells[v][s] = html;
  }
}
if (offences.length) die(
  "片段里有占位文字，不出样张：\n" + offences.join("\n") +
  "\n\n  占位文字会让三个方案看起来都还行 —— 那是这套流程唯一不能出的错。\n" +
  "  中文文案的长度、语气、断行会彻底改变一个设计成不成立。用户还没有文案，\n" +
  "  就先帮他把三屏的文案写出来，让他改，改完再渲染。"
);

/* ── 变体名锁死 ── */
const LOCKED = ["贴着做", "取其神", "反着来"];
variants.forEach((v, i) => {
  if (!v?.name) die(`variants[${i}] 缺 name。`);
  if (v.name !== LOCKED[i]) die(
    `变体名固定为「${LOCKED.join(" / ")}」，第 ${i + 1} 个写成了「${v.name}」。\n` +
    "  轴可以变（松紧、取舍、密度、气质），名字不许另起——用户要能记住、能骂。"
  );
});
const warn = [];
variants.forEach((v) => {
  if (!v.desc) warn.push(`变体「${v.name}」没写 desc（它在轴上的位置，一句话）`);
});

/* 三版是不是在比同一份内容 —— 不拦，但要说 */
const plain = (s) => s
  .replace(/<(style|script|svg)[\s\S]*?<\/\1>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const sameCopy = screens.every((_, s) => cells.every((col) => plain(col[s]) === plain(cells[0][s])));
if (!sameCopy) warn.push(
  "三版的可见文案不完全相同——那比的就不只是形式了。有意增删就在 desc 里写清楚，不是就把文案对齐。"
);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const W = cfg.stage?.w ?? 1280, H = cfg.stage?.h ?? 880;
const ROMAN = ["I", "II", "III"];

/* ── 外壳 ── */
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(product)} · 三版样张</title>
<style>
:root{
  --bg:#F2F0EA;--surface:#fff;--ink:#252319;--ink-soft:#4C4738;--muted:#7B7360;
  --hair:rgba(37,35,25,.14);--hair2:rgba(37,35,25,.26);--accent:#A8102F;--gold:#9C7A26;
  --stage-w:${W}px;--stage-h:${H}px;--stage-ar:${W}/${H};
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#17160F;--surface:rgba(255,255,255,.055);--ink:#F0ECE0;--ink-soft:#D2CBB9;--muted:#968F7C;
  --hair:rgba(255,255,255,.14);--hair2:rgba(255,255,255,.26);--accent:#EE8AA2;--gold:#D9AE59;}}
:root[data-theme="dark"]{
  --bg:#17160F;--surface:rgba(255,255,255,.055);--ink:#F0ECE0;--ink-soft:#D2CBB9;--muted:#968F7C;
  --hair:rgba(255,255,255,.14);--hair2:rgba(255,255,255,.26);--accent:#EE8AA2;--gold:#D9AE59;}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);line-height:1.75;
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif}
.shell{max-width:1760px;margin:0 auto;padding:0 clamp(16px,2.4vw,40px)}
.top{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--hair);padding:26px 0 14px}
.eyebrow{font-size:10.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin:0 0 8px}
h1{font-size:clamp(18px,2vw,23px);line-height:1.45;margin:0 0 10px;font-weight:600;letter-spacing:0;text-wrap:balance}
.axis{font-size:14px;line-height:1.8;color:var(--ink-soft);margin:0;max-width:88ch}
.axis b{color:var(--ink)}
.hint{font-size:12.5px;color:var(--muted);margin:14px 0 0;line-height:1.8;max-width:88ch}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.board{display:grid;grid-template-columns:74px repeat(3,minmax(0,1fr));gap:13px 18px;
  align-items:start;padding:22px 0 8px}
.board.solo{grid-template-columns:minmax(0,1fr);max-width:${W}px}
.board.solo>:not(.pick){display:none}
.rowlab{font-size:11.5px;font-weight:600;letter-spacing:.1em;color:var(--muted);padding-top:3px;line-height:1.6}
.vhead,.cell{min-width:0;margin:0}
.cap{font-size:12.5px;color:var(--muted);margin:9px 0 0}
.board:not(.solo) .cap{display:none}
.meta{display:flex;align-items:baseline;gap:9px;padding-bottom:9px;border-bottom:1px solid var(--hair2)}
.meta .num{font-size:17px;color:var(--gold);font-style:italic}
.meta .name{font-weight:700;font-size:17px}
.meta .tag{margin-left:auto;font-size:9.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.desc{font-size:12.5px;line-height:1.75;color:var(--muted);margin:9px 0 11px;min-height:4.4em}
.frame{position:relative;aspect-ratio:var(--stage-ar);border:1px solid var(--hair2);border-radius:6px;overflow:hidden;
  background:#fff;cursor:zoom-in;display:block;width:100%;padding:0;margin:0;font:inherit;text-align:left;color:inherit;
  -webkit-appearance:none;appearance:none}
.board.solo .frame{cursor:zoom-out}
.frame::after{content:"点开放大";position:absolute;right:8px;bottom:8px;z-index:5;font-size:10px;letter-spacing:.1em;
  padding:3px 9px;border-radius:999px;background:rgba(30,27,18,.62);color:#F6F1E4;opacity:0;transition:opacity .16s}
.frame:hover::after{opacity:1}
.board.solo .frame::after{content:"收起"}
.stage{width:var(--stage-w);height:var(--stage-h);transform-origin:0 0;position:absolute;top:0;left:0}
.stage>.screen{width:100%;height:100%;position:relative;overflow:hidden}
.confirm{border-top:1px solid var(--hair);margin-top:34px;padding:34px 0 90px;max-width:800px}
.confirm h2{font-size:19px;margin:0 0 6px}
.confirm .sub{font-size:13.5px;color:var(--muted);margin:0 0 26px;line-height:1.8}
.q{margin-bottom:24px}
.q label{display:block;font-size:14.5px;font-weight:600;margin-bottom:4px}
.q .why{font-size:12.5px;color:var(--muted);margin:0 0 10px;line-height:1.8}
.q select,.q textarea{width:100%;font:inherit;font-size:14px;padding:11px 13px;border:1px solid var(--hair2);
  border-radius:7px;background:var(--surface);color:var(--ink);resize:vertical}
.q textarea{min-height:82px;line-height:1.8}
.copy{font:inherit;font-size:14px;font-weight:600;padding:12px 28px;border:0;border-radius:999px;
  background:var(--ink);color:var(--bg);cursor:pointer}
.tip{font-size:13px;color:var(--muted);margin-left:12px}
#fallback{white-space:pre-wrap;font-size:12.5px;background:var(--surface);border:1px solid var(--hair);
  border-radius:7px;padding:14px;margin-top:14px;overflow-x:auto}
@media(max-width:900px){.board{grid-template-columns:minmax(0,1fr)}.rowlab{display:none}
  .desc{min-height:0}.board:not(.solo) .cap{display:block}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>
<div class="shell">
<header class="top">
  <p class="eyebrow">${esc(product)} · 设计方向确认</p>
  <h1>三版并列，请选一版，并说清另外两版哪里不要。</h1>
  <p class="axis">三版沿同一条轴排开：<b>${esc(axis.name)}</b>。${esc(axis.why)}
  ${sameCopy ? "三版只差在这一条轴上，文案完全相同，全部是真实文案。" : "文案是真实文案，但三版并不完全一致——差在哪，看每版下面那句说明。"}</p>
  <p class="hint">九屏全在这一页上，不用切换：<b>横着看</b>三版在同一屏上的差别，<b>竖着看</b>一版从首屏到空状态撑不撑得住。
  点任意一张放大到整宽读细节，再点一次收起。</p>
</header>

<div class="board" id="board">
  <div class="rowlab"></div>
${variants.map((v, i) => `  <div class="vhead">
    <div class="meta"><span class="num">${ROMAN[i]}</span><span class="name">${esc(v.name)}</span><span class="tag">${esc(v.tag ?? "")}</span></div>
    <p class="desc">${esc(v.desc ?? "")}</p>
  </div>`).join("\n")}
${screens.map((sc, j) => `  <div class="rowlab">${esc(sc)}</div>
${variants.map((v, i) => `  <figure class="cell">
    <button class="frame" type="button" aria-label="放大「${esc(v.name)}」的${esc(sc)}"><div class="stage"><div class="screen">${cells[i][j]}</div></div></button>
    <figcaption class="cap">${ROMAN[i]} ${esc(v.name)} · ${esc(sc)}</figcaption>
  </figure>`).join("\n")}`).join("\n")}
</div>

<section class="confirm">
  <h2>三个问题</h2>
  <p class="sub">填完点按钮，内容会复制到剪贴板，贴回对话里就行。第 2 问最重要——你骂出来的原话会一字不改地进 DESIGN.md 的 Don'ts。</p>
  <div class="q">
    <label for="pick">1 · 选哪个？</label>
    <select id="pick">
      <option value="">— 请选择 —</option>
${variants.map((v) => `      <option>${esc(v.name)}（${esc(v.tag ?? "")}）</option>`).join("\n")}
      <option>三个都不要</option>
    </select>
  </div>
  <div class="q">
    <label for="reject">2 · 另外两个，哪里不要？</label>
    <p class="why">说得越具体越好，用你自己的话，别帮我润色。「这个圆角太软了」「字太挤」「这个蓝太商务」——这种话才有约束力。</p>
    <textarea id="reject" placeholder="例：「${esc(variants[1].name)}」的圆角太软，看着像儿童产品；「${esc(variants[2].name)}」留白太多，滑半天看不到重点。"></textarea>
  </div>
  <div class="q">
    <label for="context">3 · 你的用户，在什么状态下打开这个产品？</label>
    <p class="why">不是问画面，是问人——什么时间、什么心情、单手还是双手、周围有没有人。这一问会推翻一半「好看」的选择。</p>
    <textarea id="context" placeholder="例：多半是深夜躺床上，一只手拿手机，另一只手空不出来，情绪偏焦虑。"></textarea>
  </div>
  <button class="copy" id="copyBtn" type="button">复制我的选择</button><span class="tip" id="tip"></span>
  <pre id="fallback" hidden></pre>
</section>
</div>
<script>
(function(){
  var stages=[].slice.call(document.querySelectorAll('.stage')), board=document.getElementById('board');
  function fit(){stages.forEach(function(st){var w=st.parentElement.clientWidth;
    if(w)st.style.transform='scale('+(w/${W})+')';});}
  window.addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  fit();
  var cells=[].slice.call(document.querySelectorAll('.cell'));
  cells.forEach(function(c){c.querySelector('.frame').addEventListener('click',function(){
    var was=c.classList.contains('pick');
    cells.forEach(function(x){x.classList.remove('pick');});
    board.classList.toggle('solo',!was);
    if(!was)c.classList.add('pick');
    fit();
    if(!was)c.scrollIntoView({block:'nearest'});
  });});
  document.getElementById('copyBtn').addEventListener('click',function(){
    var t='【列宾 · 设计方向确认】\\n'
      +'1 选择：'+(document.getElementById('pick').value||'（未选）')+'\\n'
      +'2 否决理由（原话）：'+(document.getElementById('reject').value||'（空）')+'\\n'
      +'3 使用场景：'+(document.getElementById('context').value||'（空）');
    var tip=document.getElementById('tip'),fb=document.getElementById('fallback');
    function manual(){tip.textContent='复制失败，请手动选中下面这段：';fb.textContent=t;fb.hidden=false;}
    if(navigator.clipboard&&navigator.clipboard.writeText)
      navigator.clipboard.writeText(t).then(function(){tip.textContent='已复制，贴回对话里即可';fb.hidden=true;},manual);
    else manual();
  });
})();
</script>
</body>
</html>
`;

writeFileSync(OUT, html, "utf8");
warn.forEach((w) => console.warn("  · " + w));
console.log(`\n✓ 样张已生成：${OUT}`);
console.log(`  轴：${axis.name}`);
console.log(`  ${variants.map((v) => v.name).join(" / ")} × ${screens.join(" / ")}`);
console.log(`  画布 ${W}×${H}，${(html.length / 1024).toFixed(0)} KB，除 Google Fonts 外无外部依赖\n`);
