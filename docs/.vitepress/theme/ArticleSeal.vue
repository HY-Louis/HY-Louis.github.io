<script setup>
// 文章顶部的「徽章 + 藏书编号」：只在 /blog/ 下的文章里显示（文章列表页不显示）。
// 徽章由 art.mjs 的 seal() 以文章标题为种子现场画出：同一个标题永远是同一枚徽章；改了标题，徽章也会跟着变。
// 图直接嵌进网页（不是图片文件），线条用"当前文字颜色"，所以亮色 / 暗色模式会自动换色。
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../blog.data.mjs'
import { seal } from './art.mjs'
const { page } = useData()
const post = computed(() => posts.find((p) => p.url === '/' + page.value.relativePath.replace(/\.md$/, '')))
const svg = computed(() => (post.value ? seal(post.value.title) : ''))
</script>

<template>
  <div v-if="post" class="article-seal">
    <span class="seal-mark" aria-hidden="true" v-html="svg"></span>
    <p class="article-seal-meta">
      <span lang="en">No.{{ post.no }}</span>
      <span v-if="post.category">{{ post.category }}</span>
      <span>{{ post.month }}</span>
    </p>
  </div>
</template>
