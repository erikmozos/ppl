import { useState } from 'react'
import type { Aircraft, Pt } from '../types'
import { Cockpit } from '../components/Cockpit'
import { ViewTabs } from '../components/ViewTabs'
import { controlsOf } from '../layout'
import { actions, useStore, type Rect } from '../store'
import { spotsFor, useView, viewAircraft } from '../views'

/** Colocar / ajustar las zonas de cada mando sobre las fotos reales */
export function SpotEditor({ ac }: { ac: Aircraft }) {
  const s = useStore()
  const [view, setView, views] = useView(ac)
  const photoViews = views.filter(v => v.photo)
  const curView = photoViews.some(v => v.id === view) ? view : photoViews[0]?.id
  const [sel, setSel] = useState<string | null>(null)
  const [grid, setGrid] = useState(false)
  const [filter, setFilter] = useState('')
  const [size, setSize] = useState<[number, number]>([60, 50])
  if (!curView) return <div className="wrap"><p>Este avión no tiene fotos.</p></div>

  const key = `${ac.id}/${curView}`
  const vac = viewAircraft(ac, curView, s)
  const spots = spotsFor(ac, curView, s)
  const all = controlsOf(ac)
  const cur = sel ? spots[sel] : undefined
  const edited = Object.keys(s.spots[key] ?? {}).length

  function place(p: Pt) {
    if (!sel) return
    const [w, h] = cur ? [cur[2], cur[3]] : size
    actions.setSpot(key, sel, [Math.round(p.x - w / 2), Math.round(p.y - h / 2), w, h])
    // pasa al siguiente mando sin colocar del mismo panel
    const idx = all.findIndex(c => c.id === sel)
    const next = all.slice(idx + 1).find(c => !(c.id in spots) && c.panel === all[idx].panel)
    if (next) setSel(next.id)
  }
  function resize(dw: number, dh: number) {
    if (!sel || !cur) return
    const [x, y, w, h] = cur
    const nw = Math.max(8, w + dw), nh = Math.max(8, h + dh)
    const r: Rect = [Math.round(x + (w - nw) / 2), Math.round(y + (h - nh) / 2), nw, nh]
    actions.setSpot(key, sel, r)
    setSize([nw, nh])
  }
  function exportJson() {
    const text = JSON.stringify(spots)
    navigator.clipboard?.writeText(text).catch(() => {})
    const blob = new Blob([text], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${ac.id}-${curView}-spots.json`
    a.click()
  }

  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href={`#/ac/${ac.id}`}>← {ac.short}</a>
          <h1>Ajustar mandos sobre la foto</h1>
          <p className="muted">Elige un mando de la lista y toca la foto donde está. Si una zona no encaja, muévela tocando otra vez o cambia su tamaño.</p>
        </div>
        <div className="row gap wrap-row">
          <label className="check"><input type="checkbox" checked={grid} onChange={e => setGrid(e.target.checked)} /> Cuadrícula</label>
          <button className="btn ghost" onClick={exportJson}>Exportar JSON</button>
          {edited > 0 && <button className="btn ghost" onClick={() => { if (confirm('¿Descartar tus ajustes en esta foto?')) actions.resetSpots(key) }}>Restablecer ({edited})</button>}
        </div>
      </div>
      <div className="split">
        <div className="split-main">
          <ViewTabs ac={ac} view={curView} setView={setView} views={photoViews} />
          <Cockpit ac={vac} showHotspots grid={grid} marks={sel && cur ? { [sel]: 'sel' } : {}} onCanvas={place} onControl={c => (sel && sel !== c.id ? place({ x: c.cx, y: c.cy }) : setSel(c.id))} />
        </div>
        <aside className="split-side">
          <div className="card">
            {sel ? (
              <>
                <h3>{all.find(c => c.id === sel)?.label}</h3>
                <p className="small muted">{cur ? `Zona: ${cur.join(', ')}` : 'Sin colocar: toca la foto donde está este mando.'}</p>
                {cur && (
                  <div className="row gap wrap-row">
                    <button className="btn sm" onClick={() => resize(-6, 0)}>Ancho −</button>
                    <button className="btn sm" onClick={() => resize(6, 0)}>Ancho +</button>
                    <button className="btn sm" onClick={() => resize(0, -6)}>Alto −</button>
                    <button className="btn sm" onClick={() => resize(0, 6)}>Alto +</button>
                    <button className="btn ghost sm" onClick={() => actions.setSpot(key, sel, null)}>Quitar</button>
                  </div>
                )}
              </>
            ) : <p className="muted">Selecciona un mando.</p>}
          </div>
          <div className="card">
            <div className="row between"><h3>Mandos</h3><span className="small muted">{Object.keys(spots).length}/{all.length} en esta foto</span></div>
            <input className="input" style={{ width: '100%', margin: '6px 0' }} placeholder="Filtrar…" value={filter} onChange={e => setFilter(e.target.value)} />
            <ul className="panel-list spot-list">
              {all.filter(c => !filter || (c.label + c.id).toLowerCase().includes(filter.toLowerCase())).map(c => (
                <li key={c.id}>
                  <button className={sel === c.id ? 'on' : ''} onClick={() => setSel(c.id)}>
                    <span>{c.id in spots ? '● ' : '○ '}{c.label}</span>
                    <span className="muted small">{ac.panels.find(p => p.id === c.panel)?.name.replace('Overhead · ', '')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
