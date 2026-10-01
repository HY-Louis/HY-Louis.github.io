import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'

// 内容保全检查：学习规划（路线式，无打勾）+ 工具箱。
// 期望值按用户历次确认的要求写死（改版经过记录在 DELIVERY.zh-CN.md）；以后主动增删课程或入口时，先改页面再改这里，
// 不要为了让脚本通过而放宽检查——尤其是课程链接和已删除的入口。
const read = (path) => readFileSync(path, 'utf8')
const plan = read('docs/public/plan/index.html')
const tools = read('docs/public/tools/index.html')
const visible = plan.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '')

/* ---------- 1. 两条路线都在学习规划这一页里 ---------- */
assert.ok(plan.includes('id="backend"') && plan.includes('data-route'), 'index.html: missing backend route section')
assert.ok(plan.includes('id="cs408"'), 'index.html: missing 408 route section')
assert.equal((plan.match(/data-route[ >]/g) || []).length, 2, 'index.html: expected exactly 2 route sections')
assert.ok(plan.indexOf('id="backend"') < plan.indexOf('id="cs408"'), 'index.html: backend route must come first')
for (const href of ['#backend', '#cs408']) {
  assert.ok(plan.includes(`href="${href}"`), `index.html: top bar missing anchor ${href}`)
}
// 两条路线不再各自成页，避免同一份内容出现第二个副本
for (const stale of ['docs/public/plan/backend.html', 'docs/public/plan/cs408.html']) {
  assert.ok(!existsSync(stale), `${stale}: route pages must live inside index.html`)
}

/* ---------- 2. 学习规划只读：打勾与进度功能按用户要求移除 ---------- */
assert.ok(!/<input|class="cb"|data-uid|louis-plan-2026-progress|stage-prog|overallBar|resetBtn/.test(plan),
  'index.html: 复选框、进度条与进度存储都应已移除')
assert.ok(!/打勾|总进度|清空/.test(visible), 'index.html: 仍有打勾/进度的字样')
// 深色模式与博客共用 VitePress 的记录，由共享脚本在 <head> 里提前设定，避免白屏闪烁
const themeJs = read('docs/public/assets/theme.js')
assert.ok(themeJs.includes("'vitepress-theme-appearance'"), 'theme.js: 必须与博客共用 vitepress-theme-appearance')
for (const [name, page] of [['plan', plan], ['tools', tools]]) {
  const head = page.slice(0, page.indexOf('</head>'))
  assert.ok(head.includes('assets/theme.js'), `${name}: 主题脚本要放在 <head> 里`)
  assert.ok(head.includes('favicon.svg'), `${name}: 缺少网站图标`)
  assert.ok(head.includes('name="description"'), `${name}: 缺少网页简介`)
  assert.ok(!/louis-(plan-2026|tools)-theme/.test(page), `${name}: 不要再用各自独立的主题记录`)
  // 顶栏右侧要和博客（VitePress）一致：深浅色开关 + GitHub 图标。
  // 2026-10-01 之前这里只有一个写着「深色」的文字按钮，和博客的图标开关对不上。
  assert.ok(page.includes('class="switch" id="themeBtn"'), `${name}: 顶栏的深浅色开关不见了`)
  assert.ok(page.includes('aria-checked='), `${name}: 深浅色开关要把状态写在 aria-checked 上`)
  assert.ok(page.includes('class="iconlink" href="https://github.com/HY-Louis"'), `${name}: 顶栏缺少 GitHub 图标`)
  assert.ok(!page.includes('iconbtn'), `${name}: 旧的「深色」文字按钮应当已经删掉`)
}

/* ---------- 编码：防止中文被存成乱码 ---------- */
// 2026-09-28 曾有工具用错编码写回文件，中文变成「瀛︿範」一类乱码或问号；这里把这类情况拦下来。
// 同日复查：原先只查 7 个写死的文件，漏掉了 .vue / blog 文章 / .impeccable 下的文件（其中 4 份提示词确实带了 BOM）。
// 现在改成遍历仓库里所有会发布或参与构建的文本文件；只放行下面三份「故意引用乱码样例」的文件。
const MOJIBAKE = /\uFFFD|瀛︿|鐨|锛|銆|\?{3,}/
const quotesMojibakeOnPurpose = new Set([
  'DELIVERY.zh-CN.md',        // 记录那次事故时引用了乱码样例
  'MAINTENANCE.zh-CN.md',     // 同上
  'scripts/check-content.mjs', // 本文件，正则里就写着这些样例
])
const TEXT_EXT = new Set(['.md', '.html', '.css', '.mjs', '.js', '.vue', '.json', '.txt', '.yml', '.yaml', '.jsonl'])
const SKIP_DIR = new Set(['node_modules', '.git', 'dist', 'cache', '.temp', 'generated', 'output'])
const textFiles = []
;(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!SKIP_DIR.has(entry.name)) walk(`${dir}/${entry.name}`); continue }
    const dot = entry.name.lastIndexOf('.')
    if (dot > 0 && TEXT_EXT.has(entry.name.slice(dot))) {
      textFiles.push((dir === '.' ? entry.name : `${dir}/${entry.name}`).replace(/^\.\//, ''))
    }
  }
})('.')
assert.ok(textFiles.length > 40, `编码检查只扫到 ${textFiles.length} 个文本文件，遍历逻辑可能坏了`)
for (const path of textFiles) {
  const text = read(path)
  assert.ok(!text.startsWith('\uFEFF'), `${path}: 文件开头多了 BOM 标记`)
  if (!quotesMojibakeOnPurpose.has(path)) assert.ok(!MOJIBAKE.test(text), `${path}: 疑似乱码`)
}
assert.ok(plan.includes('<title>学习规划 · Louis</title>'), 'plan: 标题被改动或乱码')
assert.ok(tools.includes('<title>学习工具 · Louis</title>'), 'tools: 标题被改动或乱码')

/* ---------- 3. 结构：三个阶段 + 四门课 ---------- */
assert.equal((plan.match(/data-stage[ >]/g) || []).length, 7, 'expected 3 stages + 4 courses')

/* ---------- 4. 课程链接：后端 11 条 + 408 四条（页面上两条路线分开计数，不显示合计） ---------- */
assert.ok(!/stamp-num">15</.test(plan) && !/15 门/.test(visible), '学习规划不要把两条路线的课程合并成 15 门')
assert.ok(plan.includes('stamp-num">11<') && plan.includes('stamp-num">4<'), '藏书票应分别显示 11 项与 4 门')
const bv = [...new Set(plan.match(/BV[\da-zA-Z]+/g) || [])]
assert.equal(bv.length, 15, 'expected 15 course videos')
const backendPart = plan.slice(plan.indexOf('id="backend"'), plan.indexOf('id="cs408"'))
const cs408Part = plan.slice(plan.indexOf('id="cs408"'))
assert.equal([...new Set(backendPart.match(/BV[\da-zA-Z]+/g) || [])].length, 11, 'backend route: expected 11 videos')
assert.deepEqual(
  [...new Set(cs408Part.match(/BV[\da-zA-Z]+/g) || [])],
  ['BV1umZuBsEt5', 'BV18TZuBQE5q', 'BV1YE411D7nH', 'BV1c4411d7jb'],
  '408 must be 数据结构 → 计算机组成原理 → 操作系统 → 计算机网络'
)

/* ---------- 5. 章节学习指南（内容以页面为准，原「需求文档」已由用户删除） ---------- */
assert.equal((plan.match(/class="guide"/g) || []).length, 5, 'expected 5 chapter guides')
assert.equal((plan.match(/<tr><td>/g) || []).length, 28, 'chapter guide rows changed')
for (const text of [
  '1 – 143', '185 – 188', 'Hutool', '关于 API 的说明', 'file 相关内容',
  '37 – 50', '65 – 140', '后续前端基础语法', '1 – 170', '作业要求', '主播的提醒'
]) {
  assert.ok(plan.includes(text), `guide content missing: ${text}`)
}

/* ---------- 6. 结尾验收要求写在苍穹外卖项目内 ---------- */
const atLunchBox = plan.indexOf('苍穹外卖 · 项目实战')
const atAcceptance = plan.indexOf('结尾验收要求')
const atRedis = plan.indexOf('Redis 缓存')
assert.ok(atLunchBox > 0, '苍穹外卖 project missing')
assert.ok(atAcceptance > atLunchBox, '验收要求必须排在苍穹外卖项目之后')
assert.ok(atAcceptance < atRedis, '验收要求必须写在苍穹外卖条目内部（Redis 之前）')
assert.ok(atAcceptance < plan.indexOf('id="cs408"'), '验收要求必须留在后端开发路线内，不能挪到 408 部分')
const acceptance = plan.slice(atAcceptance, plan.indexOf('</ol>', atAcceptance))
for (const text of ['写实体类', 'Apifox', '前端打开页面', '例如小商城']) {
  assert.ok(acceptance.includes(text), `acceptance criteria missing: ${text}`)
}
assert.equal((acceptance.match(/<li>/g) || []).length, 4, 'expected 4 acceptance criteria')

/* ---------- 7. 已移出的内容不得回流 ---------- */
assert.ok(!/张宇|四级|六级|美赛|蓝桥杯|期中|期末|GPA|CCF|IJCNN|科研/.test(visible), 'removed content came back')
assert.ok(!/\d{1,2}\s*月/.test(visible), 'learning path must not be organised by month')
assert.ok(!/<title>[^<]*学年规划/.test(plan), 'title still says 学年规划')
assert.ok(plan.includes('<em>学习规划</em>'), 'page title changed')

/* ---------- 8. 工具箱：分类、新增入口与已删除入口 ---------- */
const toolHrefs = [...tools.matchAll(/<a[^>]+href="(https?:[^"]+)"/g)].map((m) => m[1])
for (const href of [
  'https://www.workbuddy.cn/',
  'https://learn.lianglianglee.com/',
  'https://zh.z-library.sk/',
  'https://www.runoob.com/',
  'https://app.netlify.com/drop'
]) {
  assert.ok(toolHrefs.includes(href), `工具箱缺少入口：${href}`)
}
// 「课程视频」已换成「课程资源」：8 门公开课，按用户给的顺序排列；原先的 15 门课程视频只留在学习规划里
const coursesPart = tools.slice(tools.indexOf('id="courses"'), tools.indexOf('id="learn"'))
assert.deepEqual(
  [...coursesPart.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]),
  [
    'https://www.bilibili.com/video/BV1jsj86xE1X',
    'https://www.bilibili.com/video/BV1sy411z7nA',
    'https://www.bilibili.com/video/BV1gyM26ME4u',
    'https://ocw.mit.edu/courses/6-092-introduction-to-programming-in-java-january-iap-2010/pages/syllabus/',
    'https://www.bilibili.com/video/BV1PkLQ68EPW',
    'https://www.bilibili.com/video/BV1Cm4y1d7Ur',
    'https://www.bilibili.com/video/BV1viJu6ME9y',
    'https://www.bilibili.com/video/BV11LEA6eEuj'
  ],
  '工具箱「课程资源」的链接或顺序变了'
)
assert.ok(tools.includes('课程资源') && !tools.includes('课程视频'), '工具箱分类名应为「课程资源」')
for (const bvid of bv) {
  assert.ok(!tools.includes(bvid), `学习规划里的课程视频不该再出现在工具箱：${bvid}`)
}
assert.ok(!tools.includes('tilt-inner'), '工具箱里不该再有 tilt-inner 空壳')
// 工具箱链接要写完整的 /tools/index.html：本地预览（npm run dev）不认 /tools/ 这种写法，会显示 404
assert.ok(!(tools + read('docs/.vitepress/theme/Home.vue')).includes('href="/tools/"'), '指向工具箱的链接要写成 /tools/index.html')
for (const href of ['/', '/blog/', '/tools/index.html', '/about/']) {
  assert.ok(tools.includes(`<a href="${href}"`), `工具箱顶栏缺少链接：${href}`)
}
for (const href of ['/', '/blog/', '/about/']) {
  assert.ok(plan.includes(`<a href="${href}"`), `学习规划顶栏缺少链接：${href}`)
}
for (const gone of [
  'hermes-agent.nousresearch.com', 'claude.com', 'claude.ai',
  'cet-bm.neea.edu.cn', 'comap.com'
]) {
  assert.ok(!tools.includes(gone), `这些入口应当已删除：${gone}`)
}
assert.ok(tools.includes('id="learn"') && tools.includes('学习资料'), '工具箱缺少「学习资料」分类')
assert.ok(!tools.includes('id="exam"') && !tools.includes('英语与竞赛'), '「英语与竞赛」分类应当已删除')
assert.equal((tools.match(/data-cat[ >]/g) || []).length, 5, '工具箱分类数应为 5')
assert.ok(tools.includes('5 类 ·'), '工具箱 hero 上的分类数需要与分类保持一致')
assert.ok(!/通义千问|Qwen|\d{1,2}月/.test(tools))
assert.ok(!tools.includes('href="/plan/'))

/* ---------- 8b. 「AI 工具」每个入口都要有自己的产品图标 ---------- */
// 图标文件在 docs/public/icons/，来源与改动见该目录的 SOURCES.txt。
const aiPart = tools.slice(tools.indexOf('id="ai"'), tools.indexOf('id="oj"'))
const aiLinks = (aiPart.match(/class="tool reveal"/g) || []).length
const aiHeads = (aiPart.match(/class="head"/g) || []).length
assert.equal(aiHeads, aiLinks, '「AI 工具」里还有没配图标的入口')
const aiIcons = [...aiPart.matchAll(/<img class="ico[^"]*" src="\/(icons\/[^"]+)" alt="" width="24" height="24">/g)].map((m) => m[1])
assert.equal(aiIcons.length, aiLinks, '「AI 工具」的图标写法和数量要和入口对上')
assert.equal(new Set(aiIcons).size, aiIcons.length, '「AI 工具」的图标不该重复使用')
for (const rel of aiIcons) assert.ok(existsSync(`docs/public/${rel}`), `图标文件不存在：${rel}`)
assert.equal(readdirSync('docs/public/icons').filter((f) => f.endsWith('.svg')).length, aiIcons.length,
  'icons 里的图标文件数量应与「AI 工具」的入口数一致')
// <img> 加载的 SVG 取不到页面颜色，currentColor 会一直渲染成黑色，深色模式下等于看不见
for (const f of readdirSync('docs/public/icons')) {
  if (f.endsWith('.svg')) assert.ok(!read('docs/public/icons/' + f).includes('currentColor'),
    `icons/${f}：<img> 里不能用 currentColor，要用固定色 + 深色模式反相`)
}

/* ---------- 9. 公开页面上不写「写给作者自己」的话 ---------- */
// 博客是给别人看的：改版说明、进度存储怎么实现这类内容留在文档里，不放页面上。
const publicText = [visible, tools.replace(/<script[\s\S]*?<\/script>/g, '')].join('\n')
for (const bad of [
  '这一页就是', '不再按时间', '取代原来', '已经移出', '共用同一份记录',
  '记得补充你自己', 'Keep moving', 'Keep learning'
]) {
  assert.ok(!publicText.includes(bad), `作者视角的说明不该出现在公开页面：${bad}`)
}

/* ---------- 10. 站名与格言 ---------- */
const home = read('docs/.vitepress/theme/Home.vue')
const indexMd = read('docs/index.md')
assert.ok(indexMd.includes('天助自助者'), 'index.md: motto changed')
assert.ok(!/学习，创造，保持好奇/.test(indexMd), 'index.md: old motto came back')
assert.ok(home.includes('God helps those who help themselves.'), 'Home.vue: motto english changed')
assert.ok(plan.includes('Louis · 天助自助者。'), 'plan/index.html: footer slogan changed')
assert.ok(tools.includes('Louis · 天助自助者。'), 'tools/index.html: footer slogan changed')

console.log('PASS: 学习规划一页内含后端开发路线（3 阶段、11 门）与 408 学习（4 门课），共 15 条课程链接、5 份章节指南，结尾验收要求位于苍穹外卖条目内，且打勾与进度功能已移除；工具箱为 5 类（「课程资源」为 8 门公开课，含 WorkBuddy / 技术文章摘抄 / 菜鸟教程 / Z-Library / Netlify Drop，已删 Hermes Agent、Claude 与英语竞赛分类），「AI 工具」8 个入口各自带产品图标且图标文件齐全；两页与博客共用深色模式记录，顶栏右侧为深浅色开关 + GitHub 图标（与博客一致），带网站图标与网页简介，无乱码；公开页面无作者视角说明，格言统一为「天助自助者」。')
