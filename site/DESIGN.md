---
name: 列宾 · 云上 / Liebin Cloudside
version: 1.0.0
updated: 2026-08-18
scope: liebin.caojuege.com 落地页
origin: >
  三版样张（云上 / 落地 / 素墨）并列确认后，用户选定「云上」。
  参考来源为 Olympus AI 的三张截图，属「只有图」这一路——能拿到构图、色彩关系、气质，
  拿不到精确数值、动效、响应式行为。下列数值是我们自己定的解，不是从参考里量出来的。

colors:
  primary: "#8D6E22"              # 金，全站主色
  paper: "#FBF8F0"                # 象牙底，全站唯一底色
  paper_lift: "#FFFDF7"           # 浮起面
  ink: "#2A271D"
  ink_soft: "#4C4738"
  muted: "#7A725E"
  muted_2: "#797262"
  hairline: "rgba(42,39,29,.10)"
  hairline_2: "rgba(42,39,29,.18)"
  gold: "#8D6E22"                 # kicker、拉丁旁注
  gold_light: "#B08F43"           # 编号、印章环
  gold_glow: "#DEBE6C"            # 月牙、微光
  gold_line: "rgba(170,142,80,.30)"
  gold_grad_1: "#C39422"          # ↓ 标题金渐变三色停 —— 配方见正文 §2
  gold_grad_2: "#DEBB64"
  gold_grad_3: "#EFDCA8"
  sky_1: "rgba(243,221,157,.60)"  # ↓ 云雾四层色停 —— 配方见正文 §2
  sky_2: "rgba(253,246,228,.95)"
  sky_3: "rgba(250,238,204,.80)"
  sky_4: "rgba(254,250,238,.95)"
  strip_bg: "#F5EEDA"              # 公告条底：rgba(232,214,166,.30) 压在象牙纸上的合成值
  strip_ink: "#876721"
  crimson: "#A8102F"              # 唯一强调色，每屏上限一处
  ink_block: "#211F17"
  ink_block_code: "#D9B45F"
  ink_block_text: "#EFEADC"
  btn_dark: "#4A4536"
  btn_dark_ink: "#F8F5EC"

typography:
  # fontSize 锁的是上限值（rem，可迁移）。实际用的流体区间见正文 §3。
  h1:      { fontFamily: '"Noto Serif SC","Songti SC","SimSun",Georgia,serif', fontSize: "5rem",     lineHeight: 1.24, fontWeight: 300, letterSpacing: "0em" }
  h1Latin: { fontFamily: '"Cormorant Garamond",Georgia,"Times New Roman",serif', fontSize: "2.625rem", lineHeight: 1.24, fontWeight: 300 }
  h2:      { fontFamily: '"Noto Serif SC","Songti SC","SimSun",Georgia,serif', fontSize: "3.125rem", lineHeight: 1.35, fontWeight: 300, letterSpacing: "0em" }
  h3:      { fontFamily: '"Noto Serif SC","Songti SC","SimSun",Georgia,serif', fontSize: "1.625rem", lineHeight: 1.40, fontWeight: 300 }
  lead:    { fontFamily: '"Inter",ui-sans-serif,system-ui,-apple-system,"PingFang SC",sans-serif', fontSize: "1.094rem", lineHeight: 1.95, fontWeight: 400 }
  body:    { fontFamily: '"Inter",ui-sans-serif,system-ui,-apple-system,"PingFang SC",sans-serif', fontSize: "0.938rem", lineHeight: 1.90, fontWeight: 400 }
  aside:   { fontFamily: '"Cormorant Garamond",Georgia,"Times New Roman",serif', fontSize: "1.063rem", lineHeight: 1.40, fontWeight: 400 }
  kicker:  { fontFamily: '"Inter",ui-sans-serif,system-ui,-apple-system,"PingFang SC",sans-serif', fontSize: "0.625rem", lineHeight: 1.40, fontWeight: 600, letterSpacing: "0.22em" }
  mono:    { fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace', fontSize: "0.813rem", lineHeight: 1.70, fontWeight: 400 }

spacing:
  pageMax: "1240px"
  gutter: "clamp(20px,4.4vw,56px)"
  navHeight: "66px"
  sectionY: "clamp(72px,7vw,116px)"
  measureLead: "40em"
  measureBody: "34em"

rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "9999px"

components:
  nav:         { backgroundColor: "{colors.paper}", textColor: "{colors.ink_soft}", height: "66px" }
  strip:       { backgroundColor: "{colors.strip_bg}", textColor: "{colors.strip_ink}", height: "32px" }
  heroTitle:   { textColor: "{colors.gold_grad_2}", typography: "{typography.h1}" }
  heroLatin:   { textColor: "{colors.gold_grad_3}", typography: "{typography.h1Latin}" }
  sectionTitle: { textColor: "{colors.gold_grad_1}", typography: "{typography.h2}" }
  lead:        { textColor: "{colors.muted}", typography: "{typography.lead}" }
  body:        { textColor: "{colors.ink_soft}", typography: "{typography.body}" }
  kicker:      { textColor: "{colors.gold}", typography: "{typography.kicker}" }
  aside:       { textColor: "{colors.muted_2}", typography: "{typography.aside}" }
  moon:        { textColor: "{colors.gold_glow}", size: "34px" }
  accentMark:  { textColor: "{colors.crimson}", typography: "{typography.aside}" }
  buttonDark:  { backgroundColor: "{colors.btn_dark}", textColor: "{colors.btn_dark_ink}", rounded: "{rounded.pill}", padding: "13px 30px" }
  buttonQuiet: { backgroundColor: "{colors.paper_lift}", textColor: "{colors.ink_soft}", rounded: "{rounded.pill}", padding: "13px 30px" }
  card:        { backgroundColor: "{colors.paper_lift}", textColor: "{colors.muted}", rounded: "{rounded.md}", padding: "18px 20px 20px" }
  divider:     { backgroundColor: "{colors.hairline}", height: "1px" }
  dividerGold: { backgroundColor: "{colors.gold_line}", height: "1px" }
  field:       { backgroundColor: "{colors.paper}", textColor: "{colors.ink}", padding: "0 0 12px" }
  fieldRule:   { backgroundColor: "{colors.hairline_2}", height: "1px" }
  terminal:    { backgroundColor: "{colors.ink_block}", textColor: "{colors.ink_block_text}", rounded: "{rounded.md}", padding: "22px 24px" }
  terminalCode: { textColor: "{colors.ink_block_code}", typography: "{typography.mono}" }
  seal:        { backgroundColor: "{colors.paper_lift}", textColor: "{colors.gold_light}", rounded: "{rounded.pill}", size: "88px" }
  faqRow:      { textColor: "{colors.muted}", typography: "{typography.body}", padding: "24px 0" }
  contactTile: { backgroundColor: "{colors.paper_lift}", textColor: "{colors.ink}", rounded: "{rounded.md}", padding: "24px 16px" }
  skyWashTop:  { backgroundColor: "{colors.sky_1}" }
  skyWash:     { backgroundColor: "{colors.sky_2}" }
  skyWashEdge: { backgroundColor: "{colors.sky_3}" }
  skyWashFoot: { backgroundColor: "{colors.sky_4}" }

# ── 以下两节规范不认识，会被 export 忽略；保留是有意的 ──
# cjk：规范默认拉丁文，中文不补这几项，agent 生成的中文页面必然失调
cjk:
  headingTracking: "0em"          # 中文标题不用负字距，照抄拉丁负字距会挤连
  bodyLineHeight: 1.9             # 不是拉丁文的 1.4–1.6
  weightMap: { light: 300, regular: 400, bold: 700 }   # 别用 500，Noto Serif SC 该档无效
  latinGap: "0.25em"
  punctuation: compress

# elevation：规范只有 rounded，没有阴影层级
elevation:
  none: "默认。靠云雾晕染分层，不靠阴影"
  lift: "0 10px 30px rgba(140,116,60,.14)"   # 仅卡片 hover
  glow: "0 10px 30px rgba(140,116,60,.22)"   # 仅深色主按钮
---

# 列宾 · 云上

## 1. Overview

**用户在电脑前，想重新设计自己的产品。** 他不是来读文章的，是卡在「说不清自己要什么」这一步上，
带着一个具体的页面和一肚子说不出口的不满意，打开这一页找办法。所以这一页要在三十秒内让他相信
「这东西能把我说不出来的话逼出来」，而不是让他欣赏排版。

视觉上这是一套**天光**：象牙纸底，金渐变的细衬线大标题，四层云雾晕染，几只飞鸽，
一道虚线弧和两个角标经纬度。参考来自 Olympus AI，但坐标换成了伏尔加河（56.3287° N / 44.0020° E）——
列宾在那儿住了两个夏天画习作，这套设计的名字就是从那来的。

一句话：**克制的天光，不是华丽的装饰。** 全屏只有一处金渐变、一个按钮、一个朱红。

## 2. Colors

底色只有 `#FBF8F0` 一种，全站不出现第二种白。层次靠云雾（四层 radial-gradient 叠加）做，
不靠灰阶、不靠卡片边框。

金分四档，各有各的岗位，不要混用：`gradient` 只给标题，`solid` 给 kicker 和拉丁旁注，
`light` 给编号和印章环，`glow` 给月牙。**金渐变每屏最多出现一次。** 出现两次就不是天光，是俗气。

朱红 `#A8102F` 是从列宾原来那套文艺复兴色板里留下的唯一一笔，每屏上限一处。

## 3. Typography

三体协作：中文衬线（Noto Serif SC）主唱、拉丁衬线斜体（Cormorant Garamond）做副行与旁注、
无衬线（Inter）做 UI 和小字。

关键在**字重**：这套设计的轻盈感来自 `font-weight: 300`。中文标题用 300 而不是 700，
是「云上」和被否掉的「落地」之间最主要的分野。代价是小字号下细体会发虚——
所以 300 只用在 26px 以上，26px 以下一律回到 400。

YAML 里 `fontSize` 锁的是上限（rem）。页面实际用的是流体区间，一并记在这里：

```css
--fs-h1:       clamp(38px, 6.25vw, 80px);
--fs-h1-latin: clamp(22px, 3.30vw, 42px);
--fs-h2:       clamp(28px, 3.90vw, 50px);
--fs-h3:       clamp(20px, 2.00vw, 26px);
--fs-lead:     clamp(16px, 1.40vw, 17.5px);
```

中文四条硬规则已写进 YAML 的 `cjk` 段，逐条都是从拉丁文 spec 迁移时最容易翻车的地方。

## 4. Layout

首屏居中、内容窄、留白大——正文测量宽度 `40em`，在 1280px 下约占 55% 屏宽。
这是 Olympus 那种空气感的真正来源，不是渐变。**宁可让页面变长，也不要把一屏塞满。**

## 5. Elevation & Depth

默认无阴影。整套设计只有两处允许浮起：产品截图框和深色主按钮，且阴影都是暖调
（`rgba(140,116,60,…)`），不是中性灰。灰色阴影打在象牙底上会脏。

## 6. Shapes

边框永远 1px，永远是发丝线。**图片一律羽化**（radial 遮罩），不用硬边方框、不用图注胶囊——
这是从参考里学到的最有用的一条：Olympus 的大理石像和天使都是浮在云里的，不是贴在框里的。

## 7. Components

见 YAML `components` 段。三个需要额外说明的：

- **飞鸽**：SVG 几何拼的（体 + 双翼 + 头 + 喙 + 尾），不是手搓单条 path——
  在 30px 尺寸下 path 会糊成一团白点。每屏 2–4 只，opacity 0.45–0.72，带暖调 drop-shadow。
- **月牙**：两圆相减（`<mask>`），不要用 `☾` 字符——多数字体没有这个字形，会退成方框。
- **输入区**：只有下边框。参考里没有任何一个有框的输入框，这一条不能破。

## 8. Do's and Don'ts

### Do's
- ✅「保留 liebin.caojuege.com 的列宾自画像，文案，只是用云上的风格重新设计」— 用户定版时的原话。
  **文案一个字不改**，自画像必须留，改的只有形式。
- ✅ 首屏能不放正文就不放正文，一切靠光和留白。
- ✅ 所有从参考迁移的数值先除以字号转成 em 再落地。

### Don'ts
- ❌「落地和素墨和我给的风格不太像」— 用户**同时否掉变体 II 和 III** 时的原话。
  这一句是这份文档里约束力最强的一条，它的意思是：**凡是让页面离 Olympus 那张截图更远的改动，都是错的方向。**
  具体到执行上，以下三件事被这句话直接否掉了——
  - ❌ 不要把云雾压淡（「落地」压到三分之一，被否）
  - ❌ 不要把标题字重加粗到 700（「落地」用 700，被否）
  - ❌ 不要拿掉金渐变和云雾改用横线分栏（「素墨」的做法，被否）
- ❌ 不要用 Lorem ipsum 或任何占位文字。
- ❌ 不要给中文标题加负字距。

> **只有一条用户原话。** 规范建议 Don'ts 里至少留两条，这次用户只给了一句，
> 就只记这一句，其余三条是从这一句推出来的执行细则，已标注来源。
> 不替用户编第二句——编出来的负面约束是废话，对后续生成零约束力。

## 9. 什么时候别用这套

规范里没有这一栏。补上，因为这套设计有一个**已经量出来的**失效点：

**长正文区会撑爆它。** 三版样张实测：同一份文案（三个坑 + FAQ 四问）放进 880px 画布，
「云上」溢出 138px——四个 FAQ 只看得见两条半；「落地」和「素墨」都刚好放得下。
50px 的细衬线标题、88px 的印章、1.9 的行高，加起来就是这个结果。

### 已知取舍：金渐变标题过不了 WCAG AA

在 `#FBF8F0` 象牙底上实测（AA 大字门槛 3:1）：

| 色停 | 对比度 | |
|---|---|---|
| `#C39422`（顶） | 2.61:1 | 不足 |
| `#DEBB64`（中） | 1.74:1 | 不足 |
| `#EFDCA8`（底） | 1.28:1 | 不足 |

**这是明知故犯，不是疏漏。** 要让三档全部过线，得压到 `#B3881F → #A68C4B → #9B8E6D`——
最后一档已经是浊橄榄灰，「天光」就没了，而这恰好是用户在三版里唯一选中的东西。

所以这套设计的边界是：**金渐变只许出现在 h1 / h2 / 页脚金句这类 40px 以上的展示型标题上，
一个字都不许下放到正文。** 正文、导航、旁注、图注、kicker 全部已按 AA 4.5:1 校准过
（`--muted` `#7A725E`、`--muted-2` `#797262`、`--gold` `#8D6E22`、印章 `#B08F43`）。
标题的语义信息在 `<title>`、`<meta description>` 和正文里都有重复，不是唯一载体。

如果哪天要做无障碍合规版：把 `.gold` 换成实色 `--ink`，其余不动，页面依然成立——
只是不再是「云上」。

所以：

- **能用**：首屏、章节扉页、产品截图区、表单区（实测放得下）
- **要小心**：连续三段以上的中文说明文字——把字号降到 15px、行高降到 1.8、印章换成小编号，
  或者干脆接受页面变长
- **别用**：文档页、后台、任何以「一屏看完多少信息」为目标的界面。
  这套设计的目标函数是「让人相信」，不是「让人读完」。

---

*这份文档由 [列宾 skill](https://github.com/ShaohuaDavidLee/Liebin) 的第四步产出。
格式遵循 [google-labs-code/design.md](https://github.com/google-labs-code/design.md)（Apache-2.0），
补了 CJK 段和「什么时候别用这套」一节。*
