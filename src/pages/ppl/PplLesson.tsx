import { useEffect, useMemo } from 'react'
import type { SyllabusSubject } from '../../data/licenses/ppl-syllabus'
import { useLesson } from '../../study/content'
import { generate, hasGenerator } from '../../study/generators'
import { actions, useStore } from '../../store'
import { LessonToc, LessonView, readingMinutes } from '../../components/LessonView'
import { Practice } from '../../components/Practice'
import { CardReview } from '../../components/CardReview'
import { Icon } from '../../components/Icon'

export function PplLesson({ syl, id, tab }: { syl: SyllabusSubject; id: string; tab: string }) {
  const s = useStore()
  const file = useLesson(id)
  const idx = syl.blocks.findIndex(b => b.id === id)
  const blk = syl.blocks[idx]
  const prev = syl.blocks[idx - 1], next = syl.blocks[idx + 1]
  const base = `#/licencias/ppl/${syl.id}/${id}`
  const t = tab === 'preguntas' || tab === 'fichas' ? tab : 'leccion'
  const questions = useMemo(() => (file ? [...file.questions, ...(hasGenerator(id) ? Array.from({ length: 5 }, () => generate(id)) : [])] : []), [file, id])
  const read = !!s.study.lessons[id]
  useEffect(() => { window.scrollTo({ top: 0 }) }, [id, t])

  if (!blk) return <div className="wrap"><p>Lección no encontrada.</p></div>
  const head = (
    <header className="page-head">
      <a className="back" href={`#/licencias/ppl/${syl.id}`}><Icon name="left" size={14} /> {syl.code} {syl.name}</a>
      <p className="crumb">Bloque {idx + 1} de {syl.blocks.length} · <span className="mono">{id}</span></p>
      <h1>{file?.lesson.title ?? blk.title}</h1>
      {file && <p className="lead">{file.lesson.summary}</p>}
      {file && <p className="meta">{readingMinutes(file.lesson)} min de lectura · {file.questions.length} preguntas · {file.cards.length} fichas · revisado {file.lesson.reviewed.split('-').reverse().join('-')}{read ? ' · leída' : ''}</p>}
    </header>
  )
  if (file === undefined) return <div className="wrap narrow-doc">{head}<p className="muted">Cargando la lección…</p></div>
  if (file === null) return (
    <div className="wrap narrow-doc">
      {head}
      <div className="notice">Esta lección todavía se está redactando. Mientras tanto, esto es lo que cubre el temario oficial:</div>
      <p>{blk.topics}</p>
      <LessonNav syl={syl} prev={prev} next={next} />
    </div>
  )
  const l = file.lesson
  return (
    <div className="wrap">
      <div className="doc-layout">
        <div className="doc-main">
          {head}
          <nav className="tabs" role="tablist">
            <a role="tab" aria-selected={t === 'leccion'} className={t === 'leccion' ? 'on' : ''} href={base}>Lección</a>
            <a role="tab" aria-selected={t === 'preguntas'} className={t === 'preguntas' ? 'on' : ''} href={`${base}?tab=preguntas`}>Preguntas ({questions.length})</a>
            <a role="tab" aria-selected={t === 'fichas'} className={t === 'fichas' ? 'on' : ''} href={`${base}?tab=fichas`}>Fichas ({file.cards.length})</a>
          </nav>
          {t === 'leccion' && (
            <>
              <LessonView l={l} />
              <div className="lesson-end">
                {read
                  ? <p className="muted small">Lección marcada como leída. Sus fichas están en tu repaso.</p>
                  : <button className="btn primary" onClick={() => { actions.lessonSeen(id); actions.addCards(file.cards.map(c => 'c:' + c.id)) }}>Marcar como leída y añadir sus {file.cards.length} fichas al repaso</button>}
                <a className="btn" href={`${base}?tab=preguntas`}>Practicar las {questions.length} preguntas</a>
              </div>
            </>
          )}
          {t === 'preguntas' && <Practice questions={questions} mode="leccion" title={l.title} />}
          {t === 'fichas' && <CardReview key={id} cards={file.cards} />}
          <LessonNav syl={syl} prev={prev} next={next} />
        </div>
        <aside className="doc-side">
          {t === 'leccion' && <><p className="side-title">En esta lección</p><LessonToc l={l} /></>}
          <p className="side-title">Temario de {syl.name.toLowerCase()}</p>
          <ol className="toc">
            {syl.blocks.map(b => <li key={b.id} className={b.id === id ? 'cur' : ''}><a href={`#/licencias/ppl/${syl.id}/${b.id}`}>{b.title}</a></li>)}
          </ol>
        </aside>
      </div>
    </div>
  )
}

function LessonNav({ syl, prev, next }: { syl: SyllabusSubject; prev?: { id: string; title: string }; next?: { id: string; title: string } }) {
  return (
    <nav className="pager">
      {prev ? <a href={`#/licencias/ppl/${syl.id}/${prev.id}`}><span className="muted small">Anterior</span>{prev.title}</a> : <span />}
      {next ? <a className="next" href={`#/licencias/ppl/${syl.id}/${next.id}`}><span className="muted small">Siguiente</span>{next.title}</a> : <a className="next" href={`#/licencias/ppl/${syl.id}?tab=simulacro`}><span className="muted small">Fin del temario</span>Simulacro de la materia</a>}
    </nav>
  )
}
