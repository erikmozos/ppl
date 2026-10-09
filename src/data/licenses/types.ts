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
  /** figura: 'svg:<nombre>' (src/content/ppl/figures/<nombre>.svg) o 'calc:<widget>' (calculadora interactiva) */
  figure?: string
  caption?: string
  /** nota destacada: diferencia española, aviso o consejo */
  note?: { kind: 'es' | 'warn' | 'tip'; text: string }
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

/** Un mensaje de radio en español OACI y en inglés OACI */
export interface RadioLine {
  who: 'P' | 'ATC'
  es: string
  en: string
  /** por qué se dice así / qué hay que colacionar */
  note?: string
  /** en modo práctica, opciones incorrectas para que el alumno elija la buena (solo líneas del piloto) */
  wrong?: { es: string; en: string; why: string }[]
}

export interface RadioScenario { id: string; title: string; icon: string; desc: string; lines: RadioLine[] }

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
  /** test del módulo (si no tiene asignaturas) */
  quiz?: Question[]
  /** simulador de radio (módulo de fraseología) */
  radio?: RadioScenario[]
  /** recursos externos destacados (p. ej. tu curso de simulación) */
  featured?: { title: string; url: string; text: string }[]
}

/* ───────────── Contenido del temario por lecciones (src/content/ppl) ───────────── */

/** Una lección = un bloque del temario oficial (p. ej. 010.07) */
export interface Lesson {
  id: string
  title: string
  /** una o dos frases para el índice */
  summary: string
  /** lo que debes saber hacer al terminar */
  objectives: string[]
  sections: Block[]
  /** cifras y reglas para memorizar */
  numbers: string[]
  traps: string[]
  /** diferencias o particularidades de España */
  spain?: string[]
  sources: Ref[]
  /** fecha de la última revisión (AAAA-MM-DD) */
  reviewed: string
  /** enlaces a las cabinas o a otros módulos de la app */
  links?: { label: string; href: string }[]
}

export type QType = 'concepto' | 'regla' | 'calculo' | 'lectura'

/** Pregunta del banco propio: 4 opciones, una correcta, explicación de todas */
export interface BankQuestion {
  id: string
  type: QType
  level: 1 | 2 | 3
  /** depende de una particularidad española */
  es?: boolean
  q: string
  /** texto monoespaciado que acompaña al enunciado (METAR, TAF, NOTAM, plan de vuelo…) */
  data?: string
  figure?: string
  options: string[]
  correct: number
  why: string
  /** por qué falla cada opción (null en la correcta) */
  whyNot: (string | null)[]
  /** norma o fuente de la que depende */
  ref: string
  url?: string
}

/** Ficha de repaso: una sola idea */
export interface Card { id: string; front: string; back: string; figure?: string }

export interface LessonFile { lesson: Lesson; questions: BankQuestion[]; cards: Card[] }
