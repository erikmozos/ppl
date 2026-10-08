import type { Module } from '../data/licenses/types'
import { StudyBlock } from '../components/StudyBlock'
import { useStore } from '../store'

export function ModulePage({ m, tab }: { m: Module; tab: string }) {
  const s = useStore()
  const subs = m.subjects ?? []
  const tabs: [string, string][] = [['resumen', 'Resumen y requisitos'], ...(subs.length ? [['asignaturas', `Asignaturas (${subs.length})`] as [string, string]] : []), ['fuentes', 'Fuentes']]
  const t = tabs.some(x => x[0] === tab) ? tab : subs.length && tab === '' ? 'asignaturas' : 'resumen'
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href="#/licencias">← Recorrido modular</a>
          <p className="eyebrow">Etapa {m.stage} · {m.status === 'completo' ? 'Guía completa' : 'En progreso'}</p>
          <h1>{m.icon} {m.name}</h1>
          <p className="muted">{m.summary}</p>
        </div>
      </div>
      <div className="facts">
        {m.facts.map(([k, v]) => <div key={k} className="card fact"><span className="muted small">{k}</span><b>{v}</b></div>)}
      </div>
      {m.featured?.map(f => (
        <a key={f.url} className="card featured" href={f.url} target="_blank" rel="noreferrer">
          <span className="hub-icon">🕹️</span>
          <div><p className="eyebrow">Recurso destacado</p><h3>{f.title} ↗</h3><p className="muted small">{f.text}</p></div>
        </a>
      ))}
      <div className="tabs" role="tablist">
        {tabs.map(([id, name]) => <a key={id} role="tab" aria-selected={t === id} className={t === id ? 'on' : ''} href={`#/licencias/${m.id}?tab=${id}`}>{name}</a>)}
      </div>
      {t === 'resumen' && (
        <div className="study">
          {m.status !== 'completo' && <div className="card note-card">🛠️ Esta etapa está en progreso: aquí tienes los requisitos verificados. La guía de estudio completa por asignaturas se añadirá más adelante.</div>}
          {m.sections.map(b => <StudyBlock key={b.title} b={b} />)}
        </div>
      )}
      {t === 'asignaturas' && (
        <div className="subject-grid">
          {subs.map(sub => {
            const st = s.quiz[`${m.id}/${sub.id}`]
            return (
              <a key={sub.id} className="card subject-card" href={`#/licencias/${m.id}/${sub.id}`}>
                <div className="row between"><span className="subject-icon">{sub.icon}</span>{st && <span className={`score ${st.best >= 75 ? 'good' : st.best >= 50 ? 'mid' : 'low'}`}>{st.best}%</span>}</div>
                <h3>{sub.name}</h3>
                <p className="small muted">{sub.summary}</p>
                <div className="stats"><span><b>{sub.exam.questions}</b> preguntas</span><span><b>{sub.exam.time}</b></span><span><b>{sub.quiz.length}</b> de test</span></div>
              </a>
            )
          })}
        </div>
      )}
      {t === 'fuentes' && (
        <div className="card">
          <h3>Fuentes y normativa</h3>
          <ul className="mini-list">{m.sources.map(r => <li key={r.title}>{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a> : r.title}</li>)}</ul>
          <p className="small muted">Contenido elaborado a partir de una investigación con fuentes oficiales (EASA, AESA, ENAIRE, AEMET, BOE) a octubre de 2026. La normativa cambia: comprueba siempre la versión vigente.</p>
        </div>
      )}
    </div>
  )
}
