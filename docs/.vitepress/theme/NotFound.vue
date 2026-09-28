<template>
  <!-- 自定义 404 页：访问不存在的网址时显示，替代 VitePress 默认的白页 -->
  <div class="not-found-page">
    <p class="not-found-code" aria-hidden="true">404</p>
    <h1>此路未载于典籍。</h1>
    <p lang="en">This page is not in the library.</p>
    <p class="not-found-hint">你要找的页面可能已经搬走，或者网址打错了一个字。</p>
    <a class="primary-link" href="/">回到首页</a>
  </div>
</template>
