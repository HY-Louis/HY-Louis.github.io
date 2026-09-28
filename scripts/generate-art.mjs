// 程序化绘画生成器（npm run art；npm run build / dev 会自动先跑它）
// 作用：用代码"画"出博客的装饰图案，输出为 SVG 文件（一种用数学描述的图，放大不会糊）。
// 画法本身写在 docs/.vitepress/theme/art.mjs，这里只负责"把画好的图存成文件"。
// 用法：
//   node scripts/generate-art.mjs            → 生成底纹与迷宫到 docs/public/art/generated/（这个文件夹不进 git，每次打包重新生成）
//   node scripts/generate-art.mjs --samples  → 额外生成样张页到 output/art-samples/（只给人看，不上线）
// 颜色约定：图案一律用 currentColor（"当前文字颜色"）。页面用 CSS 蒙版（mask）给它上色，所以亮色、暗色模式自动适配。
// 文章徽章与首页星座不存文件：页面里直接调用 art.mjs 画出来，见 ArticleSeal.vue、Home.vue。

import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { seal, constellation, labyrinth, hatchTile, starTile, paperGrain, meanderTile } from '../docs/.vitepress/theme/art.mjs'

// ─────────────────────────── 批量输出 ───────────────────────────

/** 读取文章列表，拿到每篇文章的文件名和标题（标题就是徽章的种子） */
async function readPosts() {
  const dir = 'docs/blog'
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md') && f !== 'index.md')
  const posts = []
  for (const file of files) {
    const text = await readFile(join(dir, file), 'utf8')
    const title = text.match(/^title:\s*(.+)$/m)?.[1]?.trim()
    if (title) posts.push({ slug: file.replace(/\.md$/, ''), title })
  }
  return posts
}

const SUBJECTS = ['BACKEND', 'FOUNDATIONS', 'ALGORITHMS'] // 与首页 docs/index.md 的三个主题对应

async function buildProduction() {
  const out = 'docs/public/art/generated'
  await mkdir(out, { recursive: true })
  const maze = labyrinth('ariadne', 44, 8) // 44 列 × 8 行：扁长，适合做学习规划页的横幅
  await writeFile(join(out, 'labyrinth-walls.svg'), maze.walls)
  await writeFile(join(out, 'labyrinth-thread.svg'), maze.thread)
  await writeFile(join(out, 'hatch.svg'), hatchTile())
  await writeFile(join(out, 'stars.svg'), starTile())
  await writeFile(join(out, 'paper-grain.svg'), paperGrain())
  await writeFile(join(out, 'meander.svg'), meanderTile())
  console.log(`已生成：迷宫（墙 + 线）、版画网线、星点、纸纹、回纹 → ${out}`)
}

async function buildSamples(posts) {
  const out = 'output/art-samples'
  await mkdir(out, { recursive: true })
  const inline = (svg) => svg.replace(/ width="\d+" height="\d+"/, '')
  const uri = (svg) => `url('data:image/svg+xml,${encodeURIComponent(svg)}')`
  const seeds = [
    { seed: posts[0]?.title ?? '示例', label: `真实文章：${posts[0]?.title ?? '—'}` },
    { seed: '示例种子 · 甲', label: '示例种子 · 甲（仅演示不同种子的差异）' },
    { seed: '示例种子 · 乙', label: '示例种子 · 乙（仅演示不同种子的差异）' },
  ]
  const maze = labyrinth('ariadne', 44, 8) // 44 列 × 8 行：扁长，适合做学习规划页的横幅
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>程序化绘画样张</title>
<style>
@font-face{font-family:'GFS Didot';src:url(../../docs/public/fonts/gfs-didot.woff2) format('woff2')}
@font-face{font-family:'Louis Song';src:url(../../docs/public/fonts/noto-serif-sc-headings.woff2) format('woff2')}
:root{--blue:#101bb4;--paper:#f5f2e9;--ink:#182047;--muted:#60647a;--line:#cecdc5;--gold:#9a7330;
      --d-paper:#131a2c;--d-ink:#f2eee3;--d-accent:#b5beff;--d-gold:#e1c185;--on-blue-gold:#e3c77f}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.7 'Microsoft YaHei',sans-serif}
h1,h2{font-family:'GFS Didot','Louis Song','SimSun',serif;font-weight:400;margin:0}
h1{font-size:40px;padding:48px 64px 8px}h2{font-size:26px;margin-bottom:6px}
.lead{padding:0 64px 24px;color:var(--muted)}
section{padding:36px 64px;border-top:1px solid var(--line)}
.row{display:flex;gap:40px;flex-wrap:wrap;align-items:flex-start}
figure{margin:0;display:flex;flex-direction:column;gap:10px;align-items:center}
figcaption{font-size:13px;color:var(--muted);max-width:220px;text-align:center}
.dark{background:var(--d-paper);color:var(--d-ink)}.dark figcaption,.dark .note{color:#b6bfd2}
.blue{background:var(--blue);color:#f7f3ea}.blue .note{color:#c9cdf2}
.seal{width:150px;height:150px}.seal svg{width:100%;height:100%;display:block}
.note{font-size:13px;color:var(--muted);margin:6px 0 18px}
.const{position:relative;max-width:900px}.const svg{width:100%;display:block}
.const .labels{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;font-family:'Louis Song','SimSun',serif;font-size:18px}
.maze{position:relative;max-width:900px;aspect-ratio:${maze.width}/${maze.height}}
.maze .layer{position:absolute;inset:0;-webkit-mask:var(--m) center/100% 100% no-repeat;mask:var(--m) center/100% 100% no-repeat}
.swatches{display:grid;grid-template-columns:repeat(2,minmax(260px,1fr));gap:24px;max-width:900px}
.sw{height:170px;position:relative;display:flex;align-items:flex-end;padding:14px 16px;font-size:13px}
.sw::before{content:'';position:absolute;inset:0;pointer-events:none}
.sw span{position:relative}
.hatch::before{background:#f7f3ea;opacity:.09;-webkit-mask:${uri(hatchTile())} 0 0/160px 160px;mask:${uri(hatchTile())} 0 0/160px 160px}
.grain::before{background-image:${uri(paperGrain())};background-size:240px;opacity:.1;mix-blend-mode:multiply}
.stars::before{background:#e8ecff;-webkit-mask:${uri(starTile())} 0 0/560px 560px;mask:${uri(starTile())} 0 0/560px 560px;opacity:.4}
</style>
<h1>程序化绘画样张</h1>
<p class="lead">以下图案全部由 scripts/generate-art.mjs 用代码生成。同一个种子永远得到同一个图案。</p>

<section><h2>一 · 文章徽章</h2><p class="note">以文章标题为种子。对称数、外圈装饰带（回纹 / 珠串 / 刻度）、星形连线和花瓣都由种子决定。</p>
<div class="row">${seeds.map((s) => `<figure><div class="seal" style="color:var(--blue)">${inline(seal(s.seed))}</div><figcaption>${s.label}</figcaption></figure>`).join('')}</div></section>
<section class="dark"><h2>一 · 文章徽章（深色模式）</h2><p class="note">同样的图案，换成深色模式的浅蓝。</p>
<div class="row">${seeds.map((s) => `<figure><div class="seal" style="color:var(--d-accent)">${inline(seal(s.seed))}</div><figcaption>${s.label}</figcaption></figure>`).join('')}</div></section>

<section class="blue"><h2>二 · 星座图（首页「持续探索」蓝色区块）</h2><p class="note">三个主题各是一组星座。三组之间的虚线"星桥"以后在鼠标移过时才浮现。</p>
<div class="const">${inline(constellation(SUBJECTS))}<div class="labels"><span>Java 后端</span><span>计算机基础</span><span>算法与刷题</span></div></div></section>

<section><h2>三 · 迷宫头图 + 阿里阿德涅之线（学习规划页）</h2><p class="note">墙用群青，贯穿迷宫的"线"用哑光金，从左侧入口一直引到右侧的 ✦ 出口。</p>
<div class="maze"><div class="layer" style="--m:${uri(maze.walls)};background:var(--blue)"></div><div class="layer" style="--m:${uri(maze.thread)};background:var(--gold)"></div></div></section>
<section class="dark"><h2>三 · 迷宫头图（深色模式）</h2><p class="note">&nbsp;</p>
<div class="maze"><div class="layer" style="--m:${uri(maze.walls)};background:var(--d-accent);opacity:.8"></div><div class="layer" style="--m:${uri(maze.thread)};background:var(--d-gold)"></div></div></section>

<section><h2>四 · 底纹</h2><p class="note">每组左边是现在的样子，右边是加底纹后的样子。底纹只放在首页蓝色区块和页面边缘，不进正文阅读区。</p>
<div class="swatches">
<div class="sw blue"><span>现在：纯群青</span></div><div class="sw blue hatch"><span>版画网线（9% 透明度）</span></div>
<div class="sw" style="background:var(--paper);outline:1px solid var(--line)"><span>现在：纯象牙白</span></div><div class="sw grain" style="background:var(--paper);outline:1px solid var(--line)"><span>纸张纹理</span></div>
<div class="sw dark"><span>现在：纯深蓝（深色模式）</span></div><div class="sw dark stars"><span>稀疏星点（深色模式）</span></div>
</div></section>
</html>`
  await writeFile(join(out, 'index.html'), html)
  console.log(`样张页 → ${out}/index.html`)
}

await buildProduction()
if (process.argv.includes('--samples')) await buildSamples(await readPosts())
