# Cloudflare Pages 绑定

落地页是纯静态文件，走 **Pages**，不要建 Worker。

本仓库没有 Cloudflare 账号凭证，Pages 项目需要你在仪表盘建一次。之后每次 push 会自动发布。

## 你来建（一次性，大约两分钟）

1. 打开 [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. **Create** → **Pages** → **Connect to Git** → 选 `ShaohuaDavidLee/Liebin`
3. 设置：
   - Production branch：`main`（不要选某个 commit，也不要 Retry 失败的旧部署）
   - Framework preset：None
   - Build command：留空
   - Output directory：`site`
4. **Save and Deploy** —— 日志里 HEAD 必须是带 `site/` 的提交，不能是 `7a974c9`

如果第一次失败后再点 **Retry deployment**，Cloudflare 会重跑同一个旧 SHA，还是找不到 `site/`。正确做法是：Settings → Builds & deployments → Production branch 改成 `main`，然后 **Create deployment** / Save，让它拉最新代码。
5. **Custom domains** → 添加 `liebin.caojuege.com`

如果 `caojuege.com` 已经在同一个 Cloudflare 账号里，子域会自动出 CNAME，不用改 DNS。

如果域名在别的地方：给 `liebin` 加一条 CNAME，指向 Cloudflare 给的 `*.pages.dev`。

## 我已经准备好的

- `site/`：可直接上线的静态站
- `wrangler.toml`：`pages_build_output_dir = "site"`
- `site/_headers`：安全头

项目名建议用 `liebin`，和 `wrangler.toml` 一致。
