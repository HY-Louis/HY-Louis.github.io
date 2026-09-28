---
pageClass: plain catalog-page
---

<script setup>
import { data as posts } from '../blog.data.mjs'
import { seal } from '../.vitepress/theme/art.mjs'
// 「藏书目录」：按年份分组，文章已按日期从新到旧排好。
// 每篇左侧是藏书编号（最早一篇是 No.001）和它的徽章（以标题为种子画出，和文章顶部那枚一样）。
const groups = []
for (const post of posts) {
  const last = groups[groups.length - 1]
  if (last && last.year === post.year) last.items.push(post)
  else groups.push({ year: post.year, items: [post] })
}
</script>

# 文章列表

这里是全部文章，最新的在最上面。

<div class="catalog">
  <section v-for="group in groups" :key="group.year" class="catalog-year">
    <h2 class="catalog-year-no" lang="en">{{ group.year }}</h2>
    <ol class="catalog-list">
      <li v-for="post in group.items" :key="post.url">
        <a :href="post.url" class="catalog-entry">
          <span class="catalog-seal" aria-hidden="true" v-html="seal(post.title)"></span>
          <span class="catalog-text">
            <span class="catalog-meta"><span lang="en">No.{{ post.no }}</span><span v-if="post.category">{{ post.category }}</span><span>{{ post.day }}</span></span>
            <strong class="catalog-title">{{ post.title }}</strong>
            <span class="catalog-desc">{{ post.description }}</span>
          </span>
        </a>
      </li>
    </ol>
  </section>
</div>
