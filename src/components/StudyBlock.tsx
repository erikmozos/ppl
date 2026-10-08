import type { Block } from '../data/licenses/types'
import { Rich, plain } from './Rich'
import { speak, stopSpeech, useSpeech } from '../speech'

/** Bloque de estudio: texto, viñetas, tabla, fórmulas y ejemplos resueltos, con lectura en voz alta */
export function StudyBlock({ b }: { b: Block }) {
  const sp = useSpeech()
  const toRead = [b.title, ...(b.text ?? []), ...(b.bullets ?? []), ...(b.formulas ?? []).map(f => `${f.f}. ${f.note ?? ''}`), ...(b.examples ?? []).map(e => `Ejemplo: ${e.q} Solución: ${e.a}`)].map(plain).join('. ')
  return (
    <section className="card study-block">
      <div className="row between">
        <h3>{b.title}</h3>
        <div className="row gap">
          {b.verify && <span className="chip warn" title="Incluye cifras de manual estándar: contrástalas con el banco de AESA o tu manual">valor de manual</span>}
          {(sp.supported || sp.neuralCount > 0) && <button className="btn ghost sm" onClick={() => (sp.speaking ? stopSpeech() : speak(toRead))} aria-label={`Escuchar: ${b.title}`}>{sp.speaking ? '⏹' : '🔊'}</button>}
        </div>
      </div>
      {b.text?.map((t, i) => <p key={i}><Rich text={t} /></p>)}
      {b.bullets && <ul className="study-list">{b.bullets.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>}
      {b.formulas && (
        <div className="formulas">
          {b.formulas.map((f, i) => <div key={i} className="formula"><code>{f.f}</code>{f.note && <span>{f.note}</span>}</div>)}
        </div>
      )}
      {b.table && (
        <div className="table-wrap">
          {b.table.caption && <p className="small muted">{b.table.caption}</p>}
          <table className="table study-table">
            <thead><tr>{b.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich text={c} /></td>)}</tr>)}</tbody>
          </table>
          {b.table.src && <p className="small muted">Fuente: {b.table.src}</p>}
        </div>
      )}
      {b.examples && (
        <div className="examples">
          {b.examples.map((e, i) => (
            <details key={i} className="example">
              <summary>✏️ {e.q}</summary>
              <p><Rich text={e.a} /></p>
            </details>
          ))}
        </div>
      )}
    </section>
  )
}
