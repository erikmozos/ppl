// Simulacros con el formato de AESA (preguntas estratificadas por bloque) e indicador «listo para examinarte».
import type { BankQuestion, LessonFile } from '../data/licenses/types'
import type { SyllabusSubject } from '../data/licenses/ppl-syllabus'
import { blockOf, type Study } from '../store'
import { generate, hasGenerator } from './generators'

const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])

/** Reparte n preguntas entre los bloques en proporción a su peso (método del mayor resto) */
export function allocate(blocks: { id: string; target: number }[], n: number): Record<string, number> {
  const total = blocks.reduce((a, b) => a + b.target, 0)
  if (!total) return {}
  const raw = blocks.map(b => ({ id: b.id, x: (n * b.target) / total }))
  const out: Record<string, number> = {}
  raw.forEach(r => { out[r.id] = Math.floor(r.x) })
  let left = n - Object.values(out).reduce((a, b) => a + b, 0)
  for (const r of [...raw].sort((a, b) => (b.x % 1) - (a.x % 1))) { if (left-- <= 0) break; out[r.id]++ }
  return out
}

/** ids vistos en los últimos simulacros (para no repetir mientras queden inéditas) */
function recentlySeen(st: Study, howMany: number) {
  return new Set(st.answers.filter(a => a.m === 'simulacro').slice(0, howMany).map(a => a.q))
}

/** Elige k preguntas de un bloque: primero las no vistas, con mezcla de dificultad 30/50/20 */
function pickFrom(pool: BankQuestion[], k: number, seen: Set<string>): BankQuestion[] {
  const fresh = shuffle(pool.filter(q => !seen.has(q.id)))
  const old = shuffle(pool.filter(q => seen.has(q.id)))
  const want = { 1: Math.round(k * 0.3), 3: Math.round(k * 0.2), 2: 0 } as Record<number, number>
  want[2] = k - want[1] - want[3]
  const out: BankQuestion[] = []
  for (const lvl of [1, 2, 3]) out.push(...fresh.filter(q => q.level === lvl).slice(0, want[lvl]))
  for (const q of [...fresh, ...old]) { if (out.length >= k) break; if (!out.includes(q)) out.push(q) }
  return out.slice(0, k)
}

/**
 * Examen de una materia: n preguntas repartidas por bloque según el temario.
 * Los bloques con generador aportan cálculo con valores nuevos (≈1/3 de sus preguntas, o todas si faltan del banco).
 */
export function buildExam(sub: SyllabusSubject, files: LessonFile[], st: Study, n: number): BankQuestion[] {
  const bank = new Map<string, BankQuestion[]>()
  files.forEach(f => bank.set(f.lesson.id, f.questions))
  const usable = sub.blocks.filter(b => (bank.get(b.id)?.length ?? 0) > 0 || hasGenerator(b.id))
  const alloc = allocate(usable, n)
  const seen = recentlySeen(st, 600)
  const out: BankQuestion[] = []
  for (const b of usable) {
    const k = alloc[b.id] ?? 0
    if (!k) continue
    const pool = bank.get(b.id) ?? []
    const gens = hasGenerator(b.id) ? Math.max(k - pool.length, Math.round(k / 3)) : 0
    out.push(...pickFrom(pool, k - gens, seen))
    for (let i = 0; i < gens; i++) out.push(generate(b.id))
  }
  // si el banco no da para todo, se completa con lo que haya en cualquier bloque
  if (out.length < n) {
    const rest = shuffle(files.flatMap(f => f.questions).filter(q => !out.includes(q)))
    out.push(...rest.slice(0, n - out.length))
  }
  return shuffle(out).slice(0, n)
}

/** Aciertos y respuestas por bloque (banco + generadas) */
export function blockStats(st: Study): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {}
  for (const [id, s] of Object.entries(st.q)) {
    const b = blockOf(id), v = out[b] ?? [0, 0]
    out[b] = [v[0] + s.ok, v[1] + s.n]
  }
  for (const [b, [ok, n]] of Object.entries(st.gen ?? {})) {
    const v = out[b] ?? [0, 0]
    out[b] = [v[0] + ok, v[1] + n]
  }
  return out
}

export interface Readiness {
  ready: boolean
  runs: { pct: number; t: number }[]
  answered: number
  accuracy: number | null
  weak: string[]
  few: string[]
}

/**
 * «Listo para examinarte»: los tres últimos simulacros de la materia con un 85 % o más
 * y ningún bloque por debajo del 70 %, con al menos 20 respuestas en cada bloque.
 */
export function readiness(sub: SyllabusSubject, st: Study, stats = blockStats(st)): Readiness {
  const runs = st.exams.filter(r => r.code === sub.code && r.mode !== 'corto').slice(0, 3).map(r => ({ pct: Math.round((r.ok / r.n) * 100), t: r.t }))
  let ok = 0, n = 0
  const weak: string[] = [], few: string[] = []
  for (const b of sub.blocks) {
    const [bo, bn] = stats[b.id] ?? [0, 0]
    ok += bo; n += bn
    if (bn < 20) few.push(b.id)
    else if (bo / bn < 0.7) weak.push(b.id)
  }
  const ready = runs.length === 3 && runs.every(r => r.pct >= 85) && !weak.length && !few.length
  return { ready, runs, answered: n, accuracy: n ? Math.round((ok / n) * 100) : null, weak, few }
}
