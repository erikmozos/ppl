import { useMemo, useState } from 'react'
import type { Aircraft, Control } from '../types'
import { Cockpit, type MarkState, type Ripple } from '../components/Cockpit'
import { controlById, controlsOf } from '../layout'
import { actions, bestScore, flowsOf, uid, useStore } from '../store'
import { go } from '../router'
import { ViewTabs } from '../components/ViewTabs'
import { useView, viewAircraft } from '../views'
import { VideoList } from '../components/Videos'
import { VIDEOS } from '../data/videos'
import { SourceBadge } from '../components/SourceBadge'
import { SOURCES } from '../data/sources'

export function AircraftPage({ ac, tab }: { ac: Aircraft; tab: string }) {
  const tabs: [string, string][] = [['guide', 'Guía de cabina'], ['procs', 'Procedimientos'], ['cards', 'Flashcards'], ['videos', `Vídeos${VIDEOS[ac.id]?.length ? ` (${VIDEOS[ac.id].length})` : ''}`]]
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href="#/cockpits">← Cockpits</a>
          <div className="chip">{ac.category}</div>
          <h1>{ac.name}</h1>
          <p className="muted">{ac.tagline}</p>
        </div>
        <div className="row gap wrap-row">
          {ac.custom && <a className="btn" href={`#/ac/${ac.id}/edit?tab=hotspots`}>Editar mandos</a>}
          {ac.photos && <a className="btn ghost" href={`#/ac/${ac.id}/spots`}>Ajustar mandos en fotos</a>}
          <a className="btn primary" href={`#/ac/${ac.id}/edit`}>+ Nuevo flow</a>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(([id, name]) => (
          <a key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} href={`#/ac/${ac.id}?tab=${id}`}>{name}</a>
        ))}
      </div>
      {tab === 'guide' && <Guide ac={ac} />}
      {tab === 'procs' && <Procs ac={ac} />}
      {tab === 'cards' && <Flashcards ac={ac} />}
      {tab === 'videos' && (
        <div>
          <p className="muted small">Vídeos públicos de pilotos e instructores. Úsalos para ver el ritmo y la técnica; tu referencia sigue siendo tu POH/FCOM y los SOP de tu escuela. Para un tutorial narrado sobre esta cabina, abre un procedimiento y pulsa «🎬 Tutorial guiado».</p>
          <VideoList videos={VIDEOS[ac.id] ?? []} empty="Todavía no hay vídeos para este avión." />
        </div>
      )}
    </div>
  )
}

function Guide({ ac }: { ac: Aircraft }) {
  const s = useStore()
  const [sel, setSel] = useState<Control | null>(null)
  const [panel, setPanel] = useState<string | null>(null)
  const [view, setView, views] = useView(ac)
  const vac = viewAircraft(ac, view, s)
  const controls = controlsOf(vac)
  const flows = flowsOf(s, ac)

  const marks: Record<string, MarkState> = {}
  if (panel) controls.filter(c => c.panel === panel).forEach(c => (marks[c.id] = 'panel'))
  if (sel) marks[sel.id] = 'sel'
  const usedIn = sel ? flows.filter(f => f.steps.some(st => st.c === sel.id)) : []
  const panelDef = ac.panels.find(p => p.id === panel)

  return (
    <div className="split">
      <div className="split-main">
        <ViewTabs ac={ac} view={view} setView={setView} views={views} />
        <Cockpit ac={vac} marks={marks} onControl={c => { setSel(c); setPanel(c.panel) }} showHotspots={!!ac.custom} />
        <div className="card info">
          {sel ? (
            <>
              <div className="row between">
                <h3>{sel.label}</h3>
                <span className="chip">{ac.panels.find(p => p.id === sel.panel)?.name ?? 'Cabina'}</span>
              </div>
              <p>{sel.desc || <span className="muted">Sin descripción.</span>}</p>
              {usedIn.length > 0 && (
                <>
                  <p className="small muted">Aparece en:</p>
                  <ul className="mini-list">
                    {usedIn.map(f => (
                      <li key={f.id}>
                        <a href={`#/ac/${ac.id}/flow/${f.id}`}>{f.name}</a>
                        <span className="muted small"> — {f.steps.filter(st => st.c === sel.id).map(st => st.a).join(' · ')}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : panelDef ? (
            <><h3>{panelDef.name}</h3><p>{panelDef.desc ?? 'Toca un mando para ver qué hace.'}</p></>
          ) : (
            <p className="muted">Toca cualquier mando de la cabina para ver qué hace y en qué flows aparece.</p>
          )}
        </div>
      </div>
      <aside className="split-side">
        <div className="card">
          <h3>Resumen</h3>
          <p>{ac.guide.intro}</p>
          {ac.guide.specs.length > 0 && (
            <table className="specs"><tbody>{ac.guide.specs.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
          )}
        </div>
        {ac.panels.length > 0 && (
          <div className="card">
            <h3>Paneles</h3>
            <ul className="panel-list">
              {ac.panels.map(p => (
                <li key={p.id}>
                  <button className={panel === p.id ? 'on' : ''} onClick={() => { setPanel(panel === p.id ? null : p.id); setSel(null) }}>
                    <span>{p.name}</span><span className="muted small">{controls.filter(c => c.panel === p.id).length || '—'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {ac.guide.sections.map(sec => (
          <details key={sec.title} className="card" open>
            <summary><h3>{sec.title}</h3></summary>
            <p>{sec.body}</p>
          </details>
        ))}
        {SOURCES[ac.id] && (
          <div className="card">
            <h3>📘 Manual de referencia</h3>
            <p className="small">{SOURCES[ac.id].manual}</p>
            <p className="small muted">Nivel: {SOURCES[ac.id].level}. {SOURCES[ac.id].note}</p>
          </div>
        )}
        {ac.refs.length > 0 && (
          <div className="card">
            <h3>Documentación oficial</h3>
            <ul className="mini-list">{ac.refs.map(r => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a></li>)}</ul>
          </div>
        )}
      </aside>
    </div>
  )
}

function Procs({ ac }: { ac: Aircraft }) {
  const s = useStore()
  const flows = flowsOf(s, ac)
  // fases en el orden del vuelo; las desconocidas (flows propios) al final
  const ORDER = ['Prevuelo', 'Arranque', 'Rodaje', 'Despegue', 'Crucero', 'Aproximación', 'Tierra', 'Emergencia']
  const rank = (p: string) => (ORDER.indexOf(p) < 0 ? 99 : ORDER.indexOf(p))
  const phases = [...new Set(flows.map(f => f.phase || 'Otros'))].sort((a, b) => rank(a) - rank(b))

  function duplicate(fid: string) {
    const f = flows.find(x => x.id === fid)!
    const id = 'u-' + uid()
    actions.saveFlow(ac.id, { ...structuredClone(f), id, name: f.name + ' (mi versión)', custom: true })
    go(`#/ac/${ac.id}/edit/${id}`)
  }

  if (!flows.length) return <div className="card empty"><p>Todavía no hay flows.</p><a className="btn primary" href={`#/ac/${ac.id}/edit`}>Crear el primero</a></div>

  return (
    <div>
      {phases.map(ph => (
        <section key={ph}>
          <h2 className="sec">{ph}</h2>
          <div className="flow-grid">
            {flows.filter(f => (f.phase || 'Otros') === ph).map(f => {
              const best = bestScore(s, ac.id, f.id)
              const roles = [...new Set(f.steps.map(st => st.r ?? ac.roles[0]?.id))]
              return (
                <div key={f.id} className="card flow-card">
                  <div className="row between">
                    <h3>{f.name}</h3>
                    {best !== null && <span className={`score ${best >= 90 ? 'good' : best >= 60 ? 'mid' : 'low'}`}>{best}%</span>}
                  </div>
                  {f.desc && <p className="small muted">{f.desc}</p>}
                  <SourceBadge acId={ac.id} flowId={f.id} custom={f.custom} compact />
                  <div className="row gap small">
                    <span className="muted">{f.steps.length} pasos</span>
                    {roles.map(r => { const ro = ac.roles.find(x => x.id === r); return ro ? <span key={r} className="role" style={{ ['--c' as string]: ro.color }}>{ro.id}</span> : null })}
                    {f.custom && <span className="chip">propio</span>}
                  </div>
                  <div className="row gap wrap-row">
                    <a className="btn primary sm" href={`#/ac/${ac.id}/flow/${f.id}`}>Estudiar</a>
                    <a className="btn sm" href={`#/ac/${ac.id}/flow/${f.id}?mode=review`}>Repasar de memoria</a>
                    {f.custom
                      ? <a className="btn ghost sm" href={`#/ac/${ac.id}/edit/${f.id}`}>Editar</a>
                      : <button className="btn ghost sm" onClick={() => duplicate(f.id)}>Duplicar y editar</button>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function Flashcards({ ac }: { ac: Aircraft }) {
  const s = useStore()
  const flows = flowsOf(s, ac)
  const [onlyUsed, setOnlyUsed] = useState(true)
  const [hideLabels, setHideLabels] = useState(false)
  const [panel, setPanel] = useState('')
  const [view, setView, views] = useView(ac)
  const vac = viewAircraft(ac, view, s)
  const deckStats = s.cards[ac.id] ?? {}

  const deck = useMemo(() => {
    const used = new Set(flows.flatMap(f => f.steps.map(st => st.c)))
    return controlsOf(vac).filter(c => (!onlyUsed || used.has(c.id)) && (!panel || c.panel === panel))
  }, [vac, flows, onlyUsed, panel])

  const pick = () => {
    if (!deck.length) return null
    const min = Math.min(...deck.map(c => deckStats[c.id]?.box ?? 0))
    const pool = deck.filter(c => (deckStats[c.id]?.box ?? 0) <= min + 1)
    return pool[Math.floor(Math.random() * pool.length)]
  }
  const [card, setCard] = useState<Control | null>(pick)
  const [result, setResult] = useState<null | { ok: boolean; clicked: string }>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [session, setSession] = useState({ ok: 0, n: 0 })

  const current = card && deck.some(c => c.id === card.id) ? card : null

  function answer(c: Control) {
    if (!current || result) return
    const ok = c.id === current.id
    actions.cardResult(ac.id, current.id, ok)
    setResult({ ok, clicked: c.id })
    setSession(x => ({ ok: x.ok + (ok ? 1 : 0), n: x.n + 1 }))
    const t = controlById(vac, current.id)!
    setRipples([{ key: Date.now(), x: t.cx, y: t.cy, color: ok ? '#22c55e' : '#f59e0b' }])
  }
  function next() { setResult(null); setRipples([]); setCard(pick()) }

  const marks: Record<string, MarkState> = {}
  if (result && current) {
    marks[current.id] = result.ok ? 'ok' : 'hint'
    if (!result.ok) marks[result.clicked] = 'bad'
  }
  const mastered = deck.filter(c => (deckStats[c.id]?.box ?? 0) >= 3).length

  return (
    <div className="split">
      <div className="split-main">
        <ViewTabs ac={ac} view={view} setView={v => { setView(v); setResult(null); setRipples([]); setCard(null) }} views={views} />
        <Cockpit ac={vac} marks={marks} ripples={ripples} onControl={answer} showLabels={!hideLabels} />
      </div>
      <aside className="split-side">
        <div className="card flash">
          <p className="eyebrow">¿Dónde está…?</p>
          {current ? (
            <>
              <h2 className="flash-name">{current.label}</h2>
              <p className="muted small">{current.desc}</p>
              {result && <p className={result.ok ? 'ok-text' : 'bad-text'}>{result.ok ? '✓ ¡Correcto!' : `✗ Era el señalado en ámbar (${ac.panels.find(p => p.id === current.panel)?.name ?? ''})`}</p>}
              <div className="row gap">
                {result ? <button className="btn primary" onClick={next}>Siguiente →</button> : <button className="btn ghost" onClick={() => { if (current) answer({ ...current, id: '__skip' } as Control) }}>No lo sé</button>}
              </div>
            </>
          ) : deck.length ? <button className="btn primary" onClick={next}>Empezar</button> : <p className="muted">No hay mandos con este filtro.</p>}
        </div>
        <div className="card">
          <h3>Sesión</h3>
          <p><b>{session.ok}</b> / {session.n} aciertos · <b>{mastered}</b> de {deck.length} mandos dominados</p>
          <div className="bar"><i style={{ width: `${deck.length ? (mastered / deck.length) * 100 : 0}%` }} /></div>
        </div>
        <div className="card">
          <h3>Opciones</h3>
          <label className="check"><input type="checkbox" checked={onlyUsed} onChange={e => setOnlyUsed(e.target.checked)} /> Solo mandos usados en flows</label>
          <label className="check"><input type="checkbox" checked={hideLabels} onChange={e => setHideLabels(e.target.checked)} /> Modo difícil: ocultar rótulos</label>
          {ac.panels.length > 0 && (
            <label className="field">Panel
              <select value={panel} onChange={e => setPanel(e.target.value)}>
                <option value="">Todos</option>
                {ac.panels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
          )}
          <button className="btn ghost sm" onClick={next}>Nueva tarjeta</button>
        </div>
      </aside>
    </div>
  )
}
