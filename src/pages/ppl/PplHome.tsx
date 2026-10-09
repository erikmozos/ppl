import { useMemo } from 'react'
import type { Module } from '../../data/licenses/types'
import { PPL_SYLLABUS } from '../../data/licenses/ppl-syllabus'
import { PPL_REVIEWED } from '../../data/licenses/modules'
import { lessonsOf, LESSON_IDS } from '../../study/content'
import { blockStats, readiness } from '../../study/exam'
import { useStore } from '../../store'
import { StudyBlock } from '../../components/StudyBlock'
import { Icon } from '../../components/Icon'
import { DailyReview, ExamCenter, ExamPlan, dueKeys } from './parts'
import { readyText } from './PplSubject'

const TABS: [string, string][] = [['estudio', 'Estudio'], ['repaso', 'Repaso de hoy'], ['simulacro', 'Simulacro'], ['convocatoria', 'Convocatoria'], ['requisitos', 'Requisitos y examen'], ['fuentes', 'Fuentes']]

export function PplHome({ m, tab }: { m: Module; tab: string }) {
  const s = useStore()
  const t = TABS.some(x => x[0] === tab) ? tab : 'estudio'
  const stats = useMemo(() => blockStats(s.study), [s.study])
  const due = dueKeys(s.study)
  const totalBlocks = PPL_SYLLABUS.reduce((a, x) => a + x.blocks.length, 0)
  // siguiente lección: la primera disponible que no hayas leído
  const nextLesson = useMemo(() => {
    for (const sub of PPL_SYLLABUS) for (const b of sub.blocks) if (LESSON_IDS.includes(b.id) && !s.study.lessons[b.id]) return { sub, b }
    return null
  }, [s.study.lessons])
  const read = Object.keys(s.study.lessons).length
  return (
    <div className="wrap">
      <header className="page-head">
        <a className="back" href="#/licencias"><Icon name="left" size={14} /> Licencias</a>
        <h1>PPL(A) · Licencia de piloto privado de avión</h1>
        <p className="lead">{m.summary}</p>
        <dl className="facts-line">{m.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </header>
      <nav className="tabs" role="tablist">
        {TABS.map(([id, name]) => <a key={id} role="tab" aria-selected={t === id} className={t === id ? 'on' : ''} href={`#/licencias/ppl?tab=${id}`}>{name}{id === 'repaso' && due.q.length + due.c.length > 0 ? <span className="count">{due.q.length + due.c.length}</span> : null}</a>)}
      </nav>

      {t === 'estudio' && (
        <div className="stack">
          <div className="today">
            <div><span className="muted small">Lecciones leídas</span><b>{read} de {totalBlocks}</b></div>
            <div><span className="muted small">Para repasar hoy</span><b>{due.q.length + due.c.length}</b></div>
            <div><span className="muted small">Simulacros hechos</span><b>{s.study.exams.length}</b></div>
            <div className="today-actions">
              {nextLesson && <a className="btn primary" href={`#/licencias/ppl/${nextLesson.sub.id}/${nextLesson.b.id}`}>Seguir: {nextLesson.b.title}</a>}
              {due.q.length + due.c.length > 0 && <a className="btn" href="#/licencias/ppl?tab=repaso">Repaso de hoy</a>}
            </div>
          </div>
          <div className="table-wrap">
            <table className="table subjects">
              <thead><tr><th>Materia</th><th>Examen</th><th>Temario</th><th>Acierto</th><th>Preparación</th></tr></thead>
              <tbody>
                {PPL_SYLLABUS.map(sub => {
                  const r = readiness(sub, s.study, stats)
                  const lessons = lessonsOf(sub.code)
                  const readN = sub.blocks.filter(b => s.study.lessons[b.id]).length
                  return (
                    <tr key={sub.code}>
                      <td><a href={`#/licencias/ppl/${sub.id}`}><span className="mono muted">{sub.code}</span> {sub.name}</a></td>
                      <td className="nowrap">{sub.exam.questions} preg. · {sub.exam.minutes} min</td>
                      <td className="nowrap">{readN}/{sub.blocks.length} leídas{lessons.length < sub.blocks.length ? <span className="muted small"> · {lessons.length} disponibles</span> : null}</td>
                      <td>{r.accuracy === null ? '—' : `${r.accuracy} %`}</td>
                      <td className={r.ready ? 'ok-text' : 'muted small'}>{r.ready ? 'Lista' : readyText(r)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="muted small">«Lista» significa: los tres últimos simulacros de la materia con un 85 % o más y ningún bloque del temario por debajo del 70 % con al menos 20 respuestas en cada uno. El margen sobre el 75 % cubre la diferencia entre este banco propio y el de AESA, que no es público.</p>
          <div className="link-rows">
            <a href="#/licencias/fraseologia"><b>Fraseología en español e inglés OACI</b><span className="muted small">La parte práctica de Comunicaciones, con simulador de radio.</span></a>
            {m.featured?.map(f => <a key={f.url} href={f.url} target="_blank" rel="noreferrer"><b>{f.title}</b><span className="muted small">{f.text}</span></a>)}
          </div>
        </div>
      )}
      {t === 'repaso' && <DailyReview />}
      {t === 'simulacro' && <ExamCenter />}
      {t === 'convocatoria' && <ExamPlan />}
      {t === 'requisitos' && <div className="doc narrow-doc">{m.sections.map(b => <StudyBlock key={b.title} b={b} level={2} />)}</div>}
      {t === 'fuentes' && (
        <div className="doc narrow-doc">
          <ul className="link-list">{m.sources.map(r => <li key={r.title}>{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> : r.title}</li>)}</ul>
          <p className="muted small">Temario redactado a partir de la normativa (EASA, SERA, OACI, AESA, ENAIRE, AEMET, BOE) y de manuales de referencia, con preguntas originales: no son del banco de AESA, que no es público. Última revisión: {PPL_REVIEWED.split('-').reverse().join('-')}.</p>
        </div>
      )}
    </div>
  )
}
