import { useEffect, useState } from 'react'
import { GUIDE } from '../data/guide'
import { speak, stopSpeech, useSpeech } from '../speech'

const SEEN = 'cf.guideSeen'
export const guideSeen = () => { try { return localStorage.getItem(SEEN) === '1' } catch { return true } }
const markSeen = () => { try { localStorage.setItem(SEEN, '1') } catch { /* sin almacenamiento */ } }

/**
 * Presentación paso a paso de cómo funciona la app, con narración opcional.
 * autoplay: abierta por un clic del usuario (puede hablar ya). Si se abre sola (primera visita), espera a que active «Escuchar».
 */
export function GuideTour({ onClose, start = 0, autoplay = true }: { onClose: () => void; start?: number; autoplay?: boolean }) {
  const [i, setI] = useState(start)
  const [listen, setListen] = useState(autoplay)
  const sp = useSpeech()
  const g = GUIDE[i]
  const last = i === GUIDE.length - 1
  const canSpeak = sp.prefs.enabled && (sp.supported || sp.neuralCount > 0)

  // habla al cambiar de diapositiva solo si el usuario ha activado «Escuchar»
  const go = (j: number, on = listen) => {
    const t = Math.min(GUIDE.length - 1, Math.max(0, j))
    setI(t)
    if (on && canSpeak) speak(GUIDE[t].say)
    else stopSpeech()
  }
  useEffect(() => {
    const t = setTimeout(() => { if (autoplay && canSpeak) speak(GUIDE[start].say) }, 80)
    return () => { clearTimeout(t); stopSpeech() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => { markSeen(); stopSpeech(); onClose() }
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })

  return (
    <div className="tour-backdrop" role="dialog" aria-modal="true" aria-label="Guía de uso">
      <div className="tour">
        <div className="tour-top">
          <span className="eyebrow">Cómo funciona · {i + 1}/{GUIDE.length}</span>
          <div className="row gap">
            <label className="check small"><input type="checkbox" checked={listen} onChange={e => { setListen(e.target.checked); go(i, e.target.checked) }} /> 🔊 Escuchar</label>
            <button className="btn ghost sm" onClick={close} aria-label="Cerrar guía">✕</button>
          </div>
        </div>
        <div className="tour-body" key={i}>
          <div className="tour-icon">{g.icon}</div>
          <h2>{g.title}</h2>
          {g.body.map((p, k) => <p key={k}>{p}</p>)}
        </div>
        <div className="tour-dots">
          {GUIDE.map((_, k) => <button key={k} className={k === i ? 'on' : k < i ? 'done' : ''} onClick={() => go(k)} aria-label={`Ir a la diapositiva ${k + 1}`} />)}
        </div>
        <div className="tour-nav">
          <button className="btn ghost" onClick={close}>Saltar guía</button>
          <div className="row gap">
            {i > 0 && <button className="btn" onClick={() => go(i - 1)}>← Anterior</button>}
            {last
              ? <a className="btn primary" href={g.link?.href ?? '#/'} onClick={close}>{g.link?.label ?? 'Empezar'}</a>
              : <button className="btn primary" onClick={() => go(i + 1)}>Siguiente →</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
