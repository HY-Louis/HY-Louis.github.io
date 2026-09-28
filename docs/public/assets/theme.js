/* 工具箱与学习规划共用的脚本：深色 / 浅色切换 + 入场浮现。
 * 和博客（VitePress）读写同一个记录 vitepress-theme-appearance，三处页面的选择保持一致：
 *   'dark' / 'light' = 手动选过；'auto' 或没有记录 = 跟随电脑系统。
 * 这个文件放在 <head> 里同步加载，页面画出来之前就定好颜色，深色用户不会先看到一下白屏。 */
(function () {
  'use strict';
  var KEY = 'vitepress-theme-appearance';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');

  var memo = null; // 浏览器禁止存储时（如无痕模式），至少在这一页里记住选择

  function saved() {
    if (memo) return memo;
    try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; }
  }
  function isDark() {
    var pref = saved();
    return pref === 'auto' ? system.matches : pref === 'dark';
  }
  function paint() {
    var dark = isDark();
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    var btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = dark ? '浅色' : '深色';
  }

  paint();
  // 跟随系统时，系统切换深浅色也同步过来
  system.addEventListener && system.addEventListener('change', paint);

  document.addEventListener('DOMContentLoaded', function () {
    paint();
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = !isDark();
      // 与 VitePress 相同：切到和系统一致的颜色时记为 'auto'
      var value = next === system.matches ? 'auto' : (next ? 'dark' : 'light');
      memo = value;
      try { localStorage.setItem(KEY, value); } catch (e) {}
      paint();
    });
  });

  /* 入场浮现：页面往下滚时，带 .reveal 的内容块在进入屏幕那一刻轻轻浮现（淡入 + 上移 8px），每块只播一次。
   * 打开页面时已在屏幕里的块不动（不会闪烁）；设置了"减少动态效果"或浏览器太旧时什么都不做。 */
  document.addEventListener('DOMContentLoaded', function () {
    if (!('IntersectionObserver' in window)) return;
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    [].forEach.call(document.querySelectorAll('.reveal'), function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('reveal-wait');
      io.observe(el);
    });
  });
})();
