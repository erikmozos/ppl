// Valida el contenido del temario (src/content/ppl/<código>/<bloque>.json y las figuras SVG).
// Uso: npx tsx scripts/validate-content.ts [010 | 010.07 ...]   (sin argumentos, todo)
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { PPL_SYLLABUS } from '../src/data/licenses/ppl-syllabus'
import { WIDGETS } from '../src/data/licenses/widgets-list'
import type { Block, LessonFile } from '../src/data/licenses/types'

const ROOT = join(import.meta.dirname, '..', 'src', 'content', 'ppl')
const FIG = join(ROOT, 'figures')
const filters = process.argv.slice(2)
const want = (id: string) => !filters.length || filters.some(f => id.startsWith(f))

let errors = 0, warnings = 0
const err = (where: string, msg: string) => { errors++; console.log(`  ✗ ${where}: ${msg}`) }
const warn = (where: string, msg: string) => { warnings++; console.log(`  ! ${where}: ${msg}`) }
const qids = new Set<string>(), cids = new Set<string>()
const TYPES = ['concepto', 'regla', 'calculo', 'lectura']
const BANNED = /(todas las anteriores|ninguna de las anteriores|todas son correctas|a y b son)/i
const DATE = /^\d{4}-\d{2}-\d{2}$/
const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const balanced = (s: string) => (s.match(/\*\*/g) ?? []).length % 2 === 0

function checkFigure(where: string, f: string | undefined) {
  if (!f) return
  if (f.startsWith('svg:')) {
    if (!existsSync(join(FIG, f.slice(4) + '.svg'))) err(where, `figura inexistente ${f} (falta src/content/ppl/figures/${f.slice(4)}.svg)`)
  } else if (!WIDGETS[f]) err(where, `widget desconocido ${f} (válidos: ${Object.keys(WIDGETS).join(', ')})`)
}
function checkText(where: string, s: unknown, min = 1) {
  if (typeof s !== 'string' || s.trim().length < min) { err(where, `texto vacío o demasiado corto`); return }
  if (!balanced(s)) err(where, `negritas ** desparejadas`)
}
function blockWords(b: Block) {
  return [...(b.text ?? []), ...(b.bullets ?? []), ...(b.examples ?? []).flatMap(e => [e.q, e.a]), ...(b.table?.rows.flat() ?? []), ...(b.formulas ?? []).map(f => f.f + ' ' + (f.note ?? ''))].reduce((a, s) => a + words(s), 0)
}

const report: string[][] = []
for (const sub of PPL_SYLLABUS) {
  if (!want(sub.code) && !sub.blocks.some(b => want(b.id))) continue
  const dir = join(ROOT, sub.code)
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')) : []
  for (const f of files) if (!sub.blocks.some(b => b.id + '.json' === f)) err(`${sub.code}/${f}`, 'nombre de fichero que no corresponde a ningún bloque del temario')
  let sq = 0, st = 0, sc = 0, sw = 0
  for (const blk of sub.blocks) {
    if (!want(blk.id)) continue
    st += blk.target
    const path = join(dir, blk.id + '.json')
    if (!existsSync(path)) { report.push([blk.id, blk.title, '—', String(blk.target), '—', '—', '—']); continue }
    console.log(`${blk.id} ${blk.title}`)
    let data: LessonFile
    try { data = JSON.parse(readFileSync(path, 'utf8')) } catch (e) { err(blk.id, `JSON inválido: ${(e as Error).message}`); continue }
    const L = data.lesson
    if (!L) { err(blk.id, 'falta "lesson"'); continue }
    if (L.id !== blk.id) err(blk.id, `lesson.id "${L.id}" no coincide con el fichero`)
    checkText(`${blk.id} title`, L.title); checkText(`${blk.id} summary`, L.summary, 20)
    if (!Array.isArray(L.objectives) || L.objectives.length < 3) err(blk.id, 'objectives: al menos 3')
    if (!Array.isArray(L.sections) || L.sections.length < 3) err(blk.id, 'sections: al menos 3')
    if (!Array.isArray(L.numbers) || L.numbers.length < 3) err(blk.id, 'numbers: al menos 3')
    if (!Array.isArray(L.traps) || L.traps.length < 2) err(blk.id, 'traps: al menos 2')
    if (!Array.isArray(L.sources) || !L.sources.length || L.sources.some(s => !s.title)) err(blk.id, 'sources: al menos 1, todas con title')
    if (!DATE.test(L.reviewed ?? '')) err(blk.id, 'reviewed: AAAA-MM-DD')
    let lw = 0, figs = 0
    ;(L.sections ?? []).forEach((b, i) => {
      const w = `${blk.id} sección ${i + 1} «${b.title}»`
      if (!b.title) err(w, 'sin título')
      if (!b.text?.length && !b.bullets?.length && !b.table && !b.formulas?.length && !b.examples?.length && !b.figure) err(w, 'sección vacía')
      b.text?.forEach(t => checkText(w, t)); b.bullets?.forEach(t => checkText(w, t))
      if (b.table) {
        if (!b.table.head?.length || !b.table.rows?.length) err(w, 'tabla sin cabecera o sin filas')
        b.table.rows?.forEach((r, k) => { if (r.length !== b.table!.head.length) err(w, `fila ${k + 1} de la tabla con ${r.length} celdas y ${b.table!.head.length} columnas`) })
      }
      b.examples?.forEach(e => { if (!e.q || !e.a) err(w, 'ejemplo sin q o sin a') })
      if (b.note && (!['es', 'warn', 'tip'].includes(b.note.kind) || !b.note.text)) err(w, 'note: kind es|warn|tip y text')
      checkFigure(w, b.figure); if (b.figure) figs++
      lw += blockWords(b) + (b.note ? words(b.note.text) : 0)
    })
    const qs = data.questions ?? []
    const pos = [0, 0, 0, 0]
    qs.forEach((q, i) => {
      const w = `${blk.id} pregunta ${q.id ?? i + 1}`
      if (!new RegExp(`^${blk.id.replace('.', '\\.')}\\.\\d{3}$`).test(q.id ?? '')) err(w, `id debe ser ${blk.id}.NNN`)
      if (qids.has(q.id)) err(w, 'id repetido'); qids.add(q.id)
      if (!TYPES.includes(q.type)) err(w, `type: ${TYPES.join('|')}`)
      if (![1, 2, 3].includes(q.level)) err(w, 'level: 1, 2 o 3')
      checkText(w + ' q', q.q, 10)
      if (!Array.isArray(q.options) || q.options.length !== 4) err(w, 'options: exactamente 4')
      else {
        q.options.forEach(o => checkText(w + ' opción', o))
        if (new Set(q.options.map(o => String(o).trim().toLowerCase())).size !== 4) err(w, 'opciones repetidas')
        if (q.options.some(o => BANNED.test(o))) err(w, 'opción tipo «todas/ninguna de las anteriores»')
      }
      if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) err(w, 'correct: 0..3')
      else pos[q.correct]++
      checkText(w + ' why', q.why, 20)
      if (!Array.isArray(q.whyNot) || q.whyNot.length !== 4) err(w, 'whyNot: 4 elementos')
      else q.whyNot.forEach((x, k) => {
        if (k === q.correct) { if (x !== null) err(w, 'whyNot de la correcta debe ser null') }
        else if (typeof x !== 'string' || x.trim().length < 5) err(w, `whyNot[${k}] vacío`)
      })
      checkText(w + ' ref', q.ref, 3)
      checkFigure(w, q.figure)
    })
    if (qs.length >= 8 && Math.max(...pos) / qs.length > 0.4) warn(blk.id, `correctas mal repartidas por posición ${JSON.stringify(pos)}`)
    if (qs.length < blk.target) warn(blk.id, `${qs.length} preguntas de ${blk.target} objetivo`)
    const cs = data.cards ?? []
    cs.forEach((c, i) => {
      const w = `${blk.id} ficha ${c.id ?? i + 1}`
      if (!new RegExp(`^c\\.${blk.id.replace('.', '\\.')}\\.\\d{2,3}$`).test(c.id ?? '')) err(w, `id debe ser c.${blk.id}.NN`)
      if (cids.has(c.id)) err(w, 'id repetido'); cids.add(c.id)
      checkText(w + ' front', c.front, 3); checkText(w + ' back', c.back, 1); checkFigure(w, c.figure)
    })
    if (lw < 500) warn(blk.id, `lección corta (${lw} palabras)`)
    sq += qs.length; sc += cs.length; sw += lw
    report.push([blk.id, blk.title, String(qs.length), String(blk.target), String(cs.length), String(lw), String(figs)])
  }
  report.push([sub.code, `TOTAL ${sub.name}`, String(sq), String(st), String(sc), String(sw), ''])
}

// figuras
if (existsSync(FIG)) for (const f of readdirSync(FIG).filter(f => f.endsWith('.svg'))) {
  if (filters.length && !filters.some(x => f.startsWith(x.slice(0, 3)))) continue
  const s = readFileSync(join(FIG, f), 'utf8')
  const w = `figura ${f}`
  if (!/^\s*<svg[\s>]/.test(s)) err(w, 'debe empezar por <svg')
  if (!/viewBox=/.test(s)) err(w, 'falta viewBox')
  if (!/<title>[^<]+<\/title>/.test(s)) err(w, 'falta <title> descriptivo')
  if (/<script|on\w+=|href="http|xlink:href="http|<image/i.test(s)) err(w, 'no se permiten scripts, eventos, imágenes ni enlaces externos')
  if (/<style/i.test(s)) err(w, 'no uses <style>: usa las clases del README')
  if (/(fill|stroke)="#[0-9a-f]{3,8}"/i.test(s) || /(fill|stroke):\s*#/i.test(s)) warn(w, 'colores fijos: usa las clases (ln, ac, wa, sky…) para que funcione en tema claro y oscuro')
  if (/\swidth="\d/.test(s.slice(0, 200))) warn(w, 'quita width/height del <svg> (solo viewBox)')
}

console.log('\nBloque    Lección                                         Preg/Obj  Fichas  Palabras  Figuras')
for (const r of report) console.log(`${r[0].padEnd(9)} ${r[1].slice(0, 46).padEnd(47)} ${(r[2] + '/' + r[3]).padStart(8)}  ${r[4].padStart(6)}  ${r[5].padStart(8)}  ${r[6].padStart(7)}`)
console.log(`\n${errors} errores · ${warnings} avisos`)
process.exit(errors ? 1 : 0)
