import type { Aircraft, Control, Pt } from './types'

const PAD_X = 8
const TITLE_H = 24
const PAD_B = 6

const cache = new WeakMap<Aircraft, { list: Control[]; map: Map<string, Control> }>()

function compute(ac: Aircraft): Control[] {
  if (ac.hotspots) return ac.hotspots
  const out: Control[] = []
  for (const p of ac.panels) {
    const innerW = p.w - PAD_X * 2
    const innerH = p.h - TITLE_H - PAD_B
    const weights = p.rows.map(r => Math.max(...r.map(c => c.size ?? 1)))
    const totalW = weights.reduce((a, b) => a + b, 0)
    let y = p.y + TITLE_H
    p.rows.forEach((row, ri) => {
      const rh = (innerH * weights[ri]) / totalW
      const units = row.reduce((a, c) => a + (c.span ?? 1), 0)
      let x = p.x + PAD_X
      for (const c of row) {
        const cw = (innerW * (c.span ?? 1)) / units
        if (c.kind !== 'blank') {
          const cx = x + 3, cy = y + 3, w = cw - 6, h = rh - 6
          out.push({ ...c, panel: p.id, x: cx, y: cy, w, h, cx: cx + w / 2, cy: cy + (h - 13) / 2 })
        }
        x += cw
      }
      y += rh
    })
  }
  return out
}

function get(ac: Aircraft) {
  let v = cache.get(ac)
  if (!v) {
    const list = compute(ac)
    v = { list, map: new Map(list.map(c => [c.id, c])) }
    cache.set(ac, v)
  }
  return v
}

export const controlsOf = (ac: Aircraft) => get(ac).list
export const controlById = (ac: Aircraft, id: string) => get(ac).map.get(id)

/** Divide un camino suave (Catmull-Rom) en segmentos independientes */
export function smoothSegments(p: Pt[]): string[] {
  const segs: string[] = []
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    segs.push(`M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`)
  }
  return segs
}
