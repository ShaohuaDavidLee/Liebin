# 文艺复兴 Design System · 韶华David / 草诀歌 AI Labs

一套**人文主义编辑风**的视觉语言，从个人主页「方案A · 长卷索引版」提炼而来。关键词：
**温暖纸感、人文衬线、金朱二色、编辑式索引、罗马数字、拉丁斜体旁注**。

它服务的不是一家公司，而是一个人和他的社区：韶华David——前翻译、产品经理、ex LanguageX Co-founder，
公众号 / 小宇宙「David 的 AI 全景图」主理人，草诀歌 AI Labs（以非技术背景为主的 Vibe Coding 社区）发起人。
所以这套系统的气质是**书房**而不是**仪表盘**：纸、墨、颜料、页边批注、一张仍在生长的索引。

## 来源 Sources

| 来源 | 说明 |
|---|---|
| `reference/个人主页-方案A.html` | 唯一的视觉母本，所有 token 与组件均由它逐值提取 |
| https://www.caojuege.com/davidli | 上述页面的线上版本，内容一致 |
| `reference/民大分享-上半场-方案A.html` | 同一语言的 1920×1080 幻灯片实现，幻灯片字号与版式由它提取 |
| `design.md` | 提炼之前的手写设计札记，保留作为出处 |
| `assets/portrait.jpg`、`assets/canvas-tex.jpg` | 母本页面里的真实图片素材 |

**没有 logo。** 母本中品牌位是纯文字锁定（「韶华 *David*」「草诀歌 AI Labs」），本系统不臆造标志，
需要标记处一律排字：中文衬线 900 + 拉丁斜体，见 `ui_kits/homepage/homepage.css` 的 `.hp-mark`。

---

## CONTENT FUNDAMENTALS · 文案基本法

**人称**：第一人称「我」，对读者称「你」。是自述，不是公司简介。不用「我们」冒充团队。

**双语并置**：几乎每个标签都是「英文 · 中文」——`Work · 作品`、`Off the Clock · 架上 · 案上 · 场上`、
`邮箱 Email`。英文不是翻译，是另一个声部：中文说事实，英文说心情（`An index, still growing —`、
`Traduttore, Creatore.`、`more soon`）。英文永远斜体、永远小写谦逊语气，句末常挂一个破折号。

**标题的写法**：短句 + 句号，关键词用 `<em>` 挑出来变成朱红斜体。
「以产品为笔，和世界**对话**。」「几件我试图注入自己**气息**的作品」「我正在寻找什么**合作**」。
动词优先，不写「赋能」「打造」「一站式」这类词。

**克制的自我评价**：写「几件我试图注入自己气息的作品」而不是「代表作」；写「更多作品在路上 / more soon」
而不是「持续更新」。承认未完成，是这套语言的骨气。

**具体名词代替形容词**：不写「热爱阅读与传统文化」，写「圣经、道德经、史怀哲传、乔布斯传」「颜真卿、王羲之、米芙」
「梅西时期的巴萨、托雷斯时期的利物浦」。专名本身就是气质。

**大小写与标点**：kicker / badge / 标签一律 UPPERCASE + 大字距；中文用全角标点；中英之间留一个空格；
引号用中文弯引号「」或 “”；列表项不加句号，段落加。

**不用 emoji。** 一个也不用。需要图形提示时用 Lucide 线性图标或罗马数字。

---

## VISUAL FOUNDATIONS · 视觉基础

### 色彩
暖白纸底 `#f7f7f4` + 三级墨色，加三个颜料：朱橙 `#f54e00`（行动）、朱红 `#b3003f`（强调）、
金褐 `#c08532`（串场）。除此之外**没有别的彩色**——没有蓝紫渐变、没有语义色板。
饱和度全局克制；白也是暖白（不是 `#fff` 铺底，`#fff` 只做悬停浮起的面）。
反色区块 `.on-ink` 用于章扉 / 金句 / 页脚，全篇 1–2 处；进入反色后 `<em>` 由朱红自动换成金。

### 字体
三体协作：**Noto Serif SC**（中文衬线，主唱：标题、金句、专名、编号 01/02）、
**Inter**（无衬线，UI 小字：kicker、badge、按钮、标签）、
**EB Garamond italic**（拉丁斜体，旁注：罗马数字、域名、英文批注、页码、落款）。
三者分工是硬规则——中文永不用斜体伪造手写感（除 `<em>` 的朱红衬线斜体外），
英文旁注永不用无衬线，UI 小字永不用衬线。

### 版式
1240px 版心、28px 槽（移动端 16px）、章节间 76px 并用 1px 发丝线分隔。
清单一律是**行**不是卡：顶部 `--hair-2` 起始线，逐行 `--hair` 分隔，行内三栏「编号 | 内容 | 圆形箭头」。
文字有宽度上限（简介 56ch、注解 72ch、居中导语 46ch），长段永远不横跨整版。

### 背景与质感
**每一页都有纸面颗粒**：`feTurbulence` SVG 叠加，纸底 `opacity .035 / mix-blend multiply`，
墨底 `.09 / normal`。没有渐变背景、没有大色块、没有重复图案。
唯一的渐变是图片底部压图注的暗幕 `--scrim-bottom`。

### 卡片、边框、阴影
卡片=白面 + 1px 发丝边 + 20px 圆角，几乎不用阴影；只有图片框用一档暖投影
`0 18px 50px -28px rgba(38,30,8,.5)`。永远不用彩色描边、不用左侧色条卡片。
圆角只有四档：14 / 20 / 30 / 胶囊。

### 动效与状态
只有两种动作：**淡入上浮**（`translateY(18px)` → 0，`.8s cubic-bezier(.16,1,.3,1)`，最多三级 100ms 错峰）
和**悬停位移**。没有弹跳、没有缩放、没有旋转。
悬停：列表行整行浮白 + 左内缩 12px，圆形箭头反白并右移 4px；
按钮 dark → 朱橙、顶栏 CTA → 朱红、ghost → 浅面；箭头 `→` 右移 4px。
按下态不做单独处理（这是内容型页面，不是控件密集的应用）。
所有动画在 `prefers-reduced-motion` 下关闭。

### 透明与模糊
只有三处：顶栏 `rgba(247,247,244,.85) + blur(8px)`、图注胶囊 `rgba(28,20,12,.62) + blur(4px)`、
金色描边胶囊的 7% 金底。其余一律实色。

### 图像
真实照片：30px 圆角 + `inset:12px` 的 1px 半透明白内框 + 左下角深色斜体图注胶囊，
轻微降饱和提对比（`saturate(.97) contrast(1.02)`），色调偏暖。
没有真实图片时用 45° 条纹占位框，用无衬线小字写明「该放什么」——**不画 SVG 插画**。

---

## ICONOGRAPHY · 图标

母本使用 **Lucide**，通过 Iconify web component 从 CDN 引入，没有自带图标字体或 sprite：

```html
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
<iconify-icon icon="lucide:arrow-up-right"></iconify-icon>
```

- 线性、1.5–2px 描边、圆头端点；尺寸 19–26px；放在 46–48px 的圆形容器里（1px 发丝边 + 白面）。
- 母本实际用到：`arrow-up-right`（外链，索引行）、`book-open` / `pen-tool` / `circle-dot`（爱好三行）、
  `mail` / `message-circle` / `mic` / `users`（联系方式）。
- 图标色跟随语义：默认墨色，同组三行按 ink → crimson → primary 轮换；联系方式一律金色。
- **不用 emoji**，不用彩色图标，不用面性图标。
- 唯一的「非图标图形」是罗马数字和 2px 金线——它们承担了大部分图形表达。

---

## 目录索引 Index

```
styles.css              ← 消费方只需引这一个文件
tokens/                 colors · typography · spacing · effects · motion
base/                   base.css（元素默认值）· utilities.css（.grain / .wrap / .section / .caption-pill / .rise）
components/
  core/                 Button · Badge · Kicker · GoldRule · LatinAside · RoleChip(+RoleChips)
  editorial/            SectionHead · EditorialList · IndexRow · NumberedRow · FeatureRow
  media/                PhotoFrame · StripeFrame · ContactTile
guidelines/             16 张 foundation 规格卡（Colors / Type / Spacing / Brand）
ui_kits/homepage/       个人主页复刻（index.html + sections.jsx + homepage.css）
ui_kits/slides/         6 个幻灯片模板（1920×1080，卡片内缩放展示）
assets/                 portrait.jpg · canvas-tex.jpg · image-slot.js · deck-stage.js
reference/              视觉母本原件（个人主页-方案A · 民大分享-上半场-方案A）
overview.html           设计系统总览（16 张规格卡 + 组件卡一次看完）
design.md               提炼前的手写札记（出处）
SKILL.md                供 Claude Code 使用的 skill 入口
```

**Intentional additions（母本没有、但系统需要的）**
- `RoleChips`：母本 hero 里的三个身份胶囊是裸 HTML，抽成组件以便复用。
- `EditorialList`：母本的 `.windex` 与 `.olist` 是两套近似样式，合并为一个容器 + 两种行。
- `StripeFrame`：母本用 `image-slot` 做可拖拽占位，这里补一个纯静态的条纹占位以便离线使用。

## 已知取舍 Caveats
- 字体走 Google Fonts CDN（Noto Serif SC / Inter / EB Garamond），项目内没有字体二进制文件。
  如需离线或商用打包，请提供字体文件，我再改成本地 `@font-face`。
- `guidelines/` 与 `components/` 的规格卡是**静态 HTML 规格页**（直接用系统 CSS 类），不依赖组件运行时；
  本项目已注册为 Design System，后续可改成从编译产物挂载 React 组件。
- 幻灯片模板是静态单页；实际做整场演讲时请配 `assets/deck-stage.js`（母本 deck 用的翻页壳）。
