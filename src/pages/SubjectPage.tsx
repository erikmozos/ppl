import type { Module, Subject } from '../data/licenses/types'
import { StudyBlock } from '../components/StudyBlock'
import { Quiz } from '../components/Quiz'
import { Rich } from '../components/Rich'

export function SubjectPage({ m, sub, tab }: { m: Module; sub: Subject; tab: string }) {
  const subs = m.subjects ?? []
  const idx = subs.findIndex(x => x.id === sub.id)
  const prev = subs[idx - 1], next = subs[idx + 1]
  const t = tab === 'test' ? 'test' : tab === 'recursos' ? 'recursos' : 'estudio'
  const base = `#/licencias/${m.id}/${sub.id}`
  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <a className="back" href={`#/licencias/${m.id}?tab=asignaturas`}>← {m.short} · Asignaturas</a>
          <p className="eyebrow">Asignatura {idx + 1} de {subs.length}</p>
          <h1>{sub.icon} {sub.name}</h1>
          <p className="muted">{sub.summary}</p>
        </div>
        <div className="card exam-card">
          <span className="muted small">Examen AESA</span>
          <b>{sub.exam.questions} preguntas · {sub.exam.time}</b>
          <span className="small">Aprobado: {sub.exam.pass} aciertos (75 %)</span>
        </div>
      </div>
      <div className="tabs" role="tablist">
        <a role="tab" aria-selected={t === 'estudio'} className={t === 'estudio' ? 'on' : ''} href={base}>📖 Estudio</a>
        <a role="tab" aria-selected={t === 'test'} className={t === 'test' ? 'on' : ''} href={`${base}?tab=test`}>📝 Test ({sub.quiz.length})</a>
        <a role="tab" aria-selected={t === 'recursos'} className={t === 'recursos' ? 'on' : ''} href={`${base}?tab=recursos`}>📚 Libros y recursos</a>
      </div>

      {t === 'estudio' && (
        <div className="split">
          <div className="split-main study">
            {sub.blocks.map(b => <StudyBlock key={b.title} b={b} />)}
            <section className="card traps">
              <h3>⚠️ Trampas típicas de examen</h3>
              <ul className="study-list">{sub.traps.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
            </section>
            <a className="btn primary" href={`${base}?tab=test`}>Hacer el test de {sub.name} →</a>
          </div>
          <aside className="split-side">
            <div className="card">
              <h3>Temario oficial</h3>
              <p className="small muted">AMC1 FCL.210; FCL.215 (EASA)</p>
              <ol className="syllabus">{sub.syllabus.map((x, i) => <li key={i}>{x}</li>)}</ol>
            </div>
            {sub.mnemonics && (
              <div className="card">
                <h3>🧩 Mnemotecnias</h3>
                <ul className="mini-list">{sub.mnemonics.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            )}
            {sub.links && (
              <div className="card">
                <h3>🛩️ Practícalo en cabina</h3>
                <ul className="mini-list">{sub.links.map(l => <li key={l.href}><a href={l.href}>{l.label} →</a></li>)}</ul>
              </div>
            )}
            <div className="card">
              <h3>Navegación</h3>
              <div className="row gap wrap-row">
                {prev && <a className="btn sm" href={`#/licencias/${m.id}/${prev.id}`}>← {prev.name}</a>}
                {next && <a className="btn sm" href={`#/licencias/${m.id}/${next.id}`}>{next.name} →</a>}
              </div>
            </div>
          </aside>
        </div>
      )}

      {t === 'test' && (
        <div className="narrow-test">
          <Quiz id={`${m.id}/${sub.id}`} questions={sub.quiz} title={sub.name} />
          <p className="small muted">Preguntas de práctica redactadas a partir del temario y la normativa; no son del banco oficial de AESA (que no es público). Úsalas para comprobar que entiendes los conceptos.</p>
        </div>
      )}

      {t === 'recursos' && (
        <div className="resource-grid">
          {([['📕 En castellano', sub.books.es], ['📘 En inglés', sub.books.en], ['🆓 Oficial y gratuito', sub.books.free]] as const).map(([h, list]) => (
            <div key={h} className="card">
              <h3>{h}</h3>
              <ul className="mini-list">
                {list.map(r => <li key={r.title}>{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a> : r.title}{r.note && <span className="muted small"> · {r.note}</span>}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
