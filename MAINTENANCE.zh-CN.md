# 博客内容维护

以 `D:\Develop\blog` 内的文件为准。`D:\Develop\CS learning by myself` 目录中的页面是旧副本，不会自动同步，改内容时别改错地方。

## 改哪里

| 想修改什么 | 文件 |
| --- | --- |
| 首页标题、格言、探索方向 | `docs/index.md` 的 `home` 区块 |
| 首页首屏短简介、布局与入口文字 | `docs/.vitepress/theme/Home.vue`（`library-intro` 为短简介） |
| 博客与文章的颜色、字体、间距 | `docs/.vitepress/theme/style.css` |
| 文章内容 | `docs/blog/*.md` |
| 文章列表、侧栏、首页「最新札记」 | 自动生成，不用手改（见下文「发新文章」） |
| 顶部导航 | `docs/.vitepress/config.mjs` |
| 关于我 | `docs/about/index.md` |
| 工具名称、描述、官网链接 | `docs/public/tools/index.html` |
| 「AI 工具」的产品图标 | `docs/public/icons/`（来源与改动见该目录 `SOURCES.txt`） |
| 学习规划（后端开发路线、408 学习、章节指南、结尾验收要求） | `docs/public/plan/index.html` |
| 工具与规划的共同外观 | `docs/public/assets/site-pages.css` |
| 程序化图案的画法（徽章、星座、迷宫、底纹、回纹） | `docs/.vitepress/theme/art.mjs` |
| 图案存成文件（底纹、迷宫）、样张页 | `scripts/generate-art.mjs` |
| 文章顶部徽章与藏书编号 | `docs/.vitepress/theme/ArticleSeal.vue` |
| 滚动时内容浮现 | `docs/.vitepress/theme/reveal.js`（博客）、`docs/public/assets/theme.js`（工具箱与规划） |

首页插画使用 `docs/public/art/athena-library.webp` 与较小尺寸版本。精确生成提示词保存在 `.impeccable/prompts/athena-library-plate.txt`，素材来源说明在 `docs/public/art/SOURCES.txt`。新图应同时替换两个尺寸，并更新替代文本。

## 站内链接：工具箱与学习规划

工具箱（`/tools/index.html`）和学习规划（`/plan/index.html`）是手写的静态页面，不归 VitePress 路由管。VitePress 会拦截站内链接（`/tools/` 这种路径、以及 `.html` 结尾的地址都会被当成它自己管理的页面）并跳到 404，所以指向它们的链接必须带 `target`。另外，链接要写完整的 `/tools/index.html`，不要只写 `/tools/`：本地预览（`npm run dev`）不认后一种写法，会显示 404（正式网站两种都能打开）。`npm run check` 会拦下这种写法。示例：

- 顶部导航写在 `docs/.vitepress/config.mjs`：用 `target: '_self'`。
- 页面里直接写 `target="_self"`（首页 `Home.vue`、`about/index.md` 都是这样）。
- `_self` 让浏览器在当前标签页打开，不新开窗口；只要链接带了 `target` 属性，VitePress 就会跳过拦截，直接走浏览器自己的跳转。
- 不要再改回 `_blank`（会新开标签页），也不要把 `target` 去掉（会跳 404）。

工具箱在顶部导航里已经移除，入口只有首页首屏的「探索工具箱」和首页末尾的「工具箱」入口卡。

两个独立页的顶栏是「首页 / 博客 / 当前页 / 关于」，写在各自 HTML 的 `<nav class="pages">` 里；博客导航改了栏目时记得同步这里。

## 深色模式与网站图标

- 博客、工具箱、学习规划共用同一个深色 / 浅色记录 `vitepress-theme-appearance`（VitePress 自带的那个）。独立页的切换逻辑在 `docs/public/assets/theme.js`，必须放在 `<head>` 里加载，否则深色用户会先看到一下白屏。
- 两个独立页顶栏右侧是「深浅色开关 + GitHub 图标」，和博客顶栏上的两个控件对应（2026-10-01 改的，之前是一个写着「深色」的文字按钮）。开关的 HTML 在各页 `<head>` 下面那个 `<div class="tools">` 里，样式在 `site-pages.css` 的 `.switch` / `.iconlink`。**改开关时注意**：`theme.js` 不再写按钮文字，而是设 `aria-checked` 与 `title`；太阳 / 月亮和圆点位置由 CSS 按 `html[data-theme]` 切换，所以别把 `data-theme` 这个属性换成别的写法。GitHub 图标地址若要改，`scripts/check-content.mjs` 里也写着同一个地址，两处一起改。
- 开关的四个颜色变量 `--sw-border / --sw-bg / --sw-knob / --sw-icon` 声明在 `.switch` 上（深色模式在 `:root[data-theme='dark'] .switch` 里换另一套），值是照 VitePress 那个开关取的——改配色只改这四个变量，别把色值写进 `.check` / `.icon`。
- **图标是画在圆点上的**：太阳 / 月亮图标的对比度要对着**圆点**算，不是对着顶栏的群青底算。博客首页顶栏曾经把 `--vp-c-text-2` 覆盖成 `#dfdff6`，而 VitePress 的开关图标读的正是这个变量，浅色下就成了「浅灰图标 + 白圆点」（1.31:1，几乎看不见）。`docs/.vitepress/theme/style.css` 里用 `html:not(.dark) .VPNavBar.home .VPSwitchAppearance .icon [class^='vpi-']` 单独把开关图标固定成 `#67676c` 修好了；以后改首页顶栏的颜色变量时，注意别再动到开关图标（那个 `html:not(.dark)` 不能去掉，去掉会把深色模式一起覆盖）。
- 网站图标：`docs/public/favicon.svg`（主图标）、`favicon.ico`（老浏览器）、`apple-touch-icon.png`（苹果设备主屏幕）。换图标时三个一起换；博客的引用写在 `config.mjs` 的 `head`，独立页写在各自的 `<head>`。
- 首页大图的原始 PNG（3.7MB）不再随网站发布，本地留在 `assets/plates/athena.png`（不进版本库）；页面上用的是 WebP 两个尺寸，加一张 `athena-library.jpg` 给不支持 WebP 的老浏览器。字体为 WOFF2 格式。

## 工具箱的产品图标（2026-10-01）

「AI 工具」8 个入口的名称左边各有一个 24px 的产品图标，文件在 `docs/public/icons/`，一个产品一个 `.svg`，页面里是：

```html
<span class="head"><img class="ico" src="/icons/deepseek.svg" alt="" width="24" height="24"><b>DeepSeek</b></span>
```

只有「AI 工具」这一类有图标；其余四类保持纯文字。图标一律 `alt=""`（名称就在旁边，图标只是装饰，读屏不需要念第二遍），尺寸由 CSS 的 `.tool .ico` 定，`width` / `height` 属性只是给浏览器占位用。

加一个新工具时的做法：

1. 去 <https://lobehub.com/zh/icons> 找该产品的图标；那里的静态文件可以直接下载：
   `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/<名字>.svg`。找不到（例如 WorkBuddy）就去官网 `<head>` 里找它自己引用的图标文件。
2. 存到 `docs/public/icons/<产品>.svg`，顺手做两件事：把 `style="flex:none;line-height:1"` 去掉，`width` / `height` 改成 `24`。
3. **如果文件里写的是 `fill="currentColor"`，要换成固定颜色（现在用的是 `#14161a`）**，并给这个 `<img>` 加上 `ico-mono` 类。原因：`<img>` 加载的 SVG 是一个独立文档，取不到页面的 `color`，`currentColor` 会永远渲染成黑色，深色模式里等于看不见；`ico-mono` 在深色模式下走 `filter: invert(1) hue-rotate(180deg)` 反相（`hue-rotate` 是为了让 Qoder 的绿色仍然是绿色）。彩色图标不要加这个类。
4. **下载完一定要看一眼它在纸色底上到底长什么样**：有些品牌的标志是「白色线条 + 深色方块」（设计上是给深色底用的），直接放到这一页会几乎看不见——Kimi 就是这种情况（原始文件里「K」是 `#fff`，只有右上角那个蓝点露出来）。首选去官网找该品牌自己的浅色版图标；没有的话就把线条改成 `#14161a` 并加 `ico-mono`（深色模式下反相成白色），这正好等于 Kimi 官网自己 favicon-light / favicon-dark 两套图标的做法。
5. 在 `SOURCES.txt` 里补一行来源，并同步 `scripts/check-content.mjs`：它按「AI 工具」的入口数核对图标数量、图标文件和 `currentColor` 这三件事，数量对不上会直接报错。

## 改学习规划时

规划只有 `plan/index.html` 一个文件：先是「后端开发路线」（`id="backend"`，三个 `data-stage` 阶段块），再是「408 学习」（`id="cs408"`，四个 `data-stage` 课程块）。课程条目只写课程名、标签、课程链接、章节学习指南和备注即可，改文字或 `href` 都不影响别的部分。

2026-09-26 起这一页是**只读**的：复选框、阶段进度条、页头「总进度」和页脚的「清空所有打勾」都已移除，浏览器里不再写入进度。旧记录仍留在老访客浏览器的 `louis-plan-2026-progress` 里，但页面不再读取；如果哪天要把打勾加回来，先想清楚用哪套编号，别直接沿用 `m09-*` / `m10-*` / `m11-*` 这些原「学年规划」的旧编号。

`scripts/check-content.mjs` 会检查这一页确实没有 `<input>`、`data-uid`、进度条和 `louis-plan-2026-progress`，避免打勾功能被无意间加回来。

## 本地检查

在项目目录打开终端：

```powershell
npm run dev
```

开发模式看博客文章；独立工具页可直接访问 `/tools/index.html`。需要模拟正式站点全部路径时，用构建后的预览：

```powershell
npm run check
npm run build
npm run preview
```

重新构建后应重启 preview，否则预览服务器可能仍缓存旧文件列表。

`npm run check`（即 `check-content.mjs`）是这套页面的保全检查，GitHub Actions 每次发布前也会自动运行，不通过就不会上线。它固定检查学习规划里的 15 门课程（后端开发路线 11 项 + 408 四门）、3 个阶段 + 4 门课、15 条课程链接、5 份章节学习指南，以及「结尾验收要求必须排在苍穹外卖项目之后、Redis 之前、且仍在后端开发路线内」；工具箱那边检查 5 个分类、「课程资源」的 8 条链接及顺序、学习规划的课程视频没有回流到工具箱、新增入口（WorkBuddy、技术文章摘抄、菜鸟教程、Z-Library、Netlify Drop）以及已删除入口（Hermes Agent、Claude、英语与竞赛）；另外检查两个独立页都在 `<head>` 里加载共享主题脚本和网站图标，以及**全仓库文本文件没有 BOM 与乱码**。以后主动增删内容时，按新的实际内容更新这些预期；不能为了消除报错而忽略意外丢失的链接。

它只管页面内容，不管这份文档：`MAINTENANCE` / `PRODUCT` / `DESIGN` / `DELIVERY` 的说法与代码不一致时它不会报错，改完东西记得顺手核对。

## 发布

确认预览正确后检查修改，再提交、推送；GitHub Actions 会自动部署。

```powershell
git diff
git status --untracked-files=all   # 一定要看未跟踪文件：新加的 .vue / .mjs / 字体 / 图片都会列在这里
git add -A                         # 看完上面那份清单、确认没有密钥和临时文件，再整体加入
git commit -m "更新博客内容"
git push
```

**别只 `git add` 这次"改过的"文件。** 2026-09-28 就是这么漏掉的：09-27、09-28 两轮改版新增的 19 个文件（`ArticleSeal.vue`、`art.mjs`、`blog.data.mjs`、`theme.js`、`generate-art.mjs`、两个 WOFF2 字体、三个图标等）因为不在"改过"的名单里，一直没进版本库，线上始终是旧版。更糟的是**只提交一部分会让 CI 直接失败**而不是悄悄跳过：新版 `deploy.yml` 会跑 `npm run check`，它要读 `docs/public/assets/theme.js`；新版 `package.json` 的 build 要先跑 `scripts/generate-art.mjs`；`theme/index.js` 还 import 着四个组件文件——这些文件没进提交，构建就报 `ENOENT`。

`git status --short` 里 `??` 开头的就是未跟踪的新文件，**发布前必须确认它们要么被加入、要么是故意不提交的**（`.gitignore` 已覆盖 `dist/`、`cache/`、`art/generated/`、`output/`、`assets/plates/`）。

不要提交 API 密钥、PicGo token、`.env` 或图像生成输出临时目录。

## 本次改版交付

视觉规范在 `DESIGN.md`，供后续调整配色、字体、组件时参考；`.impeccable/design.json` 保存配套的布局、动效与组件示例。

验收范围与尚未完成的检查记录在 `DELIVERY.zh-CN.md`。本地修改不会自动出现在公网；只有提交并推送后才会触发部署。

## 发新文章

在 `docs/blog/` 里新建一个 `.md` 文件，开头写上这四项（两行 `---` 之间）：

```markdown
---
title: 文章标题
date: 2026-10-01
description: 一句话简介，会显示在文章列表和首页
category: 分类，例如 学习笔记
---
```

文章列表（`docs/blog/index.md`）、博客侧栏（`config.mjs` 里的 `blogItems`）和首页「最新札记」（最新 3 篇）都会在打包时自动读取这些信息，不用再手改。文章数据由 `docs/blog.data.mjs` 统一整理；日期要写成 `年-月-日`。

文章顶部会自动显示徽章和藏书编号（最早一篇是 No.001），第一段会自动首字下沉，结尾会自动加「Louis · 年 月」落款（`ArticleEnd.vue`），不用在正文里写。正文里的 `---` 分隔线会显示成「✦ ✦ ✦」。如果某个页面不想要首字下沉（例如列表页、关于页），在开头加一行 `pageClass: plain`。

## 程序化图案

装饰图案（文章徽章、首页星座、学习规划迷宫、纸纹、星点、版画网线、回纹）都是代码画的，不是图片素材：

- `npm run build` 和 `npm run dev` 会先自动运行 `scripts/generate-art.mjs`，把底纹和迷宫生成到 `docs/public/art/generated/`。这个文件夹不进 git，删了也没关系，下次打包会重新生成。
- 文章徽章以文章标题为种子：**改标题，徽章就会变**。新文章不用做任何事，徽章自动出现。
- 想换一个迷宫：改 `generate-art.mjs` 里 `labyrinth('ariadne', 44, 8)` 的种子文字 `'ariadne'`。
- 想先看看效果：运行 `node scripts/generate-art.mjs --samples`，用浏览器打开 `output/art-samples/index.html`，里面有全部图案的亮色、暗色样张。
- 想在文章里加旁注：写 `<aside class="margin-note">补充说明</aside>`，宽屏会显示在正文右侧。

## 页面截图检查

```powershell
npm run build
npm run verify
```

`npm run verify`（`scripts/verify-pages.mjs`）会起一个本地网站，用本机 Edge 在后台打开打包结果，检查图标、字体、工具箱分类与课程、两页顶栏、手机宽度下是否横向溢出、深色模式是否全站同步，并把截图存到 `output/review/`（不进版本库）。它依赖本机的 Edge 与 Node 22 以上版本。

注意它**只报告不判定**：结果以 JSON 打印出来，需要你自己看数值和截图，它不做内容断言。2026-09-28 之前它还写死 `process.exit(0)`，Edge 起不来或页面打开失败也会报成功；现在出错会以退出码 1 结束，但"页面画得不对"仍然要人来判断。Edge 路径写死在文件开头（`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`），换机器要改。

## 编码：只用 UTF-8

所有页面、样式和文档都必须以 UTF-8（无 BOM）保存。2026-09-28 曾有工具用错编码写回文件，中文整页变成「瀛︿範宸ュ叿」一类乱码或问号。

`npm run check` 现在会遍历全仓库所有会发布或参与构建的文本文件（`.md` / `.html` / `.css` / `.mjs` / `.js` / `.vue` / `.json` / `.txt` / `.yml` / `.jsonl`，跳过 `node_modules`、`.git`、`dist`、`cache`、`.temp`、`generated`、`output`），发现 BOM 或乱码就报错。只放行三份"故意引用乱码样例"的文件：`DELIVERY.zh-CN.md`、`MAINTENANCE.zh-CN.md`、以及 `scripts/check-content.mjs` 自己（它的检测正则里就写着这些样例）。新增的文本文件会自动纳入检查，不用改脚本。

在 Windows PowerShell 里写文件时要显式指定 UTF-8，别用会用系统默认编码写回的工具。
