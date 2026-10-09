// Vista previa de una figura SVG del temario en PNG (macOS, Quick Look), en tema claro y oscuro.
// Uso: node scripts/figure-preview.mjs src/content/ppl/figures/<nombre>.svg  → imprime las rutas de los PNG
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { figCss, FIG_LIGHT, FIG_DARK } from './figure-css.mjs'

const src = process.argv[2]
if (!src) { console.error('Uso: node scripts/figure-preview.mjs <figura.svg>'); process.exit(1) }
const svg = readFileSync(src, 'utf8')
const vb = svg.match(/viewBox="([\d.\s-]+)"/)?.[1].split(/\s+/).map(Number) ?? [0, 0, 640, 360]
const out = join(tmpdir(), 'fig-preview'); mkdirSync(out, { recursive: true })
const paths = []
for (const [name, vars] of [['claro', FIG_LIGHT], ['oscuro', FIG_DARK]]) {
  const root = `svg{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')};font-family:-apple-system,Helvetica,Arial,sans-serif}`
  const w = 500, h = Math.round((500 * vb[3]) / vb[2])
  const doc = svg
    .replace(/<svg([^>]*)>/, (m, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')} width="${w}" height="${h}"><style>${root}\n${figCss('svg')}</style><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${vars['--f-bg']}"/>`)
  const f = join(out, `${basename(src, '.svg')}-${name}.svg`)
  writeFileSync(f, doc)
  execFileSync('qlmanage', ['-t', '-s', '1000', '-o', out, f], { stdio: 'ignore' })
  paths.push(f + '.png')
}
console.log(paths.join('\n'))
