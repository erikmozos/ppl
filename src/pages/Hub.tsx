import { useState } from 'react'
import { GuideTour, guideSeen } from '../components/GuideTour'
import { allAircraft, useStore } from '../store'
import { MODULES } from '../data/licenses/modules'
import { AIRHISPANIA } from '../data/licenses/modules'

/** Inicio: las dos grandes secciones de la academia */
export function Hub() {
  const s = useStore()
  // primera visita: la guía se abre sola pero en silencio; con el botón, narrada
  const [tour, setTour] = useState<'auto' | 'click' | null>(() => (guideSeen() ? null : 'auto'))
  const fleet = allAircraft(s)
  const ppl = MODULES[0]
  const quizDone = (ppl.subjects ?? []).filter(sub => (s.quiz[`ppl/${sub.id}`]?.best ?? 0) >= 75).length

  return (
    <div className="wrap">
      {tour && <GuideTour autoplay={tour === 'click'} onClose={() => setTour(null)} />}
      <section className="hero">
        <div>
          <p className="eyebrow">Academia de vuelo · EASA Part-FCL · España</p>
          <h1>De la PPL a la cabina<br /><span className="grad">de un avión de línea.</span></h1>
          <p className="lead">Todo el recorrido modular en un sitio: guías de estudio de cada licencia con tests tipo AESA, y cabinas reales para aprender los flows de cada avión.</p>
          <div className="row gap wrap-row">
            <a className="btn primary" href="#/licencias">🎓 Licencias</a>
            <a className="btn primary" href="#/cockpits">🛩️ Cockpits</a>
            <button className="btn" onClick={() => setTour('click')}>▶ Cómo funciona (3 min)</button>
          </div>
        </div>
        <ul className="how">
          <li className="how-head"><b>Método recomendado</b><span>Teoría por asignaturas → test hasta superar el 75 % → cabina: tutorial guiado, estudio y repaso de memoria.</span></li>
          <li><b>🎓 Licencias</b><span>PPL completa (9 asignaturas, examen AESA, prueba de pericia) y el resto del recorrido hasta la ATPL.</span></li>
          <li><b>🛩️ Cockpits</b><span>C172, PA-28, Aztec, ATR 72 y Boeing 737 con fotos reales, voz y flows por tripulante.</span></li>
        </ul>
      </section>

      <div className="hub-grid">
        <a className="card hub-card lic" href="#/licencias">
          <div className="hub-icon">🎓</div>
          <h2>Licencias y habilitaciones</h2>
          <p className="muted">El recorrido modular completo: PPL(A), VFR nocturno, hour building, ATPL teórico, CPL, MEP, IR/BIR, MCC, habilitación de tipo y ATPL.</p>
          <div className="path-mini">{MODULES.map(m => <span key={m.id} className={m.status} title={m.name}>{m.icon}</span>)}</div>
          <div className="stats"><span><b>{MODULES.length}</b> etapas</span><span><b>{ppl.subjects?.length}</b> asignaturas PPL</span><span><b>{quizDone}</b> tests aprobados</span></div>
        </a>
        <a className="card hub-card cock" href="#/cockpits">
          <div className="hub-icon">🛩️</div>
          <h2>Cockpits y type ratings</h2>
          <p className="muted">Cabinas interactivas con fotos reales, procedimientos basados en el POH/FCOM, tutorial narrado, repaso de memoria y flashcards.</p>
          <div className="path-mini">{fleet.map(a => <span key={a.id} className="completo" title={a.name}>{a.short}</span>)}</div>
          <div className="stats"><span><b>{fleet.length}</b> aviones</span><span><b>{fleet.reduce((n, a) => n + a.flows.length, 0)}</b> procedimientos</span></div>
        </a>
      </div>

      <a className="card featured" href={AIRHISPANIA.url} target="_blank" rel="noreferrer">
        <span className="hub-icon">🕹️</span>
        <div>
          <p className="eyebrow">Simulación online</p>
          <h3>{AIRHISPANIA.title} ↗</h3>
          <p className="muted small">{AIRHISPANIA.text}</p>
        </div>
      </a>
    </div>
  )
}
