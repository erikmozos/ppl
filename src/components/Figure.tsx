import { lazy, Suspense, useEffect, useState } from 'react'
import { loadFigure } from '../study/content'

const Widget = lazy(() => import('./widgets'))

/** Figura del temario: SVG propio ('svg:nombre') o calculadora interactiva ('calc:…', 'sim:…') */
export function Figure({ id, caption }: { id: string; caption?: string }) {
  return (
    <figure className="fig-wrap">
      {id.startsWith('svg:') ? <SvgFigure name={id.slice(4)} /> : (
        <Suspense fallback={<div className="fig-loading muted small">Cargando…</div>}><Widget id={id} /></Suspense>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function SvgFigure({ name }: { name: string }) {
  const [svg, setSvg] = useState<string | null | undefined>(undefined)
  useEffect(() => { let alive = true; loadFigure(name).then(s => alive && setSvg(s)); return () => { alive = false } }, [name])
  if (svg === undefined) return <div className="fig fig-loading" />
  if (svg === null) return <div className="fig muted small">Figura no disponible.</div>
  return <div className="fig" dangerouslySetInnerHTML={{ __html: svg }} />
}
