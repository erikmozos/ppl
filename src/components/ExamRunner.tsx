import { useEffect, useMemo, useRef, useState } from 'react'
import type { BankQuestion } from '../data/licenses/types'
import { actions, blockOf, uid, type ExamRun } from '../store'
import { blockById } from '../data/licenses/ppl-syllabus'
import { Rich } from './Rich'
import { Explanation, QuestionStem } from './Practice'
import { Icon } from './Icon'

const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])
const LETTERS = 'ABCD'
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.floor(s % 60))).padStart(2, '0')}`

export interface ExamPart { code: string; name: string; minutes: number; questions: BankQuestion[] }

/**
 * Examen con las condiciones de AESA: una pregunta por pantalla, navegación libre, marcar para revisar,
 * cronómetro y nota solo al entregar. Al entregar guarda cada respuesta y el resultado por bloque.
 */
export function ExamRunner({ part, mode, session, onDone, onExit }: { part: ExamPart; mode: ExamRun['mode']; session?: string; onDone?: (run: ExamRun) => void; onExit: () => void }) {
  const qs = useMemo(() => part.questions.map(q => ({ q, order: shuffle([0, 1, 2, 3]) })), [part])
  const [ans, setAns] = useState<(number | null)[]>(() => qs.map(() => null))
  const [marked, setMarked] = useState<Set<number>>(new Set())
  const [i, setI] = useState(0)
  const [left, setLeft] = useState(part.minutes * 60)
  const [run, setRun] = useState<ExamRun | null>(null)
  const [calc, setCalc] = useState(false)
  const [onlyWrong, setOnlyWrong] = useState(false)
  const start = useRef(Date.now())
  const times = useRef<number[]>(qs.map(() => 0))
  const shownAt = useRef(Date.now())

  useEffect(() => {
    if (run) return
    const t = setInterval(() => {
      const l = part.minutes * 60 - (Date.now() - start.current) / 1000
      setLeft(l)
      if (l <= 0) submit()
    }, 500)
    return () => clearInterval(t)
  }) // eslint-disable-line react-hooks/exhaustive-deps

  function go(n: number) {
    times.current[i] += Date.now() - shownAt.current
    shownAt.current = Date.now()
    setI(Math.max(0, Math.min(qs.length - 1, n)))
  }

  function submit() {
    if (run) return
    times.current[i] += Date.now() - shownAt.current
    const blocks: Record<string, [number, number]> = {}
    let ok = 0
    qs.forEach(({ q }, k) => {
      const good = ans[k] === q.correct
      if (good) ok++
      const b = blockOf(q.id), v = blocks[b] ?? [0, 0]
      blocks[b] = [v[0] + (good ? 1 : 0), v[1] + 1]
    })
    // sin responder cuenta como fallo, igual que en el examen
    actions.answerMany(qs.map(({ q }, k) => ({ q: q.id, p: ans[k] ?? -1, ok: ans[k] === q.correct, ms: times.current[k] })), 'simulacro')
    const r: ExamRun = { id: uid(), session, code: part.code, mode, t: Date.now(), ok, n: qs.length, ms: Date.now() - start.current, blocks }
    actions.examDone([r])
    setRun(r)
    onDone?.(r)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    if (run) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || calc) return
      const n = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : LETTERS.indexOf(e.key.toUpperCase())
      if (n >= 0) { e.preventDefault(); setAns(a => a.map((x, k) => (k === i ? qs[i].order[n] : x))) }
      else if (e.key === 'ArrowRight') go(i + 1)
      else if (e.key === 'ArrowLeft') go(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (run) {
    const need = Math.ceil(run.n * 0.75)
    const pct = Math.round((run.ok / run.n) * 100)
    const pass = run.ok >= need
    const list = qs.map((x, k) => ({ ...x, a: ans[k] })).filter(x => !onlyWrong || x.a !== x.q.correct)
    return (
      <div className="exam">
        <div className="result-row">
          <div className={`result ${pass ? 'good' : 'low'}`}>{pct} %</div>
          <div>
            <p><b>{pass ? 'Aprobado' : 'Suspenso'}</b> · {run.ok} de {run.n} (hacen falta {need}) · {part.name}</p>
            <p className="muted small">Tiempo usado {mmss(run.ms / 1000)} de {part.minutes}:00. Las falladas han pasado a tu cola de repaso.</p>
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Bloque</th><th>Aciertos</th></tr></thead>
          <tbody>
            {Object.entries(run.blocks).sort().map(([b, [o, n]]) => (
              <tr key={b} className={o / n < 0.7 ? 'weak' : ''}><td><span className="mono muted">{b}</span> {blockById(b)?.title ?? ''}</td><td>{o}/{n}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="row between wrap-row">
          <h3>Revisión</h3>
          <label className="check small"><input type="checkbox" checked={onlyWrong} onChange={e => setOnlyWrong(e.target.checked)} /> Solo las falladas</label>
        </div>
        <div className="review-list">
          {list.map(({ q, a }) => (
            <details key={q.id + (a ?? '')} className={`review-item ${a === q.correct ? 'ok' : 'ko'}`}>
              <summary><span className="mark">{a === q.correct ? <Icon name="check" /> : <Icon name="x" />}</span><Rich text={q.q} /></summary>
              {q.data && <pre className="q-data">{q.data}</pre>}
              <p className="small">Tu respuesta: {a === null || a < 0 ? <i>sin responder</i> : <Rich text={q.options[a]} />}</p>
              <Explanation q={q} picked={a === null || a < 0 ? null : a} />
            </details>
          ))}
        </div>
        <div><button className="btn primary" onClick={onExit}>Volver</button></div>
      </div>
    )
  }

  const cur = qs[i]
  const answered = ans.filter(a => a !== null).length
  return (
    <div className="exam">
      <div className="exam-bar">
        <b>{part.name}</b>
        <span className={`timer ${left < 120 ? 'low' : ''}`}><Icon name="clock" /> {mmss(left)}</span>
        <span className="muted small">{answered}/{qs.length} respondidas</span>
        <button className="btn sm" onClick={() => setCalc(c => !c)}><Icon name="calc" /> Calculadora</button>
        <button className="btn sm primary" onClick={() => { if (answered === qs.length || confirm(`Quedan ${qs.length - answered} preguntas sin responder. ¿Entregar de todos modos?`)) submit() }}>Entregar</button>
      </div>
      {calc && <Calculator />}
      <div className="exam-grid">
        {qs.map((_, k) => (
          <button key={k} className={`cell ${k === i ? 'cur' : ''} ${ans[k] !== null ? 'done' : ''} ${marked.has(k) ? 'flag' : ''}`} onClick={() => go(k)} aria-label={`Pregunta ${k + 1}`}>{k + 1}</button>
        ))}
      </div>
      <div className="practice">
        <div className="practice-top"><span className="muted small">Pregunta {i + 1} de {qs.length}</span></div>
        <QuestionStem q={cur.q} />
        <div className="options">
          {cur.order.map((oi, k) => (
            <button key={oi} className={`option ${ans[i] === oi ? 'sel' : ''}`} onClick={() => setAns(a => a.map((x, j) => (j === i ? oi : x)))}>
              <span className="option-k">{LETTERS[k]}</span><span><Rich text={cur.q.options[oi]} /></span>
            </button>
          ))}
        </div>
        <div className="row between wrap-row">
          <button className="btn sm" onClick={() => go(i - 1)} disabled={i === 0}><Icon name="left" /> Anterior</button>
          <button className={`btn sm ${marked.has(i) ? 'on' : ''}`} onClick={() => setMarked(m => { const n = new Set(m); if (n.has(i)) n.delete(i); else n.add(i); return n })}><Icon name="flag" /> {marked.has(i) ? 'Marcada' : 'Marcar para revisar'}</button>
          <button className="btn sm" onClick={() => go(i + 1)} disabled={i === qs.length - 1}>Siguiente <Icon name="right" /></button>
        </div>
      </div>
      <p className="small muted">Como en AESA: sin explicaciones hasta entregar. El computador de navegación del examen es físico; aquí resuelve a mano o con la calculadora.</p>
    </div>
  )
}

/** Calculadora sencilla (como la de pantalla del examen) */
export function Calculator() {
  const [expr, setExpr] = useState('')
  let out = ''
  const clean = expr.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/')
  if (clean && /^[\d+\-*/().\s]+$/.test(clean)) {
    try { const v = Function(`"use strict";return (${clean})`)() as number; if (Number.isFinite(v)) out = String(Math.round(v * 10000) / 10000).replace('.', ',') } catch { /* expresión incompleta */ }
  }
  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', ',', '(', '+', ')']
  return (
    <div className="calc card">
      <input className="input mono" value={expr} onChange={e => setExpr(e.target.value)} placeholder="p. ej. 115 / 120 * 60" aria-label="Operación" />
      <div className="calc-out mono">{out ? `= ${out}` : ' '}</div>
      <div className="calc-keys">
        {keys.map(k => <button key={k} className="btn sm" onClick={() => setExpr(e => e + k)}>{k === '*' ? '×' : k === '/' ? '÷' : k}</button>)}
        <button className="btn sm" onClick={() => setExpr('')}>C</button>
        <button className="btn sm" onClick={() => setExpr(e => e.slice(0, -1))}>⌫</button>
      </div>
    </div>
  )
}
