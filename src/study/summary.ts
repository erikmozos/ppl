// Resumen del estudio de un alumno (lo guarda la nube para el panel de administración).
import { blockOf, type Study } from '../store'

export function studySummary(st: Study) {
  const bySubject: Record<string, [number, number]> = {}
  for (const [id, s] of Object.entries(st.q)) {
    const c = blockOf(id).slice(0, 3)
    const v = bySubject[c] ?? [0, 0]
    bySubject[c] = [v[0] + s.ok, v[1] + s.n]
  }
  for (const [b, [ok, n]] of Object.entries(st.gen ?? {})) {
    const c = b.slice(0, 3), v = bySubject[c] ?? [0, 0]
    bySubject[c] = [v[0] + ok, v[1] + n]
  }
  const answered = Object.values(bySubject).reduce((a, v) => a + v[1], 0)
  const correct = Object.values(bySubject).reduce((a, v) => a + v[0], 0)
  const now = Date.now()
  const reasons: Record<string, number> = {}
  for (const s of Object.values(st.q)) if (s.r && !s.last) reasons[s.r] = (reasons[s.r] ?? 0) + 1
  const last = st.exams[0]
  return {
    answered,
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    bySubject,
    exams: st.exams.length,
    lastExam: last ? { code: last.code, pct: Math.round((last.ok / last.n) * 100), t: last.t } : null,
    due: Object.values(st.srs).filter(s => s.due <= now).length,
    lessons: Object.keys(st.lessons).length,
    reasons,
  }
}
export type StudySummary = ReturnType<typeof studySummary>
