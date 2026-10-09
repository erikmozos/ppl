import { useState } from 'react'
import { GUIDE } from '../data/guide'
import { GuideTour } from '../components/GuideTour'
import { VoiceSettings } from '../components/VoiceSettings'
import { Icon } from '../components/Icon'

/** Guía de uso completa, en una sola página */
export function GuidePage() {
  const [tour, setTour] = useState<number | null>(null)
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <p className="eyebrow">Guía de uso</p>
          <h1>Cómo funciona Cockpit Flows</h1>
          <p className="muted">En unos 3 minutos sabrás usar todo. Puedes verla como presentación narrada o leerla aquí.</p>
        </div>
        <button className="btn primary" onClick={() => setTour(0)}>Ver presentación narrada</button>
      </div>
      <div className="guide-grid">
        {GUIDE.map((g, i) => (
          <article key={i} className="card guide-card">
            <div className="row between">
              <span className="guide-n mono">{String(i + 1).padStart(2, "0")}</span>
              <button className="btn ghost sm" onClick={() => setTour(i)} aria-label={`Escuchar: ${g.title}`}><Icon name="speaker" /></button>
            </div>
            <h3>{g.title}</h3>
            {g.body.map((p, k) => <p key={k}>{p}</p>)}
            {g.link && <a className="btn primary sm" href={g.link.href}>{g.link.label}</a>}
          </article>
        ))}
      </div>
      <h2 className="sec">Atajos de teclado</h2>
      <div className="card">
        <table className="specs"><tbody>
          <tr><th>← →</th><td>Paso anterior / siguiente (estudio, tutorial y guía)</td></tr>
          <tr><th>Espacio</th><td>Reproducir / pausar</td></tr>
          <tr><th>Esc</th><td>Salir del tutorial o de la guía</td></tr>
        </tbody></table>
      </div>
      <h2 className="sec">Voz</h2>
      <VoiceSettings />
      {tour !== null && <GuideTour start={tour} onClose={() => setTour(null)} />}
    </div>
  )
}
