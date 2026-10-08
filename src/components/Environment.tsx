import type { Aircraft } from '../types'

/* Entorno de cabina alrededor de los paneles del esquema: parabrisas con exterior, montantes,
   techo, visera, pedestal con perspectiva, suelo y volantes. Puramente decorativo (sin clics). */

interface Box { x: number; y: number; w: number; h: number }

function Outside({ x, y, w, h, id }: Box & { id: string }) {
  const hz = y + h * 0.6
  const cx = x + w / 2
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d78b8" /><stop offset="0.7" stopColor="#9cc4e6" /><stop offset="1" stopColor="#dbe8f2" />
        </linearGradient>
        <linearGradient id={`gnd-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a9a72" /><stop offset="1" stopColor="#4f5f3c" />
        </linearGradient>
        <clipPath id={`win-${id}`}><rect x={x} y={y} width={w} height={h} /></clipPath>
      </defs>
      <g clipPath={`url(#win-${id})`}>
        <rect x={x} y={y} width={w} height={hz - y} fill={`url(#sky-${id})`} />
        {[0.18, 0.42, 0.7, 0.86].map((p, i) => (
          <ellipse key={i} cx={x + w * p} cy={y + h * (0.18 + (i % 2) * 0.12)} rx={w * 0.06} ry={h * 0.04} fill="#fff" opacity={0.55} />
        ))}
        <rect x={x} y={hz} width={w} height={y + h - hz} fill={`url(#gnd-${id})`} />
        <path d={`M${x},${hz} ${Array.from({ length: 40 }, (_, i) => `L${x + (w * (i + 0.5)) / 40},${hz - 4 - ((i * 37) % 9)} L${x + (w * (i + 1)) / 40},${hz}`).join(' ')}`} fill="#3f4d33" />
        {/* pista con perspectiva */}
        <polygon points={`${cx - w * 0.02},${hz} ${cx + w * 0.02},${hz} ${cx + w * 0.3},${y + h} ${cx - w * 0.3},${y + h}`} fill="#53585e" />
        <polygon points={`${cx - w * 0.02},${hz} ${cx - w * 0.017},${hz} ${cx - w * 0.27},${y + h} ${cx - w * 0.285},${y + h}`} fill="#e5e7eb" opacity={0.8} />
        <polygon points={`${cx + w * 0.017},${hz} ${cx + w * 0.02},${hz} ${cx + w * 0.285},${y + h} ${cx + w * 0.27},${y + h}`} fill="#e5e7eb" opacity={0.8} />
        {[0.1, 0.25, 0.45, 0.7].map((p, i) => {
          const t0 = p, t1 = p + 0.06 + p * 0.08
          const yy0 = hz + (y + h - hz) * t0, yy1 = hz + (y + h - hz) * t1
          const ww0 = 1 + t0 * w * 0.006, ww1 = 1 + t1 * w * 0.006
          return <polygon key={i} points={`${cx - ww0},${yy0} ${cx + ww0},${yy0} ${cx + ww1},${yy1} ${cx - ww1},${yy1}`} fill="#f8fafc" />
        })}
      </g>
    </g>
  )
}

function Compass({ cx, y }: { cx: number; y: number }) {
  return (
    <g>
      <rect x={cx - 6} y={y - 30} width={12} height={34} fill="#1d1f22" />
      <rect x={cx - 48} y={y} width={96} height={58} rx={12} fill="#16181b" stroke="#000" />
      <rect x={cx - 34} y={y + 14} width={68} height={28} rx={6} fill="#0b0b0c" />
      <text x={cx} y={y + 34} textAnchor="middle" fill="#f8fafc" fontSize={13} fontFamily="ui-monospace, monospace" fontWeight={700}>33 · N · 3</text>
      <line x1={cx} x2={cx} y1={y + 14} y2={y + 42} stroke="#f97316" strokeWidth={1.5} />
    </g>
  )
}

/** Volante (yoke) visto de frente */
function Yoke({ x, y, s = 1, airliner = false }: { x: number; y: number; s?: number; airliner?: boolean }) {
  const w = 105 * s, top = y - 8 * s
  return (
    <g opacity={0.62} pointerEvents="none">
      <rect x={x - 11 * s} y={y - 70 * s} width={22 * s} height={airliner ? 260 * s : 70 * s} fill="url(#g-metalH)" opacity={0.7} />
      <path d={`M${x - w},${top + 75 * s} V${top + 18 * s} Q${x - w},${top - 14 * s} ${x - w + 32 * s},${top - 14 * s} H${x + w - 32 * s} Q${x + w},${top - 14 * s} ${x + w},${top + 18 * s} V${top + 75 * s}`}
        fill="none" stroke="#0c0d0f" strokeWidth={24 * s} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${x - w},${top + 72 * s} V${top + 18 * s} Q${x - w},${top - 14 * s} ${x - w + 32 * s},${top - 14 * s} H${x + w - 32 * s} Q${x + w},${top - 14 * s} ${x + w},${top + 18 * s} V${top + 72 * s}`}
        fill="none" stroke="#3a3e44" strokeWidth={5 * s} strokeLinecap="round" opacity={0.7} transform={`translate(${-4 * s},${-5 * s})`} />
      <rect x={x - 34 * s} y={top - 30 * s} width={68 * s} height={40 * s} rx={8 * s} fill="#141518" stroke="#000" />
      <rect x={x - 20 * s} y={top - 20 * s} width={40 * s} height={20 * s} rx={4 * s} fill="#9ca3af" opacity={0.6} />
    </g>
  )
}

export function EnvironmentBack({ ac, sheet }: { ac: Aircraft; sheet?: Box }) {
  const th = ac.theme
  const [W, H] = ac.viewBox
  if (th?.env === 'ga' && sheet) {
    const winBottom = sheet.y + 30
    return (
      <g pointerEvents="none">
        <Outside x={0} y={0} w={W} h={winBottom} id={ac.id} />
        {/* techo y montantes */}
        <path d={`M0,0 H${W} V26 Q${W / 2},62 0,26 Z`} fill="#1b1d20" />
        <polygon points={`0,0 130,0 34,${winBottom} 0,${winBottom}`} fill="#25282c" />
        <polygon points={`${W},0 ${W - 130},0 ${W - 34},${winBottom} ${W},${winBottom}`} fill="#25282c" />
        <polyline points={`130,0 34,${winBottom}`} stroke="rgba(255,255,255,.12)" strokeWidth={3} fill="none" />
        <polyline points={`${W - 130},0 ${W - 34},${winBottom}`} stroke="rgba(255,255,255,.12)" strokeWidth={3} fill="none" />
        <Compass cx={W / 2} y={44} />
        {/* capó que asoma por encima de la visera */}
        <ellipse cx={W / 2} cy={sheet.y + 12} rx={W * 0.36} ry={46} fill="#2a2d31" />
        <ellipse cx={W / 2} cy={sheet.y + 4} rx={W * 0.3} ry={30} fill="#33373c" opacity={0.6} />
        {/* suelo bajo el panel */}
        <rect x={0} y={sheet.y + sheet.h - 20} width={W} height={H - sheet.y - sheet.h + 20} fill="url(#g-floor)" />
        <polygon points={`0,${sheet.y + sheet.h - 20} 70,${sheet.y + sheet.h} 70,${H} 0,${H}`} fill="#1a1c1f" />
        <polygon points={`${W},${sheet.y + sheet.h - 20} ${W - 70},${sheet.y + sheet.h} ${W - 70},${H} ${W},${H}`} fill="#1a1c1f" />
      </g>
    )
  }
  if (th?.env === 'airliner') {
    const split = th.envTop ?? 0, gap = th.envGap ?? 0
    const y0 = split + 6, y1 = split + gap + 8
    const ped = ac.panels.find(p => p.id === 'ped')
    return (
      <g pointerEvents="none">
        {/* techo (overhead) con perspectiva */}
        <rect x={0} y={0} width={W} height={y0 + 10} fill="#15171a" />
        <polygon points={`120,0 ${W - 120},0 ${W - 14},${y0} 14,${y0}`} fill="#22262b" />
        <Outside x={0} y={y0} w={W} h={y1 - y0 + 40} id={ac.id} />
        {/* marcos de las ventanas */}
        <rect x={0} y={y0} width={W} height={18} fill="#1f2226" />
        <polygon points={`${W / 2 - 18},${y0} ${W / 2 + 18},${y0} ${W / 2 + 12},${y1 + 40} ${W / 2 - 12},${y1 + 40}`} fill="#25292e" />
        <polygon points={`${W * 0.09},${y0} ${W * 0.13},${y0} ${W * 0.06},${y1 + 40} ${W * 0.02},${y1 + 40}`} fill="#25292e" />
        <polygon points={`${W * 0.91},${y0} ${W * 0.87},${y0} ${W * 0.94},${y1 + 40} ${W * 0.98},${y1 + 40}`} fill="#25292e" />
        <polygon points={`0,${y0} ${W * 0.09},${y0} ${W * 0.02},${y1 + 40} 0,${y1 + 40}`} fill="rgba(10,12,14,.55)" />
        <polygon points={`${W},${y0} ${W * 0.91},${y0} ${W * 0.98},${y1 + 40} ${W},${y1 + 40}`} fill="rgba(10,12,14,.55)" />
        {/* visera (glareshield) */}
        <path d={`M0,${y1 + 6} Q${W / 2},${y1 - 34} ${W},${y1 + 6} V${y1 + 160} H0 Z`} fill="url(#g-glare)" />
        {/* fondo del panel principal y suelo */}
        <rect x={0} y={y1 + 150} width={W} height={H - y1 - 150} fill="#16191c" />
        <rect x={0} y={ped ? ped.y - 20 : H - 300} width={W} height={H} fill="url(#g-floor)" />
        {ped && (
          <polygon points={`${ped.x + 30},${ped.y - 16} ${ped.x + ped.w - 30},${ped.y - 16} ${ped.x + ped.w + 60},${H} ${ped.x - 60},${H}`} fill="#1d2125" stroke="#0b0c0e" strokeWidth={3} />
        )}
      </g>
    )
  }
  return null
}

export function EnvironmentFront({ ac, sheet }: { ac: Aircraft; sheet?: Box }) {
  const th = ac.theme
  if (th?.env === 'ga' && sheet) {
    const y = sheet.y + sheet.h + 4
    return (
      <g pointerEvents="none">
        <Yoke x={sheet.x + sheet.w * 0.2} y={y} />
        <Yoke x={sheet.x + sheet.w * 0.74} y={y} />
      </g>
    )
  }
  if (th?.env === 'airliner') {
    const ped = ac.panels.find(p => p.id === 'ped')
    if (!ped) return null
    const W = ac.viewBox[0]
    return (
      <g pointerEvents="none">
        <Yoke x={(ped.x) / 2 + 10} y={ped.y + 40} s={0.9} airliner />
        <Yoke x={W - ped.x / 2 - 10} y={ped.y + 40} s={0.9} airliner />
      </g>
    )
  }
  return null
}
