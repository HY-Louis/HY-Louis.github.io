<script setup>
// 文章结尾的落款：只在 /blog/ 下的文章正文末尾显示（文章列表页不显示）。
// 日期读文章开头的 date，显示成「2026 年 9 月」。
import { computed } from 'vue'
import { useData } from 'vitepress'
const { page, frontmatter } = useData()
const show = computed(() => /^blog\/(?!index\.md$).+\.md$/.test(page.value.relativePath))
const month = computed(() => {
  const d = new Date(frontmatter.value.date)
  return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`
})
</script>

<template>
  <footer v-if="show" class="article-end">
    <p>Louis<template v-if="month"> · {{ month }}</template></p>
    <span lang="en">God helps those who help themselves.</span>
  </footer>
</template>
