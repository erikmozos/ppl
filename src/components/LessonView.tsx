import type { Lesson } from '../data/licenses/types'
import { StudyBlock, slug } from './StudyBlock'
import { Rich } from './Rich'

const date = (d: string) => d.split('-').reverse().join('-')
export const readingMinutes = (l: Lesson) => Math.max(3, Math.round(JSON.stringify(l.sections).split(/\s+/).length / 200))

/** Lección del temario con estructura de documento: objetivos, secciones, cifras, trampas, España y fuentes */
export function LessonView({ l }: { l: Lesson }) {
  return (
    <article className="lesson">
      <section className="objectives">
        <h2>Al terminar sabrás</h2>
        <ul className="study-list">{l.objectives.map((o, i) => <li key={i}><Rich text={o} /></li>)}</ul>
      </section>
      {l.sections.map(b => <StudyBlock key={b.title} b={b} level={2} />)}
      <section className="block memo" id="para-memorizar">
        <h2>Para memorizar</h2>
        <ul className="numbers">{l.numbers.map((n, i) => <li key={i}><Rich text={n} /></li>)}</ul>
      </section>
      <section className="block traps" id="trampas-de-examen">
        <h2>Trampas de examen</h2>
        <ul className="study-list">{l.traps.map((n, i) => <li key={i}><Rich text={n} /></li>)}</ul>
      </section>
      {l.spain && l.spain.length > 0 && (
        <section className="block" id="en-espana">
          <h2>En España</h2>
          <ul className="study-list">{l.spain.map((n, i) => <li key={i}><Rich text={n} /></li>)}</ul>
        </section>
      )}
      {l.links && l.links.length > 0 && (
        <section className="block" id="practicalo">
          <h2>Practícalo en la app</h2>
          <ul className="link-list">{l.links.map(x => <li key={x.href}><a href={x.href}>{x.label}</a></li>)}</ul>
        </section>
      )}
      <section className="block sources" id="fuentes">
        <h2>Fuentes</h2>
        <ul className="link-list small">{l.sources.map(s => <li key={s.title}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}{s.note && <span className="muted"> · {s.note}</span>}</li>)}</ul>
        <p className="muted small">Revisado el {date(l.reviewed)}. La normativa cambia: comprueba la versión vigente.</p>
      </section>
    </article>
  )
}

/** Índice de la lección para la columna lateral */
export function LessonToc({ l }: { l: Lesson }) {
  const items = [...l.sections.map(s => s.title), 'Para memorizar', 'Trampas de examen', ...(l.spain?.length ? ['En España'] : []), 'Fuentes']
  return <ol className="toc">{items.map(t => <li key={t}><a href={`#${slug(t)}`} onClick={e => { e.preventDefault(); document.getElementById(slug(t))?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{t}</a></li>)}</ol>
}
