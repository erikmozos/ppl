import { useEffect, useMemo, useState } from 'react'
import type { BankQuestion, Block, LessonFile } from '../data/licenses/types'
import { actions } from '../store'
import { speak, stopSpeech, useSpeech } from '../speech'
import { blockSpeech } from '../study/narration'
import { Rich } from './Rich'
import { Figure } from './Figure'
import { Icon } from './Icon'
import { Outline } from './LessonView'
import { QuestionStem, Explanation } from './Practice'

const STOP = new Set('sobre entre desde hasta donde cuando porque para como pero esta este esto estos estas tiene tienen puede pueden cada otra otro todo toda todos todas sido será siempre menos mucho muchos parte mismo misma también'.split(' '))
const words = (s: string) => new Set(s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-zñ0-9]{5,}/g)?.filter(w => !STOP.has(w)) ?? [])
const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])

/** Asigna a cada sección la pregunta del banco que más se le parece (cada pregunta, una vez) */
function matchQuestions(sections: Block[], qs: BankQuestion[]) {
  const sw = sections.map(b => words(blockSpeech(b)))
  const pairs: [number, number, number][] = []
  qs.forEach((q, qi) => {
    const w = words(q.q + ' ' + q.options[q.correct] + ' ' + q.why)
    sw.forEach((s, si) => { let n = 0; w.forEach(x => { if (s.has(x)) n++ }); if (n >= 3) pairs.push([n, si, qi]) })
  })
  pairs.sort((a, b) => b[0] - a[0])
  const bySec = new Map<number, number>(), used = new Set<number>()
  for (const [, si, qi] of pairs) if (!bySec.has(si) && !used.has(qi)) { bySec.set(si, qi); used.add(qi) }
  return sections.map((_, si) => (bySec.has(si) ? qs[bySec.get(si)!] : null))
}

type Step = { kind: 'learn'; b: Block; i: number } | { kind: 'check'; q: BankQuestion } | { kind: 'outline' } | { kind: 'numbers' } | { kind: 'explain' } | { kind: 'end' }

/**
 * Modo paso a paso: la lección en tarjetas cortas (una sección por pantalla) con una pregunta rápida detrás de cada una,
 * y al final el esquema, las cifras y el «explícalo con tus palabras». Recuerda por dónde ibas.
 */
export function LessonSteps({ file, onDone }: { file: LessonFile; onDone?: () => void }) {
  const l = file.lesson
  const key = `cf.steps.${l.id}`
  const steps = useMemo<Step[]>(() => {
    const qs = matchQuestions(l.sections, file.questions)
    const out: Step[] = []
    l.sections.forEach((b, i) => { out.push({ kind: 'learn', b, i }); if (qs[i]) out.push({ kind: 'check', q: qs[i]! }) })
    if (l.outline?.length) out.push({ kind: 'outline' })
    out.push({ kind: 'numbers' })
    if (l.selfCheck?.length) out.push({ kind: 'explain' })
    out.push({ kind: 'end' })
    return out
  }, [file]) // eslint-disable-line react-hooks/exhaustive-deps
  const [k, setK] = useState(() => { try { return Math.min(+(localStorage.getItem(key) ?? 0) || 0, steps.length - 1) } catch { return 0 } })
  const [ok, setOk] = useState<[number, number]>([0, 0])
  useEffect(() => { try { localStorage.setItem(key, String(k)) } catch { /* sin almacenamiento */ } window.scrollTo({ top: 0 }) }, [k, key])
  useEffect(() => () => stopSpeech(), [])
  const step = steps[k]
  const go = (n: number) => { stopSpeech(); setK(Math.max(0, Math.min(steps.length - 1, n))) }
  const learnTotal = l.sections.length
  const learnDone = steps.slice(0, k + 1).filter(s => s.kind === 'learn').length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight' && step.kind !== 'check') go(k + 1)
      if (e.key === 'ArrowLeft') go(k - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const [touch, setTouch] = useState<[number, number] | null>(null)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch) return
    const dx = e.changedTouches[0].clientX - touch[0], dy = e.changedTouches[0].clientY - touch[1]
    setTouch(null)
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6 || (e.target as HTMLElement).closest('.table-wrap, .widget, input')) return
    if (dx < 0 && step.kind !== 'check' && step.kind !== 'end') go(k + 1)
    if (dx > 0) go(k - 1)
  }
  return (
    <div className="steps-mode" onTouchStart={e => setTouch([e.touches[0].clientX, e.touches[0].clientY])} onTouchEnd={onTouchEnd}>
      <div className="steps-top">
        <div className="progress"><i style={{ width: `${((k + 1) / steps.length) * 100}%` }} /></div>
        <span className="muted small">{step.kind === 'learn' || step.kind === 'check' ? `Parte ${learnDone} de ${learnTotal}` : 'Repaso final'}{ok[1] ? ` · ${ok[0]}/${ok[1]} preguntas` : ''}</span>
      </div>
      {step.kind === 'learn' && <LearnCard key={k} b={step.b} />}
      {step.kind === 'check' && <CheckCard key={k} q={step.q} onAnswer={good => setOk(([o, n]) => [o + (good ? 1 : 0), n + 1])} onNext={() => go(k + 1)} />}
      {step.kind === 'outline' && <div className="step-card"><p className="step-k">El tema de un vistazo</p><Outline l={l} compact /></div>}
      {step.kind === 'numbers' && (
        <div className="step-card">
          <p className="step-k">Para memorizar</p>
          <ul className="numbers">{l.numbers.map((n, i) => <li key={i}><Rich text={n} /></li>)}</ul>
          {l.mnemonics?.length ? <><p className="step-k">Trucos</p><ul className="study-list">{l.mnemonics.map((n, i) => <li key={i}><Rich text={n} /></li>)}</ul></> : null}
          <p className="step-k">Cuidado en el examen</p>
          <ul className="study-list">{l.traps.map((n, i) => <li key={i}><Rich text={n} /></li>)}</ul>
        </div>
      )}
      {step.kind === 'explain' && <ExplainCards items={l.selfCheck!} />}
      {step.kind === 'end' && (
        <div className="step-card end">
          <p className="step-k">Lección terminada</p>
          <h2>{l.title}</h2>
          {ok[1] > 0 && <p>Has acertado <b>{ok[0]} de {ok[1]}</b> preguntas rápidas.</p>}
          <p className="muted small">Sus {file.cards.length} fichas pasan a tu repaso diario. Para afianzarla, haz todas sus preguntas.</p>
          <div className="row gap wrap-row">
            <button className="btn primary" onClick={() => { actions.lessonSeen(l.id); actions.addCards(file.cards.map(c => 'c:' + c.id)); try { localStorage.removeItem(key) } catch { /* nada */ } onDone?.() }}>Terminar y hacer las {file.questions.length} preguntas</button>
            <button className="btn" onClick={() => { setOk([0, 0]); go(0) }}>Empezar de nuevo</button>
          </div>
        </div>
      )}
      {step.kind !== 'check' && step.kind !== 'end' && (
        <div className="steps-nav steps-bar">
          <button className="btn" onClick={() => go(k - 1)} disabled={k === 0} aria-label="Atrás"><Icon name="left" /> <span className="hide-sm">Atrás</span></button>
          <span className="steps-count muted small">{k + 1}/{steps.length}</span>
          <button className="btn primary" onClick={() => go(k + 1)}>Siguiente <Icon name="right" /></button>
        </div>
      )}
      <p className="muted small swipe-hint">Desliza a la izquierda para seguir y a la derecha para volver.</p>
    </div>
  )
}

/** Una sección en formato tarjeta: primero la idea intuitiva, luego lo esencial y el detalle plegado */
function LearnCard({ b }: { b: Block }) {
  const sp = useSpeech()
  const [more, setMore] = useState(false)
  const [first, ...rest] = b.text ?? []
  return (
    <div className="step-card">
      <div className="block-head">
        <h2>{b.title}</h2>
        {(sp.supported || sp.neuralCount > 0) && <button className="icon-btn" onClick={() => (sp.speaking ? stopSpeech() : speak(blockSpeech(b)))} aria-label="Escuchar esta parte"><Icon name={sp.speaking ? 'stop' : 'speaker'} /></button>}
      </div>
      {b.ideas?.[0] && <div className="idea-hero"><span>Para entenderlo</span><p><Rich text={b.ideas[0]} /></p></div>}
      {first && <p className="step-text"><Rich text={first} /></p>}
      {b.bullets && <ul className="study-list">{b.bullets.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>}
      {b.figure && <Figure id={b.figure} caption={b.caption} />}
      {b.formulas && <div className="formulas">{b.formulas.map((f, i) => <div key={i} className="formula"><code>{f.f}</code>{f.note && <span>{f.note}</span>}</div>)}</div>}
      {(rest.length > 0 || b.table || b.examples || (b.ideas?.length ?? 0) > 1 || b.note) && (
        more ? (
          <div className="step-more">
            {rest.map((t, i) => <p key={i}><Rich text={t} /></p>)}
            {b.table && (
              <div className="table-wrap"><table className="table study-table">
                <thead><tr>{b.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich text={c} /></td>)}</tr>)}</tbody>
              </table></div>
            )}
            {b.ideas?.slice(1).map((x, i) => <div key={i} className="callout idea"><b>Otra forma de verlo.</b> <Rich text={x} /></div>)}
            {b.examples?.map((e, i) => <details key={i} className="example"><summary><span className="example-k">Ejemplo</span> <Rich text={e.q} /></summary><p><Rich text={e.a} /></p></details>)}
            {b.note && <div className={`callout ${b.note.kind}`}><Rich text={b.note.text} /></div>}
          </div>
        ) : <button className="link-btn" onClick={() => setMore(true)}>Ver el detalle {b.table ? '(tabla, ' : '('}{b.examples ? 'ejemplos, ' : ''}explicación completa)</button>
      )}
    </div>
  )
}

function CheckCard({ q, onAnswer, onNext }: { q: BankQuestion; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const order = useMemo(() => shuffle([0, 1, 2, 3]), [q])
  const [p, setP] = useState<number | null>(null)
  const t0 = useMemo(() => Date.now(), [q])
  return (
    <div className="step-card check">
      <p className="step-k">Comprueba que lo has pillado</p>
      <QuestionStem q={q} />
      <div className="options">
        {order.map((oi, k) => {
          const st = p === null ? '' : oi === q.correct ? 'right' : oi === p ? 'wrong' : 'dim'
          return <button key={oi} className={`option ${st}`} disabled={p !== null} onClick={() => { setP(oi); onAnswer(oi === q.correct); actions.answer(q.id, oi, oi === q.correct, Date.now() - t0, 'leccion') }}><span className="option-k">{'ABCD'[k]}</span><span><Rich text={q.options[oi]} /></span></button>
        })}
      </div>
      {p !== null && <><Explanation q={q} picked={p} /><div className="steps-nav"><span /><button className="btn primary" onClick={onNext}>Seguir <Icon name="right" /></button></div></>}
    </div>
  )
}

function ExplainCards({ items }: { items: { q: string; a: string }[] }) {
  const [i, setI] = useState(0)
  const [show, setShow] = useState(false)
  const it = items[i]
  return (
    <div className="step-card">
      <p className="step-k">Explícalo con tus palabras · {i + 1} de {items.length}</p>
      <p className="fc-front"><Rich text={it.q} /></p>
      {show ? <p className="fc-back"><Rich text={it.a} /></p> : <p className="muted small">Dilo en voz alta antes de mirar.</p>}
      <div className="row gap">
        {!show ? <button className="btn" onClick={() => setShow(true)}>Ver la respuesta</button> : i < items.length - 1 ? <button className="btn" onClick={() => { setI(i + 1); setShow(false) }}>Otra</button> : <span className="muted small">Pulsa «Siguiente» para terminar.</span>}
      </div>
    </div>
  )
}
