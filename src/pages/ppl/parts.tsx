// Piezas del módulo PPL: simulador de examen, repaso diario y gestor de la convocatoria
import { useMemo, useState } from 'react'
import { PPL_SYLLABUS, syllabusByCode, type SyllabusSubject } from '../../data/licenses/ppl-syllabus'
import type { BankQuestion, Card, LessonFile } from '../../data/licenses/types'
import { loadLesson, lessonsOf, loadSubject, LESSON_IDS } from '../../study/content'
import { buildExam, blockStats, readiness } from '../../study/exam'
import { actions, blockOf, uid, useStore, type ExamRun, type PlanEntry, type Study } from '../../store'
import { ExamRunner, type ExamPart } from '../../components/ExamRunner'
import { Practice, REASONS } from '../../components/Practice'
import { CardReview } from '../../components/CardReview'

const dmy = (t: number) => new Date(t).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
const MODE_NAME: Record<ExamRun['mode'], string> = { materia: 'Materia', completo: 'Convocatoria completa', corto: 'Simulacro corto' }

/* ───────────── Simulador de examen ───────────── */

export function ExamCenter({ fixed }: { fixed?: SyllabusSubject }) {
  const s = useStore()
  const [mode, setMode] = useState<ExamRun['mode']>('materia')
  const [code, setCode] = useState(fixed?.code ?? '020')
  const [parts, setParts] = useState<ExamPart[] | null>(null)
  const [cur, setCur] = useState(0)
  const [session, setSession] = useState('')
  const [loading, setLoading] = useState(false)
  const [between, setBetween] = useState<ExamRun | null>(null)

  async function start() {
    setLoading(true)
    const subs = mode === 'completo' && !fixed ? PPL_SYLLABUS : [syllabusByCode(fixed?.code ?? code)!]
    const built: ExamPart[] = []
    for (const sub of subs) {
      const files = await loadSubject(sub.code)
      const n = mode === 'corto' ? Math.ceil(sub.exam.questions / 2) : sub.exam.questions
      const qs = buildExam(sub, files, s.study, n)
      if (qs.length) built.push({ code: sub.code, name: `${sub.code} ${sub.name}`, minutes: mode === 'corto' ? Math.ceil(sub.exam.minutes / 2) : sub.exam.minutes, questions: qs })
    }
    setLoading(false)
    setSession(uid()); setCur(0); setBetween(null)
    setParts(built.length ? built : [])
  }

  if (parts && parts.length && cur < parts.length && !between) {
    return <ExamRunner key={session + cur} part={parts[cur]} mode={mode} session={session}
      onDone={r => { if (cur + 1 < parts.length) setBetween(r) }}
      onExit={() => { setParts(null) }} />
  }
  if (parts && between) {
    const pct = Math.round((between.ok / between.n) * 100)
    return (
      <div className="panel">
        <p>Materia {cur + 1} de {parts.length} entregada: <b>{pct} %</b> ({between.ok}/{between.n}).</p>
        <p className="muted small">En el examen real cada materia tiene su propio tiempo. Siguiente: {parts[cur + 1].name}, {parts[cur + 1].questions.length} preguntas en {parts[cur + 1].minutes} min.</p>
        <div className="row gap"><button className="btn primary" onClick={() => { setCur(c => c + 1); setBetween(null) }}>Empezar la siguiente</button><button className="btn" onClick={() => setParts(null)}>Dejarlo aquí</button></div>
      </div>
    )
  }

  const runs = s.study.exams.filter(r => !fixed || r.code === fixed.code).slice(0, 15)
  const total = PPL_SYLLABUS.reduce((a, x) => a + x.exam.questions, 0)
  return (
    <div className="stack">
      <div className="panel">
        {!fixed && (
          <div className="choice-list" role="radiogroup">
            {([['materia', 'Materia suelta', 'Las preguntas y el tiempo de AESA para una materia.'], ['completo', 'Convocatoria completa', `Las 9 materias seguidas: ${total} preguntas en 3 h 35 min, cada una con su cronómetro.`], ['corto', 'Simulacro corto', 'La mitad de preguntas y de tiempo, para el día a día.']] as const).map(([k, t, d]) => (
              <label key={k} className={`choice ${mode === k ? 'on' : ''}`}><input type="radio" name="mode" checked={mode === k} onChange={() => setMode(k)} /><span><b>{t}</b><span className="muted small">{d}</span></span></label>
            ))}
          </div>
        )}
        {fixed && (
          <div className="seg-row">
            <button className={mode !== 'corto' ? 'on' : ''} onClick={() => setMode('materia')}>Examen completo · {fixed.exam.questions} preguntas, {fixed.exam.minutes} min</button>
            <button className={mode === 'corto' ? 'on' : ''} onClick={() => setMode('corto')}>Corto · {Math.ceil(fixed.exam.questions / 2)} preguntas</button>
          </div>
        )}
        {!fixed && mode !== 'completo' && (
          <label className="w-field"><span>Materia</span>
            <select className="input" value={code} onChange={e => setCode(e.target.value)}>
              {PPL_SYLLABUS.map(x => <option key={x.code} value={x.code}>{x.code} {x.name} · {x.exam.questions} preguntas, {x.exam.minutes} min</option>)}
            </select>
          </label>
        )}
        <p className="muted small">Preguntas repartidas por bloque según el peso del temario, sin repetir las de los últimos simulacros mientras queden inéditas, con 30 % fáciles, 50 % medias y 20 % difíciles; las de cálculo cambian de valores en cada intento. Nota solo al entregar; aprobado con el 75 %.</p>
        {parts && !parts.length && <p className="notice">Todavía no hay preguntas suficientes de esta materia.</p>}
        <div><button className="btn primary" onClick={start} disabled={loading}>{loading ? 'Preparando…' : 'Empezar'}</button></div>
      </div>
      {runs.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Fecha</th><th>Materia</th><th>Modo</th><th>Nota</th><th /></tr></thead>
            <tbody>{runs.map(r => { const pct = Math.round((r.ok / r.n) * 100); return <tr key={r.id}><td>{dmy(r.t)}</td><td>{r.code} {syllabusByCode(r.code)?.name}</td><td>{MODE_NAME[r.mode]}</td><td>{r.ok}/{r.n} · {pct} %</td><td className={r.ok >= Math.ceil(r.n * 0.75) ? 'ok-text' : 'bad-text'}>{r.ok >= Math.ceil(r.n * 0.75) ? 'Aprobado' : 'Suspenso'}</td></tr> })}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ───────────── Repaso diario («Hoy toca») ───────────── */

export function dueKeys(st: Study, now = Date.now()) {
  const due = Object.entries(st.srs).filter(([, v]) => v.due <= now).sort((a, b) => a[1].due - b[1].due).map(([k]) => k)
  return { q: due.filter(k => k.startsWith('q:')).map(k => k.slice(2)), c: due.filter(k => k.startsWith('c:')).map(k => k.slice(2)) }
}

export function DailyReview() {
  const s = useStore()
  const [step, setStep] = useState<'idle' | 'loading' | 'questions' | 'cards' | 'end'>('idle')
  const [qs, setQs] = useState<BankQuestion[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const due = dueKeys(s.study)
  const soon = dueKeys(s.study, Date.now() + 86_400_000)
  const stats = useMemo(() => blockStats(s.study), [s.study])
  const weakest = useMemo(() => {
    const rows = PPL_SYLLABUS.map(sub => { const r = readiness(sub, s.study, stats); return { sub, acc: r.accuracy ?? -1, n: r.answered } })
    return rows.filter(r => lessonsOf(r.sub.code).length).sort((a, b) => (a.n < 10 ? -1 : a.acc) - (b.n < 10 ? -1 : b.acc))[0]?.sub
  }, [s.study, stats])
  const reasons = useMemo(() => {
    const out: Record<string, number> = {}
    for (const q of Object.values(s.study.q)) if (q.r && !q.last) out[q.r] = (out[q.r] ?? 0) + 1
    return out
  }, [s.study.q])

  async function start() {
    setStep('loading')
    const qIds = due.q.slice(0, 30), cIds = due.c.slice(0, 40)
    const blocks = [...new Set([...qIds.map(blockOf), ...cIds.map(c => c.slice(0, 6))])].filter(b => LESSON_IDS.includes(b))
    const files: LessonFile[] = await Promise.all(blocks.map(loadLesson))
    const qMap = new Map(files.flatMap(f => f.questions).map(q => [q.id, q]))
    const cMap = new Map(files.flatMap(f => f.cards).map(c => [c.id, c]))
    const q = qIds.map(id => qMap.get(id)).filter(Boolean) as BankQuestion[]
    const c = cIds.map(id => cMap.get(id)).filter(Boolean) as Card[]
    setQs(q); setCards(c)
    setStep(q.length ? 'questions' : c.length ? 'cards' : 'end')
  }

  if (step === 'questions') return <Practice questions={qs} mode="repaso" title="Repaso de fallos" onFinish={() => setStep(cards.length ? 'cards' : 'end')} />
  if (step === 'cards') return <CardReview cards={cards} onDone={() => setStep('end')} />
  return (
    <div className="stack">
      <div className="panel">
        {step === 'end' ? <p><b>Repaso de hoy terminado.</b></p> : null}
        <div className="kpi-row">
          <div><b>{due.q.length}</b><span>preguntas falladas para repasar</span></div>
          <div><b>{due.c.length}</b><span>fichas que tocan hoy</span></div>
        </div>
        {soon.q.length + soon.c.length > due.q.length + due.c.length && <p className="small">Y {soon.q.length + soon.c.length - due.q.length - due.c.length} más en las próximas 24 horas (las falladas vuelven a los 10 minutos).</p>}
        <p className="muted small">Cada pieza vuelve cuando estás a punto de olvidarla: al acertar, el intervalo crece; al fallar, vuelve en minutos. Las fichas entran en el repaso cuando marcas una lección como leída.</p>
        <div className="row gap wrap-row">
          <button className="btn primary" onClick={start} disabled={step === 'loading' || (!due.q.length && !due.c.length)}>{step === 'loading' ? 'Preparando…' : 'Empezar el repaso de hoy'}</button>
          {weakest && <a className="btn" href={`#/licencias/ppl/${weakest.id}?tab=simulacro`}>Minisimulacro de tu materia más floja: {weakest.name}</a>}
        </div>
      </div>
      {Object.keys(reasons).length > 0 && (
        <div className="panel">
          <h3>Diario de errores</h3>
          <p className="muted small">Por qué fallas las preguntas que todavía no has corregido.</p>
          <div className="kpi-row">{REASONS.map(([r, label]) => <div key={r}><b>{reasons[r] ?? 0}</b><span>{label}</span></div>)}</div>
        </div>
      )}
    </div>
  )
}

/* ───────────── Gestor de la convocatoria real ───────────── */

const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x }
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
const days = (d: Date) => Math.ceil((d.getTime() - Date.now()) / 86_400_000)

export function ExamPlan() {
  const s = useStore()
  const plan = s.study.plan
  const all = PPL_SYLLABUS.map(sub => ({ sub, e: plan[sub.code] ?? { attempts: [] } }))
  const firsts = all.flatMap(x => x.e.attempts.map(a => a.date)).sort()
  const first = firsts[0] ? new Date(firsts[0]) : null
  const deadline = first ? addMonths(endOfMonth(first), 18) : null
  const passed = all.filter(x => x.e.attempts.some(a => a.pass))
  const lastPass = passed.length === all.length ? passed.map(x => x.e.attempts.find(a => a.pass)!.date).sort().pop() : null
  const set = (code: string, e: PlanEntry) => actions.setPlan(code, e)
  return (
    <div className="stack">
      <div className="panel">
        <div className="kpi-row">
          <div><b>{passed.length}/9</b><span>materias aprobadas</span></div>
          <div><b>{deadline ? dmy(deadline.getTime()) : '—'}</b><span>fin de los 18 meses (FCL.025){deadline ? ` · ${days(deadline)} días` : ''}</span></div>
          <div><b>{lastPass ? dmy(addMonths(new Date(lastPass), 24).getTime()) : '—'}</b><span>el teórico vale hasta (24 meses)</span></div>
        </div>
        <p className="muted small">Anota la recomendación de tu escuela (vale 12 meses) y cada intento. Plazos de FCL.025: 18 meses desde el final del mes del primer intento para aprobar las 9 materias, como máximo 4 intentos por materia, y 24 meses desde la última aprobada para emitir la licencia.</p>
        {deadline && days(deadline) < 90 && passed.length < 9 && <p className="notice">Quedan menos de 90 días para el límite de 18 meses.</p>}
      </div>
      <div className="table-wrap">
        <table className="table plan-table">
          <thead><tr><th>Materia</th><th>Recomendación</th><th>Intentos</th><th>Estado</th></tr></thead>
          <tbody>
            {all.map(({ sub, e }) => {
              const used = e.attempts.length
              const ok = e.attempts.some(a => a.pass)
              const recEnd = e.rec ? addMonths(new Date(e.rec), 12) : null
              return (
                <tr key={sub.code}>
                  <td><span className="mono muted">{sub.code}</span> {sub.name}</td>
                  <td><input className="input sm" type="date" value={e.rec ?? ''} onChange={ev => set(sub.code, { ...e, rec: ev.target.value || undefined })} />{recEnd && <div className="muted small">vale hasta {dmy(recEnd.getTime())}</div>}</td>
                  <td>
                    {e.attempts.map((a, k) => (
                      <div key={k} className="attempt">
                        <span className="mono small">{a.date.split('-').reverse().join('-')}</span>
                        <span className={a.pass ? 'ok-text' : 'bad-text'}>{a.pass ? 'aprobado' : 'suspenso'}</span>
                        <button className="link-btn" onClick={() => set(sub.code, { ...e, attempts: e.attempts.filter((_, j) => j !== k) })}>quitar</button>
                      </div>
                    ))}
                    {!ok && used < 4 && <AddAttempt onAdd={(date, pass) => set(sub.code, { ...e, attempts: [...e.attempts, { date, pass }] })} />}
                  </td>
                  <td>{ok ? <span className="ok-text">Aprobada</span> : used >= 4 ? <span className="bad-text">Sin intentos: formación adicional</span> : <span className="muted">{4 - used} intentos</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AddAttempt({ onAdd }: { onAdd: (date: string, pass: boolean) => void }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  return (
    <div className="attempt add">
      <input className="input sm" type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Fecha del intento" />
      <button className="btn sm" onClick={() => onAdd(date, true)}>Aprobado</button>
      <button className="btn sm" onClick={() => onAdd(date, false)}>Suspenso</button>
    </div>
  )
}
