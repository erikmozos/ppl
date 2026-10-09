import { useMemo, useState } from 'react'
import type { Subject } from '../../data/licenses/types'
import type { SyllabusSubject } from '../../data/licenses/ppl-syllabus'
import { hasLesson, lessonsOf, useLessons } from '../../study/content'
import { blockStats, readiness } from '../../study/exam'
import { generateMany, hasGenerator } from '../../study/generators'
import { actions, useStore } from '../../store'
import { Practice } from '../../components/Practice'
import { CardReview } from '../../components/CardReview'
import { Icon } from '../../components/Icon'
import { ExamCenter, dueKeys } from './parts'

const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])

export function PplSubject({ syl, sub, tab }: { syl: SyllabusSubject; sub?: Subject; tab: string }) {
  const s = useStore()
  const base = `#/licencias/ppl/${syl.id}`
  const tabs: [string, string][] = [['temario', 'Temario'], ['practicar', 'Practicar'], ['fichas', 'Fichas'], ['simulacro', 'Simulacro'], ['recursos', 'Libros y recursos']]
  const t = tabs.some(x => x[0] === tab) ? tab : 'temario'
  const stats = useMemo(() => blockStats(s.study), [s.study])
  const r = readiness(syl, s.study, stats)
  const avail = lessonsOf(syl.code).length
  return (
    <div className="wrap">
      <header className="page-head">
        <a className="back" href="#/licencias/ppl"><Icon name="left" size={14} /> PPL(A)</a>
        <p className="crumb mono">{syl.code}</p>
        <h1>{syl.name}</h1>
        {sub && <p className="lead">{sub.summary}</p>}
        <dl className="facts-line">
          <div><dt>Examen AESA</dt><dd>{syl.exam.questions} preguntas · {syl.exam.minutes} min</dd></div>
          <div><dt>Aprobado</dt><dd>{syl.exam.pass} aciertos (75 %)</dd></div>
          <div><dt>Temario</dt><dd>{avail} de {syl.blocks.length} lecciones</dd></div>
          <div><dt>Tu acierto</dt><dd>{r.accuracy === null ? '—' : `${r.accuracy} % en ${r.answered} respuestas`}</dd></div>
          <div><dt>Estado</dt><dd className={r.ready ? 'ok-text' : ''}>{r.ready ? 'Listo para examinarte' : readyText(r)}</dd></div>
        </dl>
      </header>
      <nav className="tabs" role="tablist">
        {tabs.map(([id, name]) => <a key={id} role="tab" aria-selected={t === id} className={t === id ? 'on' : ''} href={`${base}?tab=${id}`}>{name}</a>)}
      </nav>
      {t === 'temario' && (
        <ol className="lesson-list">
          {syl.blocks.map((b, i) => {
            const st = stats[b.id]
            const has = hasLesson(b.id)
            return (
              <li key={b.id} className={has ? '' : 'pending'}>
                <span className="lesson-n">{i + 1}</span>
                <div className="lesson-body">
                  {has ? <a href={`${base}/${b.id}`}>{b.title}</a> : <span>{b.title}</span>}
                  <p className="muted small">{b.topics}</p>
                </div>
                <div className="lesson-meta small">
                  {s.study.lessons[b.id] && <span className="tag ok">leída</span>}
                  {!has && <span className="tag">en redacción</span>}
                  {st && st[1] > 0 && <span className={st[0] / st[1] >= 0.75 ? 'ok-text' : st[0] / st[1] >= 0.6 ? '' : 'bad-text'}>{Math.round((st[0] / st[1]) * 100)} % · {st[1]}</span>}
                </div>
              </li>
            )
          })}
        </ol>
      )}
      {t === 'practicar' && <PracticeSetup syl={syl} />}
      {t === 'fichas' && <SubjectCards syl={syl} />}
      {t === 'simulacro' && <ExamCenter fixed={syl} />}
      {t === 'recursos' && sub && (
        <div className="stack">
          {syl.code === '090' && <div className="panel"><p>La parte práctica de esta materia está en el módulo de <a href="#/licencias/fraseologia">fraseología en español e inglés OACI</a>, con su <a href="#/licencias/fraseologia?tab=radio">simulador de radio</a>.</p></div>}
          {sub.links && <div className="panel"><h3>Practícalo en la app</h3><ul className="link-list">{sub.links.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul></div>}
          {([['En castellano', sub.books.es], ['En inglés', sub.books.en], ['Oficial y gratuito', sub.books.free]] as const).map(([h, list]) => (
            <div key={h} className="panel">
              <h3>{h}</h3>
              <ul className="link-list">{list.map(x => <li key={x.title}>{x.url ? <a href={x.url} target="_blank" rel="noreferrer">{x.title}</a> : x.title}{x.note && <span className="muted small"> · {x.note}</span>}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function readyText(r: ReturnType<typeof readiness>) {
  if (!r.answered) return 'Sin empezar'
  const parts: string[] = []
  if (r.runs.length < 3) parts.push(`${r.runs.length}/3 simulacros`)
  else if (r.runs.some(x => x.pct < 85)) parts.push('simulacros por debajo del 85 %')
  if (r.weak.length) parts.push(`${r.weak.length} bloques flojos`)
  if (r.few.length) parts.push(`${r.few.length} bloques con pocas respuestas`)
  return parts.join(' · ') || 'En progreso'
}

function PracticeSetup({ syl }: { syl: SyllabusSubject }) {
  const s = useStore()
  const files = useLessons(syl.code)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'todas' | 'nuevas' | 'falladas'>('todas')
  const [n, setN] = useState(20)
  const [calc, setCalc] = useState(true)
  const [run, setRun] = useState<{ key: number; qs: ReturnType<typeof generateMany> } | null>(null)
  if (!files) return <p className="muted">Cargando preguntas…</p>
  const blocks = files.map(f => f.lesson.id)
  const pool = files.filter(f => !sel.size || sel.has(f.lesson.id)).flatMap(f => f.questions)
    .filter(q => filter === 'todas' || (filter === 'nuevas' ? !s.study.q[q.id] : s.study.q[q.id] && !s.study.q[q.id].last))
  const genBlocks = (sel.size ? [...sel] : syl.blocks.map(b => b.id)).filter(hasGenerator)
  function start() {
    const g = calc && filter !== 'falladas' ? generateMany(Math.round(n / 5), genBlocks) : []
    setRun({ key: Date.now(), qs: shuffle([...shuffle(pool).slice(0, n - g.length), ...g]) })
  }
  if (run) return <div className="stack"><Practice key={run.key} questions={run.qs} title={syl.name} onFinish={() => setRun(null)} /><div><button className="btn ghost sm" onClick={() => setRun(null)}>Cambiar la selección</button></div></div>
  return (
    <div className="panel stack">
      <div className="w-field"><span>Bloques ({sel.size ? sel.size : 'todos'})</span>
        <div className="check-grid">
          {blocks.map(id => {
            const b = syl.blocks.find(x => x.id === id)
            return <label key={id} className="check small"><input type="checkbox" checked={sel.has(id)} onChange={e => setSel(p => { const x = new Set(p); if (e.target.checked) x.add(id); else x.delete(id); return x })} /> <span className="mono muted">{id}</span> {b?.title}</label>
          })}
        </div>
      </div>
      <div className="seg-row">{([['todas', 'Todas'], ['nuevas', 'Sin responder'], ['falladas', 'Falladas la última vez']] as const).map(([k, l]) => <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}</div>
      <div className="seg-row">{[10, 20, 40, 80].map(k => <button key={k} className={n === k ? 'on' : ''} onClick={() => setN(k)}>{k} preguntas</button>)}</div>
      {genBlocks.length > 0 && <label className="check small"><input type="checkbox" checked={calc} onChange={e => setCalc(e.target.checked)} /> Incluir cálculos generados con valores nuevos</label>}
      <p className="muted small">{pool.length} preguntas disponibles con esta selección.</p>
      <div><button className="btn primary" onClick={start} disabled={!pool.length && !(calc && genBlocks.length)}>Empezar</button></div>
    </div>
  )
}

function SubjectCards({ syl }: { syl: SyllabusSubject }) {
  const s = useStore()
  const files = useLessons(syl.code)
  const [mode, setMode] = useState<'due' | 'all' | null>(null)
  if (!files) return <p className="muted">Cargando fichas…</p>
  const all = files.flatMap(f => f.cards)
  const dueSet = new Set(dueKeys(s.study).c)
  const due = all.filter(c => dueSet.has(c.id))
  const inQueue = all.filter(c => s.study.srs['c:' + c.id]).length
  if (mode) return <CardReview key={mode} cards={mode === 'due' ? due : shuffle(all)} onDone={() => setMode(null)} />
  return (
    <div className="panel stack">
      <div className="kpi-row">
        <div><b>{all.length}</b><span>fichas de la materia</span></div>
        <div><b>{inQueue}</b><span>en tu repaso</span></div>
        <div><b>{due.length}</b><span>tocan hoy</span></div>
      </div>
      <div className="row gap wrap-row">
        <button className="btn primary" disabled={!due.length} onClick={() => setMode('due')}>Repasar las de hoy ({due.length})</button>
        <button className="btn" disabled={!all.length} onClick={() => setMode('all')}>Repasarlas todas</button>
        <button className="btn ghost" disabled={inQueue === all.length} onClick={() => actions.addCards(all.map(c => 'c:' + c.id))}>Añadir todas a mi repaso</button>
      </div>
    </div>
  )
}
