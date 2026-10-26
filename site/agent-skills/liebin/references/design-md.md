# DESIGN.md：用规范，别自创

Google Labs 已经把 DESIGN.md 开源成正式规范（Apache-2.0，`github.com/google-labs-code/design.md`），官方带 `@google/design.md` CLI（lint / diff / export 到 Tailwind 和 W3C DTCG）。**自创格式的唯一结果是和整个 agent 生态失去互通。**

## 八个小节（顺序固定）

```
1. Overview          — 这套设计是什么，给谁，什么场景
2. Colors            — 色板
3. Typography        — 字体、字号阶梯、字重、行高
4. Layout            — 栅格、容器宽度、间距标尺
5. Elevation & Depth — 阴影、层级
6. Shapes            — 圆角、边框
7. Components        — 具体组件规格
8. Do's and Don'ts   — 正反约束
```

结构是 **YAML 前置元数据锁死数值 + Markdown 正文承载判断**。这个分工是规范的设计意图：数值锁住让 agent 不能漂移，散文补上数字表达不了的取舍。

**所有自动化提取工具产出的散文那半页都是空的或者是废话。** 那半页正是这个 skill 的产出物。

## 这个 skill 要额外写进去的三样东西

规范本身没规定，但没有它们这份 DESIGN.md 就退化成又一份 token 清单：

### 1. Overview 第一句写使用场景，不写风格形容词

写「用户在孕期焦虑、常在深夜单手使用」，不写「现代简约的高级感设计」。
后者对 agent 零信息量，前者能让它在每个决策点上自己做对选择。

### 2. Do's and Don'ts 逐字保留用户原话

```markdown
## Do's and Don'ts

### Don'ts
- ❌「这个圆角太软了，看着像儿童产品」— 用户否决变体 B 时的原话
- ❌「深夜看这个白底会瞎」— 用户否决变体 A 时的原话
```

标注是哪个变体被否掉时说的。这一段是整份文档里唯一别人抄不走的部分。

### 3. 加一节「什么时候别用这套」

规范里没有这一栏，但 99% 的设计事故都出在这儿。写清楚这套语言在什么内容、什么情绪、什么密度下会失效。

### 3.5 每个数值标出处

规范只管锁值，不管这个值是哪来的。但**「量出来的 #FBF8F0」和「我们拍的 #FBF8F0」在下游 agent 眼里长得一模一样**——
它会把两者同等对待，一样当权威照着做。

三档就够，写成 YAML 注释最省事（也不会被 linter 挑刺）：

```yaml
colors:
  paper: "#FBF8F0"        # 看图估的 —— 截图分不出 2x 屏，这是对着色块取的
  ink: "#2A271D"          # 量得 —— 参考站 computed CSS
  crimson: "#A8102F"      # 我们定的 —— 参考里没有强调色，这一笔是这次加的
```

- `量得` —— 从 DOM / computed CSS / source map 读出来的
- `看图估的` —— 对着截图定的，色相和关系可信，绝对值不可信
- `我们定的` —— 参考里根本没有，这次拍板的

**只有一张截图的时候，诚实的结果往往是整份 spec 八成都是「我们定的」。** 那就照实写。
一份标着「我们定的」的 DESIGN.md 依然完全可用——它只是不再冒充测量结果。

这一条和「数值崇拜」是一枚硬币的两面：那一条讲别照抄别人的数，这一条讲别让自己编的数冒充量出来的数。

### 4. 实现时的创意指令（原文，不要改写）

方向锁定、Don'ts 写死之后，执行 agent 还要做大量未拍板的选择。把下面三段**原文**附在 DESIGN.md 末尾。这不是风格形容词，是实现阶段的工作方式。

```markdown
## 实现时的创意指令

在尊重本文件已确认的设计方向、真实内容和用户原话约束的前提下，充分发挥你的设计创造力。

开始实现前，用工具生成一串随机字母与数字，从其中的组合、节奏和联想中寻找灵感，用于尚未确定的构图、排版、色彩、图像和交互设计。随机字符串仅供创作启发，不要出现在页面中。

大胆做出具体、有个性的设计选择，尝试你通常不会首先采用的表达。需要时使用图片生成来实现关键视觉。运用你的判断，让这些选择形成一个完整、有吸引力、适合这个产品的设计。
```

随机串只在实现开始时生成，不得出现在页面里。三版样张阶段不要用它来决定「贴着做 / 取其神 / 反着来」。

## 跑 lint 时会踩的四个坑

`npx @google/design.md lint` 是有用的（它能替你查出对比度不达标），但 schema 比文档写的严，有四处会翻车：

**① 渐变不能放在 `colors` 底下。** `linear-gradient(...)` 不是合法颜色，直接报 error。
拆成色停放进 `colors`（`gold_grad_1/2/3`），完整配方写进正文的代码块——**这本来就是更对的分工**：YAML 锁值，散文承载配方。

**② `clamp()` 不是合法 dimension。** 流体字号在 YAML 里锁不住。
锁上限值（用 rem，可迁移），把实际用的 `clamp()` 区间写进正文。

**③ 组件引用 token 必须加引号。**

```yaml
components:
  nav: { backgroundColor: {colors.paper} }     # 错：YAML 把它解析成嵌套 map，引用静默失效
  nav: { backgroundColor: "{colors.paper}" }   # 对
```

不加引号不会报错，只会让所有颜色都被判成「定义了但没人用」——**看起来像 27 条无关紧要的 warning，实际是引用整个没生效。**

**④ 冒号和花括号之间必须有空格。** `nav:{ ... }` 会让 YAML 解析中断，
而 linter 会拿**残缺的解析结果**给你一份"0 error"的报告。**看到 warning 数量突然变得很少，先确认 YAML 真的解析通过了**，
别急着高兴：

```bash
python3 -c "import yaml,sys;yaml.safe_load(open('DESIGN.md').read().split('---')[1]);print('YAML OK')"
```

## CJK 扩展（规范原生不支持中文）

规范默认拉丁文。中文必须在 Typography 段补这几项，否则 agent 生成的中文页面必然失调：

`typography` 只认七个属性——`fontFamily / fontSize / fontWeight / lineHeight / letterSpacing / fontFeature / fontVariation`。
中文那几项没有对应的字段，硬塞成 `cjk: { font_stack, heading_tracking, latin_gap, … }` 会**每条属性报一个 warning**（实测六条全中）。
按规范的分工来：锁得住的落进 token，锁不住的写进正文——和渐变、`clamp()` 是同一个处理方式。

```yaml
typography:
  cjk-heading:
    fontFamily: '"Source Han Serif SC", "Noto Serif SC", "Songti SC", serif'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0em     # 中文标题不用负字距，最多 -0.01em
  cjk-body:
    fontFamily: '"Source Han Sans SC", "Noto Sans SC", sans-serif'
    fontWeight: 400
    fontSize: 1rem
    lineHeight: 1.8        # 中文正文 1.7–1.9，不是拉丁文的 1.4–1.6
```

剩下三样 schema 锁不住，写进 Typography 那一节的正文，一句话一条：

- **字重档位**：中文字体多数只有 3–5 档（300 / 400 / 700），别设 500——落地时会被合成成假粗体
- **中西文混排间隙**：0.25em
- **标点挤压**：开

**迁移拉丁文 spec 时最容易翻车的一条**：负字距。拉丁文大标题常用 `-0.03em` 制造高级感，中文方块字之间本来就没有多余空间，负字距会直接把字挤连。

## 演示文稿扩展（规范明确不覆盖）

DESIGN.md 规范只管数字 UI，不管 PPT 和印刷。做演示时在末尾加一节自定义 token：

```yaml
presentation:
  safe_area: 0.82          # 版心占幅面比例
  title_scale: [1, 0.62, 0.44]   # 三级标题相对比例
  image_text_ratio: 0.6    # 图文面积比上限
  max_bullets: 4           # 单页信息上限
  rhythm: [full, split, full, quote]  # 版式节奏循环
```

> 用之前先确认 Claude Design 的 PPTX 导出是不是已经覆盖了你要的场景——它自带 design system 且能导出 PPTX。这一节只在它不够用时才有价值。

## 迁移检查清单

生成 DESIGN.md 之前逐条过一遍：

- [ ] 所有 `letter-spacing` / `padding` / `border-radius` 已从 px 转成 em 或比例
- [ ] 中文场景下 heading tracking ≥ 0
- [ ] 中文正文 line-height ≥ 1.7
- [ ] 字重映射没有依赖中文字体不存在的档位
- [ ] Overview 第一句是使用场景，不是风格形容词
- [ ] Don'ts 里至少有两条用户原话，且没被润色
- [ ] 有「什么时候别用这套」一节
- [ ] 附了「实现时的创意指令」三段原文，没有改写
- [ ] 每个数值标了出处（量得 / 看图估的 / 我们定的）
- [ ] YAML 单独解析通过（别只信 lint 的 0 error，见上面第 ④ 坑）
- [ ] 跑一遍 `npx @google/design.md lint` 确认结构合法
