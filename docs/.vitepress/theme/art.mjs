// 程序化绘画的"画法"合集：每个函数按规则画出一幅 SVG 图（返回 SVG 文字）。
// 这里只放纯粹的画法，不读写文件，所以网站页面（Vue 组件）和打包脚本 scripts/generate-art.mjs 可以共用：
//   · 页面里直接调用 seal() / constellation()，把图"嵌"进网页，颜色跟随亮色 / 暗色主题；
//   · 打包脚本调用其余函数，把底纹、迷宫存成 docs/public/art/generated/ 下的文件。
// 种子 = 一段文字。同样的文字永远画出同样的图，就像抽签号码。

// ─────────────────────────── 基础工具 ───────────────────────────

/** 由种子文字得到一个可重复的随机数发生器（同样的文字 → 同样的随机序列） */
export function rngFrom(text) {
  // 第一步：把文字"搅拌"成一个整数（xmur3 散列）
  let h = 1779033703 ^ text.length
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  let a = (h ^= h >>> 16) >>> 0
  // 第二步：用这个整数驱动一个小型随机数算法（mulberry32），每次调用得到 0~1 之间的数
  const next = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    range: (lo, hi) => lo + (hi - lo) * next(),
    int: (lo, hi) => Math.floor(lo + (hi - lo + 1) * next()),
    pick: (list) => list[Math.floor(next() * list.length)],
  }
}

const n2 = (v) => +v.toFixed(2) // 保留两位小数，让文件更小
const TAU = Math.PI * 2
const polar = (cx, cy, r, ang) => [cx + r * Math.cos(ang), cy + r * Math.sin(ang)]
const pointList = (list) => list.map(([x, y]) => `${n2(x)},${n2(y)}`).join(' ')
const svgWrap = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${body}</svg>\n`

/** 四角星 ✦ 的轮廓（r 是尖角长度，腰部收窄成 r 的 28%） */
function sparkle(cx, cy, r) {
  const w = r * 0.28
  return `<path d="M${n2(cx)} ${n2(cy - r)}Q${n2(cx + w * 0.35)} ${n2(cy - w * 0.35)} ${n2(cx + r)} ${n2(cy)}Q${n2(cx + w * 0.35)} ${n2(cy + w * 0.35)} ${n2(cx)} ${n2(cy + r)}Q${n2(cx - w * 0.35)} ${n2(cy + w * 0.35)} ${n2(cx - r)} ${n2(cy)}Q${n2(cx - w * 0.35)} ${n2(cy - w * 0.35)} ${n2(cx)} ${n2(cy - r)}Z" fill="currentColor"/>`
}

// ─────────────────────────── 1. 文章徽章 ───────────────────────────
// 构图像一枚古钱币或封印：外圈双线 → 装饰带（回纹 / 珠串 / 刻度三选一）→ 内圈 → 中心花饰。
// 花饰的对称数、星形连线、花瓣长短都由种子决定。

/** 把"回纹"（希腊式直角钩纹）弯成一圈 */
function meanderRing(cx, cy, r0, r1, count, rot) {
  // 一个回纹单元在 0~1 方格里的走法：从底边升起，向右，向下，向左，再向上，形成一个钩
  const unit = [[0, 0], [0, 0.86], [0.72, 0.86], [0.72, 0.3], [0.3, 0.3], [0.3, 0.58]]
  const toXY = (i, u, v) => polar(cx, cy, r0 + v * (r1 - r0), rot + ((i + u) / count) * TAU)
  let d = ''
  for (let i = 0; i < count; i++) {
    const pts = []
    for (let s = 0; s < unit.length - 1; s++) {
      const [u0, v0] = unit[s], [u1, v1] = unit[s + 1]
      const steps = u0 === u1 ? 1 : 5 // 沿圆周方向的线要切成几小段，才能弯成弧
      for (let t = s === 0 ? 0 : 1; t <= steps; t++) pts.push(toXY(i, u0 + ((u1 - u0) * t) / steps, v0 + ((v1 - v0) * t) / steps))
    }
    d += 'M' + pts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L')
  }
  return `<path d="${d}" stroke-width="1.1" stroke-linecap="square" stroke-linejoin="miter"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r0}" stroke-width="0.8"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${n2(r1 + (r1 - r0) * 0.14)}" stroke-width="0.8"/>`
}

export function seal(seedText) {
  const r = rngFrom(seedText)
  const C = 100, rot = -Math.PI / 2
  const k = r.pick([6, 8, 10, 12]) // 对称数：花饰重复几次
  const parts = []

  // 外圈：一粗一细两道线
  parts.push(`<circle cx="${C}" cy="${C}" r="95" stroke-width="1.8"/>`, `<circle cx="${C}" cy="${C}" r="90" stroke-width="0.7"/>`)

  // 装饰带（半径 72~86）
  const band = r.pick(['meander', 'beads', 'ticks'])
  if (band === 'meander') parts.push(meanderRing(C, C, 73, 85, k * 2, rot))
  if (band === 'beads') {
    const count = k * 5
    for (let i = 0; i < count; i++) {
      const [x, y] = polar(C, C, 80, rot + (i / count) * TAU)
      parts.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${i % 5 === 0 ? 2.4 : 1.3}" fill="currentColor" stroke="none"/>`)
    }
    parts.push(`<circle cx="${C}" cy="${C}" r="74" stroke-width="0.7"/>`, `<circle cx="${C}" cy="${C}" r="86" stroke-width="0.7"/>`)
  }
  if (band === 'ticks') {
    const count = k * 6
    let d = ''
    for (let i = 0; i < count; i++) {
      const a = rot + (i / count) * TAU
      const [x0, y0] = polar(C, C, i % 3 === 0 ? 74 : 79, a)
      const [x1, y1] = polar(C, C, 86, a)
      d += `M${n2(x0)} ${n2(y0)}L${n2(x1)} ${n2(y1)}`
    }
    parts.push(`<path d="${d}" stroke-width="0.9"/>`, `<circle cx="${C}" cy="${C}" r="74" stroke-width="0.7"/>`)
  }

  // 内圈
  parts.push(`<circle cx="${C}" cy="${C}" r="68" stroke-width="1.1"/>`)

  // 星形连线：把圆上 k 个点隔 m 个相连（像画五角星那样），m 由种子决定
  const R1 = r.range(52, 62)
  const m = r.pick(k === 6 ? [2] : k === 8 ? [3, 2] : k === 10 ? [3, 4] : [5, 4])
  const verts = Array.from({ length: k }, (_, i) => polar(C, C, R1, rot + (i / k) * TAU))
  let star = ''
  verts.forEach((p, i) => { const q = verts[(i + m) % k]; star += `M${n2(p[0])} ${n2(p[1])}L${n2(q[0])} ${n2(q[1])}` })
  parts.push(`<path d="${star}" stroke-width="0.8" opacity="0.85"/>`)
  verts.forEach(([x, y]) => parts.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="2.1" fill="currentColor" stroke="none"/>`))

  // 花瓣：从中心向外伸出 k 片叶形
  const petalLen = r.range(30, 46), petalW = r.range(0.16, 0.3) * (TAU / k)
  let petals = ''
  for (let i = 0; i < k; i++) {
    const a = rot + (i / k) * TAU // 与星点对齐
    const [bx, by] = polar(C, C, 13, a)
    const [tx, ty] = polar(C, C, petalLen, a)
    const [c1x, c1y] = polar(C, C, petalLen * 0.62, a - petalW)
    const [c2x, c2y] = polar(C, C, petalLen * 0.62, a + petalW)
    petals += `M${n2(bx)} ${n2(by)}Q${n2(c1x)} ${n2(c1y)} ${n2(tx)} ${n2(ty)}Q${n2(c2x)} ${n2(c2y)} ${n2(bx)} ${n2(by)}Z`
  }
  parts.push(`<path d="${petals}" stroke-width="1.1" stroke-linejoin="round"/>`)

  // 星位：在花瓣之间的空隙里撒几颗小 ✦
  const starCount = r.int(2, Math.min(5, k / 2))
  const used = new Set()
  for (let s = 0; s < starCount; s++) {
    let j = r.int(0, k - 1)
    while (used.has(j)) j = (j + 1) % k
    used.add(j)
    const [x, y] = polar(C, C, r.range(34, 46), rot + ((j + 0.5) / k) * TAU)
    parts.push(sparkle(x, y, r.range(2.6, 4.2)))
  }

  // 中心：小圆 + ✦
  parts.push(`<circle cx="${C}" cy="${C}" r="10" stroke-width="1"/>`, sparkle(C, C, 7))

  return svgWrap(200, 200, `<g fill="none" stroke="currentColor">${parts.join('')}</g>`)
}

// ─────────────────────────── 2. 星座图 ───────────────────────────
// 首页"持续探索"的三个主题各是一组星座。组内用"最短连线"把星星串起来（像天文图）。
// 每组包在 <g class="cluster" data-i="序号"> 里，页面可以单独点亮某一组；
// 组与组之间的虚线 class="bridge"（星桥），页面上在鼠标移过时才浮现。
// vertical = true 时三组从上到下排列（首页用），否则从左到右排列（样张用）。

export function constellation(names, { width = 720, height = 300, vertical = false } = {}) {
  const parts = []
  // 背景星尘
  const dust = rngFrom('constellation-dust')
  const dustDots = []
  for (let i = 0; i < Math.round((width * height) / 3000); i++) {
    dustDots.push(`<circle cx="${n2(dust.range(4, width - 4))}" cy="${n2(dust.range(4, height - 4))}" r="${n2(dust.range(0.5, 1.1))}" opacity="${n2(dust.range(0.25, 0.55))}"/>`)
  }
  parts.push(`<g class="dust" fill="currentColor">${dustDots.join('')}</g>`)
  const brightest = []
  const slotW = vertical ? width : width / names.length
  const slotH = vertical ? height / names.length : height
  names.forEach((name, gi) => {
    const r = rngFrom('constellation:' + name)
    const cx = vertical ? width * r.range(0.42, 0.58) : slotW * (gi + 0.5)
    const cy = vertical ? slotH * (gi + 0.5) : r.range(height * 0.4, height * 0.6)
    const minGap = Math.min(slotW, slotH) * 0.24
    const stars = []
    const n = r.int(5, 7)
    let guard = 0
    while (stars.length < n && guard++ < 800) {
      const p = [cx + r.range(-slotW * 0.38, slotW * 0.38), cy + r.range(-slotH * 0.36, slotH * 0.36)]
      if (stars.every(([x, y]) => Math.hypot(x - p[0], y - p[1]) > minGap)) stars.push(p)
    }
    // Prim 最小生成树：每次把"离已连通部分最近的星"接进来，连线自然且不会交叉成一团
    const inTree = [0], edges = []
    while (inTree.length < stars.length) {
      let best = null
      for (const a of inTree) for (let b = 0; b < stars.length; b++) {
        if (inTree.includes(b)) continue
        const d = Math.hypot(stars[a][0] - stars[b][0], stars[a][1] - stars[b][1])
        if (!best || d < best.d) best = { a, b, d }
      }
      inTree.push(best.b); edges.push([best.a, best.b])
    }
    const d = edges.map(([a, b]) => `M${n2(stars[a][0])} ${n2(stars[a][1])}L${n2(stars[b][0])} ${n2(stars[b][1])}`).join('')
    const group = [`<path class="figure" d="${d}" fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.7"/>`]
    stars.forEach(([x, y], i) => {
      if (i === 0) group.push(sparkle(x, y, 8))
      else group.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r.range(1.6, 3))}" fill="currentColor"/>`)
    })
    parts.push(`<g class="cluster" data-i="${gi}">${group.join('')}</g>`)
    brightest.push(stars[0])
  })
  // 组与组之间的虚线"星桥"
  let bridge = ''
  for (let i = 0; i < brightest.length - 1; i++) bridge += `M${n2(brightest[i][0])} ${n2(brightest[i][1])}L${n2(brightest[i + 1][0])} ${n2(brightest[i + 1][1])}`
  parts.push(`<path class="bridge" d="${bridge}" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 5" opacity="0.6"/>`)
  return svgWrap(width, height, parts.join(''))
}

// ─────────────────────────── 3. 迷宫 + 阿里阿德涅之线 ───────────────────────────
// 用"深度优先"算法挖迷宫：从一个格子出发随机往没去过的方向挖，走不通就退回，直到挖遍所有格子。
// 这样的迷宫任意两点之间只有一条路。再用"广度优先"找出入口到出口的那条路，画成一根圆润的线。
// 返回两层：walls（墙）和 thread（线），页面上分别上不同颜色。

export function labyrinth(seedText, cols = 36, rows = 11, cell = 20) {
  const r = rngFrom(seedText)
  const pad = 12, W = cols * cell + pad * 2, H = rows * cell + pad * 2
  const idx = (x, y) => y * cols + x
  const open = Array.from({ length: cols * rows }, () => ({ n: false, s: false, e: false, w: false }))
  const seen = new Uint8Array(cols * rows)
  const dirs = [['n', 0, -1, 's'], ['s', 0, 1, 'n'], ['e', 1, 0, 'w'], ['w', -1, 0, 'e']]
  const stack = [[0, r.int(0, rows - 1)]]
  seen[idx(...stack[0])] = 1
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]
    const options = dirs.filter(([, dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[idx(nx, ny)] })
    if (!options.length) { stack.pop(); continue }
    const [d, dx, dy, back] = r.pick(options)
    open[idx(x, y)][d] = true; open[idx(x + dx, y + dy)][back] = true
    seen[idx(x + dx, y + dy)] = 1; stack.push([x + dx, y + dy])
  }
  const entry = r.int(1, rows - 2), exit = r.int(1, rows - 2)
  open[idx(0, entry)].w = true; open[idx(cols - 1, exit)].e = true

  // 墙：横墙按行合并、竖墙按列合并，线条更干净
  let walls = ''
  for (let y = 0; y <= rows; y++) {
    let start = null
    for (let x = 0; x <= cols; x++) {
      const wall = x < cols && (y === rows ? !open[idx(x, rows - 1)].s : !open[idx(x, y)].n)
      if (wall && start === null) start = x
      if (!wall && start !== null) { walls += `M${pad + start * cell} ${pad + y * cell}H${pad + x * cell}`; start = null }
    }
  }
  for (let x = 0; x <= cols; x++) {
    let start = null
    for (let y = 0; y <= rows; y++) {
      const wall = y < rows && (x === cols ? !open[idx(cols - 1, y)].e : !open[idx(x, y)].w)
      if (wall && start === null) start = y
      if (!wall && start !== null) { walls += `M${pad + x * cell} ${pad + start * cell}V${pad + y * cell}`; start = null }
    }
  }

  // 找路（广度优先：像水波一样一圈圈向外探，最先碰到出口的就是答案）
  const prev = new Int32Array(cols * rows).fill(-1)
  const queue = [idx(0, entry)]; prev[queue[0]] = queue[0]
  for (let q = 0; q < queue.length; q++) {
    const c = queue[q], x = c % cols, y = (c / cols) | 0
    for (const [d, dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy
      if (!open[c][d] || nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
      const nc = idx(nx, ny)
      if (prev[nc] === -1) { prev[nc] = c; queue.push(nc) }
    }
  }
  const route = []
  for (let c = idx(cols - 1, exit); ; c = prev[c]) { route.unshift(c); if (c === prev[c]) break }
  const centre = (c) => [pad + (c % cols + 0.5) * cell, pad + (((c / cols) | 0) + 0.5) * cell]
  let pts = [[pad - cell * 0.6, pad + (entry + 0.5) * cell], ...route.map(centre), [W - pad + cell * 0.6, pad + (exit + 0.5) * cell]]
  // 去掉直线上多余的点，只保留拐角
  pts = pts.filter((p, i) => i === 0 || i === pts.length - 1 || !((pts[i - 1][0] === p[0] && p[0] === pts[i + 1][0]) || (pts[i - 1][1] === p[1] && p[1] === pts[i + 1][1])))
  // 拐角处用小圆弧过渡，让线像一根柔软的丝线
  const bend = cell * 0.42
  let thread = `M${n2(pts[0][0])} ${n2(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1]
    const inLen = Math.hypot(x - px, y - py), outLen = Math.hypot(nx - x, ny - y)
    const a = [x - ((x - px) / inLen) * Math.min(bend, inLen / 2), y - ((y - py) / inLen) * Math.min(bend, inLen / 2)]
    const b = [x + ((nx - x) / outLen) * Math.min(bend, outLen / 2), y + ((ny - y) / outLen) * Math.min(bend, outLen / 2)]
    thread += `L${n2(a[0])} ${n2(a[1])}Q${x} ${y} ${n2(b[0])} ${n2(b[1])}`
  }
  const last = pts[pts.length - 1]
  thread += `L${n2(last[0])} ${n2(last[1])}`

  const wallsSvg = svgWrap(W, H, `<path d="${walls}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>`)
  const threadSvg = svgWrap(W, H, `<path d="${thread}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>` +
    `<circle cx="${n2(pts[0][0])}" cy="${n2(pts[0][1])}" r="3" fill="currentColor"/>` + sparkle(last[0], last[1], 7))
  return { walls: wallsSvg, thread: threadSvg, width: W, height: H }
}

// ─────────────────────────── 4. 版画网线（可无缝平铺的底纹） ───────────────────────────
// 模仿铜版画的"刻线"：一排排横线，线本身有轻微波动，粗细也忽粗忽细（刻刀下压力度不同）。
// 所有波动的周期都能整除方块宽度，所以方块左右上下拼接时看不出接缝。

export function hatchTile(seedText = 'engraving', size = 160, spacing = 5) {
  const r = rngFrom(seedText)
  const rows = size / spacing
  let d = ''
  for (let j = 0; j < rows; j++) {
    const y0 = j * spacing + spacing / 2
    const k1 = r.int(1, 2), k2 = r.int(1, 3), ph = r.range(0, TAU), ps = r.range(0, TAU)
    const amp = r.range(0.3, 0.9)
    const upper = [], lower = []
    for (let x = 0; x <= size; x += 4) {
      const y = y0 + amp * Math.sin((x / size) * TAU * k1 + ph)
      const half = 0.18 + 0.32 * (0.5 + 0.5 * Math.sin((x / size) * TAU * k2 + ps))
      upper.push([x, y - half]); lower.unshift([x, y + half])
    }
    d += 'M' + [...upper, ...lower].map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L') + 'Z'
  }
  return svgWrap(size, size, `<path d="${d}" fill="currentColor"/>`)
}

// ─────────────────────────── 5. 深色模式星点（可平铺） ───────────────────────────
// 方块取得较大（560px）、只放大小不一的圆点、不放 ✦：平铺时就看不出"每隔一段重复一次"的格子感。
export function starTile(seedText = 'night-sky', size = 560) {
  const r = rngFrom(seedText)
  const parts = []
  for (let i = 0; i < 46; i++) parts.push(`<circle cx="${n2(r.range(2, size - 2))}" cy="${n2(r.range(2, size - 2))}" r="${n2(r.range(0.35, 0.95))}" fill="currentColor" opacity="${n2(r.range(0.25, 1))}"/>`)
  return svgWrap(size, size, parts.join(''))
}

// ─────────────────────────── 6. 纸张纹理（SVG 滤镜，浏览器实时生成噪点，文件只有几百字节） ───────────────────────────
export function paperGrain(size = 240) {
  return svgWrap(size, size,
    `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>` +
    `<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.32"/></filter>` +
    `<rect width="100%" height="100%" filter="url(#g)"/>`)
}

// ─────────────────────────── 7. 希腊回纹带（横向平铺，用来替代普通细分隔线） ───────────────────────────
// 一个 16×16 的方块：上下两条边线 + 一个挂在底边上的直角钩。左右拼起来就是一条连续的回纹带。
export function meanderTile() {
  return svgWrap(16, 16, '<path d="M0 .5H16M0 15.5H16M2 15.5V3.5H13.5V12H6.5V7.5H10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="square"/>')
}

