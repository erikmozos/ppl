import { useMemo } from 'react'
import { SCHOOL, SCHOOL_SUBJECTS, type SchoolSubject } from '../data/school'
import { syllabusByCode } from '../data/licenses/ppl-syllabus'
import { hasLesson } from '../study/content'
import { blockStats, readiness } from '../study/exam'
import { useStore } from '../store'
import { Icon } from '../components/Icon'
import { PracticeSetup, SubjectCards, SubjectSummary, readyText } from './ppl/PplSubject'
import { ExamCenter } from './ppl/parts'
import { PplLesson, type LessonCtx } from './ppl/PplLesson'

const courseBlocks = (s: SchoolSubject) => s.temas.flatMap(t => t.blocks)

/** Sección de la escuela: cada asignatura con los temas y el orden de los instructores */
export function DreamAirHome() {
  const s = useStore()
  const stats = useMemo(() => blockStats(s.study), [s.study])
  return (
    <div className="wrap">
      <header className="page-head">
        <a className="back" href="#/"><Icon name="left" size={14} /> Inicio</a>
        <h1>{SCHOOL.name}</h1>
        <p className="lead">{SCHOOL.summary}</p>
      </header>
      <section className="index-rows">
        {SCHOOL_SUBJECTS.map(sub => {
          const ids = courseBlocks(sub)
          const read = ids.filter(id => s.study.lessons[id]).length
          const [ok, n] = ids.reduce(([a, b], id) => [a + (stats[id]?.[0] ?? 0), b + (stats[id]?.[1] ?? 0)], [0, 0])
          return (
            <a key={sub.id} className="index-row" href={`#/dreamair/${sub.id}`}>
              <span className="index-k">{sub.short}</span>
              <span className="index-body"><b>{sub.name}</b><span className="muted">{sub.temas.length} temas · {ids.length} lecciones · {read} leídas{n ? ` · ${Math.round((ok / n) * 100)} % de acierto` : ''}</span></span>
              <Icon name="right" />
            </a>
          )
        })}
      </section>
      <p className="muted small">Cuando tus instructores te den las diapositivas de otra asignatura, se añadirá aquí con sus temas. Las asignaturas que aún no están siguen disponibles en el <a href="#/licencias/ppl">PPL completo</a>, ordenadas por el temario oficial.</p>
    </div>
  )
}

export function DreamAirSubject({ sub, tab }: { sub: SchoolSubject; tab: string }) {
  const s = useStore()
  const syl = syllabusByCode(sub.code)!
  const base = `#/dreamair/${sub.id}`
  const ids = courseBlocks(sub)
  const stats = useMemo(() => blockStats(s.study), [s.study])
  const r = readiness(syl, s.study, stats)
  const tabs: [string, string][] = [['temario', 'Temas del curso'], ['resumen', 'Resumen para estudiar'], ['practicar', 'Practicar'], ['fichas', 'Fichas'], ['simulacro', 'Simulacro']]
  const t = tabs.some(x => x[0] === tab) ? tab : 'temario'
  const rest = syl.blocks.filter(b => !ids.includes(b.id))
  const row = (id: string, n: number) => {
    const b = syl.blocks.find(x => x.id === id)!
    const st = stats[id]
    const has = hasLesson(id)
    return (
      <li key={id} className={has ? '' : 'pending'}>
        <span className="lesson-n">{n}</span>
        <div className="lesson-body">{has ? <a href={`${base}/${id}`}>{b.title}</a> : <span>{b.title}</span>}<p className="muted small">{b.topics}</p></div>
        <div className="lesson-meta small">
          {s.study.lessons[id] && <span className="tag ok">leída</span>}
          {st && st[1] > 0 && <span className={st[0] / st[1] >= 0.75 ? 'ok-text' : st[0] / st[1] >= 0.6 ? '' : 'bad-text'}>{Math.round((st[0] / st[1]) * 100)} % · {st[1]}</span>}
        </div>
      </li>
    )
  }
  let k = 0
  return (
    <div className="wrap">
      <header className="page-head">
        <a className="back" href="#/dreamair"><Icon name="left" size={14} /> {SCHOOL.name}</a>
        <p className="crumb">{sub.short} · materia {sub.code} del examen de AESA</p>
        <h1>{sub.name}</h1>
        <dl className="facts-line">
          <div><dt>Curso</dt><dd>{sub.temas.length} temas, {ids.length} lecciones</dd></div>
          <div><dt>Examen AESA</dt><dd>{syl.exam.questions} preguntas · {syl.exam.minutes} min</dd></div>
          <div><dt>Tu acierto</dt><dd>{r.accuracy === null ? '—' : `${r.accuracy} % en ${r.answered} respuestas`}</dd></div>
          <div><dt>Estado</dt><dd className={r.ready ? 'ok-text' : ''}>{r.ready ? 'Listo para examinarte' : readyText(r)}</dd></div>
        </dl>
      </header>
      <nav className="tabs" role="tablist">{tabs.map(([id, name]) => <a key={id} role="tab" aria-selected={t === id} className={t === id ? 'on' : ''} href={`${base}?tab=${id}`}>{name}</a>)}</nav>
      {t === 'temario' && (
        <div>
          {sub.temas.map(tm => (
            <div key={tm.title}>
              <p className="course-group">{tm.title}</p>
              <ol className="lesson-list">{tm.blocks.map(id => row(id, ++k))}</ol>
            </div>
          ))}
          {rest.length > 0 && (
            <div>
              <p className="course-group">Del temario oficial, todavía no dado en el curso <span className="muted small">(entra en el examen de AESA)</span></p>
              <ol className="lesson-list">{rest.map(b => row(b.id, ++k))}</ol>
            </div>
          )}
        </div>
      )}
      {t === 'resumen' && <SubjectSummary syl={syl} order={[...ids, ...rest.map(b => b.id)]} />}
      {t === 'practicar' && <PracticeSetup syl={syl} />}
      {t === 'fichas' && <SubjectCards syl={syl} />}
      {t === 'simulacro' && <ExamCenter fixed={syl} />}
    </div>
  )
}

export function DreamAirLesson({ sub, id, tab }: { sub: SchoolSubject; id: string; tab: string }) {
  const syl = syllabusByCode(sub.code)!
  const order = [...courseBlocks(sub), ...syl.blocks.map(b => b.id).filter(x => !courseBlocks(sub).includes(x))]
  const ctx: LessonCtx = {
    home: `#/dreamair/${sub.id}`, homeLabel: `${SCHOOL.name} · ${sub.short}`,
    lesson: x => `#/dreamair/${sub.id}/${x}`,
    order: order.map(x => syl.blocks.find(b => b.id === x)!),
    sideTitle: `Curso de ${sub.short}`,
    end: { href: `#/dreamair/${sub.id}?tab=simulacro`, label: 'Simulacro de la asignatura' },
  }
  return <PplLesson syl={syl} id={id} tab={tab} ctx={ctx} />
}
