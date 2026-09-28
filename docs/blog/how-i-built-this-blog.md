---
title: 我的博客是怎么搭起来的
date: 2026-09-15
description: 从第一份 Markdown 到自己的线上空间，记录 VitePress、GitHub Pages 与图床的搭建过程。
category: 建站手记
---

# 我的博客是怎么搭起来的

这是这个博客的第一篇文章，顺便记录一下搭建过程，免得以后自己忘了。

## 整体方案

<aside class="margin-note">Markdown 是一种用简单符号排版的纯文本写法：行首写 <code>#</code> 就是标题，两边加 <code>**</code> 就是加粗。</aside>

| 环节 | 用什么 | 花多少钱 |
| --- | --- | --- |
| 写文章 | Markdown 纯文本 | 免费 |
| 生成网站 | VitePress | 免费 |
| 存代码 | GitHub 仓库 | 免费 |
| 自动发布 | GitHub Actions | 免费 |
| 网站托管 | GitHub Pages | 免费 |
| 存图片 | PicGo + GitHub 图床 | 免费 |

全套零成本。

## 几个名词

**静态博客**：文章提前生成好网页存起来，访客来了直接发文件，不需要数据库。像预先印好的书，而不是现点现做的菜。好处是快、便宜、不容易被攻击。

**VitePress**：把 Markdown 文件自动变成网站的工具。我只管写文字，排版、导航、搜索它全包了。

**GitHub Pages**：GitHub 免费送的网站空间。把网页文件放进指定仓库，就能被全世界访问。

**GitHub Actions**：GitHub 的自动流水线。我把文章推上去，它自动跑打包命令、自动发布。省掉每次手动复制文件的七八个步骤。

## 日常怎么发文章

```bash
# 1. 在 docs/blog/ 里新建一个 .md 文件，写内容

# 2. 本地看效果
npm run dev

# 3. 满意了就推上去
git add .
git commit -m "新文章：XXX"
git push
```

推送之后 GitHub 自动构建，一两分钟网站就更新了。

## 踩到的坑

<aside class="margin-note">举个例子：仓库名叫 <code>blog</code>，网址就是 <code>用户名.github.io/blog/</code>，<code>base</code> 要填 <code>/blog/</code>。</aside>

**base 配置填错，网站一片空白。** `docs/.vitepress/config.mjs` 里有个 `base` 选项，它表示网站在域名下的子目录。仓库名叫 `用户名.github.io` 就填 `/`，仓库名叫别的就填 `/仓库名/`。填错了页面能打开但样式全丢。

<aside class="margin-note">图床是专门存图片的地方，文章里只写图片的网址。PicGo 是上传图片的小工具，拖进去就能传到图床并复制好网址。</aside>

**图片不要直接塞进仓库。** 图片体积大，仓库会越来越臃肿。用图床存，文章里引网址。

**图片上传前先压缩。** 手机拍的照片动不动好几 MB，直接放网上加载会很慢。[Squoosh](https://squoosh.app/) 和 [TinyPNG](https://tinypng.com/) 都能免费压，压完通常只剩十分之一，肉眼看不出区别。

## 参考

搭建思路参考了[一行栗子的静态博客搭建教程](https://yihanglizi.cn/blog/static-blog-setup.html)，在他的基础上把手动复制 `dist` 改成了 GitHub Actions 自动部署。
