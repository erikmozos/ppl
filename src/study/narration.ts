// Texto que se lee en voz alta para cada sección de una lección.
// Lo usan la web (botón Escuchar) y scripts/lesson-audio.ts (voces pregeneradas), así que debe ser idéntico en ambos.
import type { Block } from '../data/licenses/types'

const plain = (t: string) => t.replace(/\*\*/g, '')

export const blockSpeech = (b: Block) =>
  [b.title, ...(b.text ?? []), ...(b.bullets ?? []), ...(b.formulas ?? []).map(f => `${f.f}. ${f.note ?? ''}`), ...(b.examples ?? []).map(e => `Ejemplo: ${e.q} Solución: ${e.a}`), ...(b.ideas ?? []).map(x => `Para entenderlo: ${x}`), b.note?.text ?? '']
    .map(plain).filter(Boolean).join('. ')
