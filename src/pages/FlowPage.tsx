import { useEffect, useMemo, useRef, useState } from 'react'
import type { Aircraft, Control, Step } from '../types'
import { Cockpit, type MarkState, type Ripple } from '../components/Cockpit'
import { controlById } from '../layout'
import { actions, flowsOf, useStore } from '../store'
import { buildViz, roleColor } from '../flowviz'
import { exportPng } from '../exportPng'
import { ViewTabs } from '../components/ViewTabs'
import { bestView, useView, viewAircraft, viewWith } from '../views'
import { Tutorial } from '../components/Tutorial'
import { VoiceSettings } from '../components/VoiceSettings'
import { contextFor, speak, stepNarration, stopSpeech, useSpeech } from '../speech'
import { go } from '../router'
import { VideoList } from '../components/Videos'
import { VIDEOS } from '../data/videos'
import { SourceBadge } from '../components/SourceBadge'

export function FlowPage({ ac, flowId, mode }: { ac: Aircraft; flowId: string; mode: 'study' | 'review' }) {
  const s = useStore()
  const flow = flowsOf(s, ac).find(f => f.id === flowId)
  const [tutorial, setTutorial] = useState(false)
  if (!flow) return <div className="wrap"><p>Flow no encontrado. <a href={`#/ac/${ac.id}?tab=procs`}>Volver</a></p></div>
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href={`#/ac/${ac.id}?tab=procs`}>← {ac.short} · Procedimientos</a>
          <h1>{flow.name}</h1>
          {flow.desc && <p className="muted">{flow.desc}</p>}
          <SourceBadge acId={ac.id} flowId={flow.id} custom={flow.custom} />
        </div>
        <div className="row gap wrap-row">
        <button className="btn primary" onClick={() => setTutorial(true)}>Tutorial guiado</button>
        <div className="seg">
          <a className={mode === 'study' ? 'on' : ''} href={`#/ac/${ac.id}/flow/${flow.id}`}>Estudio</a>
          <a className={mode === 'review' ? 'on' : ''} href={`#/ac/${ac.id}/flow/${flow.id}?mode=review`}>Repaso</a>
        </div>
        </div>
      </div>
      {tutorial && <Tutorial ac={ac} flow={flow} onClose={() => setTutorial(false)} onReview={() => { setTutorial(false); go(`#/ac/${ac.id}/flow/${flow.id}?mode=review`) }} />}
      {mode === 'study' ? <Study ac={ac} steps={flow.steps} title={flow.name} suspended={tutorial} /> : <Review ac={ac} steps={flow.steps} flowId={flow.id} flowName={flow.name} />}
      {mode === 'study' && (VIDEOS[ac.id] ?? []).some(v => v.flow === flow.id) && (
        <section>
          <h2 className="sec">Vídeos de este procedimiento</h2>
          <VideoList videos={(VIDEOS[ac.id] ?? []).filter(v => v.flow === flow.id)} />
        </section>
      )}
    </div>
  )
}

function RoleToggles({ ac, steps, active, setActive }: { ac: Aircraft; steps: Step[]; active: Set<string>; setActive: (s: Set<string>) => void }) {
  const roles = ac.roles.filter(r => steps.some(st => (st.r ?? ac.roles[0].id) === r.id))
  if (roles.length < 2) return null
  return (
    <div className="row gap wrap-row">
      {roles.map(r => (
        <button key={r.id} className={`role-btn ${active.has(r.id) ? 'on' : ''}`} style={{ ['--c' as string]: r.color }}
          onClick={() => { const n = new Set(active); if (n.has(r.id)) { if (n.size > 1) n.delete(r.id) } else n.add(r.id); setActive(n) }}>
          <i />{r.name}
        </button>
      ))}
    </div>
  )
}

function Study({ ac, steps: all, title, suspended }: { ac: Aircraft; steps: Step[]; title: string; suspended: boolean }) {
  const s = useStore()
  const [view, setView, views] = useView(ac)
  const [autoView, setAutoView] = useState(true)
  const vac = viewAircraft(ac, view, s)
  const [active, setActive] = useState(() => new Set(ac.roles.map(r => r.id)))
  const steps = all.filter(st => active.has(st.r ?? ac.roles[0].id))
  const [k, setK] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1400)
  const [narrate, setNarrate] = useState(true)
  const [detailed, setDetailed] = useState(true)
  const [readCtx, setReadCtx] = useState(false)
  const [showCtx, setShowCtx] = useState(false)
  const sp = useSpeech()
  const svgRef = useRef<SVGSVGElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const n = steps.length
  const kk = Math.min(Math.max(k, 0), n)
  const voiceOn = narrate && sp.prefs.enabled && (sp.supported || sp.neuralCount > 0)

  /* ── Reproductor ──────────────────────────────────────────────────────────
     La voz SOLO suena por una acción del usuario (avanzar, tocar un paso, reproducir).
     Cada acción invalida la anterior con un token, así nunca se solapan dos voces. */
  const run = useRef(0)
  const live = useRef({ steps, n, voiceOn, detailed, speed, kk, readCtx })
  live.current = { steps, n, voiceOn, detailed, speed, kk, readCtx }
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
  const narrateStep = (i: number) => {
    const L = live.current, st = L.steps[i - 1]
    if (!L.voiceOn || !st) { stopSpeech(); return null }
    const my = run.current
    const ctx = L.readCtx ? contextFor(ac, st.c) : undefined
    // explicación del paso y, si está activado, el contexto ampliado (solo si nadie lo ha interrumpido)
    return speak(stepNarration(ac, st, i - 1, L.n, L.detailed)).then(() => (ctx && run.current === my ? speak(ctx) : undefined))
  }
  const stop = () => { run.current++; setPlaying(false); stopSpeech() }
  const goTo = (i: number) => {
    run.current++
    setPlaying(false)
    const t = Math.min(Math.max(i, 0), live.current.n)
    setK(t)
    if (t > 0) narrateStep(t)
    else stopSpeech()
  }
  const play = async () => {
    const my = ++run.current
    setPlaying(true)
    const L = live.current
    const start = L.kk <= 0 || L.kk >= L.n ? 1 : L.kk
    for (let i = start; i <= live.current.n; i++) {
      if (run.current !== my) return
      setK(i)
      const spoken = narrateStep(i)
      await (spoken ?? wait(live.current.speed))
      if (run.current !== my) return
      if (spoken) await wait(450)
    }
    if (run.current === my) setPlaying(false)
  }
  // al salir de la página o abrir el tutorial, se calla
  useEffect(() => () => { run.current++; stopSpeech() }, [])
  useEffect(() => { if (suspended) stop() }, [suspended])

  useEffect(() => {
    listRef.current?.querySelector('.cur')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [kk])

  // cambia sola a la vista (foto/esquema) donde está el mando del paso actual
  const curId = steps[kk - 1]?.c
  useEffect(() => {
    if (!autoView || !curId) return
    const v = bestView(ac, curId, s, view)
    if (v !== view) setView(v)
  }, [curId, autoView, ac, s, view, setView])

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (suspended) return
      if (e.key === 'ArrowRight') goTo(live.current.kk + 1)
      if (e.key === 'ArrowLeft') goTo(live.current.kk - 1)
      if (e.key === ' ') { e.preventDefault(); if (playingRef.current) stop(); else play() }
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })
  const playingRef = useRef(playing)
  playingRef.current = playing

  const { layers, badges } = buildViz(vac, steps, kk, { animateLast: true })
  const marks: Record<string, MarkState> = {}
  steps.slice(0, kk - 1).forEach(st => (marks[st.c] = 'done'))
  const cur = steps[kk - 1]
  if (cur) marks[cur.c] = 'active'
  if (badges.length) badges[badges.length - 1].pulse = true
  const curC = cur ? controlById(ac, cur.c) : undefined

  return (
    <div className="split">
      <div className="split-main">
        <ViewTabs ac={ac} view={view} setView={v => { setView(v); setAutoView(false) }} views={views} extra={views.length > 1 && <label className="check small"><input type="checkbox" checked={autoView} onChange={e => setAutoView(e.target.checked)} /> Cambiar de vista solo</label>} />
        <Cockpit ac={vac} svgRef={svgRef} marks={marks} layers={layers} badges={badges}
          onControl={c => { const i = steps.findIndex((st, j) => st.c === c.id && j >= kk); const i2 = i >= 0 ? i : steps.findIndex(st => st.c === c.id); if (i2 >= 0) goTo(i2 + 1) }} />
        <div className="player card">
          <button className="btn sm" onClick={() => { stop(); setK(0) }} aria-label="Reiniciar">⏮</button>
          <button className="btn sm" onClick={() => goTo(kk - 1)} aria-label="Anterior">◀</button>
          <button className="btn primary sm" onClick={() => (playing ? stop() : play())}>{playing ? 'Pausa' : 'Reproducir'}</button>
          <button className="btn sm" onClick={() => goTo(kk + 1)} aria-label="Siguiente">▶</button>
          <button className="btn sm" onClick={() => { stop(); setK(n) }}>Ver todo</button>
          <span className="muted small">{kk} / {n}</span>
          <label className="small muted speed">Velocidad
            <input type="range" min={500} max={3000} step={100} value={3500 - speed} onChange={e => setSpeed(3500 - Number(e.target.value))} />
          </label>
          <button className="btn ghost sm" onClick={() => exportPng(svgRef.current!, `${ac.short} · ${title}`, steps.map((st, i) => `${i + 1}. ${controlById(ac, st.c)?.label ?? st.c}`).slice(0, 6).join('  ') + (n > 6 ? '  …' : ''), ac.roles.filter(r => steps.some(st => (st.r ?? ac.roles[0].id) === r.id)))}>Exportar PNG</button>
        </div>
        {cur && !controlById(vac, cur.c) && (
          <p className="offview">Este mando no aparece en esta vista.<button className="btn sm" onClick={() => { const v = viewWith(ac, cur.c, s, view); if (v) setView(v) }}>Ver dónde está</button></p>
        )}
        {cur && (
          <div className="now card" style={{ ['--c' as string]: roleColor(ac.roles, cur.r) }}>
            <span className="now-n">{kk}</span>
            <div>
              <div className="now-c">{curC?.label} {cur.r && <span className="role" style={{ ['--c' as string]: roleColor(ac.roles, cur.r) }}>{cur.r}</span>}</div>
              <div className="now-a">{cur.a}</div>
              {cur.w && <div className="why">{cur.w}</div>}
              {cur.n && <div className="note">{cur.n}</div>}
              {contextFor(ac, cur.c) && (
                <details className="ctx" open={showCtx} onToggle={e => setShowCtx((e.target as HTMLDetailsElement).open)}>
                  <summary>Más contexto <span className="muted small">— si no terminas de entender este paso</span></summary>
                  <p>{contextFor(ac, cur.c)}</p>
                  {sp.prefs.enabled && <button className="btn ghost sm" onClick={() => { run.current++; setPlaying(false); speak(contextFor(ac, cur.c)!) }}>Escuchar el contexto</button>}
                </details>
              )}
            </div>
          </div>
        )}
      </div>
      <aside className="split-side">
        <RoleToggles ac={ac} steps={all} active={active} setActive={a => { stop(); setActive(a); setK(1) }} />
        <div className="card row gap wrap-row">
          <label className="check"><input type="checkbox" checked={narrate} onChange={e => { setNarrate(e.target.checked); if (!e.target.checked) stopSpeech() }} /> Narrar cada paso</label>
          <label className="check"><input type="checkbox" checked={detailed} onChange={e => setDetailed(e.target.checked)} /> Con explicación</label>
          <label className="check"><input type="checkbox" checked={readCtx} onChange={e => setReadCtx(e.target.checked)} /> Leer también el contexto ampliado</label>
        </div>
        <ol className="steps card" ref={listRef}>
          {steps.map((st, i) => (
            <li key={i} className={i === kk - 1 ? 'cur' : i < kk ? 'past' : ''} onClick={() => goTo(i + 1)}>
              <span className="n" style={{ background: roleColor(ac.roles, st.r) }}>{i + 1}</span>
              <div>
                <b>{controlById(ac, st.c)?.label ?? st.c}</b>
                <span>{st.a}</span>
                {st.n && <em>{st.n}</em>}
              </div>
            </li>
          ))}
        </ol>
        <p className="small muted">Atajos: ← → para avanzar, espacio para reproducir. Toca un mando para saltar a su paso.</p>
        <VoiceSettings />
      </aside>
    </div>
  )
}

type Res = 'ok' | 'late' | 'fail'

function Review({ ac, steps: all, flowId, flowName }: { ac: Aircraft; steps: Step[]; flowId: string; flowName: string }) {
  const s = useStore()
  const [view, setView, views] = useView(ac)
  const vac = viewAircraft(ac, view, s)
  /** Lleva a la vista donde está un mando y devuelve su posición en esa vista */
  function locate(id: string) {
    const v = viewWith(ac, id, s, view) ?? view
    if (v !== view) setView(v)
    return controlById(viewAircraft(ac, v, s), id)
  }
  const [active, setActive] = useState(() => new Set(ac.roles.map(r => r.id)))
  const [hideLabels, setHideLabels] = useState(false)
  const steps = useMemo(() => all.filter(st => active.has(st.r ?? ac.roles[0].id)), [all, active, ac])
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<Res[]>([])
  const [bad, setBad] = useState(0)
  const [misses, setMisses] = useState(0)
  const [hint, setHint] = useState(0)
  const [hints, setHints] = useState(0)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [flash, setFlash] = useState<{ id: string; ok: boolean } | null>(null)
  const [compare, setCompare] = useState(false)
  const saved = useRef(false)
  const n = steps.length
  const done = idx >= n
  const target = steps[idx]

  function reset() {
    setIdx(0); setResults([]); setBad(0); setMisses(0); setHint(0); setHints(0); setRipples([]); setFlash(null); setCompare(false); saved.current = false
  }

  const ok = results.filter(r => r === 'ok').length
  const score = n ? Math.round(((ok + results.filter(r => r === 'late').length * 0.5) / n) * 100) : 0

  useEffect(() => {
    if (done && n && !saved.current) {
      saved.current = true
      actions.addAttempt({ ac: ac.id, flow: flowId, flowName, score, ok, total: n, bad, hints })
    }
  }, [done, n, ac.id, flowId, flowName, score, ok, bad, hints])

  function advance(r: Res) {
    setResults(x => [...x, r]); setIdx(i => i + 1); setMisses(0); setHint(0)
  }

  function click(c: Control) {
    if (done || !target) return
    const key = Date.now()
    if (c.id === target.c) {
      setRipples([{ key, x: c.cx, y: c.cy, color: '#22c55e' }])
      setFlash({ id: c.id, ok: true })
      advance(misses === 0 && hint < 2 ? 'ok' : 'late')
    } else {
      setBad(b => b + 1)
      setFlash({ id: c.id, ok: false })
      const m = misses + 1
      setMisses(m)
      setRipples([{ key, x: c.cx, y: c.cy, color: '#ef4444' }])
      if (m >= 3) {
        const t = controlById(vac, target.c)
        if (t) setRipples([{ key: key + 1, x: t.cx, y: t.cy, color: '#f59e0b' }])
        advance('fail')
      }
    }
  }

  function takeHint() {
    if (!target || hint >= 2) return
    const h = hint + 1
    setHint(h); setHints(x => x + 1)
    if (h === 2) {
      const t = locate(target.c)
      if (t) setRipples([{ key: Date.now(), x: t.cx, y: t.cy, color: '#f59e0b' }])
    }
  }

  const viz = buildViz(vac, steps, compare ? n : idx, { animateLast: !compare })
  const marks: Record<string, MarkState> = {}
  if (flash) marks[flash.id] = flash.ok ? 'ok' : 'bad'
  if (done) steps.forEach((st, i) => { marks[st.c] = results[i] === 'fail' ? 'bad' : results[i] === 'late' ? 'hint' : 'ok' })

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 600)
    return () => clearTimeout(t)
  }, [flash])

  const role = target ? ac.roles.find(r => r.id === (target.r ?? ac.roles[0].id)) : undefined

  return (
    <div className="split">
      <div className="split-main">
        <ViewTabs ac={ac} view={view} setView={v => { setView(v); setRipples([]) }} views={views} />
        <Cockpit ac={vac} marks={marks} layers={viz.layers} badges={viz.badges} ripples={ripples} onControl={click} showLabels={!hideLabels} />
      </div>
      <aside className="split-side">
        {!done ? (
          <div className="card hud">
            <p className="eyebrow">Flow oculto · reconstrúyelo de memoria</p>
            <div className="hud-step">
              <span className="big">{idx + 1}</span><span className="muted">/ {n}</span>
              {role && ac.roles.length > 1 && <span className="role" style={{ ['--c' as string]: role.color }}>{role.name}</span>}
            </div>
            <div className="counters">
              <span className="ok-text">✓ {ok}</span>
              <span className="bad-text">✗ {bad}</span>
              <span className="muted">{hints} pistas</span>
            </div>
            {hint >= 1 && target && <div className="hint-box">{target.a}</div>}
            {misses > 0 && <p className="small bad-text">Fallos en este paso: {misses}/3 {misses === 2 && '(uno más y se revela)'}</p>}
            <div className="row gap wrap-row">
              <button className="btn" onClick={takeHint} disabled={hint >= 2}>{hint === 0 ? 'Pista 1 · acción' : hint === 1 ? 'Pista 2 · ubicación' : 'Sin más pistas'}</button>
              <button className="btn ghost" onClick={() => { const t = controlById(vac, target.c); if (t) setRipples([{ key: Date.now(), x: t.cx, y: t.cy, color: '#f59e0b' }]); advance('fail') }}>Saltar</button>
            </div>
            <div className="dots">{steps.map((_, i) => <i key={i} className={results[i] ?? (i === idx ? 'cur' : '')} />)}</div>
          </div>
        ) : (
          <div className="card hud">
            <p className="eyebrow">Resultado</p>
            <div className={`result ${score >= 90 ? 'good' : score >= 60 ? 'mid' : 'low'}`}>{score}%</div>
            <p>{ok} a la primera · {results.filter(r => r === 'late').length} con ayuda · {results.filter(r => r === 'fail').length} revelados · {bad} clics erróneos · {hints} pistas</p>
            <div className="row gap wrap-row">
              <button className="btn primary" onClick={reset}>Repetir</button>
              <button className={`btn ${compare ? 'on' : ''}`} onClick={() => setCompare(c => !c)}>{compare ? 'Ocultar flow' : 'Superponer flow correcto'}</button>
            </div>
            <ol className="steps compact">
              {steps.map((st, i) => (
                <li key={i} className={results[i]}>
                  <span className="n">{results[i] === 'ok' ? '✓' : results[i] === 'late' ? '~' : '✗'}</span>
                  <div><b>{controlById(ac, st.c)?.label}</b><span>{st.a}</span></div>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="card">
          <h3>Opciones</h3>
          <RoleToggles ac={ac} steps={all} active={active} setActive={a => { setActive(a); reset() }} />
          <label className="check"><input type="checkbox" checked={hideLabels} onChange={e => setHideLabels(e.target.checked)} /> Ocultar rótulos de la cabina</label>
          <p className="small muted">Toca los mandos en el orden del flow. Con 3 fallos en un paso, se revela y cuenta como fallado. Practica un rol para aprender tu parte, o todos para el flow completo de la tripulación.</p>
        </div>
      </aside>
    </div>
  )
}
