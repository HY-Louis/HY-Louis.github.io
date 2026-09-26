import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

// Compare the redesign with the last committed content before publishing.
const read = (path) => readFileSync(path, 'utf8')
for (const path of ['docs/public/plan/index.html', 'docs/public/tools/index.html']) {
  const before = execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8' })
  const after = read(path)
  const externalLinks = (html) => [...html.matchAll(/href="(https?:[^\"]+)"/g)].map((m) => m[1]).sort()
  assert.deepEqual(externalLinks(after), externalLinks(before), `${path}: external links changed`)
  const inputs = (html) => [...html.matchAll(/<input\b[^>]*class="cb"[^>]*>/g)].map((m) => m[0])
  assert.deepEqual(inputs(after), inputs(before), `${path}: task inputs or explicit IDs changed`)
}
const plan = read('docs/public/plan/index.html')
assert.equal((plan.match(/class="cb"/g) || []).length, 38)
assert.equal((plan.match(/data-month[ >]/g) || []).length, 7)
assert.equal(new Set(plan.match(/BV[\da-zA-Z]+/g)).size, 13)
assert.ok(plan.includes('louis-plan-2026-progress'))
for (const id of ['m01-2', 'm01-3', 'm01-4']) assert.ok(plan.includes(`data-uid="${id}"`))
assert.ok(!plan.includes('data-uid="m01-1"'))
assert.ok(plan.includes('https://www.bilibili.com/video/BV1YE411D7nH'))
assert.ok(!/CCF|IJCNN|科研/.test(plan))
const tools = read('docs/public/tools/index.html')
assert.ok(tools.includes('Beokayy_'))
assert.ok(tools.includes('louis-tools-theme'))
assert.ok(!/通义千问|Qwen|\d{1,2}月/.test(tools))
assert.ok(!tools.includes('href="/plan/'))
console.log('PASS: external links, 38 tasks, 7 months, 13 courses, IDs, storage keys and independent toolbox preserved.')
