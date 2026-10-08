import { allAircraft, bestScore, flowsOf, useStore } from '../store'
import { Cockpit } from '../components/Cockpit'
import { controlsOf } from '../layout'
import { buildViz } from '../flowviz'
import { viewAircraft, viewsOf } from '../views'

export function Fleet() {
  const s = useStore()
  const list = allAircraft(s)
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href="#/">← Inicio</a>
          <p className="eyebrow">Cockpits · Type ratings</p>
          <h1>Cabinas y procedimientos</h1>
          <p className="muted">Fotos reales y esquemas interactivos de cada cabina, flows animados con voz, tutorial guiado, repaso de memoria y flashcards.</p>
        </div>
        <a className="btn" href="#/new">+ Subir mi cabina</a>
      </div>
      <h2 className="sec">Flotas</h2>
      <div className="grid">
        {list.map(ac => {
          const flows = flowsOf(s, ac)
          const done = flows.filter(f => (bestScore(s, ac.id, f.id) ?? 0) >= 90).length
          const vac = viewAircraft(ac, viewsOf(ac)[0].id, s)
          const preview = flows[0] ? buildViz(vac, flows[0].steps, flows[0].steps.length) : { layers: [], badges: [] }
          return (
            <a key={ac.id} className="card ac-card" href={`#/ac/${ac.id}`}>
              <div className="thumb">
                <Cockpit ac={vac} zoomable={false} compact layers={preview.layers} showLabels={false} />
              </div>
              <div className="ac-body">
                <div className="chip">{ac.category}</div>
                <h3>{ac.name}</h3>
                <p className="muted small">{ac.tagline}</p>
                <div className="stats">
                  <span><b>{controlsOf(ac).length}</b> mandos</span>
                  <span><b>{flows.length}</b> flows</span>
                  <span><b>{done}</b> dominados</span>
                </div>
                <div className="bar"><i style={{ width: `${flows.length ? (done / flows.length) * 100 : 0}%` }} /></div>
              </div>
            </a>
          )
        })}
        <a className="card ac-card add" href="#/new">
          <div className="plus">+</div>
          <h3>Añadir cabina propia</h3>
          <p className="muted small">Sube una foto o un esquema de cualquier avión, marca los mandos y crea tus flows.</p>
        </a>
      </div>
    </div>
  )
}
