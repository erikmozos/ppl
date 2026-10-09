import { useEffect, useState } from 'react'
import type { Card } from '../data/licenses/types'
import { actions, type Grade } from '../store'
import { speak, stopSpeech } from '../speech'
import { Rich, plain } from './Rich'
import { Figure } from './Figure'
import { Icon } from './Icon'

const GRADES: [Grade, string, string][] = [['again', 'Otra vez', '10 min'], ['hard', 'Difícil', ''], ['good', 'Bien', ''], ['easy', 'Fácil', '']]

/** Repaso de fichas con repetición espaciada: anverso, respuesta y valoración (atajos: espacio y 1–4) */
export function CardReview({ cards, onDone, audio = false }: { cards: Card[]; onDone?: () => void; audio?: boolean }) {
  const [i, setI] = useState(0)
  const [show, setShow] = useState(false)
  const [listen, setListen] = useState(audio)
  const c = cards[i]
  const done = i >= cards.length

  useEffect(() => { if (listen && c) speak(plain(show ? c.back : c.front)) }, [i, show, listen]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopSpeech(), [])

  function rate(g: Grade) { actions.grade('c:' + c.id, g); setShow(false); setI(x => x + 1) }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || e.target instanceof HTMLInputElement) return
      if (!show && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); setShow(true) }
      else if (show && '1234'.includes(e.key)) { e.preventDefault(); rate(GRADES[+e.key - 1][0]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!cards.length) return <p className="muted">No hay fichas pendientes.</p>
  if (done) return (
    <div className="practice">
      <p><b>{cards.length} fichas repasadas.</b> Volverán cuando toque según cómo las hayas valorado.</p>
      {onDone && <div><button className="btn primary" onClick={onDone}>Continuar</button></div>}
    </div>
  )
  return (
    <div className="flashcard-wrap">
      <div className="practice-top">
        <span className="muted small">Ficha {i + 1} de {cards.length} · <span className="mono">{c.id.slice(2, 8)}</span></span>
        <label className="check small"><input type="checkbox" checked={listen} onChange={e => { setListen(e.target.checked); if (!e.target.checked) stopSpeech() }} /> Leer en voz alta</label>
      </div>
      <div className="flashcard" onClick={() => setShow(true)}>
        <p className="fc-front"><Rich text={c.front} /></p>
        {c.figure && <Figure id={c.figure} />}
        {show ? <p className="fc-back"><Rich text={c.back} /></p> : <p className="muted small">Piensa la respuesta y toca para verla.</p>}
      </div>
      {show ? (
        <div className="grades">
          {GRADES.map(([g, label, hint], k) => <button key={g} className={`btn ${g === 'again' ? 'bad' : g === 'good' ? 'primary' : ''}`} onClick={() => rate(g)}>{label}{hint && <span className="muted small"> · {hint}</span>}<kbd>{k + 1}</kbd></button>)}
        </div>
      ) : (
        <div><button className="btn primary" onClick={() => setShow(true)}>Mostrar respuesta</button> <button className="icon-btn" onClick={() => speak(plain(c.front))} aria-label="Escuchar la ficha"><Icon name="speaker" /></button></div>
      )}
    </div>
  )
}
