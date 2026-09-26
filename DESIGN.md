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

**The Readable Ground Rule.** 大幅艺术背景只承担形象表达，长正文留在清晰的纯色阅读区。

## Typography

标题使用前述 display 字体栈；英文以 GFS Didot 呈现。Louis Song 是 Noto Serif SC 的标题字形子集，并非完整中文字体，新增标题必须保留 Songti SC、STSong、SimSun 回退。字体本地托管并采用 `font-display: swap`。

正文保持无衬线，不将长文改成装饰字体。文章段落行高为 1.95，首页文章说明为 1.9。辅助标签最小为 12px；工具说明与规划备注分别使用 14px、15px。

**The Chinese First Rule.** 关键标题、链接和反馈使用中文；英文跟随对应中文，不替代操作名称。

## Layout

首页内容最大宽度 1536px，桌面内侧留白约 8.2%；工具和规划内容容器最大宽度 1200px，桌面左右内边距 40px。文章内容宽度沿用 VitePress 阅读布局，保留侧栏与文章目录。

首页在 760px 及以下改为单列，文字在前、插画在后，左右内边距 24px；761–1200px 使用较紧凑的首屏排版。工具与规划在 900px、600px 两档适配：工具条目三列、两列、单列；课程目录两列改单列。内容先换行，不靠缩小到难读的字号塞入。

独立页面导航保持顶部可达，锚点栏在窄屏可横向滚动；整体页面不应横向溢出。阶段与课程锚点保留 155px 滚动边距。总进度留在页头，不浮在正文上。

## Elevation & Depth

自定义内容区不使用悬浮阴影、玻璃模糊或全卡片 3D。深度来自真正的版画素材、色块对照、字号与留白；VitePress 原生搜索弹层保留其必要的覆盖层行为。

首页插画仅在支持悬停且未开启减少动态效果时随指针横移，幅度不超过 3px，离开归位；触屏与减少动态效果模式关闭这一位移。正文无需等待动画才出现。

## Shapes

主阅读入口是直角色块，次级控件、标签与代码块为轻微圆角。分隔线以 1px 为主；工具条目是带细线的链接列表，不包进额外的悬浮卡片。保留浏览器原生复选框的识别与键盘行为。

## Components

### Links and buttons

首页主入口为象牙白底、群青字，桌面最小高度 56px，移动端 48px；次入口用下划线。课程链接最小高度 44px，细边框，悬停强化边框与底色。键盘焦点使用可见的 2px 轮廓，不移除原生可访问性。

### Navigation and search

博客保留 VitePress 搜索、主题切换、移动导航、侧栏与目录。独立页采用相同品牌与颜色，但维持各自的导航结构。当前栏目用下划线标记，不仅依赖颜色。

### Tool entries

名称、用途、域名形成三级信息层次，整项可点击；长网址允许换行。描述不含月份、个人进度或规划语境。

### Course entries

学习规划里的课程是只读条目：课程名、标签、课程链接、章节学习指南与备注依次排布，条目左侧顶格，不设复选框列。2026-09-26 起不再有打勾、进度条与清空按钮；课程链接最小高度 44px，键盘焦点可见。

### Route sections, chapter guides and acceptance

学习规划一页里用二级标题分成「后端开发路线」与「408 学习」两段，段内沿用阶段块（编号、标题、说明），不再使用入口卡片，也不显示进度条。章节学习指南是三列表格（节次 / 要求 / 说明），要求沿用金、玫瑰、青绿的既有标签色；窄屏下表格改为逐条堆叠，不横向滚动。结尾验收要求是苍穹外卖条目内的编号清单，以群青细线起头，不额外包卡片或浮层。

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
