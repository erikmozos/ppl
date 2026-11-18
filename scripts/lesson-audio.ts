// Exporta los textos de lectura en voz alta de las lecciones de DreamAir (asignaturas del curso)
// para generar sus voces naturales con scripts/edge_tts_lessons.py
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { blockSpeech } from '../src/study/narration'
import { textHash } from '../src/speech'
import { SCHOOL_SUBJECTS } from '../src/data/school'
import type { Block, LessonFile } from '../src/data/licenses/types'

const root = 'src/content/ppl'
const blocks: Block[] = []
for (const sub of SCHOOL_SUBJECTS)
  for (const f of readdirSync(join(root, sub.code)).filter(x => x.endsWith('.json')))
    blocks.push(...(JSON.parse(readFileSync(join(root, sub.code, f), 'utf8')) as LessonFile).lesson.sections)
const seen = new Map<string, string>()
for (const b of blocks) { const t = blockSpeech(b); seen.set(textHash(t), t) }
mkdirSync('public/audio/lessons', { recursive: true })
writeFileSync('public/audio/lessons/texts.json', JSON.stringify([...seen].map(([h, t]) => ({ h, t }))))
console.log(`${seen.size} secciones exportadas`)
