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

export interface State {
  /** resultados de los tests de asignaturas (clave: módulo/asignatura) */
  quiz: Record<string, QuizStat>
  /** ajustes de zonas sobre fotos: clave `${avion}/${vista}` */
  spots: Record<string, Record<string, Rect | null>>
  attempts: Attempt[]
  flows: Record<string, Flow[]>
  cards: Record<string, Record<string, CardStat>>
  customAc: Aircraft[]
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
  snapshot() {
    const { attempts, flows, cards, customAc, spots, quiz } = state
    return { version: 1, exported: new Date().toISOString(), attempts, flows, cards, customAc, spots, quiz }
  },
  restore(data: Partial<State>) {
    update({
      attempts: data.attempts ?? [],
      flows: data.flows ?? {},
      cards: data.cards ?? {},
      customAc: data.customAc ?? [],
      spots: data.spots ?? {},
      quiz: data.quiz ?? {},
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
