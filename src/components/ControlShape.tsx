import type { Control } from '../types'

/* ───────────── utilidades geométricas ───────────── */

/** Ángulo en grados: 0 = las 12, sentido horario */
const pol = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
}
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = pol(cx, cy, r, a0), p1 = pol(cx, cy, r, a1)
  return `M${p0.x},${p0.y} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1.x},${p1.y}`
}
const FONT = 'ui-sans-serif, "Helvetica Neue", Arial, sans-serif'
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace'

function Ticks({ cx, cy, r0, r1, from, to, n, w = 1, color = '#f1f5f9' }: { cx: number; cy: number; r0: number; r1: number; from: number; to: number; n: number; w?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={w}>
      {Array.from({ length: n + 1 }, (_, i) => {
        const a = from + ((to - from) * i) / n
        const p0 = pol(cx, cy, r0, a), p1 = pol(cx, cy, r1, a)
        return <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} />
      })}
    </g>
  )
}
function Nums({ cx, cy, r, items, size, color = '#f8fafc' }: { cx: number; cy: number; r: number; items: [string, number][]; size: number; color?: string }) {
  return (
    <g fill={color} fontSize={size} fontFamily={FONT} fontWeight={700} textAnchor="middle">
      {items.map(([t, a]) => { const p = pol(cx, cy, r, a); return <text key={t + a} x={p.x} y={p.y + size * 0.36}>{t}</text> })}
    </g>
  )
}
function Needle({ cx, cy, r, deg, w = 0.07, color = '#fff' }: { cx: number; cy: number; r: number; deg: number; w?: number; color?: string }) {
  const tip = pol(cx, cy, r, deg), back = pol(cx, cy, r * 0.18, deg + 180)
  const l = pol(cx, cy, r * w * 1.4, deg - 90), rr = pol(cx, cy, r * w * 1.4, deg + 90)
  return <polygon points={`${tip.x},${tip.y} ${l.x},${l.y} ${back.x},${back.y} ${rr.x},${rr.y}`} fill={color} filter="url(#f-soft)" />
}

/* ───────────── instrumentos redondos ───────────── */

function Bezel({ cx, cy, r, children }: { cx: number; cy: number; r: number; children: React.ReactNode }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#g-bezel)" filter="url(#f-shadow)" />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="#050506" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="url(#g-face)" />
      {children}
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.38} rx={r * 0.55} ry={r * 0.32} fill="url(#g-glass)" transform={`rotate(-25 ${cx} ${cy})`} pointerEvents="none" />
      {[45, 135, 225, 315].map(a => { const p = pol(cx, cy, r * 0.95, a); return <circle key={a} cx={p.x} cy={p.y} r={r * 0.035} fill="#9ca3af" /> })}
    </g>
  )
}

function faceOf(c: Control) {
  const id = c.id.toLowerCase(), l = c.label.toUpperCase()
  if (id === 'asi') return 'asi'
  if (id === 'ai') return 'ai'
  if (id === 'alt') return 'alt'
  if (id === 'tc') return 'tc'
  if (id === 'hi') return 'hi'
  if (id === 'vsi') return 'vsi'
  if (id.startsWith('cdi')) return 'cdi'
  if (id === 'adf') return 'adf'
  if (id.includes('tach') || id === 'rpm') return 'rpm'
  if (id.includes('clock')) return 'clock'
  if (id === 'map') return 'map'
  if (id.includes('fuel')) return 'fuel'
  if (l.includes('L/R')) return 'dual'
  return 'eng'
}

function Gauge({ c, cx, cy, r }: { c: Control; cx: number; cy: number; r: number }) {
  const f = r * 0.86
  const sz = Math.max(5, f * 0.17)
  switch (faceOf(c)) {
    case 'asi': {
      const A = (k: number) => 20 + (k / 200) * 310
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <path d={arc(cx, cy, f * 0.74, A(40), A(85))} stroke="#f8fafc" strokeWidth={f * 0.07} fill="none" />
          <path d={arc(cx, cy, f * 0.84, A(48), A(129))} stroke="#16a34a" strokeWidth={f * 0.09} fill="none" />
          <path d={arc(cx, cy, f * 0.84, A(129), A(163))} stroke="#eab308" strokeWidth={f * 0.09} fill="none" />
          <Ticks cx={cx} cy={cy} r0={f * 0.78} r1={f * 0.96} from={A(163)} to={A(163)} n={1} w={f * 0.05} color="#dc2626" />
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.97} from={A(40)} to={A(200)} n={16} w={1.2} />
          <Nums cx={cx} cy={cy} r={f * 0.58} size={sz} items={[40, 60, 80, 100, 120, 140, 160].map(k => [String(k), A(k)])} />
          <text x={cx} y={cy + f * 0.32} textAnchor="middle" fill="#cbd5e1" fontSize={sz * 0.6} fontFamily={FONT}>KNOTS</text>
          <Needle cx={cx} cy={cy} r={f * 0.85} deg={A(0)} />
          <circle cx={cx} cy={cy} r={f * 0.08} fill="#111" stroke="#555" />
        </Bezel>
      )
    }
    case 'ai': {
      const id = `ai-${c.id}`
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <clipPath id={id}><circle cx={cx} cy={cy} r={f * 0.97} /></clipPath>
          <g clipPath={`url(#${id})`}>
            <rect x={cx - f} y={cy - f} width={f * 2} height={f} fill="url(#g-sky)" />
            <rect x={cx - f} y={cy} width={f * 2} height={f} fill="url(#g-ground)" />
            <line x1={cx - f} x2={cx + f} y1={cy} y2={cy} stroke="#fff" strokeWidth={1.5} />
            {[-2, -1, 1, 2].map(i => <line key={i} x1={cx - f * (i % 2 ? 0.15 : 0.28)} x2={cx + f * (i % 2 ? 0.15 : 0.28)} y1={cy + i * f * 0.16} y2={cy + i * f * 0.16} stroke="#fff" strokeWidth={1} />)}
            {[-1, 1].map(s => <line key={s} x1={cx} y1={cy} x2={cx + s * f} y2={cy + f * 1.1} stroke="#fff" strokeWidth={0.8} opacity={0.6} />)}
          </g>
          <Ticks cx={cx} cy={cy} r0={f * 0.8} r1={f * 0.95} from={-60} to={60} n={4} w={1.4} />
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.95} from={-20} to={20} n={4} w={1} />
          <polygon points={`${cx},${cy - f * 0.8} ${cx - f * 0.06},${cy - f * 0.94} ${cx + f * 0.06},${cy - f * 0.94}`} fill="#f97316" />
          <path d={`M${cx - f * 0.55},${cy} h${f * 0.3} l${f * 0.12},${f * 0.12} l${f * 0.13},-${f * 0.12} h${f * 0.3}`} stroke="#f97316" strokeWidth={f * 0.07} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={f * 0.04} fill="#f97316" />
        </Bezel>
      )
    }
    case 'alt':
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.97} from={0} to={360} n={50} w={0.9} />
          <Ticks cx={cx} cy={cy} r0={f * 0.78} r1={f * 0.97} from={0} to={360} n={10} w={1.8} />
          <Nums cx={cx} cy={cy} r={f * 0.62} size={sz * 1.05} items={Array.from({ length: 10 }, (_, i) => [String(i), i * 36] as [string, number])} />
          <rect x={cx + f * 0.18} y={cy - f * 0.09} width={f * 0.42} height={f * 0.18} rx={2} fill="#000" stroke="#555" />
          <text x={cx + f * 0.39} y={cy + f * 0.05} textAnchor="middle" fill="#f8fafc" fontSize={sz * 0.7} fontFamily={MONO}>1013</text>
          <text x={cx} y={cy - f * 0.3} textAnchor="middle" fill="#cbd5e1" fontSize={sz * 0.55} fontFamily={FONT}>ALT · FEET</text>
          <Needle cx={cx} cy={cy} r={f * 0.5} deg={45} w={0.16} />
          <Needle cx={cx} cy={cy} r={f * 0.85} deg={90} w={0.06} />
          <circle cx={cx} cy={cy} r={f * 0.07} fill="#111" stroke="#555" />
        </Bezel>
      )
    case 'tc':
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.75} r1={f * 0.92} from={-90} to={-90} n={1} w={2.5} />
          <Ticks cx={cx} cy={cy} r0={f * 0.75} r1={f * 0.92} from={90} to={90} n={1} w={2.5} />
          <Ticks cx={cx} cy={cy} r0={f * 0.75} r1={f * 0.92} from={-110} to={-110} n={1} w={2.5} />
          <Ticks cx={cx} cy={cy} r0={f * 0.75} r1={f * 0.92} from={110} to={110} n={1} w={2.5} />
          <text x={cx - f * 0.62} y={cy + f * 0.42} fill="#f8fafc" fontSize={sz} fontFamily={FONT} fontWeight={700}>L</text>
          <text x={cx + f * 0.5} y={cy + f * 0.42} fill="#f8fafc" fontSize={sz} fontFamily={FONT} fontWeight={700}>R</text>
          <path d={`M${cx - f * 0.7},${cy} h${f * 1.4} M${cx},${cy - f * 0.12} v${f * 0.24}`} stroke="#f8fafc" strokeWidth={f * 0.06} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={f * 0.1} fill="#f8fafc" />
          <path d={arc(cx, cy - f * 0.4, f * 0.95, 160, 200)} stroke="#e5e7eb" strokeWidth={f * 0.17} fill="none" opacity={0.9} />
          <circle cx={cx} cy={cy + f * 0.55} r={f * 0.07} fill="#111" />
          <text x={cx} y={cy - f * 0.35} textAnchor="middle" fill="#cbd5e1" fontSize={sz * 0.55} fontFamily={FONT}>2 MIN</text>
        </Bezel>
      )
    case 'hi':
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.96} from={0} to={360} n={72} w={0.8} />
          <Ticks cx={cx} cy={cy} r0={f * 0.8} r1={f * 0.96} from={0} to={360} n={12} w={1.6} />
          <Nums cx={cx} cy={cy} r={f * 0.66} size={sz} items={[['N', 0], ['3', 30], ['6', 60], ['E', 90], ['12', 120], ['15', 150], ['S', 180], ['21', 210], ['24', 240], ['W', 270], ['30', 300], ['33', 330]]} />
          <path d={`M${cx},${cy - f * 0.38} v${f * 0.7} M${cx - f * 0.3},${cy} h${f * 0.6} M${cx - f * 0.13},${cy + f * 0.28} h${f * 0.26}`} stroke="#f97316" strokeWidth={f * 0.06} strokeLinecap="round" />
          <polygon points={`${cx},${cy - f * 0.97} ${cx - f * 0.05},${cy - f * 1.06} ${cx + f * 0.05},${cy - f * 1.06}`} fill="#f97316" />
        </Bezel>
      )
    case 'cdi':
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.97} from={0} to={360} n={36} w={0.8} />
          <Nums cx={cx} cy={cy} r={f * 0.74} size={sz * 0.75} items={[['N', 0], ['3', 30], ['6', 60], ['E', 90], ['12', 120], ['15', 150], ['S', 180], ['21', 210], ['24', 240], ['W', 270], ['30', 300], ['33', 330]]} />
          <circle cx={cx} cy={cy} r={f * 0.56} fill="#0b0c0e" stroke="#475569" strokeWidth={0.8} />
          {[-4, -3, -2, -1, 1, 2, 3, 4].map(i => <circle key={'h' + i} cx={cx + i * f * 0.11} cy={cy} r={f * 0.025} fill="#f1f5f9" />)}
          {[-4, -3, -2, -1, 1, 2, 3, 4].map(i => <circle key={'v' + i} cx={cx} cy={cy + i * f * 0.11} r={f * 0.025} fill="#f1f5f9" />)}
          <circle cx={cx} cy={cy} r={f * 0.06} fill="none" stroke="#f1f5f9" strokeWidth={1} />
          <line x1={cx + f * 0.12} x2={cx + f * 0.12} y1={cy - f * 0.5} y2={cy + f * 0.5} stroke="#f8fafc" strokeWidth={Math.max(1.5, f * 0.04)} />
          <line x1={cx - f * 0.5} x2={cx + f * 0.5} y1={cy - f * 0.08} y2={cy - f * 0.08} stroke="#f8fafc" strokeWidth={Math.max(1.5, f * 0.04)} />
          <rect x={cx - f * 0.42} y={cy + f * 0.18} width={f * 0.22} height={f * 0.12} fill="#dc2626" />
          <text x={cx - f * 0.31} y={cy + f * 0.27} textAnchor="middle" fill="#fff" fontSize={sz * 0.45} fontFamily={FONT} fontWeight={800}>NAV</text>
          <polygon points={`${cx},${cy - f * 0.97} ${cx - f * 0.05},${cy - f * 1.06} ${cx + f * 0.05},${cy - f * 1.06}`} fill="#f8fafc" />
          <circle cx={cx - f * 0.78} cy={cy + f * 0.78} r={f * 0.13} fill="url(#g-knob)" stroke="#000" />
          <text x={cx - f * 0.78} y={cy + f * 0.82} textAnchor="middle" fill="#cbd5e1" fontSize={sz * 0.4} fontFamily={FONT}>OBS</text>
        </Bezel>
      )
    case 'adf':
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.84} r1={f * 0.97} from={0} to={360} n={72} w={0.8} />
          <Nums cx={cx} cy={cy} r={f * 0.68} size={sz * 0.8} items={[['N', 0], ['3', 30], ['6', 60], ['E', 90], ['12', 120], ['15', 150], ['S', 180], ['21', 210], ['24', 240], ['W', 270], ['30', 300], ['33', 330]]} />
          <Needle cx={cx} cy={cy} r={f * 0.82} deg={35} w={0.06} color="#fbbf24" />
          <Needle cx={cx} cy={cy} r={f * 0.5} deg={215} w={0.06} color="#fbbf24" />
          <path d={`M${cx},${cy - f * 0.2} v${f * 0.4} M${cx - f * 0.18},${cy} h${f * 0.36}`} stroke="#f97316" strokeWidth={f * 0.05} strokeLinecap="round" />
        </Bezel>
      )
    case 'vsi': {
      const A = (v: number) => 270 + v * 8
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.84} r1={f * 0.96} from={A(-20)} to={A(20)} n={20} w={1} />
          <Nums cx={cx} cy={cy} r={f * 0.64} size={sz} items={[['0', A(0)], ['5', A(5)], ['10', A(10)], ['15', A(15)], ['20', A(20)], ['5', A(-5)], ['10', A(-10)], ['15', A(-15)]]} />
          <text x={cx + f * 0.1} y={cy - f * 0.2} fill="#cbd5e1" fontSize={sz * 0.5} fontFamily={FONT}>UP</text>
          <text x={cx + f * 0.1} y={cy + f * 0.28} fill="#cbd5e1" fontSize={sz * 0.5} fontFamily={FONT}>DN</text>
          <Needle cx={cx} cy={cy} r={f * 0.85} deg={A(0)} />
          <circle cx={cx} cy={cy} r={f * 0.07} fill="#111" stroke="#555" />
        </Bezel>
      )
    }
    case 'rpm': {
      const A = (k: number) => -130 + (k / 35) * 260
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <path d={arc(cx, cy, f * 0.86, A(21), A(27))} stroke="#16a34a" strokeWidth={f * 0.09} fill="none" />
          <Ticks cx={cx} cy={cy} r0={f * 0.78} r1={f * 0.96} from={A(27)} to={A(27)} n={1} w={f * 0.05} color="#dc2626" />
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.97} from={A(0)} to={A(35)} n={35} w={0.8} />
          <Nums cx={cx} cy={cy} r={f * 0.62} size={sz} items={[0, 5, 10, 15, 20, 25, 30, 35].map(k => [String(k), A(k)])} />
          <text x={cx} y={cy + f * 0.35} textAnchor="middle" fill="#cbd5e1" fontSize={sz * 0.55} fontFamily={FONT}>RPM × 100</text>
          <Needle cx={cx} cy={cy} r={f * 0.85} deg={A(0)} />
          <circle cx={cx} cy={cy} r={f * 0.08} fill="#111" stroke="#555" />
        </Bezel>
      )
    }
    case 'map': {
      const A = (k: number) => -130 + ((k - 10) / 30) * 260
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <path d={arc(cx, cy, f * 0.86, A(15), A(34))} stroke="#16a34a" strokeWidth={f * 0.09} fill="none" />
          <Ticks cx={cx} cy={cy} r0={f * 0.86} r1={f * 0.97} from={A(10)} to={A(40)} n={30} w={0.8} />
          <Nums cx={cx} cy={cy} r={f * 0.62} size={sz} items={[10, 15, 20, 25, 30, 35, 40].map(k => [String(k), A(k)])} />
          <text x={cx} y={cy + f * 0.35} textAnchor="middle" fill="#cbd5e1" fontSize={sz * 0.55} fontFamily={FONT}>MAN PRESS</text>
          <Needle cx={cx} cy={cy} r={f * 0.82} deg={A(29.9)} color="#e5e7eb" />
          <Needle cx={cx} cy={cy} r={f * 0.7} deg={A(29.9) + 3} color="#fbbf24" />
          <circle cx={cx} cy={cy} r={f * 0.08} fill="#111" stroke="#555" />
        </Bezel>
      )
    }
    case 'clock':
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          <Ticks cx={cx} cy={cy} r0={f * 0.84} r1={f * 0.96} from={0} to={360} n={12} w={1.6} />
          <Nums cx={cx} cy={cy} r={f * 0.66} size={sz} items={[['12', 0], ['3', 90], ['6', 180], ['9', 270]]} />
          <Needle cx={cx} cy={cy} r={f * 0.5} deg={300} w={0.14} />
          <Needle cx={cx} cy={cy} r={f * 0.8} deg={60} w={0.07} />
        </Bezel>
      )
    default: {
      const dual = faceOf(c) === 'dual'
      const fuel = faceOf(c) === 'fuel'
      const A = (p: number) => -120 + p * 240
      const short = c.label.replace('L/R', '').trim().split(/\s+/).slice(0, 2).join(' ')
      return (
        <Bezel cx={cx} cy={cy} r={r}>
          {!fuel && <path d={arc(cx, cy, f * 0.86, A(0.35), A(0.78))} stroke="#16a34a" strokeWidth={f * 0.1} fill="none" />}
          {!fuel && <path d={arc(cx, cy, f * 0.86, A(0.78), A(0.88))} stroke="#eab308" strokeWidth={f * 0.1} fill="none" />}
          {fuel && <path d={arc(cx, cy, f * 0.86, A(0), A(0.12))} stroke="#eab308" strokeWidth={f * 0.1} fill="none" />}
          <Ticks cx={cx} cy={cy} r0={f * 0.72} r1={f * 0.97} from={A(0.9)} to={A(0.9)} n={1} w={f * 0.05} color="#dc2626" />
          <Ticks cx={cx} cy={cy} r0={f * 0.8} r1={f * 0.97} from={A(0)} to={A(1)} n={8} w={1} />
          {fuel
            ? <Nums cx={cx} cy={cy} r={f * 0.58} size={sz * 0.85} items={[['E', A(0)], ['½', A(0.5)], ['F', A(1)]]} />
            : <Nums cx={cx} cy={cy} r={f * 0.58} size={sz * 0.75} items={[['0', A(0)], ['50', A(0.5)], ['100', A(1)]]} />}
          <text x={cx} y={cy + f * 0.42} textAnchor="middle" fill="#cbd5e1" fontSize={Math.min(sz * 0.6, (f * 1.2) / Math.max(4, short.length) * 1.6)} fontFamily={FONT} fontWeight={600}>{short}</text>
          {dual ? (
            <>
              <Needle cx={cx} cy={cy} r={f * 0.8} deg={A(0.02)} />
              <Needle cx={cx} cy={cy} r={f * 0.68} deg={A(0.05)} color="#fbbf24" />
            </>
          ) : <Needle cx={cx} cy={cy} r={f * 0.8} deg={A(fuel ? 0.72 : 0.02)} />}
          <circle cx={cx} cy={cy} r={f * 0.08} fill="#111" stroke="#555" />
        </Bezel>
      )
    }
  }
}

/* ───────────── pantallas y equipos ───────────── */

function dispOf(c: Control) {
  const id = c.id.toLowerCase(), l = c.label.toUpperCase()
  if (id.startsWith('pfd') || id === 'isis' || id === 'isfd') return 'pfd'
  if (l === 'ND' || l.startsWith('ND ')) return 'nd'
  if (id === 'ewd' || id === 'upperdu') return 'eicas'
  if (id === 'lowerdu') return 'eicas2'
  if (id.includes('cdu')) return 'cdu'
  if (/efb|techlog|logbook|docs/.test(id)) return 'tablet'
  if (id.startsWith('oxy')) return 'oxy'
  if (id.startsWith('efis')) return 'efis'
  if (id === 'hobbs') return 'counter'
  if (/fltalt|landalt|elecmeters/.test(id)) return 'digits'
  if (id === 'gps') return 'gps'
  if (id === 'wxr') return 'wxr'
  return 'radio'
}

function Screen({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: React.ReactNode }) {
  const b = Math.max(4, Math.min(w, h) * 0.06)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={b} fill="url(#g-bezelFlat)" filter="url(#f-shadow)" />
      <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} rx={2} fill="#020304" />
      <svg x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} overflow="hidden">{children}</svg>
      <rect x={x + b} y={y + b} width={w - 2 * b} height={(h - 2 * b) * 0.45} fill="url(#g-glassFlat)" pointerEvents="none" />
    </g>
  )
}

function Pfd({ w, h, id }: { w: number; h: number; id: string }) {
  const ax = w * 0.22, aw = w * 0.56, ay = h * 0.14, ah = h * 0.62
  const cx = ax + aw / 2, cy = ay + ah / 2
  const fs = Math.max(5, Math.min(w, h) * 0.055)
  return (
    <g fontFamily={MONO}>
      <clipPath id={`pfd-${id}`}><rect x={ax} y={ay} width={aw} height={ah} rx={6} /></clipPath>
      <g clipPath={`url(#pfd-${id})`}>
        <rect x={ax} y={ay} width={aw} height={ah / 2} fill="url(#g-sky)" />
        <rect x={ax} y={cy} width={aw} height={ah / 2} fill="url(#g-ground)" />
        <line x1={ax} x2={ax + aw} y1={cy} y2={cy} stroke="#fff" strokeWidth={1.2} />
        {[-2, -1, 1, 2].map(i => <line key={i} x1={cx - aw * (i % 2 ? 0.08 : 0.16)} x2={cx + aw * (i % 2 ? 0.08 : 0.16)} y1={cy + i * ah * 0.12} y2={cy + i * ah * 0.12} stroke="#fff" strokeWidth={0.9} />)}
      </g>
      <path d={`M${cx - aw * 0.3},${cy} h${aw * 0.18} v${ah * 0.05} M${cx + aw * 0.3},${cy} h-${aw * 0.18} v${ah * 0.05}`} stroke="#fde047" strokeWidth={Math.max(2, w * 0.012)} fill="none" />
      <rect x={cx - 2} y={cy - 2} width={4} height={4} fill="#fde047" />
      <path d={arc(cx, cy, ah * 0.45, -45, 45)} stroke="#fff" strokeWidth={1} fill="none" />
      {/* cinta de velocidad */}
      <rect x={w * 0.03} y={ay} width={w * 0.14} height={ah} fill="#3f4651" />
      {[0, 1, 2, 3, 4].map(i => <text key={i} x={w * 0.13} y={ay + ah * (0.12 + i * 0.2)} textAnchor="end" fill="#fff" fontSize={fs}>{(160 - i * 20).toString()}</text>)}
      <rect x={w * 0.03} y={cy - fs * 0.8} width={w * 0.15} height={fs * 1.6} fill="#000" stroke="#fff" strokeWidth={0.8} />
      <text x={w * 0.13} y={cy + fs * 0.35} textAnchor="end" fill="#fff" fontSize={fs * 1.05}>0</text>
      {/* cinta de altitud */}
      <rect x={w * 0.81} y={ay} width={w * 0.15} height={ah} fill="#3f4651" />
      {[0, 1, 2, 3, 4].map(i => <text key={i} x={w * 0.84} y={ay + ah * (0.12 + i * 0.2)} fill="#fff" fontSize={fs}>{(200 - i * 100 + 100).toString().padStart(3, '0')}</text>)}
      <rect x={w * 0.8} y={cy - fs * 0.8} width={w * 0.17} height={fs * 1.6} fill="#000" stroke="#fff" strokeWidth={0.8} />
      <text x={w * 0.83} y={cy + fs * 0.35} fill="#fff" fontSize={fs * 1.05}>1250</text>
      {/* FMA */}
      {[0, 1, 2, 3].map(i => <rect key={i} x={w * (0.2 + i * 0.15)} y={h * 0.02} width={w * 0.14} height={h * 0.09} fill="none" stroke="#475569" strokeWidth={0.6} />)}
      <text x={w * 0.27} y={h * 0.085} textAnchor="middle" fill="#22c55e" fontSize={fs * 0.85}>ARM</text>
      {/* rumbo */}
      <path d={arc(cx, h * 1.25, h * 0.42, -38, 38)} stroke="#fff" fill="#3f4651" strokeWidth={0.8} />
      <text x={cx} y={h * 0.93} textAnchor="middle" fill="#fff" fontSize={fs}>36</text>
    </g>
  )
}

function Nd({ w, h }: { w: number; h: number }) {
  const cx = w / 2, cy = h * 0.88, r = h * 0.72
  const fs = Math.max(5, Math.min(w, h) * 0.055)
  return (
    <g fontFamily={MONO}>
      <path d={arc(cx, cy, r, -55, 55)} stroke="#fff" fill="none" strokeWidth={1.2} />
      <Ticks cx={cx} cy={cy} r0={r} r1={r * 0.94} from={-55} to={55} n={22} w={0.8} />
      <Nums cx={cx} cy={cy} r={r * 0.86} size={fs} items={[['33', -30], ['36', 0], ['3', 30]]} />
      <path d={arc(cx, cy, r * 0.5, -55, 55)} stroke="#fff" fill="none" strokeWidth={0.7} strokeDasharray="3 4" />
      <path d={`M${cx},${cy} L${cx + w * 0.12},${cy - r * 0.55} L${cx + w * 0.05},${cy - r * 0.95}`} stroke="#e879f9" strokeWidth={Math.max(1.5, w * 0.01)} fill="none" />
      <path d={`M${cx + w * 0.12 - 4},${cy - r * 0.55} l4,-4 l4,4 l-4,4z`} fill="none" stroke="#e879f9" />
      <text x={cx + w * 0.15} y={cy - r * 0.55} fill="#e879f9" fontSize={fs * 0.9}>LEMD</text>
      <polygon points={`${cx},${cy - 10} ${cx - 6},${cy + 4} ${cx + 6},${cy + 4}`} fill="none" stroke="#fff" strokeWidth={1.4} />
      <text x={w * 0.04} y={fs * 1.3} fill="#fff" fontSize={fs * 0.8}>GS <tspan fill="#22c55e">0</tspan> TAS <tspan fill="#22c55e">0</tspan></text>
      <text x={w * 0.96} y={fs * 1.3} textAnchor="end" fill="#e879f9" fontSize={fs * 0.85}>RW36L</text>
      <text x={w * 0.96} y={fs * 2.5} textAnchor="end" fill="#fff" fontSize={fs * 0.8}>0.0 NM</text>
    </g>
  )
}

function Eicas({ w, h, secondary }: { w: number; h: number; secondary?: boolean }) {
  const fs = Math.max(5, Math.min(w, h) * 0.06)
  const r = Math.min(w * 0.14, h * 0.2)
  const dial = (cx: number, cy: number, lab: string) => (
    <g key={cx + lab}>
      <path d={arc(cx, cy, r, -120, 90)} stroke="#e5e7eb" strokeWidth={1.4} fill="none" />
      <Ticks cx={cx} cy={cy} r0={r} r1={r * 0.85} from={90} to={90} n={1} w={2} color="#ef4444" />
      <line x1={cx} y1={cy} x2={pol(cx, cy, r * 0.9, -115).x} y2={pol(cx, cy, r * 0.9, -115).y} stroke="#e5e7eb" strokeWidth={1.6} />
      <rect x={cx + r * 0.1} y={cy - r * 0.95} width={r * 1.1} height={fs * 1.3} fill="#000" stroke="#94a3b8" strokeWidth={0.6} />
      <text x={cx + r * 1.12} y={cy - r * 0.95 + fs * 1.05} textAnchor="end" fill="#e5e7eb" fontSize={fs}>0.0</text>
      <text x={cx} y={cy + r * 0.55} textAnchor="middle" fill="#22d3ee" fontSize={fs * 0.75}>{lab}</text>
    </g>
  )
  const top = h * 0.32, bot = h * 0.72
  return (
    <g fontFamily={MONO}>
      {secondary
        ? <>{dial(w * 0.25, top, 'N2')}{dial(w * 0.65, top, 'N2')}{dial(w * 0.25, bot, 'OIL P')}{dial(w * 0.65, bot, 'OIL P')}</>
        : <>{dial(w * 0.18, top, 'N1')}{dial(w * 0.48, top, 'N1')}{dial(w * 0.18, bot, 'EGT')}{dial(w * 0.48, bot, 'EGT')}
          <text x={w * 0.72} y={h * 0.2} fill="#e5e7eb" fontSize={fs * 0.9}>FUEL</text>
          <text x={w * 0.72} y={h * 0.32} fill="#22c55e" fontSize={fs}>4.2 <tspan fill="#94a3b8">KG</tspan></text>
          <text x={w * 0.72} y={h * 0.55} fill="#f59e0b" fontSize={fs * 0.85}>DOORS</text>
          <text x={w * 0.72} y={h * 0.67} fill="#22d3ee" fontSize={fs * 0.85}>PARK BRK</text></>}
    </g>
  )
}

function Cdu({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const sh = h * 0.42, b = Math.max(4, w * 0.04)
  const fs = Math.max(4, Math.min(w * 0.045, sh * 0.1))
  const lines = ['     IDENT     1/2', 'MODEL      ENGINES', '737-800W  26K', 'NAV DATA   ACTIVE', 'WEU2410   OCT08', '', '<INDEX   POS INIT>']
  const keys = []
  const kx = x + w * 0.1, ky = y + sh + b * 2.4, kw = w * 0.8, kh = h - sh - b * 3.5
  const cols = 9, rows = 6
  for (let r = 0; r < rows; r++) for (let c2 = 0; c2 < cols; c2++) {
    keys.push(<rect key={`${r}-${c2}`} x={kx + (c2 * kw) / cols + 1} y={ky + (r * kh) / rows + 1} width={Math.max(1, kw / cols - 2)} height={Math.max(1, kh / rows - 2)} rx={1.5} fill={r < 2 ? '#3a3f46' : '#2a2e33'} stroke="#111" strokeWidth={0.5} />)
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="url(#g-bezelFlat)" filter="url(#f-shadow)" />
      <rect x={x + w * 0.12} y={y + b} width={w * 0.76} height={sh} rx={2} fill="#020304" />
      {lines.map((t, i) => <text key={i} x={x + w * 0.14} y={y + b + fs * 1.4 + i * (sh - fs) / lines.length} fill={i % 2 ? '#e5e7eb' : '#22c55e'} fontSize={fs} fontFamily={MONO} xmlSpace="preserve">{t}</text>)}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i < 6 ? x + w * 0.03 : x + w * 0.9} y={y + b + (sh * ((i % 6) + 0.5)) / 6 - 3} width={w * 0.07} height={6} rx={1} fill="#3a3f46" />
      ))}
      {keys}
    </g>
  )
}

function Radio({ x, y, w, h, c }: { x: number; y: number; w: number; h: number; c: Control }) {
  const fs = Math.max(6, Math.min(h * 0.3, w * 0.07))
  const id = c.id.toLowerCase()
  const big = /audio|acp/.test(id)
  const nb = Math.max(4, Math.floor(w / 22))
  const val = id.includes('xpdr') ? ['7000', 'ALT'] : id.includes('adf') ? ['0350', '0415'] : id === 'ap' ? ['ROL', 'ALT'] : ['118.700', '121.500']
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="url(#g-avionics)" filter="url(#f-shadow)" />
      {[[x + 4, y + 4], [x + w - 4, y + 4], [x + 4, y + h - 4], [x + w - 4, y + h - 4]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={1.6} fill="#777" />)}
      {big ? (
        Array.from({ length: nb }, (_, i) => (
          <g key={i}>
            <rect x={x + 8 + (i * (w - 16)) / nb} y={y + h * 0.25} width={(w - 16) / nb - 4} height={h * 0.5} rx={2} fill="#1d2024" stroke="#000" />
            <rect x={x + 10 + (i * (w - 16)) / nb} y={y + h * 0.3} width={(w - 16) / nb - 8} height={2} fill={i % 3 === 0 ? '#22c55e' : '#374151'} />
          </g>
        ))
      ) : (
        <>
          <rect x={x + w * 0.06} y={y + h * 0.2} width={w * 0.6} height={h * 0.6} rx={2} fill="#000" />
          <text x={x + w * 0.09} y={y + h * 0.5 + fs * 0.35} fill="#fbbf24" fontSize={fs} fontFamily={MONO}>{val[0]}</text>
          <text x={x + w * 0.63} y={y + h * 0.5 + fs * 0.35} textAnchor="end" fill="#22d3ee" fontSize={fs * 0.8} fontFamily={MONO}>{val[1]}</text>
          <circle cx={x + w * 0.83} cy={y + h / 2} r={Math.min(h * 0.32, w * 0.09)} fill="url(#g-knob)" stroke="#000" />
          <circle cx={x + w * 0.83} cy={y + h / 2} r={Math.min(h * 0.18, w * 0.05)} fill="url(#g-knob)" stroke="#000" />
        </>
      )}
    </g>
  )
}

function Display({ c, x, y, w, h }: { c: Control; x: number; y: number; w: number; h: number }) {
  const t = dispOf(c)
  const ih = h - Math.max(4, Math.min(w, h) * 0.06) * 2, iw = w - Math.max(4, Math.min(w, h) * 0.06) * 2
  switch (t) {
    case 'pfd': return <Screen x={x} y={y} w={w} h={h}><Pfd w={iw} h={ih} id={c.id} /></Screen>
    case 'nd': return <Screen x={x} y={y} w={w} h={h}><Nd w={iw} h={ih} /></Screen>
    case 'eicas': return <Screen x={x} y={y} w={w} h={h}><Eicas w={iw} h={ih} /></Screen>
    case 'eicas2': return <Screen x={x} y={y} w={w} h={h}><Eicas w={iw} h={ih} secondary /></Screen>
    case 'cdu': return <Cdu x={x} y={y} w={w} h={h} />
    case 'gps':
      return (
        <Screen x={x} y={y} w={w} h={h}>
          <rect width={iw} height={ih} fill="#0c2a1a" />
          <path d={`M0,${ih * 0.7} C${iw * 0.3},${ih * 0.5} ${iw * 0.5},${ih * 0.9} ${iw},${ih * 0.4}`} stroke="#3b82f6" strokeWidth={3} fill="none" opacity={0.7} />
          <path d={`M${iw * 0.2},${ih * 0.8} L${iw * 0.5},${ih * 0.45} L${iw * 0.8},${ih * 0.3}`} stroke="#e879f9" strokeWidth={2} fill="none" />
          <polygon points={`${iw * 0.2},${ih * 0.8 - 8} ${iw * 0.2 - 5},${ih * 0.8 + 4} ${iw * 0.2 + 5},${ih * 0.8 + 4}`} fill="#fff" />
          <rect width={iw} height={Math.max(10, ih * 0.14)} fill="#111827" />
          <text x={4} y={Math.max(8, ih * 0.1)} fill="#22d3ee" fontSize={Math.max(6, ih * 0.09)} fontFamily={MONO}>GS 0KT  DTK 360°  ETE --:--</text>
        </Screen>
      )
    case 'wxr':
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={3} fill="url(#g-avionics)" filter="url(#f-shadow)" />
          {[0.2, 0.42, 0.64].map(p => <circle key={p} cx={x + w * p} cy={y + h * 0.5} r={Math.min(h * 0.22, w * 0.08)} fill="url(#g-knob)" stroke="#000" />)}
          <rect x={x + w * 0.78} y={y + h * 0.3} width={w * 0.14} height={h * 0.4} rx={2} fill="#1d2024" />
        </g>
      )
    case 'tablet':
      return (
        <g>
          <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx={Math.min(10, w * 0.08)} fill="#111" stroke="#3f3f46" filter="url(#f-shadow)" />
          <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={3} fill="#e2e8f0" />
          {Array.from({ length: Math.max(2, Math.floor((h - 24) / 9)) }, (_, i) => <rect key={i} x={x + 14} y={y + 14 + i * 9} width={(w - 28) * (i === 0 ? 0.5 : 0.6 + ((i * 37) % 40) / 100)} height={i === 0 ? 4 : 2.5} fill={i === 0 ? '#1e3a8a' : '#64748b'} />)}
        </g>
      )
    case 'oxy':
      return (
        <g>
          <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={8} fill="#374151" stroke="#111" filter="url(#f-shadow)" />
          <ellipse cx={x + w / 2} cy={y + h * 0.45} rx={w * 0.22} ry={h * 0.22} fill="#fbbf24" stroke="#92400e" />
          <rect x={x + w * 0.3} y={y + h * 0.72} width={w * 0.4} height={h * 0.1} rx={2} fill="#ef4444" />
        </g>
      )
    case 'efis':
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={3} fill="url(#g-avionics)" filter="url(#f-shadow)" />
          {[0.18, 0.5, 0.82].map(p => <circle key={p} cx={x + w * p} cy={y + h * 0.42} r={Math.min(h * 0.26, w * 0.1)} fill="url(#g-knob)" stroke="#000" />)}
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x + w * (0.06 + i * 0.15)} y={y + h * 0.78} width={w * 0.12} height={h * 0.12} rx={1.5} fill="#3a3f46" />)}
        </g>
      )
    case 'counter':
      return (
        <g>
          <rect x={x + 4} y={y + h * 0.2} width={w - 8} height={h * 0.5} rx={3} fill="#111" stroke="#555" filter="url(#f-shadow)" />
          {'01234'.split('').map((d, i) => (
            <g key={i}>
              <rect x={x + 8 + (i * (w - 16)) / 5} y={y + h * 0.25} width={(w - 16) / 5 - 2} height={h * 0.4} fill={i === 4 ? '#f1f5f9' : '#222'} />
              <text x={x + 8 + (i + 0.45) * ((w - 16) / 5)} y={y + h * 0.53} textAnchor="middle" fontSize={Math.min(h * 0.3, w / 8)} fill={i === 4 ? '#111' : '#f1f5f9'} fontFamily={MONO}>{'7' + d}</text>
            </g>
          ))}
        </g>
      )
    case 'digits':
      return (
        <g>
          <rect x={x + 2} y={y + h * 0.15} width={w - 4} height={h * 0.6} rx={2} fill="#000" stroke="#555" filter="url(#f-shadow)" />
          <text x={x + w - 8} y={y + h * 0.56} textAnchor="end" fill="#fb923c" fontSize={Math.min(h * 0.35, w / 6)} fontFamily={MONO}>{c.id === 'landAlt' ? '1980' : c.id === 'fltAlt' ? '37000' : '28.0'}</text>
        </g>
      )
    default:
      return <Radio x={x} y={y} w={w} h={h} c={c} />
  }
}

/* ───────────── mandos ───────────── */

/** Interruptor de palanca (bat-handle) visto de frente, con tuerca hexagonal */
function Toggle({ cx, cy, s, guard }: { cx: number; cy: number; s: number; guard?: boolean }) {
  const hex = Array.from({ length: 6 }, (_, i) => pol(cx, cy, s * 0.42, i * 60 + 30)).map(p => `${p.x},${p.y}`).join(' ')
  return (
    <g>
      <circle cx={cx} cy={cy} r={s * 0.6} fill="rgba(0,0,0,.35)" />
      <polygon points={hex} fill="url(#g-metal)" stroke="#333" strokeWidth={0.6} />
      <circle cx={cx} cy={cy} r={s * 0.22} fill="#1f2937" />
      <path d={`M${cx - s * 0.09},${cy} L${cx - s * 0.16},${cy - s * 1.0} A${s * 0.16},${s * 0.12} 0 0 1 ${cx + s * 0.16},${cy - s * 1.0} L${cx + s * 0.09},${cy} Z`} fill="url(#g-metalH)" stroke="#222" strokeWidth={0.6} filter="url(#f-shadow)" />
      <ellipse cx={cx} cy={cy - s * 1.0} rx={s * 0.16} ry={s * 0.1} fill="#f8fafc" />
      {guard && (
        <g>
          <path d={`M${cx - s * 0.75},${cy + s * 0.5} V${cy - s * 1.25} H${cx + s * 0.75} V${cy + s * 0.5}`} fill="rgba(220,38,38,.25)" stroke="#b91c1c" strokeWidth={s * 0.14} strokeLinejoin="round" />
          {[0, 1, 2].map(i => <line key={i} x1={cx - s * 0.75} x2={cx + s * 0.75} y1={cy - s * (1.05 - i * 0.18)} y2={cy - s * (0.9 - i * 0.18)} stroke="#7f1d1d" strokeWidth={s * 0.06} opacity={0.6} />)}
        </g>
      )}
    </g>
  )
}

function PushButton({ cx, cy, s, c }: { cx: number; cy: number; s: number; c: Control }) {
  const legend = /PUMP|GEN|BLEED|PACK|INV|BAT|HTG|DE-ICE|AI$/.test(c.label) ? ['FAULT', 'OFF'] : /MASTER WARN/.test(c.label) ? ['MASTER', 'WARNING'] : /MASTER CAUT/.test(c.label) ? ['MASTER', 'CAUTION'] : /FIRE WARN/.test(c.label) ? ['FIRE', 'WARN'] : /TEST/.test(c.label) ? ['TEST', ''] : ['', 'ON']
  const warnRed = legend[1] === 'WARNING' || legend[0] === 'FIRE'
  const warnAmber = legend[1] === 'CAUTION'
  const fs = s * 0.2
  return (
    <g>
      <rect x={cx - s / 2 - 2} y={cy - s / 2 - 2} width={s + 4} height={s + 4} rx={3} fill="#0d0f11" />
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={2.5} fill={warnRed ? '#3b0d0d' : warnAmber ? '#3a2a07' : 'url(#g-cap)'} stroke="#000" filter="url(#f-shadow)" />
      <line x1={cx - s * 0.42} x2={cx + s * 0.42} y1={cy} y2={cy} stroke="#000" strokeWidth={0.8} opacity={0.7} />
      <text x={cx} y={cy - s * 0.12} textAnchor="middle" fontSize={fs} fill={warnRed ? '#f87171' : warnAmber ? '#fbbf24' : '#b45309'} opacity={warnRed || warnAmber ? 0.9 : 0.75} fontFamily={FONT} fontWeight={800}>{legend[0]}</text>
      <text x={cx} y={cy + s * 0.3} textAnchor="middle" fontSize={fs} fill={warnRed ? '#f87171' : warnAmber ? '#fbbf24' : '#e5e7eb'} opacity={warnRed || warnAmber ? 0.9 : 0.45} fontFamily={FONT} fontWeight={800}>{legend[1]}</text>
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s * 0.35} rx={2.5} fill="url(#g-glassFlat)" />
    </g>
  )
}

export function ControlShape({ c, showLabel = true, labelColor = '#f1f5f9' }: { c: Control; showLabel?: boolean; labelColor?: string }) {
  const lh = 13
  const bx = c.x, by = c.y, bw = c.w, bh = c.h - lh
  const cx = bx + bw / 2, cy = by + bh / 2
  const r = Math.max(5, Math.min(bw, bh) / 2 - 2)
  let shape: React.ReactNode = null

  switch (c.kind) {
    case 'gauge':
      shape = <Gauge c={c} cx={cx} cy={cy} r={r} />
      break
    case 'display':
      shape = <Display c={c} x={bx + 2} y={by + 2} w={bw - 4} h={bh - 4} />
      break
    case 'toggle':
      shape = <Toggle cx={cx} cy={cy + r * 0.35} s={Math.min(r * 0.9, 18)} />
      break
    case 'guarded':
      shape = <Toggle cx={cx} cy={cy + r * 0.35} s={Math.min(r * 0.85, 17)} guard />
      break
    case 'rocker': {
      const w = Math.min(bw * 0.5, r * 1.1), hh = Math.min(bh * 0.9, r * 1.9)
      const red = /MASTER|BAT/.test(c.label)
      shape = (
        <g filter="url(#f-shadow)">
          <rect x={cx - w / 2 - 2} y={cy - hh / 2 - 2} width={w + 4} height={hh + 4} rx={3} fill="#0a0a0a" />
          <rect x={cx - w / 2} y={cy - hh / 2} width={w} height={hh * 0.55} rx={2} fill={red ? 'url(#g-rockerRed)' : 'url(#g-rockerTop)'} />
          <rect x={cx - w / 2} y={cy + hh * 0.05} width={w} height={hh * 0.45} rx={2} fill={red ? '#5f0f0f' : '#141414'} />
          <text x={cx} y={cy - hh * 0.12} textAnchor="middle" fontSize={Math.min(w * 0.3, 8)} fill="#f8fafc" fontFamily={FONT} fontWeight={800}>ON</text>
        </g>
      )
      break
    }
    case 'push':
      shape = <PushButton cx={cx} cy={cy} s={Math.min(r * 1.75, 36)} c={c} />
      break
    case 'rotary': {
      const rr = Math.min(r * 0.75, 24)
      const bar = rr * 0.38
      shape = (
        <g>
          {[-60, -30, 0, 30, 60].map(d => { const p0 = pol(cx, cy, rr * 1.15, d), p1 = pol(cx, cy, rr * 1.35, d); return <line key={d} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={labelColor} strokeWidth={1.4} /> })}
          <circle cx={cx} cy={cy} r={rr} fill="url(#g-knob)" stroke="#000" filter="url(#f-shadow)" />
          <rect x={cx - bar / 2} y={cy - rr * 1.05} width={bar} height={rr * 2.1} rx={bar / 2} fill="url(#g-knobBar)" stroke="#000" strokeWidth={0.6} transform={`rotate(-30 ${cx} ${cy})`} />
          <line x1={cx} y1={cy - rr * 0.95} x2={cx} y2={cy - rr * 0.35} stroke="#fff" strokeWidth={1.6} transform={`rotate(-30 ${cx} ${cy})`} />
        </g>
      )
      break
    }
    case 'key': {
      const rr = Math.min(r * 0.8, 26)
      shape = (
        <g>
          <circle cx={cx} cy={cy} r={rr * 1.25} fill="#111" />
          {(['OFF', 'R', 'L', 'BOTH', 'START'] as const).map((t, i) => { const p = pol(cx, cy, rr * 1.55, -70 + i * 35); return <text key={t} x={p.x} y={p.y + 3} textAnchor="middle" fontSize={Math.max(6, rr * 0.28)} fill={labelColor} fontFamily={FONT} fontWeight={700}>{t}</text> })}
          <circle cx={cx} cy={cy} r={rr} fill="url(#g-metal)" stroke="#333" filter="url(#f-shadow)" />
          <rect x={cx - rr * 0.12} y={cy - rr * 0.75} width={rr * 0.24} height={rr * 1.5} rx={2} fill="#111" transform={`rotate(-70 ${cx} ${cy})`} />
        </g>
      )
      break
    }
    case 'knob': {
      const rr = Math.min(r * 0.62, 17)
      const red = c.color === '#b91c1c'
      const ribs = red ? Array.from({ length: 16 }, (_, i) => { const p0 = pol(cx, cy, rr * 0.7, i * 22.5), p1 = pol(cx, cy, rr, i * 22.5); return <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#450a0a" strokeWidth={1} /> }) : null
      shape = (
        <g>
          <circle cx={cx} cy={cy} r={rr * 1.25} fill="url(#g-metal)" stroke="#222" />
          <circle cx={cx} cy={cy} r={rr * 1.02} fill="#000" opacity={0.5} />
          <circle cx={cx} cy={cy} r={rr} fill={red ? 'url(#g-knobRed)' : 'url(#g-knob)'} stroke="#000" filter="url(#f-shadow)" />
          {ribs}
          <circle cx={cx - rr * 0.3} cy={cy - rr * 0.3} r={rr * 0.3} fill="rgba(255,255,255,.18)" />
        </g>
      )
      break
    }
    case 'lever': {
      const sh = bh - 6
      const gear = /GEAR/.test(c.label)
      const hw = Math.min(bw * 0.7, 46), hh = Math.max(10, sh * 0.16)
      const hy = by + 3 + sh * 0.12
      shape = (
        <g>
          <rect x={cx - 5} y={by + 3} width={10} height={sh} rx={5} fill="#050505" stroke="#2a2a2a" />
          {Array.from({ length: 6 }, (_, i) => <line key={i} x1={cx + 8} x2={cx + 14} y1={by + 6 + (i * (sh - 6)) / 5} y2={by + 6 + (i * (sh - 6)) / 5} stroke={labelColor} strokeWidth={1} opacity={0.7} />)}
          <rect x={cx - 3} y={hy + hh / 2} width={6} height={sh * 0.28} fill="url(#g-metalH)" />
          {gear ? (
            <g filter="url(#f-shadow)">
              <circle cx={cx} cy={hy + hh / 2} r={hh * 0.9} fill="url(#g-wheelKnob)" stroke="#555" />
              <circle cx={cx} cy={hy + hh / 2} r={hh * 0.35} fill="#9ca3af" />
            </g>
          ) : (
            <g filter="url(#f-shadow)">
              <rect x={cx - hw / 2} y={hy} width={hw} height={hh} rx={hh * 0.35} fill={c.color ?? '#d1d5db'} stroke="#000" />
              <rect x={cx - hw / 2 + 2} y={hy + 1.5} width={hw - 4} height={hh * 0.35} rx={hh * 0.2} fill="rgba(255,255,255,.28)" />
            </g>
          )}
        </g>
      )
      break
    }
    case 'handle': {
      const w = Math.min(bw * 0.72, r * 2.1), hh = Math.max(9, Math.min(r * 0.6, 20))
      const fire = /FIRE/.test(c.label)
      shape = (
        <g>
          <rect x={cx - 4} y={cy} width={8} height={bh / 2 - 2} fill="url(#g-metalH)" />
          <g filter="url(#f-shadow)">
            <rect x={cx - w / 2} y={cy - hh / 2} width={w} height={hh} rx={hh / 2} fill={c.color ?? '#dc2626'} stroke="#000" />
            <rect x={cx - w / 2 + 3} y={cy - hh / 2 + 2} width={w - 6} height={hh * 0.35} rx={hh / 4} fill="rgba(255,255,255,.3)" />
            {fire && <text x={cx} y={cy + hh * 0.3} textAnchor="middle" fontSize={hh * 0.65} fill="#fff" fontFamily={FONT} fontWeight={900}>{c.label.match(/\d/)?.[0] ?? 'APU'}</text>}
          </g>
        </g>
      )
      break
    }
    case 'wheel': {
      const w = Math.min(bw * 0.4, 28), hh = bh - 6
      shape = (
        <g filter="url(#f-shadow)">
          <rect x={cx - w / 2} y={by + 3} width={w} height={hh} rx={w * 0.3} fill="url(#g-wheel)" stroke="#000" />
          {Array.from({ length: Math.floor(hh / 5) }, (_, i) => <line key={i} x1={cx - w / 2 + 2} x2={cx + w / 2 - 2} y1={by + 5 + i * 5} y2={by + 5 + i * 5} stroke="#000" opacity={0.5} />)}
          <rect x={cx - w / 2} y={cy - 2} width={w} height={4} fill="#f8fafc" opacity={0.9} />
          <polygon points={`${cx + w / 2 + 4},${cy} ${cx + w / 2 + 12},${cy - 5} ${cx + w / 2 + 12},${cy + 5}`} fill={labelColor} />
          <text x={cx + w / 2 + 6} y={by + 12} fontSize={7} fill={labelColor} fontFamily={FONT}>NOSE DN</text>
        </g>
      )
      break
    }
    case 'breaker': {
      const cols = Math.max(2, Math.floor(bw / 18)), rows = Math.max(1, Math.floor(bh / 20))
      shape = (
        <g>
          {Array.from({ length: rows * cols }, (_, i) => {
            const x = bx + 10 + (i % cols) * ((bw - 20) / Math.max(1, cols - 1)), y = by + 10 + Math.floor(i / cols) * ((bh - 20) / Math.max(1, rows - 1))
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={6} fill="#111" />
                <circle cx={x} cy={y} r={4.6} fill="url(#g-knob)" stroke="#000" />
                <circle cx={x} cy={y} r={4.6} fill="none" stroke="#e5e7eb" strokeWidth={0.8} opacity={0.6} />
              </g>
            )
          })}
        </g>
      )
      break
    }
    case 'annun': {
      const cols = 4, rows = 2
      const cw = (bw - 8) / cols, ch = Math.min(20, (bh - 8) / rows)
      const legends = c.id === 'gearLts' ? ['NOSE', 'LEFT', 'RIGHT', 'UNSAFE', '', '', '', ''] : ['LOW FUEL L', 'OIL PRESS', 'LOW VAC', 'VOLTS', 'LOW FUEL R', 'ALT', 'PITOT', 'DOOR']
      const cols2 = c.id === 'gearLts' ? ['#22c55e', '#22c55e', '#22c55e', '#ef4444', '#333', '#333', '#333', '#333'] : ['#f59e0b', '#ef4444', '#f59e0b', '#f59e0b', '#f59e0b', '#ef4444', '#f59e0b', '#f59e0b']
      shape = (
        <g filter="url(#f-shadow)">
          <rect x={bx + 2} y={cy - ch - 3} width={bw - 4} height={ch * 2 + 6} rx={3} fill="#050505" stroke="#333" />
          {Array.from({ length: rows * cols }, (_, i) => (
            <g key={i}>
              <rect x={bx + 4 + (i % cols) * cw + 1} y={cy - ch + Math.floor(i / cols) * ch + 1} width={cw - 2} height={ch - 2} rx={1} fill={cols2[i]} opacity={0.18} />
              <text x={bx + 4 + (i % cols) * cw + cw / 2} y={cy - ch + Math.floor(i / cols) * ch + ch / 2 + 2} textAnchor="middle" fontSize={Math.min(6, cw / 7)} fill={cols2[i]} opacity={0.7} fontFamily={FONT} fontWeight={800}>{legends[i]}</text>
            </g>
          ))}
        </g>
      )
      break
    }
  }

  const fs = Math.max(6.5, Math.min(10.5, (bw * 1.75) / Math.max(4, c.label.length)))
  return (
    <g>
      {shape}
      {showLabel && (
        <text x={cx} y={c.y + c.h - 3} textAnchor="middle" fontSize={fs} fontFamily={FONT} fontWeight={700} fill={labelColor} letterSpacing={0.4} stroke="rgba(0,0,0,.45)" strokeWidth={1.6} paintOrder="stroke">
          {c.label}
        </text>
      )}
    </g>
  )
}
