import type { Aircraft, Role, Step } from './types'
import type { Badge, Layer } from './components/Cockpit'
import { controlById } from './layout'

export const roleColor = (roles: Role[], r?: string) => roles.find(x => x.id === r)?.color ?? roles[0]?.color ?? '#38bdf8'

/** Construye trazados por rol e insignias numeradas para los primeros `count` pasos */
export function buildViz(ac: Aircraft, steps: Step[], count: number, opts: { animateLast?: boolean; dashed?: boolean; dim?: boolean; numbers?: number[] } = {}) {
  const byRole = new Map<string, { x: number; y: number }[]>()
  const badges: Badge[] = []
  const seen = new Map<string, number>()
  const r = Math.max(11, ac.viewBox[0] / 110)
  steps.slice(0, count).forEach((s, i) => {
    const c = controlById(ac, s.c)
    if (!c) return
    const role = s.r ?? ac.roles[0]?.id ?? 'P'
    if (!byRole.has(role)) byRole.set(role, [])
    byRole.get(role)!.push({ x: c.cx, y: c.cy })
    const k = seen.get(c.id) ?? 0
    seen.set(c.id, k + 1)
    badges.push({ x: c.x + c.w - r * 0.6 - k * (r * 2 + 2), y: c.y + r * 0.6, text: String(opts.numbers?.[i] ?? i + 1), color: roleColor(ac.roles, role), dim: opts.dim })
  })
  const layers: Layer[] = [...byRole].map(([role, pts]) => ({ color: roleColor(ac.roles, role), pts, animateLast: opts.animateLast, dashed: opts.dashed }))
  return { layers, badges }
}
