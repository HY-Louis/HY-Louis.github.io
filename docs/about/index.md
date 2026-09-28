---
pageClass: plain about-page
---

<script setup>
import { seal } from '../.vitepress/theme/art.mjs'
// 题记区右侧的「藏书票」徽章：以 "Louis" 为种子画出，永远是同一枚
const exLibrisSeal = seal('Louis')
</script>

# 关于我

<div class="about-frontis">
  <figure class="epigraph">
    <blockquote>天助自助者。</blockquote>
    <figcaption lang="en">God helps those who help themselves.</figcaption>
  </figure>
  <div class="ex-libris">
    <span class="ex-libris-seal" aria-hidden="true" v-html="exLibrisSeal"></span>
    <span class="ex-libris-label" lang="en">Ex Libris</span>
    <strong lang="en">Louis</strong>
    <small>湖南工商大学 · 智能科学与技术<br>Java 后端方向</small>
  </div>
</div>

## 我是谁

湖南工商大学智能科学与技术专业在读，主攻 Java 后端方向（后续可能转 AI Agent 方向），同时在打基础：操作系统、计算机组成原理、计算机网络，数据结构。

## 在做什么

- 啃 Java 全栈路线，从 JavaSE 到 SpringBoot 到项目实战
- 关注 GitHub 每周高 star 项目，关注最新 AI 前沿新闻

具体的学习路线在 <a href="/plan/index.html" target="_self">学习规划</a> 页面。

## 这个博客写什么

主要三类：

1. **学习笔记** —— 学一门新技术时整理的理解，尤其是把概念讲给「三个月前的自己」听
2. **踩坑记录** —— 报错、配置问题、环境问题，解决了就写下来
3. **阶段复盘** —— 每隔一段时间回顾一下进度

## 联系

- GitHub：[@HY-Louis](https://github.com/HY-Louis)
- Gmail：liuhongyang323@gmail.com
