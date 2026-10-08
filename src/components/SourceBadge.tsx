import { sourceOf } from '../data/sources'

/** «Basado en»: manual y sección de referencia de un procedimiento */
export function SourceBadge({ acId, flowId, custom, compact }: { acId: string; flowId: string; custom?: boolean; compact?: boolean }) {
  if (custom) return <p className="src small muted">✏️ Flow propio (editado por ti)</p>
  const s = sourceOf(acId, flowId)
  if (!s) return null
  if (compact) return <p className="src small" title={s.manual}>📘 {s.section}</p>
  return (
    <details className="src card">
      <summary>📘 <b>Basado en:</b> {s.section} <span className="muted">· {s.level}</span></summary>
      <p><b>Manual:</b> {s.manual}{s.extra ? ` · ${s.extra}` : ''}</p>
      <p className="muted small">{s.note} Los pasos siguen el orden y el contenido de esa sección, pero no son una transcripción literal: verifica siempre con la revisión vigente del manual y con las SOP de tu escuela u operador.</p>
    </details>
  )
}
