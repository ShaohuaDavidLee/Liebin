# 列宾落地页

静态站。没有构建步骤，没有后端，没有 Worker。

```
site/
  index.html     整页结构：hero / 输出什么 / 怎么用 / 三个坑 / FAQ / 页脚
  css/liebin.css 文艺复兴设计系统 token + 组件 + 本页版式
  js/app.js      安装命令切换、任务包 zip、导航
  img/           列宾公版画（Wikimedia Commons）
  favicon.svg    字标
  _headers       Cloudflare Pages 安全头
```

`index.html` 是唯一入口。`js/app.js` 只做三件事：复制安装命令、在浏览器里打 BRIEF.md zip、小屏导航。任务包不经过服务器。

部署：Cloudflare Pages 指向仓库根目录，产出目录 `site`。自定义域名 `liebin.caojuege.com`。
