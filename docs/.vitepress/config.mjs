import { defineConfig } from 'vitepress'

export default defineConfig({
  // ========================================================
  //  网站基本信息
  // ========================================================
  lang: 'zh-CN',
  title: 'Louis',
  description: 'Louis 的个人博客 · 学习记录与技术笔记',

  // base = 网站在域名下的「子目录」。
  //   仓库名叫 用户名.github.io  → 填 '/'
  //   仓库名叫 blog              → 填 '/blog/'
  // 填错的表现：网站打开是一片空白，或者样式全乱。
  base: '/',

  // 干净链接：网址结尾不带 .html
  cleanUrls: true,

  // 显示「最后更新于」，时间自动从 git 提交记录里读
  lastUpdated: true,

  // 构建时如果有链接指向不存在的页面，直接报错而不是悄悄发布。
  // /plan/ 下面是手写的静态 HTML（放在 docs/public/plan/），
  // 不是 VitePress 页面，所以这里要放行，否则构建会误报。
  ignoreDeadLinks: [/^\/plan\//],

  head: [
    ['meta', { name: 'theme-color', content: '#7c9cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Louis 的个人博客' }],
  ],

  // ========================================================
  //  主题配置（导航栏、侧边栏、页脚等）
  // ========================================================
  themeConfig: {
    // 顶部导航栏
    // 「学习规划」指向 docs/public/plan/ 里的手写 HTML。
    // 必须加 target: '_blank'：那是独立页面，不归 VitePress 路由管，
    // 不加的话点击会被路由拦截，跳到 404。
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '学习规划', link: '/plan/index.html', target: '_blank' },
      { text: '关于', link: '/about/' },
    ],

    // 侧边栏：按路径分组。左边是网址前缀，右边是该区域显示的目录
    sidebar: {
      '/blog/': [
        {
          text: '全部文章',
          items: [
            { text: '文章列表', link: '/blog/' },
            { text: '我的博客是怎么搭起来的', link: '/blog/how-i-built-this-blog' },
          ],
        },
      ],
    },

    // 右上角的社交图标
    socialLinks: [
      { icon: 'github', link: 'https://github.com/HY-Louis' },
    ],

    // 右侧「本页目录」
    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    // ---- 以下是把 VitePress 的英文界面文字换成中文 ----
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除搜索条件',
            displayDetails: '展开详情',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新于',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    outlineTitle: '本页目录',

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 Louis',
    },
  },
})
