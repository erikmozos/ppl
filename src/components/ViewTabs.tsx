import type { Aircraft } from '../types'
import type { ViewInfo } from '../views'

/** Selector de vista (fotos reales / esquema) con la atribución de la foto actual */
export function ViewTabs({ ac, view, setView, views, extra }: { ac: Aircraft; view: string; setView: (v: string) => void; views: readonly ViewInfo[]; extra?: React.ReactNode }) {
  const photo = ac.photos?.find(p => p.id === view)
  if (views.length < 2 && !photo) return null
  return (
    <div className="viewbar">
      <div className="seg small-seg" role="tablist" aria-label="Vista de la cabina">
        {views.map(v => (
          <button key={v.id} role="tab" aria-selected={v.id === view} className={v.id === view ? 'on' : ''} onClick={() => setView(v.id)}>
            {v.photo ? '📷 ' : '▦ '}{v.name}
          </button>
        ))}
      </div>
      {extra}
      {photo && (
        <a className="credit" href={photo.page} target="_blank" rel="noreferrer">
          Foto: {photo.credit} · {photo.license} · Wikimedia Commons
        </a>
      )}
    </div>
  )
}
