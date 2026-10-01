// 页面验证脚本（npm run verify，先 npm run build）：起本地静态服务 → 本机无头 Edge 打开打包结果 →
// 检查并截图（截图存 output/review/，不进版本库）→ 全部关闭。依赖本机 Edge 与 Node 22+。
import http from 'node:http'
import { readFile, stat, mkdir, writeFile, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, extname } from 'node:path'
import { tmpdir } from 'node:os'

const DIST = 'docs/.vitepress/dist'
const OUT = 'output/review'
const PORT = 4179, DBG = 9339
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8' }

async function resolveFile(p) {
  for (const c of [p, p + '.html', join(p, 'index.html')]) {
    try { if ((await stat(join(DIST, c))).isFile()) return c } catch {}
  }
}
const server = http.createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const f = await resolveFile(p)
  // 找不到文件时和 GitHub Pages 一样返回 404.html，这样能看到自定义 404 页
  if (!f) { res.writeHead(404, { 'content-type': types['.html'] }); return res.end(await readFile(join(DIST, '404.html'))) }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' })
  res.end(await readFile(join(DIST, f)))
}).listen(PORT)

const profile = join(tmpdir(), 'louis-verify-edge')
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', 'about:blank'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let ws, seq = 0
const pending = new Map()
function send(method, params = {}) {
  const id = ++seq
  ws.send(JSON.stringify({ id, method, params, sessionId }))
  return new Promise((ok, bad) => pending.set(id, { ok, bad }))
}
let sessionId
async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const v = await (await fetch(`http://127.0.0.1:${DBG}/json/version`)).json()
      ws = new WebSocket(v.webSocketDebuggerUrl); break
    } catch { await sleep(200) }
  }
  await new Promise((r) => ws.addEventListener('open', r))
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.bad(new Error(JSON.stringify(m.error))) : p.ok(m.result) }
  })
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  ;({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }))
  await send('Page.enable'); await send('Runtime.enable')
}
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value
async function view(w, h, mobile = false) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile }) }
async function scheme(dark) { await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }] }) }
async function go(path) { await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${path}` }); await sleep(1500); await evaluate('document.fonts.ready.then(() => 1)') }
async function shot(name) { const { data } = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(`${OUT}/${name}.png`, Buffer.from(data, 'base64')) }

const results = {}
try {
  await mkdir(OUT, { recursive: true })
  await connect()
  await scheme(false)

  // 1. 桌面截图 + 首页大图与图标
  await view(1440, 900)
  await go('/'); await evaluate("localStorage.clear()"); await go('/')
  results.homeImage = await evaluate("document.querySelector('.library-art img').currentSrc")
  results.icons = await evaluate(`Promise.all(['/favicon.svg','/favicon.ico','/apple-touch-icon.png','/fonts/gfs-didot.woff2','/fonts/noto-serif-sc-headings.woff2','/art/athena-library.jpg'].map(u => fetch(u).then(r => u + ' ' + r.status)))`)
  results.homeFonts = await evaluate("[...document.fonts].filter(f => f.status === 'loaded').map(f => f.family)")
  // 首页顶栏（.VPNavBar.home）把 --vp-c-text-2 覆盖成 #dfdff6，而 VitePress 的开关图标读的正是这个变量、
  // 又画在白圆点上——浅色下就成了 1.31:1 的「浅灰画在白上」。style.css 单独把开关里的图标固定成
  // VitePress 出厂的 #67676c（对白圆点 5.62:1）。这里守住它：期望 rgb(255,255,255) 圆点 + rgb(103,103,108) 图标。
  results.homeLightSwitch = await evaluate(`({
    knob: getComputedStyle(document.querySelector('.VPSwitchAppearance .check')).backgroundColor,
    sunIcon: getComputedStyle(document.querySelector('.VPSwitchAppearance .icon .vpi-sun')).color
  })`)
  await shot('home-1440')
  await evaluate("document.getElementById('journal').scrollIntoView()"); await sleep(1200); await shot('home-journal-1440')
  await evaluate("document.querySelector('.interests').scrollIntoView()"); await sleep(1200); await shot('home-interests-1440')
  await go('/blog/how-i-built-this-blog'); await shot('article-top-1440')
  await evaluate("document.querySelector('.article-end')?.scrollIntoView(false)"); await sleep(300); await shot('article-end-1440')
  results.articleEnd = await evaluate("document.querySelector('.article-end p')?.textContent")
  await go('/blog/'); await shot('blog-list-1440')
  // 博客（VitePress）顶栏右侧有什么，用来和工具箱 / 规划两页对齐着看
  results.blogNavControls = await evaluate(`({
    switch: !!document.querySelector('.VPNavBarAppearance .VPSwitchAppearance'),
    switchBox: (() => { const r = document.querySelector('.VPSwitchAppearance') && document.querySelector('.VPSwitchAppearance').getBoundingClientRect(); return r ? Math.round(r.width) + 'x' + Math.round(r.height) : 'none' })(),
    social: [...document.querySelectorAll('.VPNavBarSocialLinks .VPSocialLink')].map(a => a.getAttribute('aria-label')),
    // 开关图标画在白圆点上，要对着圆点算对比度：首页顶栏曾经把它压成 #dfdff6（1.31:1，看不见）。
    // 期望：浅色下圆点是白、图标是 VitePress 出厂的 rgb(103, 103, 108)。
    knob: getComputedStyle(document.querySelector('.VPSwitchAppearance .check')).backgroundColor,
    sunIcon: getComputedStyle(document.querySelector('.VPSwitchAppearance .icon .vpi-sun')).color
  })`)
  results.listDropCap = await evaluate("getComputedStyle(document.querySelector('.vp-doc h1 + p'), '::first-letter').float")
  await go('/about/'); await shot('about-1440')
  results.aboutSeal = await evaluate("!!document.querySelector('.ex-libris-seal svg')")
  results.articleSeal = await evaluate("fetch('/blog/how-i-built-this-blog').then(r => r.text()).then(t => t.includes('seal-mark'))")
  results.generatedArt = await evaluate(`Promise.all(['paper-grain','stars','hatch','meander','labyrinth-walls','labyrinth-thread'].map(n => fetch('/art/generated/' + n + '.svg').then(r => n + ' ' + r.status)))`)
  await go('/no-such-page'); await shot('404-1440')
  results.notFound = await evaluate("document.querySelector('.not-found-page h1')?.textContent")
  await go('/tools/index.html'); await shot('tools-top-1440')
  // 「AI 工具」这一类的产品图标在首屏之外，单独滚到这一段截一张，方便人工核对图标
  await evaluate("document.getElementById('ai').scrollIntoView()"); await sleep(600); await shot('tools-ai-1440')
  await evaluate("document.getElementById('courses').scrollIntoView()"); await sleep(300); await shot('tools-courses-1440')
  results.tools = await evaluate(`({
    cats: [...document.querySelectorAll('[data-cat] h2')].map(h => h.textContent),
    total: document.getElementById('totalCount').textContent,
    scrollY: Math.round(window.scrollY),
    courses: [...document.querySelectorAll('#courses .course-row b')].map(b => b.textContent),
    nav: [...document.querySelectorAll('.pages a')].map(a => a.textContent + '→' + a.getAttribute('href')),
    // 顶栏右侧应该是「开关 + GitHub 图标」两个控件，和博客顶栏一致；文字按钮已改掉
    navControls: [...document.querySelectorAll('.topbar .tools > *')].map(el => el.tagName.toLowerCase() + '[' + (el.getAttribute('aria-label') || '') + '] ' +
      Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height)),
    switchKnob: (() => {
      const sw = document.querySelector('.switch'), k = sw.querySelector('.check')
      return Math.round(k.getBoundingClientRect().width) + 'x' + Math.round(k.getBoundingClientRect().height) +
        ' 左偏 ' + Math.round(k.getBoundingClientRect().left - sw.getBoundingClientRect().left) + 'px'
    })(),
    // 「AI 工具」的产品图标：文件读到了没、渲染尺寸对不对、在页面的哪个位置（方便截图核对）
    icons: [...document.querySelectorAll('#ai .tool .ico')].map(i => (i.getAttribute('src') || '').replace('/icons/', '') +
      ' ' + Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height) +
      ' @' + Math.round(i.getBoundingClientRect().left) + ',' + Math.round(i.getBoundingClientRect().top) +
      (i.complete && i.naturalWidth > 0 ? ' ok' : ' BROKEN')),
    // 图标和标题在同一行，且中心线对齐（两者高度不同，所以比中心而不是比 top）
    iconHeadRow: [...document.querySelectorAll('#ai .tool .head')].every(h => {
      const i = h.querySelector('.ico').getBoundingClientRect(), b = h.querySelector('b').getBoundingClientRect()
      return Math.abs((i.top + i.bottom) / 2 - (b.top + b.bottom) / 2) <= 2
    }),
    iconTagOverlap: [...document.querySelectorAll('#ai .tool')].filter(t => {
      const tag = t.querySelector('.tag'); if (!tag) return false
      const a = tag.getBoundingClientRect(), b = t.querySelector('.head').getBoundingClientRect()
      return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
    }).length
  })`)
  await go('/plan/index.html'); await shot('plan-top-1440')
  results.planNav = await evaluate("[...document.querySelectorAll('.pages a')].map(a => a.textContent + '→' + a.getAttribute('href'))")

  // 2. 手机宽度：顶栏是否挤、页面是否横向溢出
  for (const w of [390, 320]) {
    await view(w, 844, true)
    await go('/'); await evaluate("document.querySelector('.interests').scrollIntoView()"); await sleep(300); await shot(`home-interests-${w}`)
    results[`home-${w}`] = await evaluate('({ overflow: document.documentElement.scrollWidth > innerWidth })')
    // 文章页：旁注在手机上要回到正文里，不能把页面撑宽
    await go('/blog/how-i-built-this-blog'); await evaluate("document.querySelector('.margin-note')?.scrollIntoView()"); await sleep(1200); await shot(`article-notes-${w}`)
    results[`article-${w}`] = await evaluate("({ overflow: document.documentElement.scrollWidth > innerWidth, noteFloat: getComputedStyle(document.querySelector('.margin-note')).float })")
    for (const [name, path] of [['tools', '/tools/index.html'], ['plan', '/plan/index.html']]) {
      await go(path)
      results[`${name}-${w}`] = await evaluate(`({
        overflow: document.documentElement.scrollWidth > innerWidth,
        topbarHeight: Math.round(document.querySelector('.topbar').getBoundingClientRect().height),
        pagesRows: new Set([...document.querySelectorAll('.pages a')].map(a => Math.round(a.getBoundingClientRect().top))).size,
        topbarItems: [...document.querySelectorAll('.topbar-inner > *')].map(el => el.className + ' ' + Math.round(el.getBoundingClientRect().width) + 'px@行' + Math.round(el.getBoundingClientRect().top))
      })`)
      await shot(`${name}-top-${w}`)
    }
  }

  // 3. 深色模式同步：博客选深色 → 工具箱 / 规划也是深色；在工具箱切回浅色 → 博客也是浅色
  await view(1440, 900); await scheme(false)
  await go('/blog/'); await evaluate("localStorage.setItem('vitepress-theme-appearance', 'dark')")
  await go('/blog/'); results.blogDark = await evaluate("document.documentElement.classList.contains('dark')")
  // 深色下首页顶栏的开关：圆点变黑、图标读 --vp-c-text-1（象牙白）。style.css 那条修复带 html:not(.dark)，
  // 就是不许它把这里的深色配色也覆盖成 #67676c（黑圆点上的深灰图标同样看不见）。
  await go('/'); results.homeDarkSwitch = await evaluate(`({
    knob: getComputedStyle(document.querySelector('.VPSwitchAppearance .check')).backgroundColor,
    moonIcon: getComputedStyle(document.querySelector('.VPSwitchAppearance .icon .vpi-moon')).color
  })`)
  await go('/tools/index.html'); results.toolsDarkAfterBlog = await evaluate("document.documentElement.dataset.theme + ' / 开关:' + document.getElementById('themeBtn').getAttribute('aria-checked') + ' / ' + document.getElementById('themeBtn').title")
  await shot('tools-dark-1440')
  await evaluate("document.getElementById('ai').scrollIntoView()"); await sleep(600); await shot('tools-ai-dark-1440')
  // 深色模式下黑白图标（OpenAI / Qoder / Cursor）要反相，否则等于看不见
  results.toolsDarkIconFilter = await evaluate("getComputedStyle(document.querySelector('#ai .ico-mono')).filter")
  // 深色下开关要「圆点右移 + 月亮出现」
  results.toolsDarkSwitch = await evaluate(`({
    checked: document.getElementById('themeBtn').getAttribute('aria-checked'),
    knobOffset: Math.round(document.querySelector('.switch .check').getBoundingClientRect().left - document.querySelector('.switch').getBoundingClientRect().left),
    sun: getComputedStyle(document.querySelector('.switch .sun')).opacity,
    moon: getComputedStyle(document.querySelector('.switch .moon')).opacity
  })`)
  await go('/'); await shot('home-dark-1440')
  await go('/blog/'); await shot('blog-list-dark-1440')
  await go('/plan/index.html'); results.planDarkAfterBlog = await evaluate("document.documentElement.dataset.theme")
  await shot('plan-dark-1440')
  await go('/tools/index.html'); await evaluate("document.getElementById('themeBtn').click()")
  results.toolsAfterClick = await evaluate("document.documentElement.dataset.theme + ' / 存储:' + localStorage.getItem('vitepress-theme-appearance')")
  await go('/blog/'); results.blogAfterToolsClick = await evaluate("document.documentElement.classList.contains('dark') ? 'dark' : 'light'")
  // 首次绘制前就定好颜色：theme.js 在 <head> 里同步执行，<body> 出现之前 data-theme 已是深色
  await evaluate("localStorage.setItem('vitepress-theme-appearance', 'dark')")
  await send('Page.addScriptToEvaluateOnNewDocument', { source: "new MutationObserver((m, o) => { if (document.body) { window.__themeAtBody = document.documentElement.dataset.theme; o.disconnect() } }).observe(document, {childList: true, subtree: true})" })
  await go('/tools/index.html'); results.themeWhenBodyAppears = await evaluate('window.__themeAtBody')
  // 未选择时跟随系统
  await evaluate("localStorage.removeItem('vitepress-theme-appearance')")
  await scheme(true); await go('/plan/index.html'); results.planFollowsSystemDark = await evaluate("document.documentElement.dataset.theme")
} catch (e) {
  results.error = String(e.stack || e)
} finally {
  console.log(JSON.stringify(results, null, 2))
  try { ws?.close() } catch {}
  edge.kill(); server.close()
  await sleep(500)
  await rm(profile, { recursive: true, force: true }).catch(() => {})
  // 出错时用非 0 退出。以前这里固定 process.exit(0)，Edge 起不来或页面打开失败也照样报成功，等于没有验证。
  process.exit(results.error ? 1 : 0)
}
