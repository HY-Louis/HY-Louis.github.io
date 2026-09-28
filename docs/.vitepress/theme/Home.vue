<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../blog.data.mjs'
import Arrow from './Arrow.vue'
import { constellation } from './art.mjs'
const { frontmatter } = useData()
const content = computed(() => frontmatter.value.home)
const latestPosts = posts.slice(0, 3)
function moveArt(event) {
  if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return
  const box = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--art-x', `${((event.clientX - box.left) / box.width - .5) * 6}px`)
}
function resetArt(event) { event.currentTarget.style.setProperty('--art-x', '0px') }
// 「持续探索」右侧的星座：每个主题一组星，从上到下排列，种子是主题的英文名（BACKEND 等）。
// 鼠标移到某个主题上，对应那组星点亮，三组之间的虚线"星桥"浮现（样式见 style.css 的「星座」一节）。
const sky = computed(() => constellation((content.value?.subjects || []).map((s) => s.english), { width: 260, height: 390, vertical: true }))
const activeSubject = ref(null)
</script>

<template>
  <div v-if="content" class="louis-home">
    <section class="library-hero" aria-labelledby="home-heading" @pointermove="moveArt" @pointerleave="resetArt">
      <picture class="library-art">
        <source srcset="/art/athena-library-small.webp 768w, /art/athena-library.webp 1536w"
          sizes="(max-width: 760px) 100vw, 63vw" type="image/webp">
        <img src="/art/athena-library.jpg" alt="银白色古典版画：雅典娜手持书卷，猫头鹰停在身旁，背后是图书馆与拱廊。"
          width="1536" height="1024" fetchpriority="high" decoding="async">
      </picture>
      <div class="library-copy">
        <h1 id="home-heading">{{ content.title }}<br>{{ content.titleSecond }}</h1>
        <p class="library-intro">我是 Louis。在这里记录代码、问题与思考。</p>
        <div class="library-actions">
          <a class="primary-link" href="/blog/">翻开我的札记</a>
          <a class="quiet-link" href="/tools/index.html" target="_self">探索工具箱</a>
        </div>
        <p class="library-motto">{{ content.motto }}<span lang="en">God helps those who help themselves.</span></p>
      </div>
    </section>
    <section id="journal" class="journal section-shell" aria-labelledby="journal-heading">
      <div class="section-heading">
        <h2 id="journal-heading" data-no="I">最新札记 <small lang="en">Journal</small></h2><span class="section-rule" aria-hidden="true"></span>
      </div>
      <article v-for="post in latestPosts" :key="post.url" class="journal-entry">
        <p class="entry-meta"><span>{{ post.category }}</span><span>{{ post.month }}</span></p>
        <a class="entry-link" :href="post.url"><h3>{{ post.title }}</h3><Arrow /></a>
        <p class="entry-description">{{ post.description }}</p>
      </article>
    </section>
    <!-- 群青色带：与首屏、页脚形成「蓝 — 纸 — 蓝 — 纸」的节奏 -->
    <section class="interests" aria-labelledby="interests-heading">
      <div class="section-shell">
        <div class="section-heading"><h2 id="interests-heading" data-no="II">持续探索 <small lang="en">Fields of interest</small></h2><span class="section-rule" aria-hidden="true"></span></div>
        <div class="subject-field" :data-active="activeSubject">
          <dl class="subject-list">
            <div v-for="(subject, i) in content.subjects" :key="subject.title" @pointerenter="activeSubject = i" @pointerleave="activeSubject = null">
              <dt>{{ subject.title }} <span lang="en">{{ subject.english }}</span></dt>
              <dd>{{ subject.detail }}</dd>
            </div>
          </dl>
          <div class="subject-sky" aria-hidden="true" v-html="sky"></div>
        </div>
      </div>
    </section>
    <section class="portals section-shell" aria-label="工具与学习入口">
      <a href="/tools/index.html" target="_self" class="portal">
        <h2 data-no="III">工具箱 <small lang="en">Toolbox</small></h2>
        <p>好用的工具与值得收藏的资源，放在这里。</p><span class="portal-action">打开工具箱 <Arrow /></span>
      </a>
      <a href="/plan/index.html" target="_self" class="portal">
        <h2 data-no="IV">学习规划 <small lang="en">Learning Path</small></h2>
        <p>从 Java 后端到计算机基础，一步步往下走。</p><span class="portal-action">查看学习路线 <Arrow /></span>
      </a>
    </section>
    <div class="art-colophon section-shell"><span lang="en">A place for curiosity.</span><p>首页插画为 AI 生成的原创古典神话意象，并非历史版画。<a href="/art/SOURCES.txt" target="_blank" rel="noopener">素材说明</a></p></div>
  </div>
</template>
