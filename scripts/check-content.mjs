import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

// 学习规划（路线式）的内容保全检查。
// 期望值按「需求文档.md」的实际内容写死；以后主动增删课程或任务时，先改页面再改这里，
// 不要为了让脚本通过而放宽检查——尤其是课程链接和任务编号。
const read = (path) => readFileSync(path, 'utf8')
const plan = read('docs/public/plan/index.html')
const tools = read('docs/public/tools/index.html')

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

/* ---------- 2. 任务：11 个后端 + 4 门 408，全部固定 UID ---------- */
const uids = [...plan.matchAll(/<input\b[^>]*class="cb"[^>]*data-uid="([^"]+)"/g)].map((m) => m[1])
assert.equal((plan.match(/class="cb"/g) || []).length, 15)
// 每个勾选框都必须带显式编号，避免以后增删条目时进度串位
assert.equal(uids.length, 15, 'every checkbox needs an explicit data-uid')
assert.equal(new Set(uids).size, 15, 'duplicate data-uid')
// 编号沿用原「学年规划」，改造前已打的勾不会丢
assert.deepEqual(uids, [
  'm09-0', 'm09-1',
  'm10-0', 'm10-1', 'm10-2', 'm10-3', 'm10-4', 'm10-5', 'm10-6',
  'm11-0', 'm11-1',
  'c408-1', 'm09-3', 'm09-2', 'c408-4'
])
assert.ok(plan.includes('louis-plan-2026-progress'), 'progress storage key changed')
assert.ok(plan.includes('louis-plan-2026-theme'), 'theme storage key changed')

/* ---------- 3. 结构：三个阶段 + 四门课 ---------- */
assert.equal((plan.match(/data-stage[ >]/g) || []).length, 7, 'expected 3 stages + 4 courses')

/* ---------- 4. 课程链接：后端 11 条 + 408 四条，共 15 门 ---------- */
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

/* ---------- 5. 章节学习指南按需求文档保留 ---------- */
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
const atRedis = plan.indexOf('data-uid="m11-1"')
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
const visible = plan.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '')
assert.ok(!/张宇|四级|六级|美赛|蓝桥杯|期中|期末|GPA|CCF|IJCNN|科研/.test(visible), 'removed content came back')
assert.ok(!/\d{1,2}\s*月/.test(visible), 'learning path must not be organised by month')
assert.ok(!/<title>[^<]*学年规划/.test(plan), 'title still says 学年规划')
assert.ok(plan.includes('<em>学习规划</em>'), 'page title changed')

/* ---------- 8. 工具箱保持独立 ---------- */
assert.ok(tools.includes('Beokayy_'))
assert.ok(tools.includes('louis-tools-theme'))
assert.ok(!/通义千问|Qwen|\d{1,2}月/.test(tools))
assert.ok(!tools.includes('href="/plan/'))

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

console.log('PASS: 学习规划一页内含后端开发路线（3 阶段、11 任务）与 408 学习（4 门课），共 15 个任务、15 条课程链接、5 份章节指南；结尾验收要求位于苍穹外卖项目内；工具箱仍独立；公开页面无作者视角说明，格言已统一为「天助自助者」。')
