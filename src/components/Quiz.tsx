import { useMemo, useState } from 'react'
import type { Question } from '../data/licenses/types'
import { actions, useStore } from '../store'

const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])

/** Test tipo examen: 4 opciones, corrección inmediata con explicación y nota final */
export function Quiz({ id, questions, title }: { id: string; questions: Question[]; title?: string }) {
  const s = useStore()
  const [seed, setSeed] = useState(0)
  const qs = useMemo(() => shuffle(questions.map(q => ({ ...q, order: shuffle(q.options.map((_, i) => i)) }))), [questions, seed])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [ok, setOk] = useState(0)
  const [wrong, setWrong] = useState<{ q: string; right: string; why: string }[]>([])
  const done = i >= qs.length
  const stat = s.quiz[id]

  function choose(opt: number) {
    if (picked !== null) return
    setPicked(opt)
    const q = qs[i]
    if (opt === q.correct) setOk(x => x + 1)
    else setWrong(w => [...w, { q: q.q, right: q.options[q.correct], why: q.why }])
  }
  function next() {
    setPicked(null)
    const n = i + 1
    setI(n)
    if (n >= qs.length) actions.quizResult(id, Math.round(((ok) / qs.length) * 100))
  }
  function restart() { setSeed(x => x + 1); setI(0); setPicked(null); setOk(0); setWrong([]) }

  if (done) {
    const pct = Math.round((ok / qs.length) * 100)
    return (
      <div className="card quiz">
        <p className="eyebrow">{title ?? 'Test'} · resultado</p>
        <div className={`result ${pct >= 75 ? 'good' : pct >= 50 ? 'mid' : 'low'}`}>{pct}%</div>
        <p>{ok} de {qs.length} correctas · {pct >= 75 ? '✅ Aprobado (75 %)' : '❌ Por debajo del 75 % de AESA'}</p>
        {wrong.length > 0 && (
          <>
            <h3>Repasa estas</h3>
            <ul className="mini-list">{wrong.map((w, k) => <li key={k}><b>{w.q}</b><br /><span className="ok-text">✓ {w.right}</span> — <span className="muted small">{w.why}</span></li>)}</ul>
          </>
        )}
        <button className="btn primary" onClick={restart}>Repetir con otro orden</button>
      </div>
    )
  }
  const q = qs[i]
  return (
    <div className="card quiz">
      <div className="row between">
        <p className="eyebrow">{title ?? 'Test'} · pregunta {i + 1}/{qs.length}</p>
        {stat && <span className="small muted">Mejor: {stat.best}% · {stat.n} intentos</span>}
      </div>
      <div className="quiz-bar"><i style={{ width: `${(i / qs.length) * 100}%` }} /></div>
      <h3 className="quiz-q">{q.q}</h3>
      <div className="quiz-opts">
        {q.order.map((oi, k) => {
          const state = picked === null ? '' : oi === q.correct ? 'right' : oi === picked ? 'wrong' : 'dim'
          return (
            <button key={oi} className={`quiz-opt ${state}`} onClick={() => choose(oi)} disabled={picked !== null}>
              <span className="quiz-letter">{'ABCD'[k]}</span>{q.options[oi]}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className={`quiz-why ${picked === q.correct ? 'ok' : 'ko'}`}>
          <b>{picked === q.correct ? '✓ Correcto.' : `✗ Incorrecto. La correcta es: ${q.options[q.correct]}.`}</b> {q.why}
        </div>
      )}
      {picked !== null && <button className="btn primary" onClick={next}>{i + 1 < qs.length ? 'Siguiente →' : 'Ver resultado'}</button>}
    </div>
  )
}
