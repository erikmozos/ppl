// Piezas comunes de las calculadoras interactivas
import type { ReactNode } from 'react'

export const fmt = (n: number, dec = 0) => (Number.isFinite(n) ? n.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : '—')
export const rad = (d: number) => (d * Math.PI) / 180
export const deg = (r: number) => (r * 180) / Math.PI
export const norm360 = (d: number) => ((d % 360) + 360) % 360
export const p3 = (d: number) => { const n = Math.round(norm360(d)); return String(n === 0 ? 360 : n).padStart(3, '0') }

export function Num({ label, value, onChange, step = 1, min, max, unit, width }: { label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; unit?: string; width?: number }) {
  return (
    <label className="w-field">
      <span>{label}</span>
      <span className="w-input">
        <input type="number" inputMode="decimal" value={Number.isFinite(value) ? value : ''} step={step} min={min} max={max} style={width ? { width } : undefined}
          onChange={e => { const v = parseFloat(e.target.value.replace(',', '.')); onChange(Number.isFinite(v) ? v : 0) }} />
        {unit && <em>{unit}</em>}
      </span>
    </label>
  )
}

export function Slider({ label, value, onChange, min, max, step = 1, unit = '' }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string }) {
  return (
    <label className="w-field w-slider">
      <span>{label} <b>{value}{unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} />
    </label>
  )
}

export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label?: string }) {
  return (
    <div className="w-field">
      {label && <span>{label}</span>}
      <div className="seg-row" role="radiogroup">
        {options.map(([v, t]) => <button key={v} role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{t}</button>)}
      </div>
    </div>
  )
}

export function Out({ k, v, strong }: { k: string; v: ReactNode; strong?: boolean }) {
  return <div className={`w-out ${strong ? 'strong' : ''}`}><span>{k}</span><b>{v}</b></div>
}

export function Widget({ title, children, note }: { title: string; children: ReactNode; note?: ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-title">{title}</div>
      {children}
      {note && <p className="widget-note">{note}</p>}
    </div>
  )
}

/** Flecha SVG con punta (para los diagramas) */
export function Arrow({ x1, y1, x2, y2, cls = 'ln', head = 8, sw }: { x1: number; y1: number; x2: number; y2: number; cls?: string; head?: number; sw?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const p = (da: number) => `${x2 - head * Math.cos(a + da)},${y2 - head * Math.sin(a + da)}`
  const fill = cls.startsWith('ac') ? 'ac-fill' : cls.startsWith('wa') ? 'wa-fill' : cls.startsWith('ok') ? 'ok-fill' : 'ink-fill'
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} className={cls} style={sw ? { strokeWidth: sw } : undefined} /><polygon points={`${x2},${y2} ${p(0.4)} ${p(-0.4)}`} className={fill} /></g>
}
