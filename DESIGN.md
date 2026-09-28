---
name: Louis · 知识殿堂
description: 群青与象牙白构成的古典神话、技术札记与学习空间。
colors:
  ultramarine: "#101bb4"
  ultramarine-deep: "#0b167f"
  paper: "#f5f2e9"
  ivory: "#f7f3ea"
  ink: "#182047"
  muted: "#60647a"
  rule: "#cecdc5"
  surface: "#eeece3"
  dark-paper: "#131a2c"
  dark-ink: "#f2eee3"
  dark-muted: "#b6bfd2"
  dark-rule: "#424b61"
  dark-accent: "#b5beff"
typography:
  display:
    fontFamily: "'GFS Didot', 'Louis Song', 'Songti SC', 'STSong', 'SimSun', serif"
    fontSize: "clamp(38px, 4.16vw, 68px)"
    fontWeight: 400
    lineHeight: 1.44
    letterSpacing: "-.035em"
  headline:
    fontFamily: "'GFS Didot', 'Louis Song', 'Songti SC', 'STSong', 'SimSun', serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  english:
    fontFamily: "'GFS Didot', serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  flat: "0px"
  control: "2px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "48px"
  section-large: "64px"
components:
  primary-link:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ultramarine}"
    rounded: "{rounded.flat}"
    padding: "14px 30px"
  course-link:
    textColor: "{colors.ultramarine}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  course-link-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ultramarine}"
  tag:
    rounded: "{rounded.control}"
    padding: "2px 8px"
  note:
    backgroundColor: "{colors.surface}"
    padding: "16px 20px"
---

# Design System: Louis

## Overview

**Creative North Star: "知识殿堂"**

以用户选定的 C 方向为准：古典神话版画带来识别度，群青与象牙白形成明确的明暗关系，中文宋体气质的标题与克制的英文共同构成书籍式阅读体验。灵感来自 Hermes Agent 的古典视觉语言，不复制其品牌或文案。

首页承担形象表达，文章、工具和规划优先满足阅读与操作。全站共享视觉语言，不要求每个页面重复大幅插画。中文承担信息与操作，英文仅作辅助。

**Key Characteristics:**

- 群青大色块与银白神话版画。
- 宋体气质的中文标题、Didot 英文、无衬线正文。
- 细线与留白分组，近直角控件。
- 工具箱与规划独立，阅读和任务内容始终可见。

## Colors

### Primary

群青用于首页首屏、入口区和独立页面导航；浅色页面链接与标题使用群青，深色主题换为明亮的淡蓝强调色。首屏插画不随主题反色。

### Neutral

纸色用于阅读底，象牙白用于群青背景上的文字和主按钮；深墨用于正文，灰蓝用于说明文字，细线色用于分组。深色主题采用独立的底色、文字和分隔线组合，而非整体反相。

规划中的金、玫瑰与青绿为课程备注辅助色，不扩展成新的品牌主色；标签本身仍保留文字含义。

**哑光金（2026-09-28 起的装饰点缀色）**：`--l-gold`（博客）/ `--gold-deco`（工具箱与规划）。纸色底 #8a6526（对比度 4.7:1）、深色底 #e1c185、群青底 #e3c77f。只用于 ✦、首页罗马数字章节序号、藏书编号 No.xxx、藏书票外框、文章旁注的竖线和迷宫之线，不用于正文、按钮或大面积色块。

**The Readable Ground Rule.** 大幅艺术背景只承担形象表达，长正文留在清晰的纯色阅读区。

## Typography

标题使用前述 display 字体栈；英文以 GFS Didot 呈现。Louis Song 是 Noto Serif SC 的标题字形子集，并非完整中文字体，新增标题必须保留 Songti SC、STSong、SimSun 回退。字体以 WOFF2 格式本地托管并采用 `font-display: swap`。

正文保持无衬线，不将长文改成装饰字体。文章段落行高为 1.95，首页文章说明为 1.9。辅助标签最小为 12px；工具说明与规划备注分别使用 14px、15px。

**The Chinese First Rule.** 关键标题、链接和反馈使用中文；英文跟随对应中文，不替代操作名称。

## Layout

首页内容最大宽度 1536px，桌面内侧留白约 8.2%；工具和规划内容容器最大宽度 1200px，桌面左右内边距 40px。文章内容宽度沿用 VitePress 阅读布局，保留侧栏与文章目录。

首页在 760px 及以下改为单列，文字在前、插画在后，左右内边距 24px；761–1200px 使用较紧凑的首屏排版。工具与规划在 900px、600px 两档适配：工具条目三列、两列、单列；课程目录两列改单列。内容先换行，不靠缩小到难读的字号塞入。

独立页面导航保持顶部可达，锚点栏在窄屏可横向滚动；整体页面不应横向溢出。阶段与课程锚点保留 155px 滚动边距。

## Elevation & Depth

自定义内容区不使用悬浮阴影、玻璃模糊或全卡片 3D。深度来自真正的版画素材、色块对照、字号与留白；VitePress 原生搜索弹层保留其必要的覆盖层行为。

首页插画仅在支持悬停且未开启减少动态效果时随指针横移，幅度不超过 3px，离开归位；触屏与减少动态效果模式关闭这一位移。正文无需等待动画才出现。

## Shapes

主阅读入口是直角色块，次级控件、标签与代码块为轻微圆角。分隔线以 1px 为主；工具条目是带细线的链接列表，不包进额外的悬浮卡片。网站图标为群青底、象牙白衬线字母 L（`docs/public/favicon.svg`，另有 ico 与 apple-touch-icon 两个位图版本）。

## Components

### Links and buttons

首页主入口为象牙白底、群青字，桌面最小高度 56px，移动端 48px；次入口用下划线。课程链接最小高度 44px，细边框，悬停强化边框与底色。键盘焦点使用可见的 2px 轮廓，不移除原生可访问性。

### Navigation and search

博客保留 VitePress 搜索、主题切换、移动导航、侧栏与目录。独立页采用相同品牌与颜色，页面切换栏与博客导航一致（首页 / 博客 / 当前页 / 关于），下方是本页的锚点栏。当前栏目用下划线标记，不仅依赖颜色。

深色 / 浅色选择全站共用 VitePress 的 `vitepress-theme-appearance` 记录；独立页通过 `<head>` 中的 `assets/theme.js` 在绘制前设定主题，未手动选择时跟随系统。

### Tool entries

名称、用途、域名形成三级信息层次，整项可点击；长网址允许换行。描述不含月份、个人进度或规划语境。

### Course entries

学习规划里的课程是只读条目：课程名、标签、课程链接、章节学习指南与备注依次排布，条目左侧顶格，不设复选框列。2026-09-26 起不再有打勾、进度条与清空按钮；课程链接最小高度 44px，键盘焦点可见。

### Route sections, chapter guides and acceptance

学习规划一页里用二级标题分成「后端开发路线」与「408 学习」两段，段内沿用阶段块（编号、标题、说明），不再使用入口卡片，也不显示进度条。章节学习指南是三列表格（节次 / 要求 / 说明），要求沿用金、玫瑰、青绿的既有标签色；窄屏下表格改为逐条堆叠，不横向滚动。结尾验收要求是苍穹外卖条目内的编号清单，以群青细线起头，不额外包卡片或浮层。

### Ornaments and rhythm (2026-09-28)

- 章节标题前的花饰：**工具箱分类与学习规划两条路线**用的是 14px 哑光金 ✦（窄屏 12px，`site-pages.css`）；**首页各区块不用 ✦**，用的是金色 Didot 罗马数字（见下文「首页章节序号」）。文章正文里的 `<hr>` 会渲染成居中的「✦ ✦ ✦」——但截至 2026-09-28 站内没有任何一篇文章用过 `hr`（所有 `---` 都是 frontmatter 分隔符），这条样式目前等于备用。
- 首页节奏为「蓝 — 纸 — 蓝 — 纸」：首屏群青，最新札记纸色，持续探索群青色带（象牙白字），入口卡回到纸色并以细线收尾。
- 工具箱与学习规划页头右侧是「藏书票」：1px 群青边框外加 3px 间距的第二道边框，居中排版，顶部一行 Didot 小英文（Ex Libris · Louis / Learning Path · Louis），中间 64px 数字 + 单位，底部一行说明。学习规划的藏书票分成左右两栏（后端开发路线 11 项 | 408 学习 4 门，中间一道细竖线），两条路线分开计数，不显示合计。
- 学习规划的阶段列表是路线图：`.stage-list` 左侧 1px 细线，每个 `.stage-block` 头部对应一个 11px 空心圆点，锚点定位到该阶段时圆点填实。
- 文章首段首字下沉（2.8em，群青，衬线），`pageClass: plain` 的页面（文章列表、关于）不做；文章结尾有 `ArticleEnd.vue` 落款：✦ + 「Louis · 年 月」+ 英文格言。
- 404 页（`NotFound.vue`）：上下各一行「✦ ✦ ✦」，150px Didot 数字，「此路未载于典籍。」与英文副题，群青主按钮回首页。不放插画。
- 首页章节序号：「最新札记 I · 持续探索 II · 工具箱 III · 学习规划 IV」，金色 Didot 罗马数字，替代首页的 ✦；读屏软件跳过它。
- 悬停动效只有一种：下划线从左往右画出（背景渐变宽度 0 → 100%，.3–.35s），用于工具名、课程名、最新札记标题、顶栏与博客导航链接；入口卡箭头间距略增。遵守 reduce-motion。

### 质感与程序化图案（2026-09-28 第二轮）

图案全部用代码画成 SVG：画法在 `docs/.vitepress/theme/art.mjs`，打包时 `scripts/generate-art.mjs` 把底纹和迷宫存到 `docs/public/art/generated/`（不进 git，每次打包重新生成）。每幅图有一个"种子"文字，同一个种子永远画出同一幅图。图案线条一律用"当前文字颜色"，靠 CSS 蒙版上色，亮暗主题自动适配。

- **纸纹 / 星点**：只铺在首页和工具箱、规划的页头（透明度 .1）；深色模式换成稀疏星点（透明度 .4，560px 大方块，看不出重复）。文章、列表、关于页的阅读区保持纯色底——Readable Ground Rule 不变。
- **版画网线**：首页两块群青区域叠 7% 的横向刻线，呼应雅典娜铜版画；首屏左侧被插画盖住，只露在文字区底下。
- **希腊回纹带**：首页区块标题和文章列表年份旁的细线换成 14px 高的回纹带（透明度 .32）。
- **文章徽章**：以文章标题为种子画出的圆形封印（对称花饰 + 星形连线 + 回纹 / 珠串 / 刻度外圈），显示在文章顶部（84px）和文章列表（64px）。关于页的藏书票徽章种子是 "Louis"。
- **星座**：首页「持续探索」右侧，一个主题一组星（种子是主题英文名），平时 45% 亮度，鼠标移到主题上时那组全亮、组间虚线浮现；宽度 1100px 以下不显示。
- **迷宫头图**：学习规划页头下方，44×8 的迷宫（种子 "ariadne"），群青墙 50% + 金色阿里阿德涅之线；打开页面时线从左往右牵出（3.2 秒，只一次）。
- **文章列表 = 藏书目录**：大号 Didot 年份 + 回纹，每条左侧徽章，上方一行「No.001 · 分类 · 月 日」。
- **关于页题记**：左侧大号格言 + 英文，右侧藏书票（内群青、外金色双线框 + 徽章）。只重排已有信息，不新增个人经历。
- **文章旁注**：已用在《我的博客是怎么搭起来的》（Markdown、base 例子、图床与 PicGo 三条，只解释文中已有的名词，不加个人经历）。Markdown 里写 `<aside class="margin-note">…</aside>`，宽屏浮在正文右侧（左侧金线、小字），窄屏回到正文里。

### 克制动效（2026-09-28 第二轮）

全部在"减少动态效果"开启时关闭，也都只在内容还没进入屏幕时才准备——打开页面时已在屏幕里的内容不动，不会闪烁。

- **入场浮现**：淡入 + 上移 8px，0.8 秒，每块只播一次。博客里是首页札记、主题、入口和文章列表条目（`theme/reveal.js`），文章正文不参与；工具箱与规划是带 `.reveal` 的块（`assets/theme.js`）。
- **路线生长**：学习规划的竖线随滚动从起点长到屏幕 62% 高度处，经过的阶段圆点点亮。
- **星座点亮**、**迷宫之线牵出**：见上一节。

### Notes and tags

提示区使用纯色浅底、正文与加粗重点；细框标签保留实际文字说明。标签不是按钮，不添加虚假的交互样式。

## Do's and Don'ts

### Do:

- Do 保持中文可读性，英文只作辅助。
- Do 在浅色与深色主题分别检查对比度。
- Do 保留搜索、键盘焦点与课程链接。
- Do 为插画提供替代文本、响应式尺寸和准确来源说明。

### Don't:

- Don't 把工具目录重新混入个人规划。
- Don't 用装饰文字、动态效果或图片遮挡阅读与操作。
- Don't 将标题字形子集误当作完整中文字体。
- Don't 将 AI 插画描述成历史原作，或虚构文章与个人经历。
