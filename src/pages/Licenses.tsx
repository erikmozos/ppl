import { MODULES, AIRHISPANIA } from '../data/licenses/modules'
import { useStore } from '../store'

/** Recorrido modular: cada etapa como una tarjeta en la línea de tiempo */
export function Licenses() {
  const s = useStore()
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href="#/">← Inicio</a>
          <p className="eyebrow">Licencias · Recorrido modular EASA en España</p>
          <h1>De cero a piloto de línea</h1>
          <p className="muted">Cada etapa tiene sus requisitos, horas, exámenes y validez según Part-FCL y AESA. La PPL está completa; el resto se irá ampliando.</p>
        </div>
      </div>
      <ol className="path">
        {MODULES.map(m => {
          const subs = m.subjects ?? []
          const passed = subs.filter(sub => (s.quiz[`${m.id}/${sub.id}`]?.best ?? 0) >= 75).length
          return (
            <li key={m.id} className={`path-step ${m.status}`}>
              <span className="path-dot">{m.icon}</span>
              <a className="card path-card" href={`#/licencias/${m.id}`}>
                <div className="row between">
                  <span className="chip">Etapa {m.stage}</span>
                  <span className={`status ${m.status}`}>{m.status === 'completo' ? '✅ Guía completa' : '🛠️ En progreso'}</span>
                </div>
                <h3>{m.name}</h3>
                <p className="small muted">{m.summary}</p>
                <div className="facts-mini">{m.facts.slice(0, 3).map(([k, v]) => <span key={k}><b>{k}:</b> {v}</span>)}</div>
                {subs.length > 0 && (
                  <>
                    <div className="bar"><i style={{ width: `${(passed / subs.length) * 100}%` }} /></div>
                    <span className="small muted">{passed}/{subs.length} asignaturas con el test aprobado</span>
                  </>
                )}
              </a>
            </li>
          )
        })}
      </ol>
      <a className="card featured" href={AIRHISPANIA.url} target="_blank" rel="noreferrer">
        <span className="hub-icon">🕹️</span>
        <div><p className="eyebrow">Complemento en simulador</p><h3>{AIRHISPANIA.title} ↗</h3><p className="muted small">{AIRHISPANIA.text}</p></div>
      </a>
    </div>
  )
}
