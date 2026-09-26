# 博客内容维护

以 `D:\Develop\blog` 内的文件为准。原先「CS learning by myself」目录中的页面是旧副本，不会自动同步。

## 改哪里

| 想修改什么 | 文件 |
| --- | --- |
| 首页标题、格言、最新文章、探索方向 | `docs/index.md` 的 `home` 区块 |
| 首页首屏短简介、布局与入口文字 | `docs/.vitepress/theme/Home.vue`（`library-intro` 为短简介；当前不读取 `home.description`） |
| 博客与文章的颜色、字体、间距 | `docs/.vitepress/theme/style.css` |
| 文章内容 | `docs/blog/*.md` |
| 文章列表 | `docs/blog/index.md` |
| 顶部导航、文章侧栏 | `docs/.vitepress/config.mjs` |
| 关于我 | `docs/about/index.md` |
| 工具名称、描述、官网链接 | `docs/public/tools/index.html` |
| 学习规划（后端开发路线、408 学习、章节指南、结尾验收要求） | `docs/public/plan/index.html` |
| 工具与规划的共同外观 | `docs/public/assets/site-pages.css` |

首页插画使用 `docs/public/art/athena-library.webp` 与较小尺寸版本。精确生成提示词保存在 `.impeccable/prompts/athena-library-plate.txt`，素材来源说明在 `docs/public/art/SOURCES.txt`。新图应同时替换两个尺寸，并更新替代文本。

## 站内链接：工具箱与学习规划

工具箱（`/tools/`）和学习规划（`/plan/index.html`）是手写的静态页面，不归 VitePress 路由管。VitePress 会拦截站内链接（`/tools/` 这种路径、以及 `.html` 结尾的地址都会被当成它自己管理的页面）并跳到 404，所以指向它们的链接必须带 `target`：

- 顶部导航写在 `docs/.vitepress/config.mjs`：用 `target: '_self'`。
- 页面里直接写 `target="_self"`（首页 `Home.vue`、`about/index.md` 都是这样）。
- `_self` 让浏览器在当前标签页打开，不新开窗口；只要链接带了 `target` 属性，VitePress 就会跳过拦截，直接走浏览器自己的跳转。
- 不要再改回 `_blank`（会新开标签页），也不要把 `target` 去掉（会跳 404）。

工具箱在顶部导航里已经移除，入口只有首页首屏的「探索工具箱」和首页末尾的「工具箱」入口卡。

## 改学习规划时

规划只有 `plan/index.html` 一个文件：先是「后端开发路线」（`id="backend"`，三个 `data-stage` 阶段块），再是「408 学习」（`id="cs408"`，四个 `data-stage` 课程块）。课程条目只写课程名、标签、课程链接、章节学习指南和备注即可，改文字或 `href` 都不影响别的部分。

2026-09-26 起这一页是**只读**的：复选框、阶段进度条、页头「总进度」和页脚的「清空所有打勾」都已移除，浏览器里不再写入进度（只保留主题偏好 `louis-plan-2026-theme`）。旧记录仍留在老访客浏览器的 `louis-plan-2026-progress` 里，但页面不再读取；如果哪天要把打勾加回来，先想清楚用哪套编号，别直接沿用 `m09-*` / `m10-*` / `m11-*` 这些原「学年规划」的旧编号。

`scripts/check-content.mjs` 会检查这一页确实没有 `<input>`、`data-uid`、进度条和 `louis-plan-2026-progress`，避免打勾功能被无意间加回来。

## 本地检查

在项目目录打开终端：

```powershell
npm run dev
```

开发模式看博客文章；独立工具页可直接访问 `/tools/index.html`。需要模拟正式站点全部路径时，用构建后的预览：

```powershell
node scripts/check-content.mjs
npm run build
npm run preview
```

重新构建后应重启 preview，否则预览服务器可能仍缓存旧文件列表。

`check-content.mjs` 是这套页面的保全检查，固定检查学习规划里的 15 门课程（后端开发路线 11 项 + 408 四门）、3 个阶段 + 4 门课、15 条课程链接、5 份章节学习指南，以及「结尾验收要求必须排在苍穹外卖项目之后、Redis 之前、且仍在后端开发路线内」；工具箱那边检查 5 个分类、新增入口（WorkBuddy、技术文章摘抄、菜鸟教程、Z-Library、Netlify Drop、数据结构与计算机网络）以及已删除入口（Hermes Agent、Claude、英语与竞赛）。以后主动增删内容时，按新的实际内容更新这些预期；不能为了消除报错而忽略意外丢失的链接。

## 发布

确认预览正确后检查修改，再提交、推送；GitHub Actions 会自动部署。

```powershell
git diff
git status
git add <这次实际修改的文件>
git commit -m "更新博客内容"
git push
```

不要提交 API 密钥、PicGo token、`.env` 或图像生成输出临时目录。

## 本次改版交付

视觉规范在 `DESIGN.md`，供后续调整配色、字体、组件时参考；`.impeccable/design.json` 保存配套的布局、动效与组件示例。

验收范围与尚未完成的检查记录在 `DELIVERY.zh-CN.md`。本地修改不会自动出现在公网；只有提交并推送后才会触发部署。
