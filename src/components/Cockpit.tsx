import { memo, useRef, useState } from 'react'
import type { Aircraft, Control, Pt } from '../types'
import { controlsOf, smoothSegments } from '../layout'
import { ControlShape } from './ControlShape'
import { EnvironmentBack, EnvironmentFront } from './Environment'

export type MarkState = 'active' | 'done' | 'ok' | 'bad' | 'hint' | 'sel' | 'panel'

export interface Layer { color: string; pts: Pt[]; animateLast?: boolean; dashed?: boolean; width?: number }
export interface Badge { x: number; y: number; text: string; color: string; pulse?: boolean; dim?: boolean }
export interface Ripple { key: number; x: number; y: number; color: string }

interface Props {
  ac: Aircraft
  marks?: Record<string, MarkState>
  layers?: Layer[]
  badges?: Badge[]
  ripples?: Ripple[]
  onControl?: (c: Control) => void
  onCanvas?: (p: Pt) => void
  showLabels?: boolean
  showHotspots?: boolean
  svgRef?: React.RefObject<SVGSVGElement | null>
  zoomable?: boolean
  compact?: boolean
  /** cuadrícula de coordenadas (calibrar zonas sobre fotos) */
  grid?: boolean
  /** encuadre manual (modo tutorial): sustituye al viewBox completo */
  camera?: { x: number; y: number; w: number; h: number }
  /** ocupa todo el contenedor (alto y ancho) */
  fill?: boolean
}

const MARK: Record<MarkState, { stroke: string; fill: string; dash?: string }> = {
  active: { stroke: '#38bdf8', fill: 'rgba(56,189,248,0.18)' },
  done: { stroke: 'rgba(56,189,248,0.45)', fill: 'rgba(56,189,248,0.06)' },
  ok: { stroke: '#22c55e', fill: 'rgba(34,197,94,0.18)' },
  bad: { stroke: '#ef4444', fill: 'rgba(239,68,68,0.18)' },
  hint: { stroke: '#f59e0b', fill: 'rgba(245,158,11,0.15)', dash: '6 4' },
  sel: { stroke: '#f59e0b', fill: 'rgba(245,158,11,0.2)' },
  panel: { stroke: 'rgba(245,158,11,0.7)', fill: 'rgba(245,158,11,0.08)' },
}

/** Aclara (amt > 0) u oscurece (amt < 0) un color hex */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))))
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`
}

const lin = (id: string, stops: [number, string][], h = false) => (
  <linearGradient id={id} x1="0" y1="0" x2={h ? 1 : 0} y2={h ? 0 : 1}>
    {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
  </linearGradient>
)
const rad = (id: string, stops: [number, string, number?][], cx = '50%', cy = '50%') => (
  <radialGradient id={id} cx={cx} cy={cy} r="65%">
    {stops.map(([o, c, op]) => <stop key={o} offset={o} stopColor={c} stopOpacity={op ?? 1} />)}
  </radialGradient>
)

/** Materiales compartidos: metal, plástico, cristal, cielo/tierra, sombras */
function Defs({ ac }: { ac: Aircraft }) {
  const th = ac.theme
  const panel = th?.panel ?? '#2a2f35'
  return (
    <defs>
      {lin('g-bezel', [[0, '#a3a8ae'], [0.45, '#3d4045'], [1, '#121315']])}
      {lin('g-bezelFlat', [[0, '#3d4147'], [1, '#1b1d20']])}
      {rad('g-face', [[0, '#1e2023'], [1, '#060607']])}
      {rad('g-glass', [[0, '#ffffff', 0.32], [1, '#ffffff', 0]])}
      {lin('g-glassFlat', [[0, 'rgba(255,255,255,0.09)'], [1, 'rgba(255,255,255,0)']])}
      {rad('g-knob', [[0, '#70757d'], [0.55, '#1b1c1e'], [1, '#050505']], '35%', '30%')}
      {lin('g-knobBar', [[0, '#34373b'], [0.5, '#08090a'], [1, '#34373b']], true)}
      {rad('g-knobRed', [[0, '#f87171'], [0.6, '#991b1b'], [1, '#3a0505']], '35%', '30%')}
      {rad('g-metal', [[0, '#ffffff'], [0.5, '#a1a7b0'], [1, '#4b5563']], '35%', '30%')}
      {lin('g-metalH', [[0, '#5b6370'], [0.5, '#f3f4f6'], [1, '#5b6370']], true)}
      {lin('g-sky', [[0, '#1b58a8'], [1, '#5fa6ea']])}
      {lin('g-ground', [[0, '#8b5a2b'], [1, '#4a2c12']])}
      {lin('g-cap', [[0, '#3b4047'], [1, '#202328']])}
      {lin('g-avionics', [[0, '#2d3035'], [1, '#16181b']])}
      {lin('g-rockerTop', [[0, '#3d3d3d'], [1, '#141414']])}
      {lin('g-rockerRed', [[0, '#dc2626'], [1, '#6b0f0f']])}
      {lin('g-wheel', [[0, '#0d0d0d'], [0.5, '#5a5a5a'], [1, '#0d0d0d']], true)}
      {rad('g-wheelKnob', [[0, '#ffffff'], [0.6, '#cbd5e1'], [1, '#64748b']], '35%', '30%')}
      {lin('g-screw', [[0, '#d1d5db'], [1, '#4b5563']])}
      {lin(`g-panel-${ac.id}`, [[0, shade(panel, 0.1)], [1, shade(panel, -0.18)]])}
      {rad(`g-bg-${ac.id}`, [[0, shade(th?.bg ?? '#101317', 0.08)], [1, th?.bg ?? '#101317']], '50%', '35%')}
      {lin('g-glare', [[0, '#0a0a0b'], [0.8, '#1c1d20'], [1, '#050505']])}
      {lin('g-floor', [[0, '#141518'], [1, '#08090a']])}
      <filter id="f-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1.2" dy="2.2" stdDeviation="1.5" floodOpacity="0.6" /></filter>
      <filter id="f-soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0.5" dy="1" stdDeviation="0.6" floodOpacity="0.6" /></filter>
      <filter id="f-noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0" />
      </filter>
    </defs>
  )
}

function Screw({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={3.6} fill="url(#g-screw)" stroke="rgba(0,0,0,.6)" strokeWidth={0.8} />
      <line x1={x - 2.2} y1={y - 1} x2={x + 2.2} y2={y + 1} stroke="#2b2f35" strokeWidth={1} />
    </g>
  )
}

/** Placa de panel: chapa con bisel, tornillos y título serigrafiado */
function Plate({ ac, p, flat }: { ac: Aircraft; p: Aircraft['panels'][number]; flat: boolean }) {
  const label = ac.theme?.label ?? '#e5e7eb'
  const title = p.name.replace(/^Overhead · /, '').toUpperCase()
  const tw = Math.min(p.w - 30, title.length * 6.6)
  return (
    <g>
      {!flat && (
        <>
          <rect x={p.x - 1.5} y={p.y - 1.5} width={p.w + 3} height={p.h + 3} rx={5} fill="#050506" />
          <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={4} fill={`url(#g-panel-${ac.id})`} />
          <path d={`M${p.x + 1},${p.y + p.h - 2} V${p.y + 1} H${p.x + p.w - 2}`} stroke="rgba(255,255,255,.2)" strokeWidth={1.2} fill="none" />
          <path d={`M${p.x + 2},${p.y + p.h - 1} H${p.x + p.w - 1} V${p.y + 2}`} stroke="rgba(0,0,0,.45)" strokeWidth={1.2} fill="none" />
          <Screw x={p.x + 8} y={p.y + 8} /><Screw x={p.x + p.w - 8} y={p.y + 8} />
          <Screw x={p.x + 8} y={p.y + p.h - 8} /><Screw x={p.x + p.w - 8} y={p.y + p.h - 8} />
        </>
      )}
      <g opacity={0.85}>
        <line x1={p.x + 18} x2={p.x + p.w / 2 - tw / 2 - 6} y1={p.y + 12} y2={p.y + 12} stroke={label} strokeWidth={0.8} />
        <line x1={p.x + p.w / 2 + tw / 2 + 6} x2={p.x + p.w - 18} y1={p.y + 12} y2={p.y + 12} stroke={label} strokeWidth={0.8} />
        <text x={p.x + p.w / 2} y={p.y + 15.5} textAnchor="middle" fontSize={10} fontWeight={800} fill={label} letterSpacing={1} fontFamily='ui-sans-serif, "Helvetica Neue", Arial, sans-serif'>{title}</text>
      </g>
    </g>
  )
}

/** Cabina estática: se memoiza para no repintar cientos de controles en cada paso */
const Static = memo(function Static({ ac, showLabels, showHotspots }: { ac: Aircraft; showLabels: boolean; showHotspots: boolean }) {
  const [W, H] = ac.viewBox
  const controls = controlsOf(ac)
  const th = ac.theme
  // Avionetas: los paneles superiores forman una única chapa con visera; el resto (suelo/pedestal) son placas sueltas
  const top = th?.env === 'ga' ? th.envTop ?? 0 : 0
  const onSheet = (p: Aircraft['panels'][number]) => !!th?.sheet && p.y - top + p.h < (H - top) * 0.78
  const sheetPanels = ac.panels.filter(onSheet)
  const sx = Math.min(...sheetPanels.map(p => p.x)) - 12, sy = Math.min(...sheetPanels.map(p => p.y)) - 6
  const sw = Math.max(...sheetPanels.map(p => p.x + p.w)) + 12 - sx, sh = Math.max(...sheetPanels.map(p => p.y + p.h)) + 12 - sy
  return (
    <g>
      <Defs ac={ac} />
      <rect x={0} y={0} width={W} height={H} fill={ac.image ? '#101317' : `url(#g-bg-${ac.id})`} />
      {ac.image && <image href={ac.image} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />}
      {!ac.image && <EnvironmentBack ac={ac} sheet={sheetPanels.length ? { x: sx, y: sy, w: sw, h: sh } : undefined} />}
      {sheetPanels.length > 0 && (
        <g>
          <rect x={sx - 2} y={sy - 2} width={sw + 4} height={sh + 4} rx={22} fill="#040405" />
          <rect x={sx} y={sy} width={sw} height={sh} rx={20} fill={`url(#g-panel-${ac.id})`} />
          <rect x={sx} y={sy} width={sw} height={sh} rx={20} filter="url(#f-noise)" />
          <path d={`M${sx + 10},${sy + 1} H${sx + sw - 10}`} stroke="rgba(255,255,255,.12)" strokeWidth={1.5} />
          {/* visera antirreflejos */}
          <path d={`M${sx - 4},${sy + 8} Q${sx + sw / 2},${sy - 34} ${sx + sw + 4},${sy + 8} L${sx + sw + 4},${sy - 4} Q${sx + sw / 2},${sy - 44} ${sx - 4},${sy - 4} Z`} fill="url(#g-glare)" />
        </g>
      )}
      {ac.panels.map(p => <Plate key={p.id} ac={ac} p={p} flat={onSheet(p)} />)}
      {!sheetPanels.length && ac.panels.length > 0 && <rect x={0} y={0} width={W} height={H} filter="url(#f-noise)" pointerEvents="none" />}
      {!ac.image && controls.map(c => <ControlShape key={c.id} c={c} showLabel={showLabels} labelColor={th?.label} />)}
      {!ac.image && <EnvironmentFront ac={ac} sheet={sheetPanels.length ? { x: sx, y: sy, w: sw, h: sh } : undefined} />}
      {ac.image && showHotspots && controls.map(c => (
        <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={4} fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeDasharray="4 3" />
          <text x={c.cx} y={c.y - 4} textAnchor="middle" fontSize={Math.max(10, W / 120)} fill="#e0f2fe" stroke="#0b1016" strokeWidth={3} paintOrder="stroke" fontWeight={700}>{c.label}</text>
        </g>
      ))}
    </g>
  )
})

export function Cockpit({ ac, marks = {}, layers = [], badges = [], ripples = [], onControl, onCanvas, showLabels = true, showHotspots = false, svgRef, zoomable = true, compact = false, grid = false, camera, fill = false }: Props) {
  const [zoom, setZoom] = useState(() => (zoomable && window.innerWidth < 700 ? 2 : 1))
  const localRef = useRef<SVGSVGElement>(null)
  const ref = svgRef ?? localRef
  const [W, H] = ac.viewBox
  const controls = controlsOf(ac)
  const sw = Math.max(3, W / 320)

  function toSvg(e: React.MouseEvent): Pt | null {
    const svg = ref.current
    const m = svg?.getScreenCTM()
    if (!svg || !m) return null
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    return { x: p.x, y: p.y }
  }

  return (
    <div className={`cockpit ${compact ? 'compact' : ''} ${fill ? 'fill' : ''}`}>
      {zoomable && (
        <div className="zoombar">
          <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} aria-label="Alejar">−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(4, z + 0.5))} aria-label="Acercar">+</button>
        </div>
      )}
      <div className="cockpit-scroll">
        <svg
          ref={ref}
          viewBox={camera ? `${camera.x} ${camera.y} ${camera.w} ${camera.h}` : `0 0 ${W} ${H}`}
          style={fill ? { width: '100%', height: '100%' } : { width: `${zoom * 100}%` }}
          xmlns="http://www.w3.org/2000/svg"
          onClick={e => { if (onCanvas && e.target === e.currentTarget.querySelector('.bg-hit')) { const p = toSvg(e); if (p) onCanvas(p) } }}
        >
          <Static ac={ac} showLabels={showLabels} showHotspots={showHotspots} />
          {onCanvas && <rect className="bg-hit" x={0} y={0} width={W} height={H} fill="transparent" style={{ cursor: 'crosshair' }} />}

          {grid && (
            <g pointerEvents="none">
              {Array.from({ length: Math.floor(W / 50) + 1 }, (_, i) => <line key={'x' + i} x1={i * 50} x2={i * 50} y1={0} y2={H} stroke={i % 2 ? 'rgba(255,255,0,.25)' : 'rgba(255,255,0,.6)'} strokeWidth={i % 2 ? 0.6 : 1} />)}
              {Array.from({ length: Math.floor(H / 50) + 1 }, (_, i) => <line key={'y' + i} y1={i * 50} y2={i * 50} x1={0} x2={W} stroke={i % 2 ? 'rgba(255,255,0,.25)' : 'rgba(255,255,0,.6)'} strokeWidth={i % 2 ? 0.6 : 1} />)}
              {Array.from({ length: Math.floor(W / 100) + 1 }, (_, i) => Array.from({ length: Math.floor(H / 100) + 1 }, (_, j) => (
                <text key={i + '-' + j} x={i * 100 + 2} y={j * 100 + 11} fontSize={11} fill="#ff0" stroke="#000" strokeWidth={2.5} paintOrder="stroke" fontFamily="monospace">{i * 100},{j * 100}</text>
              )))}
            </g>
          )}

          {/* marcas de estado */}
          {controls.map(c => {
            const m = marks[c.id]
            if (!m) return null
            const s = MARK[m]
            return <rect key={c.id} x={c.x - 3} y={c.y - 3} width={c.w + 6} height={c.h + 6} rx={6} fill={s.fill} stroke={s.stroke} strokeWidth={2.5} strokeDasharray={s.dash} pointerEvents="none" className={m === 'active' ? 'glow' : undefined} />
          })}

          {/* trazados de flujo */}
          {layers.map((l, li) => {
            const segs = smoothSegments(l.pts)
            const last = l.animateLast ? segs.pop() : undefined
            const width = l.width ?? sw
            return (
              <g key={li} pointerEvents="none">
                {segs.length > 0 && (
                  <>
                    <path d={segs.join(' ')} stroke="#000" strokeOpacity={0.5} strokeWidth={width + 4} fill="none" strokeLinecap="round" />
                    <path d={segs.join(' ')} stroke={l.color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={l.dashed ? `${width * 3} ${width * 2}` : undefined} />
                  </>
                )}
                {last && <path key={`${l.pts.length}`} d={last} pathLength={1} className="draw" stroke={l.color} strokeWidth={width} fill="none" strokeLinecap="round" />}
              </g>
            )
          })}

          {/* insignias numeradas */}
          {badges.map((b, i) => {
            const r = Math.max(11, W / 110)
            return (
              <g key={i} pointerEvents="none" opacity={b.dim ? 0.45 : 1} className={b.pulse ? 'pulse' : undefined} style={{ transformOrigin: `${b.x}px ${b.y}px` }}>
                <circle cx={b.x} cy={b.y} r={r} fill={b.color} stroke="#0b1016" strokeWidth={2.5} />
                <text x={b.x} y={b.y + r * 0.38} textAnchor="middle" fontSize={r * (b.text.length > 2 ? 0.8 : 1.05)} fontWeight={800} fill="#0b1016" fontFamily="ui-sans-serif, system-ui">{b.text}</text>
              </g>
            )
          })}

          {/* ondas tipo sonar */}
          {ripples.map(r => (
            <g key={r.key} pointerEvents="none">
              <circle cx={r.x} cy={r.y} r={10} fill="none" stroke={r.color} strokeWidth={4} className="ripple" />
              <circle cx={r.x} cy={r.y} r={10} fill="none" stroke={r.color} strokeWidth={3} className="ripple r2" />
            </g>
          ))}

          {/* zonas clicables */}
          {onControl && controls.map(c => (
            <rect key={c.id} className="hit" x={c.x} y={c.y} width={c.w} height={c.h} rx={5} fill="transparent" onClick={e => { e.stopPropagation(); onControl(c) }}>
              <title>{showLabels ? c.label : ''}</title>
            </rect>
          ))}
        </svg>
      </div>
    </div>
  )
}
