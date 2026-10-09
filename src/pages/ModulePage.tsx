import type { Module } from '../data/licenses/types'
import { StudyBlock } from '../components/StudyBlock'
import { useStore } from '../store'
import { Quiz } from '../components/Quiz'
import { RadioList, RadioTrainer } from '../components/RadioTrainer'
import { Icon } from '../components/Icon'

export function ModulePage({ m, tab, sid }: { m: Module; tab: string; sid?: string | null }) {
  const s = useStore()
  const subs = m.subjects ?? []
  const tabs: [string, string][] = [
    ['resumen', m.radio ? 'Fundamentos' : 'Resumen y requisitos'],
    ...(subs.length ? [['asignaturas', `Asignaturas (${subs.length})`] as [string, string]] : []),
    ...(m.radio ? [['radio', `Simulador de radio (${m.radio.length})`] as [string, string]] : []),
    ...(m.quiz ? [['test', `Test (${m.quiz.length})`] as [string, string]] : []),
    ['fuentes', 'Fuentes'],
  ]
  const t = tabs.some(x => x[0] === tab) ? tab : subs.length && tab === '' ? 'asignaturas' : 'resumen'
  return (
    <div className="wrap">
      <header className="page-head">
        <a className="back" href="#/licencias"><Icon name="left" size={14} /> Recorrido modular</a>
        <p className="crumb">Etapa {m.stage} · {m.status === 'completo' ? 'Guía completa' : 'Requisitos verificados'}</p>
        <h1>{m.name}</h1>
        <p className="lead">{m.summary}</p>
        <dl className="facts-line">{m.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </header>
      {m.featured?.map(f => (
        <p key={f.url} className="small"><a href={f.url} target="_blank" rel="noreferrer">{f.title}</a> <span className="muted">· {f.text}</span></p>
      ))}
      <nav className="tabs" role="tablist">
        {tabs.map(([id, name]) => <a key={id} role="tab" aria-selected={t === id} className={t === id ? 'on' : ''} href={`#/licencias/${m.id}?tab=${id}`}>{name}</a>)}
      </nav>
      {t === 'resumen' && (
        <div className="doc narrow-doc">
          {m.status !== 'completo' && <div className="notice">Esta etapa está en progreso: aquí tienes los requisitos verificados. La guía de estudio completa por asignaturas se añadirá más adelante.</div>}
          {m.sections.map(b => <StudyBlock key={b.title} b={b} level={2} />)}
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
      {t === 'radio' && m.radio && (() => {
        const sc = m.radio.find(x => x.id === sid)
        const base = `#/licencias/${m.id}?tab=radio`
        return sc ? <RadioTrainer sc={sc} back={base} quizKey={`${m.id}/radio-${sc.id}`} /> : <RadioList scenarios={m.radio} base={base} />
      })()}
      {t === 'test' && m.quiz && (
        <div className="narrow-test"><Quiz id={`${m.id}/test`} questions={m.quiz} title={m.short} /></div>
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
