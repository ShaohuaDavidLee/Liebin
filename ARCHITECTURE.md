# 列宾

```
SKILL.md                 skill 主流程：收料 → 三变体 → 确认 → DESIGN.md
references/              收料、分轴、DESIGN.md 规范
assets/preview-template.html  样张 HTML 模板
evals/                   触发与流程测试
site/                    落地页（Cloudflare Pages 静态产出）
wrangler.toml            Pages 配置：产出目录 site
```

skill 与落地页互不依赖。落地页只负责让人装上、攒任务包、理解四步。真正的设计方向确认发生在 agent 读 `SKILL.md` 之后。
