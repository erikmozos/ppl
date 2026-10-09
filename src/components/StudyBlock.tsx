import type { Block } from '../data/licenses/types'
import { Rich, plain } from './Rich'
import { speak, stopSpeech, useSpeech } from '../speech'
import { Figure } from './Figure'
import { Icon } from './Icon'

const NOTE: Record<string, string> = { es: 'En España', warn: 'Atención', tip: 'Consejo' }
export const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Bloque de estudio: texto, viñetas, tabla, fórmulas, ejemplos resueltos y figura, con lectura en voz alta */
export function StudyBlock({ b, level = 3 }: { b: Block; level?: 2 | 3 }) {
  const sp = useSpeech()
  const toRead = [b.title, ...(b.text ?? []), ...(b.bullets ?? []), ...(b.formulas ?? []).map(f => `${f.f}. ${f.note ?? ''}`), ...(b.examples ?? []).map(e => `Ejemplo: ${e.q} Solución: ${e.a}`), b.note?.text ?? ''].map(plain).join('. ')
  const H = level === 2 ? 'h2' : 'h3'
  return (
    <section className="block" id={slug(b.title)}>
      <div className="block-head">
        <H>{b.title}</H>
        {b.verify && <span className="tag warn" title="Incluye valores de un manual o POH concreto: contrástalos con el de tu avión">valor de manual</span>}
        {(sp.supported || sp.neuralCount > 0) && (
          <button className="icon-btn" onClick={() => (sp.speaking ? stopSpeech() : speak(toRead))} aria-label={sp.speaking ? 'Parar la lectura' : `Escuchar: ${b.title}`} title={sp.speaking ? 'Parar' : 'Escuchar'}>
            <Icon name={sp.speaking ? 'stop' : 'speaker'} />
          </button>
        )}
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
          {b.table.caption && <p className="table-cap">{b.table.caption}</p>}
          <table className="table study-table">
            <thead><tr>{b.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich text={c} /></td>)}</tr>)}</tbody>
          </table>
          {b.table.src && <p className="table-src">Fuente: {b.table.src}</p>}
        </div>
      )}
      {b.figure && <Figure id={b.figure} caption={b.caption} />}
      {b.examples && (
        <div className="examples">
          {b.examples.map((e, i) => (
            <details key={i} className="example">
              <summary><span className="example-k">Ejemplo {b.examples!.length > 1 ? i + 1 : ''}</span> <Rich text={e.q} /></summary>
              <p><Rich text={e.a} /></p>
            </details>
          ))}
        </div>
      )}
      {b.note && <div className={`callout ${b.note.kind}`}><b>{NOTE[b.note.kind]}.</b> <Rich text={b.note.text} /></div>}
    </section>
  )
}
