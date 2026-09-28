import { createContentLoader } from 'vitepress'

// 文章数据加载器：打包时读取 docs/blog/ 下每篇文章开头的 title、date、description、category，
// 供文章列表页（blog/index.md）、首页「最新札记」（Home.vue）和文章顶部徽章（ArticleSeal.vue）使用。最新的排在最前面。
export default createContentLoader('blog/*.md', {
  transform(data) {
    const posts = data
      .filter((item) => item.url !== '/blog/')
      .map((item) => {
        // 开头写的 date: 2026-09-15 会被读成日期对象，这里统一转成「2026-09-15」字符串
        const date = new Date(item.frontmatter.date).toISOString().slice(0, 10)
        const [year, month, day] = date.split('-').map(Number)
        return {
          title: item.frontmatter.title,
          date,
          year,
          month: `${year} 年 ${month} 月`,
          day: `${month} 月 ${day} 日`,
          description: item.frontmatter.description,
          category: item.frontmatter.category,
          url: item.url,
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
    // 藏书编号：按发表先后，最早的一篇是 No.001。以后补写日期更早的文章，排在它后面的编号会顺延。
    posts.forEach((post, i) => { post.no = String(posts.length - i).padStart(3, '0') })
    return posts
  },
})
