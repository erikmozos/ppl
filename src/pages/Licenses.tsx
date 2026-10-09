import { MODULES } from '../data/licenses/modules'
import { Icon } from '../components/Icon'

/** Recorrido modular: las etapas en orden, como una lista */
export function Licenses() {
  return (
    <div className="wrap">
      <header className="page-head">
        <a className="back" href="#/"><Icon name="left" size={14} /> Inicio</a>
        <h1>Recorrido modular EASA en España</h1>
        <p className="lead">De cero a piloto de línea, etapa a etapa, con los requisitos, horas, exámenes y validez de Part-FCL y AESA. El PPL(A) tiene el temario completo; el resto de etapas, los requisitos verificados.</p>
      </header>
      <ol className="stage-list">
        {MODULES.map(m => (
          <li key={m.id}>
            <span className="stage-n mono">{m.stage}</span>
            <div className="stage-body">
              <a href={`#/licencias/${m.id}`}><b>{m.name}</b></a>
              <p className="muted">{m.summary}</p>
              <p className="small facts-inline">{m.facts.slice(0, 3).map(([k, v]) => <span key={k}><span className="muted">{k}:</span> {v}</span>)}</p>
            </div>
            <span className={`tag ${m.status === 'completo' ? 'ok' : ''}`}>{m.status === 'completo' ? (m.id === 'ppl' ? 'Temario completo' : 'Completo') : 'Requisitos'}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
