import { useState } from 'react'
import type { Aircraft, Control } from './types'
import { controlsOf } from './layout'
import type { Rect, State } from './store'

export const SCHEMA = 'schema'

export interface ViewInfo { id: string; name: string; photo: boolean }

export function viewsOf(ac: Aircraft): ViewInfo[] {
  const v: ViewInfo[] = (ac.photos ?? []).map(p => ({ id: p.id, name: p.name, photo: true }))
  if (ac.panels.length || !v.length) v.push({ id: SCHEMA, name: 'Esquema', photo: false })
  return v
}

const cache = new Map<string, { sig: string; ac: Aircraft }>()

/** Zonas efectivas de una foto: las del avión + los ajustes del usuario (null = quitada) */
export function spotsFor(ac: Aircraft, viewId: string, s: State): Record<string, Rect> {
  const p = ac.photos?.find(x => x.id === viewId)
  if (!p) return {}
  const out: Record<string, Rect> = { ...p.spots }
  for (const [id, r] of Object.entries(s.spots[`${ac.id}/${viewId}`] ?? {})) {
    if (r) out[id] = r
    else delete out[id]
  }
  return out
}

/**
 * Devuelve un "avión" equivalente para la vista elegida: en vistas de foto, la imagen de fondo
 * y los mandos colocados como hotspots (mismos ids, etiquetas y descripciones que el esquema).
 */
export function viewAircraft(ac: Aircraft, viewId: string, s: State): Aircraft {
  const p = ac.photos?.find(x => x.id === viewId)
  if (!p) return ac
  const spots = spotsFor(ac, viewId, s)
  const sig = JSON.stringify(spots)
  const key = `${ac.id}/${viewId}`
  const hit = cache.get(key)
  if (hit && hit.sig === sig) return hit.ac
  const base = new Map(controlsOf(ac).map(c => [c.id, c]))
  const hotspots: Control[] = []
  for (const [id, [x, y, w, h]] of Object.entries(spots)) {
    const c = base.get(id)
    if (c) hotspots.push({ ...c, x, y, w, h, cx: x + w / 2, cy: y + h / 2 })
  }
  // las zonas grandes primero, para que las pequeñas queden encima y se puedan pulsar
  hotspots.sort((a, b) => b.w * b.h - a.w * a.h)
  const v: Aircraft = { ...ac, viewBox: [p.w, p.h], image: p.src, hotspots, panels: [] }
  cache.set(key, { sig, ac: v })
  return v
}

/** Mejor vista para un mando: la foto actual si sale en ella, si no la primera foto donde sale, si no el esquema */
export function bestView(ac: Aircraft, controlId: string, s: State, current: string): string {
  const views = viewsOf(ac)
  const inPhoto = (id: string) => controlId in spotsFor(ac, id, s)
  const cur = views.find(v => v.id === current)
  if (cur?.photo && inPhoto(cur.id)) return cur.id
  return views.find(v => v.photo && inPhoto(v.id))?.id ?? (views.some(v => v.id === SCHEMA) ? SCHEMA : current)
}

/** Primera vista (preferentemente la actual) en la que aparece un mando */
export function viewWith(ac: Aircraft, controlId: string, s: State, prefer?: string): string | undefined {
  const views = viewsOf(ac)
  const has = (v: ViewInfo) => !v.photo || controlId in spotsFor(ac, v.id, s)
  const cur = views.find(v => v.id === prefer)
  if (cur && has(cur)) return cur.id
  return views.find(has)?.id
}

export function useView(ac: Aircraft) {
  const views = viewsOf(ac)
  const key = 'cf.view.' + ac.id
  const [v, setV] = useState<string>(() => {
    try { return localStorage.getItem(key) ?? views[0].id } catch { return views[0].id }
  })
  const view = views.some(x => x.id === v) ? v : views[0].id
  const set = (id: string) => {
    setV(id)
    try { localStorage.setItem(key, id) } catch { /* sin almacenamiento */ }
  }
  return [view, set, views] as const
}
