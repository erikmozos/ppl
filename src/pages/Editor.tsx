import { useState } from 'react'
import type { Aircraft, Control, Flow, Pt } from '../types'
import { Cockpit, type MarkState } from '../components/Cockpit'
import { controlById } from '../layout'
import { actions, flowsOf, uid, useStore } from '../store'
import { buildViz } from '../flowviz'
import { go } from '../router'
import { ViewTabs } from '../components/ViewTabs'
import { useView, viewAircraft } from '../views'

export function Editor({ ac, flowId, hotspots }: { ac: Aircraft; flowId?: string; hotspots: boolean }) {
  if (hotspots && ac.custom) return <HotspotEditor ac={ac} />
  return <FlowEditor ac={ac} flowId={flowId} />
}

function FlowEditor({ ac, flowId }: { ac: Aircraft; flowId?: string }) {
  const s = useStore()
  const existing = flowId ? flowsOf(s, ac).find(f => f.id === flowId) : undefined
  const [draft, setDraft] = useState<Flow>(() =>
    existing?.custom ? structuredClone(existing)
      : existing ? { ...structuredClone(existing), id: 'u-' + uid(), name: existing.name + ' (mi versión)', custom: true }
        : { id: 'u-' + uid(), name: 'Nuevo flow', phase: 'Personalizado', steps: [], custom: true })
  const [role, setRole] = useState(ac.roles[0]?.id ?? 'P')
  const [view, setView, views] = useView(ac)
  const vac = viewAircraft(ac, view, s)
  const [sel, setSel] = useState<number | null>(null)

  const setSteps = (fn: (st: Flow['steps']) => Flow['steps']) => setDraft(d => ({ ...d, steps: fn(d.steps) }))

  function add(c: Control) {
    const step = { c: c.id, a: `${c.label} — `, r: role }
    setSteps(st => {
      const at = sel === null ? st.length : sel + 1
      const n = [...st]; n.splice(at, 0, step); return n
    })
    setSel(sel === null ? draft.steps.length : sel + 1)
  }
  const move = (i: number, d: number) => setSteps(st => {
    const j = i + d; if (j < 0 || j >= st.length) return st
    const n = [...st];[n[i], n[j]] = [n[j], n[i]]; setSel(j); return n
  })

  function save() {
    if (!draft.steps.length) { alert('Añade al menos un paso tocando los mandos de la cabina.'); return }
    actions.saveFlow(ac.id, draft)
    go(`#/ac/${ac.id}/flow/${draft.id}`)
  }

  const viz = buildViz(vac, draft.steps, draft.steps.length)
  const marks: Record<string, MarkState> = {}
  if (sel !== null && draft.steps[sel]) marks[draft.steps[sel].c] = 'sel'

  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href={`#/ac/${ac.id}?tab=procs`}>← {ac.short}</a>
          <h1>Editor de flows</h1>
          <p className="muted">Toca los mandos en orden para añadir pasos. Cada paso se inserta después del seleccionado.</p>
        </div>
        <div className="row gap">
          {flowsOf(s, ac).some(f => f.id === draft.id) && (
            <button className="btn ghost" onClick={() => { if (confirm('¿Borrar este flow?')) { actions.deleteFlow(ac.id, draft.id); go(`#/ac/${ac.id}?tab=procs`) } }}>Borrar</button>
          )}
          <button className="btn primary" onClick={save}>Guardar</button>
        </div>
      </div>
      <div className="split">
        <div className="split-main">
          <ViewTabs ac={ac} view={view} setView={setView} views={views} />
          <Cockpit ac={vac} marks={marks} layers={viz.layers} badges={viz.badges} onControl={add} showHotspots={!!ac.custom} />
        </div>
        <aside className="split-side">
          <div className="card">
            <label className="field">Nombre<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
            <label className="field">Fase<input value={draft.phase} onChange={e => setDraft({ ...draft, phase: e.target.value })} list="phases" /></label>
            <datalist id="phases">{['Prevuelo', 'Arranque', 'Rodaje', 'Despegue', 'Crucero', 'Aproximación', 'Tierra', 'Emergencia'].map(p => <option key={p} value={p} />)}</datalist>
            <label className="field">Descripción<input value={draft.desc ?? ''} onChange={e => setDraft({ ...draft, desc: e.target.value })} /></label>
            {ac.roles.length > 1 && (
              <div className="field">Rol de los pasos nuevos
                <div className="row gap">
                  {ac.roles.map(r => (
                    <button key={r.id} className={`role-btn ${role === r.id ? 'on' : ''}`} style={{ ['--c' as string]: r.color }} onClick={() => setRole(r.id)}><i />{r.id}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ol className="steps card editable">
            {draft.steps.length === 0 && <li className="muted small">Sin pasos todavía.</li>}
            {draft.steps.map((st, i) => (
              <li key={i} className={sel === i ? 'cur' : ''} onClick={() => setSel(i)}>
                <span className="n" style={{ background: ac.roles.find(r => r.id === st.r)?.color ?? ac.roles[0]?.color }}>{i + 1}</span>
                <div className="grow">
                  <b>{controlById(ac, st.c)?.label ?? st.c}</b>
                  <input aria-label="Acción" value={st.a} onChange={e => setSteps(x => x.map((y, j) => (j === i ? { ...y, a: e.target.value } : y)))} />
                  <input aria-label="Nota" className="note-in" placeholder="Nota (FCOM, límites…)" value={st.n ?? ''} onChange={e => setSteps(x => x.map((y, j) => (j === i ? { ...y, n: e.target.value || undefined } : y)))} />
                  {ac.roles.length > 1 && (
                    <select aria-label="Rol" value={st.r ?? ac.roles[0].id} onChange={e => setSteps(x => x.map((y, j) => (j === i ? { ...y, r: e.target.value } : y)))}>
                      {ac.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  )}
                </div>
                <div className="tools">
                  <button aria-label="Subir" onClick={e => { e.stopPropagation(); move(i, -1) }}>↑</button>
                  <button aria-label="Bajar" onClick={e => { e.stopPropagation(); move(i, 1) }}>↓</button>
                  <button aria-label="Eliminar" onClick={e => { e.stopPropagation(); setSteps(x => x.filter((_, j) => j !== i)); setSel(null) }}>✕</button>
                </div>
              </li>
            ))}
          </ol>
          {sel !== null && <button className="btn ghost sm" onClick={() => setSel(null)}>Añadir al final</button>}
        </aside>
      </div>
    </div>
  )
}

function HotspotEditor({ ac }: { ac: Aircraft }) {
  const [spots, setSpots] = useState<Control[]>(ac.hotspots ?? [])
  const [sel, setSel] = useState<string | null>(null)
  const [W] = ac.viewBox
  const def = Math.round(W / 22)
  // copia local para que el Cockpit vea los cambios sin guardar
  const live: Aircraft = { ...ac, hotspots: spots }

  function addAt(p: Pt) {
    const id = 'h' + uid()
    const w = def * 1.4, h = def
    setSpots(s => [...s, { id, label: `Mando ${s.length + 1}`, kind: 'push', panel: 'img', x: p.x - w / 2, y: p.y - h / 2, w, h, cx: p.x, cy: p.y }])
    setSel(id)
  }
  const upd = (id: string, patch: Partial<Control>) => setSpots(s => s.map(c => {
    if (c.id !== id) return c
    const n = { ...c, ...patch }
    return { ...n, cx: n.x + n.w / 2, cy: n.y + n.h / 2 }
  }))
  const cur = spots.find(c => c.id === sel)

  function save() {
    actions.saveAircraft({ ...ac, hotspots: spots })
    go(`#/ac/${ac.id}`)
  }

  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href={`#/ac/${ac.id}`}>← {ac.short}</a>
          <h1>Marcar mandos</h1>
          <p className="muted">Toca la imagen donde haya un mando para crear una zona. Ponle nombre y ajusta su tamaño.</p>
        </div>
        <div className="row gap">
          <button className="btn ghost" onClick={() => { if (confirm('¿Borrar esta cabina y sus flows?')) { actions.deleteAircraft(ac.id); go('#/cockpits') } }}>Borrar cabina</button>
          <button className="btn primary" onClick={save}>Guardar</button>
        </div>
      </div>
      <div className="split">
        <div className="split-main">
          <Cockpit ac={live} showHotspots marks={sel ? { [sel]: 'sel' } : {}} onCanvas={addAt} onControl={c => setSel(c.id)} />
        </div>
        <aside className="split-side">
          {cur ? (
            <div className="card">
              <h3>Mando seleccionado</h3>
              <label className="field">Nombre<input autoFocus value={cur.label} onChange={e => upd(cur.id, { label: e.target.value })} /></label>
              <label className="field">Descripción<input value={cur.desc ?? ''} onChange={e => upd(cur.id, { desc: e.target.value })} /></label>
              <div className="row gap">
                <label className="field">Ancho<input type="range" min={def * 0.4} max={def * 6} value={cur.w} onChange={e => { const w = +e.target.value; upd(cur.id, { x: cur.cx - w / 2, w }) }} /></label>
                <label className="field">Alto<input type="range" min={def * 0.4} max={def * 6} value={cur.h} onChange={e => { const h = +e.target.value; upd(cur.id, { y: cur.cy - h / 2, h }) }} /></label>
              </div>
              <button className="btn ghost sm" onClick={() => { setSpots(s => s.filter(c => c.id !== cur.id)); setSel(null) }}>Eliminar mando</button>
            </div>
          ) : <div className="card muted">Toca la imagen para añadir un mando, o un mando existente para editarlo.</div>}
          <div className="card">
            <h3>{spots.length} mandos</h3>
            <ul className="panel-list">
              {spots.map(c => <li key={c.id}><button className={sel === c.id ? 'on' : ''} onClick={() => setSel(c.id)}><span>{c.label}</span></button></li>)}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
