import { c172 } from './c172'
import { pa27 } from './pa27'
import { atr72 } from './atr72'
import { b737 } from './b737'
import { pa28 } from './pa28'
import { airliner, ga } from './env'

export const BUILTIN = [ga(c172), ga(pa28), ga(pa27), airliner(atr72, 460), airliner(b737, 530)]

// En desarrollo, avisa de pasos que apuntan a mandos inexistentes o ids duplicados
if (import.meta.env?.DEV) {
  for (const ac of BUILTIN) {
    const ids = ac.panels.flatMap(p => p.rows.flat()).filter(c => c.kind !== 'blank').map(c => c.id)
    const set = new Set(ids)
    if (set.size !== ids.length) console.warn(`[${ac.id}] ids duplicados:`, ids.filter((x, i) => ids.indexOf(x) !== i))
    for (const f of ac.flows) for (const s of f.steps) if (!set.has(s.c)) console.warn(`[${ac.id}/${f.id}] mando inexistente: ${s.c}`)
  }
}
