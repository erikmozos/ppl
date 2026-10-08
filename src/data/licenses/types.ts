// Tipos de la sección de licencias (recorrido modular EASA Part-FCL en España)

export interface Table { caption?: string; head: string[]; rows: string[][]; src?: string }

/** Bloque de contenido de estudio: texto, viñetas, tabla, fórmulas o ejemplos resueltos */
export interface Block {
  title: string
  text?: string[]
  bullets?: string[]
  table?: Table
  formulas?: { f: string; note?: string }[]
  examples?: { q: string; a: string }[]
  /** contiene cifras de manual que conviene contrastar con el banco de AESA */
  verify?: boolean
}

export interface Question { q: string; options: string[]; correct: number; why: string }

export interface Ref { title: string; url?: string; note?: string }

export interface Subject {
  id: string
  code: string
  name: string
  icon: string
  exam: { questions: number; time: string; pass: number }
  summary: string
  syllabus: string[]
  blocks: Block[]
  traps: string[]
  mnemonics?: string[]
  books: { es: Ref[]; en: Ref[]; free: Ref[] }
  quiz: Question[]
  /** enlaces a otras partes de la app (p. ej. cabinas) */
  links?: { label: string; href: string }[]
}

export type Status = 'completo' | 'en-progreso'

export interface Module {
  id: string
  name: string
  short: string
  icon: string
  status: Status
  stage: string
  summary: string
  facts: [string, string][]
  sections: Block[]
  sources: Ref[]
  subjects?: Subject[]
  /** recursos externos destacados (p. ej. tu curso de simulación) */
  featured?: { title: string; url: string; text: string }[]
}
