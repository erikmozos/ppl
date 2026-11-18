/** Texto con **negritas** y *cursivas* (marcado mínimo de los contenidos de estudio) */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return <>{parts.map((p, i) => (i % 2 ? <b key={i}>{italics(p)}</b> : <span key={i}>{italics(p)}</span>))}</>
}
function italics(t: string) {
  const parts = t.split(/(?<![\w*])\*([^*\n]+?)\*(?![\w*])/g)
  return parts.length === 1 ? t : parts.map((p, i) => (i % 2 ? <i key={i}>{p}</i> : p))
}
export const plain = (t: string) => t.replace(/\*\*/g, '').replace(/(?<![\w*])\*([^*\n]+?)\*(?![\w*])/g, '$1')
