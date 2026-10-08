// Exporta todos los textos que narra la app (pasos, intros, guía) a public/audio/texts.json
// para generar su audio neuronal con scripts/tts_piper.py. Uso: npm run audio
import { writeFileSync, mkdirSync } from 'node:fs'
import { BUILTIN } from '../src/data'
import { GUIDE } from '../src/data/guide'
import { END_TEXT, TEST_TEXT, contextFor, flowIntro, stepNarration, textHash } from '../src/speech'

const texts = new Set<string>([END_TEXT, TEST_TEXT])
for (const ac of BUILTIN) {
  for (const f of ac.flows) {
    texts.add(flowIntro(ac, f))
    f.steps.forEach((st, i) => {
      const ctx = contextFor(ac, st.c)
      if (ctx) texts.add(ctx)
      texts.add(stepNarration(ac, st, i, f.steps.length, true))
      texts.add(stepNarration(ac, st, i, f.steps.length, false))
    })
    // en modo estudio con filtro de rol cambia el total: se cubren también los subconjuntos por rol
    for (const r of ac.roles) {
      const sub = f.steps.filter(st => (st.r ?? ac.roles[0].id) === r.id)
      if (sub.length && sub.length !== f.steps.length) sub.forEach((st, i) => {
        texts.add(stepNarration(ac, st, i, sub.length, true))
        texts.add(stepNarration(ac, st, i, sub.length, false))
      })
    }
  }
}
for (const g of GUIDE) texts.add(g.say)

mkdirSync('public/audio', { recursive: true })
const list = [...texts].map(t => ({ h: textHash(t), t }))
writeFileSync('public/audio/texts.json', JSON.stringify(list, null, 0))
console.log(`${list.length} textos exportados`)
