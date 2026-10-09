import { useEffect, useMemo, useRef, useState } from 'react'
import type { BankQuestion } from '../data/licenses/types'
import { actions, type Mode, type Reason } from '../store'
import { Rich } from './Rich'
import { Figure } from './Figure'
import { Icon } from './Icon'

const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])
const LETTERS = 'ABCD'
export const REASONS: [Reason, string][] = [['nolosabia', 'No lo sabía'], ['confusion', 'Lo confundí'], ['calculo', 'Error de cálculo'], ['lectura', 'Leí mal']]

/** Enunciado de una pregunta con sus datos (METAR, NOTAM…) y figura */
export function QuestionStem({ q }: { q: BankQuestion }) {
  return (
    <>
      <h3 className="q-text"><Rich text={q.q} /></h3>
      {q.data && <pre className="q-data">{q.data}</pre>}
      {q.figure && <Figure id={q.figure} />}
    </>
  )
}

/** Explicación completa: por qué acierta la correcta y por qué falla la elegida */
export function Explanation({ q, picked }: { q: BankQuestion; picked: number | null }) {
  const ok = picked === q.correct
  return (
    <div className={`explain ${picked === null ? '' : ok ? 'ok' : 'ko'}`}>
      {picked !== null && <p className="explain-head">{ok ? 'Correcto.' : `Incorrecto. La respuesta es: ${q.options[q.correct]}`}</p>}
      <p><Rich text={q.why} /></p>
      {picked !== null && !ok && q.whyNot[picked] && <p className="explain-not"><b>Tu opción:</b> <Rich text={q.whyNot[picked]!} /></p>}
      <p className="explain-ref">{q.ref}{q.url && <> · <a href={q.url} target="_blank" rel="noreferrer">fuente</a></>}</p>
    </div>
  )
}

/**
 * Práctica con corrección inmediata: guarda cada respuesta, manda las falladas a la cola de repaso
 * y deja anotar el motivo del fallo. Atajos: 1–4 o A–D para responder, Intro para seguir.
 */
export function Practice({ questions, mode = 'practica', title, onFinish }: { questions: BankQuestion[]; mode?: Mode; title?: string; onFinish?: () => void }) {
  const [round, setRound] = useState(0)
  const [pool, setPool] = useState(questions)
  const qs = useMemo(() => pool.map(q => ({ q, order: shuffle([0, 1, 2, 3]) })), [pool, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [reason, setReason] = useState<Reason | null>(null)
  const [log, setLog] = useState<{ q: BankQuestion; p: number }[]>([])
  const t0 = useRef(Date.now())
  const done = i >= qs.length
  const cur = qs[i]

  useEffect(() => { setPool(questions); setI(0); setPicked(null); setLog([]); setRound(r => r + 1) }, [questions])
  useEffect(() => { t0.current = Date.now(); setReason(null) }, [i, round])

  function choose(opt: number) {
    if (picked !== null || !cur) return
    setPicked(opt)
    actions.answer(cur.q.id, opt, opt === cur.q.correct, Date.now() - t0.current, mode)
    setLog(l => [...l, { q: cur.q, p: opt }])
  }
  function next() { setPicked(null); setI(x => x + 1) }
  function restart(only?: BankQuestion[]) { setPool(only ?? questions); setI(0); setPicked(null); setLog([]); setRound(r => r + 1) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || done) return
      const k = e.key.toUpperCase()
      const n = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : LETTERS.indexOf(k)
      if (picked === null && n >= 0 && cur) { e.preventDefault(); choose(cur.order[n]) }
      else if (picked !== null && e.key === 'Enter') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!questions.length) return <p className="muted">Todavía no hay preguntas para esta selección.</p>

  if (done) {
    const ok = log.filter(x => x.p === x.q.correct).length
    const pct = Math.round((ok / Math.max(1, log.length)) * 100)
    const failed = log.filter(x => x.p !== x.q.correct)
    return (
      <div className="practice">
        <div className="result-row">
          <div className={`result ${pct >= 75 ? 'good' : pct >= 50 ? 'mid' : 'low'}`}>{pct} %</div>
          <div><p><b>{ok} de {log.length}</b> correctas{title ? ` · ${title}` : ''}</p><p className="muted small">{pct >= 75 ? 'Por encima del 75 % que exige AESA.' : 'Por debajo del 75 % que exige AESA.'} Las falladas ya están en tu cola de repaso.</p></div>
        </div>
        {failed.length > 0 && (
          <div className="review-list">
            <h3>Falladas</h3>
            {failed.map(({ q, p }) => (
              <details key={q.id} className="review-item">
                <summary><Rich text={q.q} /></summary>
                {q.data && <pre className="q-data">{q.data}</pre>}
                <Explanation q={q} picked={p} />
              </details>
            ))}
          </div>
        )}
        <div className="row gap wrap-row">
          {failed.length > 0 && <button className="btn primary" onClick={() => restart(failed.map(f => f.q))}>Repetir las falladas ({failed.length})</button>}
          <button className="btn" onClick={() => restart()}>Repetir la tanda</button>
          {onFinish && <button className="btn ghost" onClick={onFinish}>Terminar</button>}
        </div>
      </div>
    )
  }

  const q = cur.q
  return (
    <div className="practice">
      <div className="practice-top">
        <span className="muted small">{title ? `${title} · ` : ''}Pregunta {i + 1} de {qs.length}</span>
        <span className="muted small mono">{q.id.startsWith('g-') ? 'cálculo generado' : q.id}</span>
      </div>
      <div className="progress"><i style={{ width: `${(i / qs.length) * 100}%` }} /></div>
      <QuestionStem q={q} />
      <div className="options">
        {cur.order.map((oi, k) => {
          const st = picked === null ? '' : oi === q.correct ? 'right' : oi === picked ? 'wrong' : 'dim'
          return (
            <button key={oi} className={`option ${st}`} onClick={() => choose(oi)} disabled={picked !== null}>
              <span className="option-k">{LETTERS[k]}</span><span><Rich text={q.options[oi]} /></span>
              {st === 'right' && <Icon name="check" />}{st === 'wrong' && <Icon name="x" />}
            </button>
          )
        })}
      </div>
      {picked !== null && <Explanation q={q} picked={picked} />}
      {picked !== null && picked !== q.correct && !q.id.startsWith('g-') && (
        <div className="reasons">
          <span className="muted small">¿Por qué fallaste?</span>
          {REASONS.map(([r, label]) => <button key={r} className={`chip-btn ${reason === r ? 'on' : ''}`} onClick={() => { setReason(r); actions.reason(q.id, r) }}>{label}</button>)}
        </div>
      )}
      {picked !== null && <div><button className="btn primary" onClick={next}>{i + 1 < qs.length ? 'Siguiente' : 'Ver resultado'}</button></div>}
    </div>
  )
}
