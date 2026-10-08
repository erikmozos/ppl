import { useEffect, useRef, useState } from 'react'
import type { Aircraft, Flow } from '../types'
import { Cockpit, type MarkState } from './Cockpit'
import { controlById } from '../layout'
import { buildViz, roleColor } from '../flowviz'
import { END_TEXT, contextFor, flowIntro, speak, stepNarration, stopSpeech, useSpeech } from '../speech'
import { useStore } from '../store'
import { bestView, viewAircraft, viewsOf } from '../views'
import { sourceOf } from '../data/sources'

type Cam = { x: number; y: number; w: number; h: number }
const ASPECT = 16 / 9

/** Encuadre 16:9 centrado en un punto, sin salirse de la imagen */
function frame(W: number, H: number, cx: number, cy: number, w: number): Cam {
  w = Math.min(w, W, H * ASPECT)
  const h = w / ASPECT
  return { x: Math.max(0, Math.min(W - w, cx - w / 2)), y: Math.max(0, Math.min(H - h, cy - h / 2)), w, h }
}
function full(W: number, H: number): Cam {
  // encuadre general con el aspecto de la pantalla (barras si hace falta)
  if (W / H > ASPECT) { const h = W / ASPECT; return { x: 0, y: (H - h) / 2, w: W, h } }
  const w = H * ASPECT
  return { x: (W - w) / 2, y: 0, w, h: H }
}
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Tutorial guiado a pantalla completa: "vídeo" generado en tiempo real con cámara que viaja
 * a cada mando, narración con voz, subtítulos y el flow dibujándose.
 */
export function Tutorial({ ac, flow, onClose, onReview }: { ac: Aircraft; flow: Flow; onClose: () => void; onReview: () => void }) {
  const s = useStore()
  const sp = useSpeech()
  const steps = flow.steps
  const n = steps.length
  const [i, setI] = useState(-1) // -1 = portada, n = final
  const [playing, setPlaying] = useState(false)
  const [extended, setExtended] = useState(false)
  const extRef = useRef(extended)
  extRef.current = extended
  const [view, setView] = useState(() => viewsOf(ac)[0].id)
  const vac = viewAircraft(ac, view, s)
  const [W, H] = vac.viewBox
  const [cam, setCam] = useState<Cam>(() => full(W, H))
  const camRef = useRef(cam)
  camRef.current = cam
  const prevVac = useRef(vac)
  const cur = i >= 0 && i < n ? steps[i] : undefined

  // vista adecuada para el paso actual
  useEffect(() => {
    if (!cur) return
    const v = bestView(ac, cur.c, s, view)
    if (v !== view) setView(v)
  }, [cur, ac, s, view])

  // cámara: viaja suavemente al mando actual (o al plano general)
  useEffect(() => {
    const c = cur ? controlById(vac, cur.c) : undefined
    const target = c ? frame(W, H, c.cx, c.cy, Math.max(W * 0.42, c.w * 5)) : full(W, H)
    // al cambiar de foto/esquema, la cámara parte del plano general de la nueva imagen
    const from = prevVac.current === vac ? camRef.current : full(W, H)
    prevVac.current = vac
    const start = performance.now(), dur = 900
    let raf = 0
    const tick = (t: number) => {
      const k = dur ? ease(Math.min(1, (t - start) / dur)) : 1
      setCam({ x: from.x + (target.x - from.x) * k, y: from.y + (target.y - from.y) * k, w: from.w + (target.w - from.w) * k, h: from.h + (target.h - from.h) * k })
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cur, vac, W, H])

  /* ── Narración ─────────────────────────────────────────────────────────────
     Un único "hilo" de reproducción; cada acción (pausa, flechas, salir) lo invalida
     con un token, así nunca hablan dos voces a la vez ni se repite un paso solo. */
  const run = useRef(0)
  const iRef = useRef(i)
  iRef.current = i
  const playingRef = useRef(playing)
  playingRef.current = playing
  const spRef = useRef(sp)
  spRef.current = sp
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
  const textFor = (j: number) => (j < 0 ? flowIntro(ac, flow) : j < n ? stepNarration(ac, steps[j], j, n, true) : END_TEXT)
  const say = (j: number) => {
    const p = spRef.current
    const t = textFor(j)
    const ctx = extRef.current && j >= 0 && j < n ? contextFor(ac, steps[j].c) : undefined
    const my = run.current
    if (!(p.prefs.enabled && (p.supported || p.neuralCount > 0))) return wait(1200 + (t.length + (ctx?.length ?? 0)) * 45)
    return speak(t).then(() => (ctx && run.current === my ? speak(ctx) : undefined))
  }
  const playFrom = async (start: number) => {
    const my = ++run.current
    setPlaying(true)
    for (let j = start; j <= n; j++) {
      if (run.current !== my) return
      setI(j)
      await Promise.all([say(j), wait(j < 0 ? 2500 : 1800)])
      if (run.current !== my) return
      if (j < n) await wait(450)
    }
    if (run.current === my) setPlaying(false)
  }
  const pause = () => { run.current++; stopSpeech(); setPlaying(false) }
  const jump = (j: number) => {
    const t = Math.min(n, Math.max(-1, j))
    if (playingRef.current) { stopSpeech(); playFrom(t) }
    else { run.current++; setI(t); say(t) }
  }
  const close = () => { run.current++; stopSpeech(); onClose() }

  // arranca al abrir y se calla al cerrar (también con el doble montaje de React en desarrollo)
  useEffect(() => {
    const t = setTimeout(() => playFrom(-1), 80)
    return () => { clearTimeout(t); run.current++; stopSpeech() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === ' ') { e.preventDefault(); if (playingRef.current) pause(); else playFrom(iRef.current >= n ? -1 : iRef.current) }
      if (e.key === 'ArrowRight') jump(iRef.current + 1)
      if (e.key === 'ArrowLeft') jump(iRef.current - 1)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })

  const shown = Math.max(0, Math.min(n, i + 1))
  const viz = buildViz(vac, steps, shown, { animateLast: true })
  if (viz.badges.length && cur) viz.badges[viz.badges.length - 1].pulse = true
  const marks: Record<string, MarkState> = {}
  if (cur) marks[cur.c] = 'active'
  const curC = cur ? controlById(ac, cur.c) : undefined
  const role = cur?.r ? ac.roles.find(r => r.id === cur.r) : undefined

  return (
    <div className="tutorial" role="dialog" aria-label={`Tutorial: ${flow.name}`}>
      <div className="tut-stage">
        <Cockpit ac={vac} camera={cam} fill zoomable={false} marks={marks} layers={viz.layers} badges={viz.badges} />
        {i < 0 && (
          <div className="tut-card">
            <p className="eyebrow">{ac.name}</p>
            <h2>{flow.name}</h2>
            <p>{flow.desc ?? `${n} pasos`}</p>
            {sourceOf(ac.id, flow.id) && <p className="small muted">📘 Basado en: {sourceOf(ac.id, flow.id)!.section}</p>}
          </div>
        )}
        {i >= n && (
          <div className="tut-card">
            <p className="eyebrow">Flow completado</p>
            <h2>{flow.name}</h2>
            <div className="row gap" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={() => playFrom(-1)}>Ver otra vez</button>
              <button className="btn primary" onClick={() => { run.current++; stopSpeech(); onReview() }}>Repasar de memoria →</button>
            </div>
          </div>
        )}
        {cur && (
          <div className="tut-sub" style={{ ['--c' as string]: roleColor(ac.roles, cur.r) }}>
            <span className="tut-n">{i + 1}</span>
            <div>
              <div className="tut-c">{curC?.label}{role && ac.roles.length > 1 && <span className="role" style={{ ['--c' as string]: role.color }}>{role.name}</span>}</div>
              <div className="tut-a">{cur.a}</div>
              {(cur.w || cur.n) && <div className="tut-w">{cur.w ?? ''} {cur.n && <em>📎 {cur.n}</em>}</div>}
              {extended && contextFor(ac, cur.c) && <div className="tut-ctx">➕ {contextFor(ac, cur.c)}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="tut-bar">
        <button className="btn sm" onClick={() => jump(i - 1)} aria-label="Anterior">◀</button>
        <button className="btn primary sm" onClick={() => (playing ? pause() : playFrom(i >= n ? -1 : i))}>{playing ? '❚❚ Pausa' : '▶ Reproducir'}</button>
        <button className="btn sm" onClick={() => jump(i + 1)} aria-label="Siguiente">▶</button>
        <div className="tut-progress"><i style={{ width: `${((i + 1) / (n + 1)) * 100}%` }} /></div>
        <span className="small muted">{Math.max(0, i + 1)}/{n}</span>
        <label className="check small" title="Muestra y lee una explicación más amplia de cada mando"><input type="checkbox" checked={extended} onChange={e => setExtended(e.target.checked)} /> ➕ Más contexto</label>
        {!sp.supported && <span className="small muted">Tu navegador no tiene voz</span>}
        <button className="btn ghost sm" onClick={close}>✕ Salir</button>
      </div>
    </div>
  )
}
