/** Texto con **negritas** (marcado mínimo de los contenidos de estudio) */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return <>{parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p))}</>
}
export const plain = (t: string) => t.replace(/\*\*/g, '')
