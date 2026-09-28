// 入场浮现：页面往下滚时，还没进入屏幕的内容块在进入屏幕的那一刻轻轻浮现（淡入 + 上移 8px），每块只播一次。
// 安全设计：
//   · 打开页面时已经在屏幕里的内容不动，所以不会出现"先看到、又消失、再出现"的闪烁；
//   · 电脑 / 手机设置了"减少动态效果"，或浏览器太旧，就什么都不做，内容照常显示；
//   · 只有被这段代码标记过的元素才会先隐藏，代码没运行时内容永远是可见的。
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// 哪些内容块参与浮现：首页的札记、主题、入口，以及文章列表的每一条。文章正文不参与，保证阅读安静。
const SELECTOR = '.journal-entry, .subject-list > div, .portal, .art-colophon, .catalog-list > li'

export function useReveal() {
  let io = null
  function scan() {
    io?.disconnect()
    if (!('IntersectionObserver' in window)) return
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -6% 0px' })
    for (const el of document.querySelectorAll(SELECTOR)) {
      if (el.classList.contains('is-in')) continue
      if (el.getBoundingClientRect().top < window.innerHeight) continue // 已经在屏幕里，不动它
      el.classList.add('reveal-wait')
      io.observe(el)
    }
  }
  const route = useRoute()
  onMounted(scan)
  // 站内换页时，新页面的内容稍后才画出来，等两帧再扫描
  watch(() => route.path, () => nextTick(() => requestAnimationFrame(() => requestAnimationFrame(scan))))
  onBeforeUnmount(() => io?.disconnect())
}
