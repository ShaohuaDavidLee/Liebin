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

## CJK 扩展（规范原生不支持中文）

规范默认拉丁文。中文必须在 Typography 段补这几项，否则 agent 生成的中文页面必然失调：

```yaml
typography:
  cjk:
    font_stack: '"Source Han Serif SC", "Noto Serif SC", "Songti SC", serif'
    heading_tracking: 0em          # 中文标题不用负字距，最多 -0.01em
    body_line_height: 1.8          # 中文正文 1.7–1.9，不是拉丁文的 1.4–1.6
    weight_map: { light: 300, regular: 400, bold: 700 }  # 中文字体多数只有 3-5 档，别设 500
    latin_gap: 0.25em              # 中西文混排间隙
    punctuation: compress          # 标点挤压
```

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
- [ ] 跑一遍 `npx @google/design.md lint` 确认结构合法
