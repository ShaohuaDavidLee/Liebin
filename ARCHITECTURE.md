# 列宾

```
SKILL.md                 skill 主流程：收料 → 三变体 → 确认 → DESIGN.md → 验收
references/              收料、分轴、DESIGN.md 规范、验收
scripts/proof.mjs        样张脚手架（无依赖）
scripts/proof.test.mjs   脚手架自检：占位文字和缺屏必须拦下
scripts/verify-page.mjs  验收体检（要 playwright，有保底路径）
assets/preview-template.html  不用脚本时的手搭模板
evals/                   触发与流程测试
site/                    落地页（Cloudflare Pages 静态产出）
wrangler.toml            Pages 配置：产出目录 site
```

skill 与落地页互不依赖。落地页只负责让人看清产出、装上、攒任务包。真正的设计方向确认发生在 agent 读 `SKILL.md` 之后。

两个脚本都是可选的：不装 Node 也能走完五步，脚本只是把机械的部分（搭样张外壳、跑体检）自动化了。
