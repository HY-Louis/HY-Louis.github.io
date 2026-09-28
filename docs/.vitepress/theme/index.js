import { h, defineComponent } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Home from './Home.vue'
import ArticleSeal from './ArticleSeal.vue'
import ArticleEnd from './ArticleEnd.vue'
import NotFound from './NotFound.vue'
import { useReveal } from './reveal.js'
import './style.css'

export default {
  extends: DefaultTheme,
  // 在默认布局外面包一层：可以在固定位置插入自己的组件，也能在页面加载后运行 useReveal()
  Layout: defineComponent({
    setup() {
      useReveal() // 往下滚时，下方内容轻轻浮现（见 reveal.js）
      return () => h(DefaultTheme.Layout, null, {
        'home-hero-before': () => h(Home),   // 首页自定义首屏与各区块
        'doc-before': () => h(ArticleSeal),  // 文章顶部：徽章 + 藏书编号
        'doc-after': () => h(ArticleEnd),    // 文章结尾落款
        'not-found': () => h(NotFound),      // 自定义 404 页
      })
    },
  }),
}
