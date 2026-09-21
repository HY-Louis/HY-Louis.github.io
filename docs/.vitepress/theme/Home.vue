<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const content = computed(() => frontmatter.value.home)
const frame = ref(null)
let motionQuery
let raf = 0

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)')
})
onUnmounted(() => cancelAnimationFrame(raf))

function moveLight(event) {
  if (!frame.value || !motionQuery || motionQuery.matches) return
  const box = frame.value.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => frame.value?.style.setProperty('--light-x', `${x * 100}%`))
}
function resetLight() {
  cancelAnimationFrame(raf)
  frame.value?.style.removeProperty('--light-x')
}
</script>

<template>
  <div v-if="content" class="louis-home">
    <section class="gallery" aria-labelledby="home-heading">
      <div class="gallery-topline"><span>LOUIS / A PERSONAL CHRONICLE</span><span>学习记录与技术笔记</span></div>
      <div class="gallery-layout">
        <div class="gallery-copy">
          <h1 id="home-heading">{{ content.title }}<br><span>{{ content.titleSecond }}</span></h1>
          <p class="gallery-description">{{ content.description }}</p>
          <a class="gallery-button" href="/blog/">翻开我的札记 <span aria-hidden="true">↗</span></a>
          <p class="gallery-motto">{{ content.motto }}</p>
        </div>
        <figure class="masterpiece">
          <div ref="frame" class="art-frame" @pointermove="moveLight" @pointerleave="resetLight">
            <img src="/art/birth-of-venus.webp"
              srcset="/art/birth-of-venus-small.webp 960w, /art/birth-of-venus.webp 1920w"
              sizes="(max-width: 900px) 90vw, 57vw"
              alt="波提切利《维纳斯的诞生》完整画作：维纳斯立于贝壳，风神从左侧吹送她来到岸边。"
              width="1920" height="1230" fetchpriority="high" decoding="async">
          </div>
          <figcaption><span>THE BIRTH OF VENUS</span><span>Sandro Botticelli · 约 1484–1486</span></figcaption>
        </figure>
      </div>
      <div class="gallery-bottom"><span>保持好奇，继续求索。</span><a href="#journal">向下探索 <span aria-hidden="true">↓</span></a><span>EST. 2026</span></div>
    </section>

    <section id="journal" class="journal section-shell" aria-labelledby="journal-heading">
      <div class="section-heading"><h2 id="journal-heading">写下的，才会留下。<span>Journal</span></h2><a class="text-link" href="/blog/">全部文章 <span aria-hidden="true">↗</span></a></div>
      <article class="journal-entry">
        <div class="entry-date"><span>{{ content.article.category }}</span><span>{{ content.article.date }}</span></div>
        <a class="entry-link" :href="content.article.link"><h3>{{ content.article.title }}</h3><p>{{ content.article.description }}</p><span class="entry-read">阅读全文 <span aria-hidden="true">↗</span></span></a>
        <div class="entry-mark" aria-hidden="true">Aa<span>NOTES<br>IN THE MAKING</span></div>
      </article>
    </section>

    <section class="interests section-shell" aria-labelledby="interests-heading">
      <div class="section-heading"><h2 id="interests-heading">我的求索方向<span>Fields of interest</span></h2><p>从理解原理，到亲手实现。</p></div>
      <div class="subject-list"><div v-for="subject in content.subjects" :key="subject.title" class="subject"><span>{{ subject.english }}</span><h3>{{ subject.title }}</h3><p>{{ subject.detail }}</p></div></div>
    </section>

    <section class="portals" aria-labelledby="portals-heading">
      <div class="portal-intro"><h2 id="portals-heading">探索，也需要<br>趁手的工具。</h2><p>收藏好用的资源，安排下一段路。</p></div>
      <div class="portal-links">
        <a href="/tools/" target="_blank" rel="noopener"><span class="portal-label">TOOLBOX</span><span class="portal-title">工具箱 <span aria-hidden="true">↗</span></span><span class="portal-description">AI、开发工具、课程与资源，一处直达。</span></a>
        <a href="/plan/index.html" target="_blank" rel="noopener"><span class="portal-label">LEARNING PATH</span><span class="portal-title">学年规划 <span aria-hidden="true">↗</span></span><span class="portal-description">把长远的目标，拆成每个月的行动。</span></a>
      </div>
    </section>

    <section class="colophon section-shell" aria-label="关于与图片来源">
      <div class="colophon-signature"><span>Louis.</span><p>学习记录与技术笔记<br>Keep learning. Keep making.</p><a class="text-link" href="/about/">关于我 ↗</a></div>
      <div class="art-credit"><p>首页画作：桑德罗·波提切利《维纳斯的诞生》</p><a href="https://commons.wikimedia.org/wiki/File:La_nascita_di_Venere_(Botticelli).jpg" target="_blank" rel="noopener">Wikimedia Commons · Public Domain ↗</a></div>
    </section>
  </div>
</template>
