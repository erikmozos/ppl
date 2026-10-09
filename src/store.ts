import { useSyncExternalStore } from 'react'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import type { Aircraft, Flow } from './types'
import { BUILTIN } from './data'

export interface Attempt {
  id: string
  ac: string
  flow: string
  flowName: string
  date: number
  score: number
  ok: number
  total: number
  bad: number
  hints: number
}
export interface CardStat { box: number; seen: number; ok: number }

export type Rect = [number, number, number, number]

export interface QuizStat { best: number; last: number; n: number }

/* ───────────── Estudio del PPL: respuestas, repaso espaciado y simulacros ───────────── */

export type Mode = 'practica' | 'simulacro' | 'repaso' | 'leccion'
/** motivo del fallo (diario de errores) */
export type Reason = 'nolosabia' | 'confusion' | 'calculo' | 'lectura'
/** estadística de una pregunta del banco */
export interface QStat { n: number; ok: number; t: number; last: boolean; r?: Reason }
/** estado de repaso espaciado (SM-2) de una pregunta (q:<id>) o ficha (c:<id>) */
export interface Srs { due: number; ivl: number; ef: number; reps: number; lapses: number }
export interface Answer { q: string; p: number; ok: boolean; ms: number; m: Mode; t: number }
/** un examen simulado de una materia */
export interface ExamRun { id: string; session?: string; code: string; mode: 'materia' | 'completo' | 'corto'; t: number; ok: number; n: number; ms: number; blocks: Record<string, [number, number]> }
/** convocatoria real de una materia: recomendación de la escuela e intentos */
export interface PlanEntry { rec?: string; attempts: { date: string; pass: boolean; score?: number }[] }
export interface Study {
  q: Record<string, QStat>
  srs: Record<string, Srs>
  answers: Answer[]
  exams: ExamRun[]
  plan: Record<string, PlanEntry>
  /** lecciones leídas: id → fecha */
  lessons: Record<string, number>
  /** aciertos y respuestas de las preguntas generadas (cálculo) por bloque */
  gen: Record<string, [number, number]>
}
export const emptyStudy = (): Study => ({ q: {}, srs: {}, answers: [], exams: [], plan: {}, lessons: {}, gen: {} })
/** bloque del temario de una pregunta (las generadas tienen id g-<bloque>-…) */
export const blockOf = (id: string) => (id.startsWith('g-') ? id.slice(2, 8) : id.slice(0, 6))

const DAY = 86_400_000
export type Grade = 'again' | 'hard' | 'good' | 'easy'
/** SM-2 simplificado: al acertar el intervalo crece; al fallar la pieza vuelve en 10 minutos */
export function schedule(s: Srs | undefined, g: Grade, now = Date.now()): Srs {
  const c = s ?? { due: now, ivl: 0, ef: 2.5, reps: 0, lapses: 0 }
  if (g === 'again') return { due: now + 10 * 60_000, ivl: 0, ef: Math.max(1.3, c.ef - 0.2), reps: 0, lapses: c.lapses + 1 }
  const base = c.reps === 0 ? 1 : c.reps === 1 ? 3 : c.ivl * c.ef
  const ivl = g === 'hard' ? Math.max(1, (c.ivl || 1) * 1.2) : g === 'easy' ? base * 1.3 : base
  const ef = Math.max(1.3, c.ef + (g === 'hard' ? -0.15 : g === 'easy' ? 0.15 : 0))
  return { due: now + ivl * DAY, ivl, ef, reps: c.reps + 1, lapses: c.lapses }
}

export interface State {
  /** resultados de los tests de asignaturas (clave: módulo/asignatura) */
  quiz: Record<string, QuizStat>
  /** ajustes de zonas sobre fotos: clave `${avion}/${vista}` */
  spots: Record<string, Record<string, Rect | null>>
  attempts: Attempt[]
  flows: Record<string, Flow[]>
  cards: Record<string, Record<string, CardStat>>
  customAc: Aircraft[]
  study: Study
  ready: boolean
}

function load<T>(k: string, d: T): T {
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : d
  } catch {
    return d
  }
}
function save(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* modo privado / sin espacio */ }
}

let state: State = {
  attempts: load('cf.attempts', []),
  spots: load('cf.spots', {}),
  quiz: load('cf.quiz', {}),
  flows: load('cf.flows', {}),
  cards: load('cf.cards', {}),
  customAc: [],
  study: { ...emptyStudy(), ...load<Partial<Study>>('cf.study', {}) },
  ready: false,
}
const subs = new Set<() => void>()

function update(patch: Partial<State>) {
  state = { ...state, ...patch }
  if (patch.attempts) save('cf.attempts', state.attempts)
  if (patch.flows) save('cf.flows', state.flows)
  if (patch.cards) save('cf.cards', state.cards)
  if (patch.spots) save('cf.spots', state.spots)
  if (patch.quiz) save('cf.quiz', state.quiz)
  if (patch.study) save('cf.study', state.study)
  if (patch.customAc) idbSet('cf.customAc', state.customAc).catch(() => {})
  subs.forEach(f => f())
}

idbGet<Aircraft[]>('cf.customAc')
  .then(v => update({ customAc: v ?? [], ready: true }))
  .catch(() => update({ ready: true }))

/** Para la sincronización con la nube: avisa de cada cambio y da el estado actual */
export function subscribe(fn: () => void) { subs.add(fn); return () => { subs.delete(fn) } }
export const getState = () => state

export function useStore() {
  return useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => state)
}

export const uid = () => Math.random().toString(36).slice(2, 10)

function applyAnswer(st: Study, q: string, p: number, ok: boolean, ms: number, m: Mode): Study {
  const now = Date.now()
  const answers = [{ q, p, ok, ms: Math.round(ms), m, t: now }, ...st.answers].slice(0, 800)
  if (q.startsWith('g-')) {
    const b = blockOf(q), g = st.gen[b] ?? [0, 0]
    return { ...st, gen: { ...st.gen, [b]: [g[0] + (ok ? 1 : 0), g[1] + 1] }, answers }
  }
  const prev = st.q[q] ?? { n: 0, ok: 0, t: 0, last: false }
  const key = 'q:' + q
  const srs = { ...st.srs }
  if (!ok) srs[key] = schedule(srs[key], 'again', now)
  else if (srs[key]) srs[key] = schedule(srs[key], 'good', now)
  return { ...st, q: { ...st.q, [q]: { n: prev.n + 1, ok: prev.ok + (ok ? 1 : 0), t: now, last: ok, ...(ok ? {} : { r: prev.r }) } }, srs, answers }
}

export const actions = {
  addAttempt(a: Omit<Attempt, 'id' | 'date'>) {
    update({ attempts: [{ ...a, id: uid(), date: Date.now() }, ...state.attempts].slice(0, 500) })
  },
  saveFlow(acId: string, f: Flow) {
    const list = state.flows[acId] ?? []
    const i = list.findIndex(x => x.id === f.id)
    const next = i >= 0 ? list.map(x => (x.id === f.id ? f : x)) : [...list, f]
    update({ flows: { ...state.flows, [acId]: next } })
  },
  deleteFlow(acId: string, id: string) {
    update({ flows: { ...state.flows, [acId]: (state.flows[acId] ?? []).filter(f => f.id !== id) } })
  },
  cardResult(acId: string, cid: string, ok: boolean) {
    const deck = state.cards[acId] ?? {}
    const s = deck[cid] ?? { box: 0, seen: 0, ok: 0 }
    const n = { box: ok ? Math.min(5, s.box + 1) : 0, seen: s.seen + 1, ok: s.ok + (ok ? 1 : 0) }
    update({ cards: { ...state.cards, [acId]: { ...deck, [cid]: n } } })
  },
  saveAircraft(ac: Aircraft) {
    const i = state.customAc.findIndex(a => a.id === ac.id)
    update({ customAc: i >= 0 ? state.customAc.map(a => (a.id === ac.id ? ac : a)) : [...state.customAc, ac] })
  },
  deleteAircraft(id: string) {
    const { [id]: _f, ...flows } = state.flows
    update({ customAc: state.customAc.filter(a => a.id !== id), flows })
  },
  quizResult(key: string, pct: number) {
    const q = state.quiz[key] ?? { best: 0, last: 0, n: 0 }
    update({ quiz: { ...state.quiz, [key]: { best: Math.max(q.best, pct), last: pct, n: q.n + 1 } } })
  },
  setSpot(key: string, id: string, r: Rect | null | undefined) {
    const cur = { ...(state.spots[key] ?? {}) }
    if (r === undefined) delete cur[id]
    else cur[id] = r
    update({ spots: { ...state.spots, [key]: cur } })
  },
  resetSpots(key: string) {
    const { [key]: _x, ...rest } = state.spots
    update({ spots: rest })
  },
  /** registra una respuesta del banco: estadística, historial y cola de repaso de fallos */
  answer(q: string, p: number, ok: boolean, ms: number, m: Mode) {
    update({ study: applyAnswer(state.study, q, p, ok, ms, m) })
  },
  /** varias respuestas de golpe (al entregar un simulacro) */
  answerMany(list: { q: string; p: number; ok: boolean; ms: number }[], m: Mode) {
    update({ study: list.reduce((st, a) => applyAnswer(st, a.q, a.p, a.ok, a.ms, m), state.study) })
  },
  /** motivo de un fallo (diario de errores) */
  reason(q: string, r: Reason) {
    const st = state.study
    const prev = st.q[q]
    if (prev) update({ study: { ...st, q: { ...st.q, [q]: { ...prev, r } } } })
  },
  /** valoración de una pieza en el repaso (ficha o pregunta) */
  grade(key: string, g: Grade) {
    const st = state.study
    update({ study: { ...st, srs: { ...st.srs, [key]: schedule(st.srs[key], g) } } })
  },
  /** añade una ficha al repaso si todavía no está */
  addCards(keys: string[]) {
    const st = state.study
    const now = Date.now()
    const add = keys.filter(k => !st.srs[k])
    if (!add.length) return
    const srs = { ...st.srs }
    add.forEach(k => { srs[k] = { due: now, ivl: 0, ef: 2.5, reps: 0, lapses: 0 } })
    update({ study: { ...st, srs } })
  },
  examDone(runs: ExamRun[]) {
    const st = state.study
    update({ study: { ...st, exams: [...runs, ...st.exams].slice(0, 120) } })
  },
  lessonSeen(id: string) {
    const st = state.study
    update({ study: { ...st, lessons: { ...st.lessons, [id]: Date.now() } } })
  },
  setPlan(code: string, e: PlanEntry) {
    const st = state.study
    update({ study: { ...st, plan: { ...st.plan, [code]: e } } })
  },
  resetStudy() { update({ study: emptyStudy() }) },
  snapshot() {
    const { attempts, flows, cards, customAc, spots, quiz, study } = state
    return { version: 2, exported: new Date().toISOString(), attempts, flows, cards, customAc, spots, quiz, study }
  },
  restore(data: Partial<State>) {
    update({
      attempts: data.attempts ?? [],
      flows: data.flows ?? {},
      cards: data.cards ?? {},
      customAc: data.customAc ?? [],
      spots: data.spots ?? {},
      quiz: data.quiz ?? {},
      study: { ...emptyStudy(), ...(data.study ?? {}) },
    })
  },
}

export function allAircraft(s: State): Aircraft[] {
  return [...BUILTIN, ...s.customAc]
}
export function findAircraft(s: State, id: string) {
  return allAircraft(s).find(a => a.id === id)
}
export function flowsOf(s: State, ac: Aircraft): Flow[] {
  return [...ac.flows, ...(s.flows[ac.id] ?? [])]
}
export function bestScore(s: State, acId: string, flowId: string) {
  const xs = s.attempts.filter(a => a.ac === acId && a.flow === flowId)
  return xs.length ? Math.max(...xs.map(a => a.score)) : null
}
