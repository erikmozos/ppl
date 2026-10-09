import { useMemo, useState } from 'react'
import { GuideTour, guideSeen } from '../components/GuideTour'
import { Icon } from '../components/Icon'
import { allAircraft, useStore } from '../store'
import { AIRHISPANIA, MODULES } from '../data/licenses/modules'
import { PPL_SYLLABUS } from '../data/licenses/ppl-syllabus'
import { LESSON_IDS } from '../study/content'

/** Inicio: qué hay en la academia y por dónde seguir */
export function Hub() {
  const s = useStore()
  // primera visita: la guía se abre sola pero en silencio; con el botón, narrada
  const [tour, setTour] = useState<'auto' | 'click' | null>(() => (guideSeen() ? null : 'auto'))
  const fleet = allAircraft(s)
  const blocks = PPL_SYLLABUS.reduce((a, x) => a + x.blocks.length, 0)
  const read = Object.keys(s.study.lessons).length
  const due = Object.values(s.study.srs).filter(v => v.due <= Date.now()).length
  const next = useMemo(() => {
    for (const sub of PPL_SYLLABUS) for (const b of sub.blocks) if (LESSON_IDS.includes(b.id) && !s.study.lessons[b.id]) return { sub, b }
    return null
  }, [s.study.lessons])

  return (
    <div className="wrap">
      {tour && <GuideTour autoplay={tour === 'click'} onClose={() => setTour(null)} />}
      <section className="intro">
        <h1>Estudia para volar, de la PPL a la línea aérea.</h1>
        <p className="lead">El temario completo del PPL(A) con simulacros como los de AESA, el recorrido modular EASA en España y cabinas reales para aprender los procedimientos de cada avión.</p>
        <button className="link-btn" onClick={() => setTour('click')}>Cómo funciona la app</button>
      </section>

      {(read > 0 || due > 0) && (
        <section className="continue">
          {next && <a href={`#/licencias/ppl/${next.sub.id}/${next.b.id}`}><span className="muted small">Seguir con el PPL · {next.sub.name}</span><b>{next.b.title}</b></a>}
          {due > 0 && <a href="#/licencias/ppl?tab=repaso"><span className="muted small">Repaso de hoy</span><b>{due} piezas pendientes</b></a>}
        </section>
      )}

      <section className="index-rows">
        <a className="index-row" href="#/licencias/ppl">
          <span className="index-k">PPL(A)</span>
          <span className="index-body"><b>Temario completo y simulador de examen</b><span className="muted">9 materias y {blocks} lecciones con preguntas explicadas, fichas con repaso espaciado, simulacros con los tiempos de AESA y gestor de la convocatoria.{read ? ` Llevas ${read} lecciones.` : ''}</span></span>
          <Icon name="right" />
        </a>
        <a className="index-row" href="#/licencias/fraseologia">
          <span className="index-k">Radio</span>
          <span className="index-body"><b>Fraseología en español e inglés OACI</b><span className="muted">Palabras normalizadas, colaciones y un simulador de radio con voces de piloto y controlador.</span></span>
          <Icon name="right" />
        </a>
        <a className="index-row" href="#/licencias">
          <span className="index-k">Licencias</span>
          <span className="index-body"><b>Recorrido modular hasta la ATPL</b><span className="muted">{MODULES.length} etapas: VFR nocturno, hour building, ATPL teórico, CPL, MEP, IR, MCC, habilitación de tipo y ATPL, con requisitos verificados.</span></span>
          <Icon name="right" />
        </a>
        <a className="index-row" href="#/cockpits">
          <span className="index-k">Cockpits</span>
          <span className="index-body"><b>Cabinas y procedimientos</b><span className="muted">{fleet.map(a => a.short).join(', ')}: fotos reales, flows basados en el POH o el FCOM, tutorial narrado y repaso de memoria.</span></span>
          <Icon name="right" />
        </a>
        <a className="index-row" href={AIRHISPANIA.url} target="_blank" rel="noreferrer">
          <span className="index-k">Simulador</span>
          <span className="index-body"><b>{AIRHISPANIA.title}</b><span className="muted">{AIRHISPANIA.text}</span></span>
          <Icon name="ext" />
        </a>
      </section>
    </div>
  )
}
