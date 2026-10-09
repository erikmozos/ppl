// Carga bajo demanda del temario (un JSON por bloque) y de las figuras SVG.
import { useEffect, useState } from 'react'
import type { BankQuestion, LessonFile } from '../data/licenses/types'

const lessonFiles = import.meta.glob<LessonFile>('../content/ppl/*/*.json', { import: 'default' })
const figureFiles = import.meta.glob<string>('../content/ppl/figures/*.svg', { query: '?raw', import: 'default' })

const idOf = (path: string) => path.split('/').pop()!.replace(/\.(json|svg)$/, '')
const lessonPath = new Map(Object.keys(lessonFiles).map(p => [idOf(p), p]))
const figurePath = new Map(Object.keys(figureFiles).map(p => [idOf(p), p]))

/** ids de las lecciones disponibles (se conocen sin descargar nada) */
export const LESSON_IDS = [...lessonPath.keys()].sort()
export const hasLesson = (id: string) => lessonPath.has(id)
export const lessonsOf = (code: string) => LESSON_IDS.filter(id => id.startsWith(code + '.'))

const cache = new Map<string, Promise<LessonFile>>()
export function loadLesson(id: string): Promise<LessonFile> {
  const p = lessonPath.get(id)
  if (!p) return Promise.reject(new Error('Lección no disponible: ' + id))
  if (!cache.has(id)) cache.set(id, lessonFiles[p]())
  return cache.get(id)!
}
export const loadSubject = (code: string) => Promise.all(lessonsOf(code).map(loadLesson))
export const loadAll = () => Promise.all(LESSON_IDS.map(loadLesson))

const figCache = new Map<string, Promise<string | null>>()
export function loadFigure(name: string): Promise<string | null> {
  const p = figurePath.get(name)
  if (!p) return Promise.resolve(null)
  if (!figCache.has(name)) figCache.set(name, figureFiles[p]())
  return figCache.get(name)!
}

/** Lecciones de una materia (código) o de todas ('all'); null mientras cargan */
export function useLessons(code: string | 'all'): LessonFile[] | null {
  const [files, setFiles] = useState<LessonFile[] | null>(null)
  useEffect(() => {
    let alive = true
    setFiles(null)
    ;(code === 'all' ? loadAll() : loadSubject(code)).then(f => alive && setFiles(f)).catch(() => alive && setFiles([]))
    return () => { alive = false }
  }, [code])
  return files
}

export function useLesson(id: string): LessonFile | null | undefined {
  const [file, setFile] = useState<LessonFile | null | undefined>(undefined)
  useEffect(() => {
    let alive = true
    setFile(undefined)
    loadLesson(id).then(f => alive && setFile(f)).catch(() => alive && setFile(null))
    return () => { alive = false }
  }, [id])
  return file
}

export const questionsOf = (files: LessonFile[]): BankQuestion[] => files.flatMap(f => f.questions)
