// Narración con las voces neuronales del sistema (Web Speech API). Sin claves ni coste.
// En macOS/iOS las voces "Premium/Mejorada" (Mónica, Jorge, Paulina…) suenan muy naturales:
// se descargan en Ajustes › Accesibilidad › Contenido leído › Voces.
import { useSyncExternalStore } from 'react'
import type { Aircraft, Flow, Step } from './types'
import { controlById } from './layout'
import { CONTEXT } from './data/context'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

export type Engine = 'neural' | 'system'
interface Prefs { voice: string; rate: number; enabled: boolean; engine: Engine }
const DEFAULTS: Prefs = { voice: '', rate: 1, enabled: true, engine: 'neural' }
function loadPrefs(): Prefs {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('cf.voice') ?? '{}') } } catch { return DEFAULTS }
}
let prefs = loadPrefs()
let voices: SpeechSynthesisVoice[] = []
/** audios neuronales pregenerados (npm run audio): hashes disponibles en /audio */
let neural = new Set<string>()
let neuralVoice = ''
const subs = new Set<() => void>()
let snap = { prefs, voices, speaking: false, supported, neuralCount: 0, neuralVoice }
const emit = () => {
  snap = { prefs, voices, speaking: !!audio && !audio.paused || (supported && speechSynthesis.speaking), supported, neuralCount: neural.size, neuralVoice }
  subs.forEach(f => f())
}

/** FNV-1a de 32 bits: identifica el audio de cada texto (mismo algoritmo que scripts/narrations.ts) */
export function textHash(t: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
  fetch('/audio/manifest.json').then(r => (r.ok ? r.json() : null)).then((m: { voice: string; files: string[] } | null) => {
    if (m) { neural = new Set(m.files); neuralVoice = m.voice; emit() }
  }).catch(() => {})
}
let audio: HTMLAudioElement | null = null

function refreshVoices() {
  if (!supported) return
  voices = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('es'))
  emit()
}
if (supported) {
  refreshVoices()
  speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
}

/** Puntuación heurística: voces neuronales / mejoradas y de España primero */
function score(v: SpeechSynthesisVoice) {
  let s = 0
  if (/premium|enhanced|mejorad|neural|natural|siri/i.test(v.name)) s += 10
  if (/google|microsoft/i.test(v.name)) s += 5
  if (v.lang === 'es-ES') s += 3
  if (v.localService) s += 1
  return s
}
export function bestVoice() {
  return voices.find(v => v.name === prefs.voice) ?? [...voices].sort((a, b) => score(b) - score(a))[0]
}

export function setPrefs(p: Partial<Prefs>) {
  prefs = { ...prefs, ...p }
  try { localStorage.setItem('cf.voice', JSON.stringify(prefs)) } catch { /* sin almacenamiento */ }
  emit()
}

export function useSpeech() {
  return useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => snap)
}

let token = 0
/** Habla un texto; la promesa se resuelve al terminar (o al cancelarse) */
export function speak(text: string): Promise<void> {
  if (!prefs.enabled || !text) return Promise.resolve()
  const my = ++token
  if (supported) speechSynthesis.cancel()
  audio?.pause()
  const h = textHash(text)
  if (prefs.engine === 'neural' && neural.has(h)) {
    return new Promise(resolve => {
      const a = new Audio(`/audio/${h}.m4a`)
      audio = a
      a.playbackRate = prefs.rate
      const done = () => { if (my === token) emit(); resolve() }
      a.onended = done
      a.onerror = done
      a.play().then(emit).catch(done)
    })
  }
  if (!supported) return Promise.resolve()
  return new Promise(resolve => {
    const u = new SpeechSynthesisUtterance(text)
    const v = bestVoice()
    if (v) { u.voice = v; u.lang = v.lang } else u.lang = 'es-ES'
    u.rate = prefs.rate
    const done = () => { if (my === token) emit(); resolve() }
    u.onend = done
    u.onerror = done
    speechSynthesis.speak(u)
    emit()
    // Safari a veces no dispara onend: red de seguridad según la longitud del texto
    setTimeout(done, 3000 + (text.length * 130) / prefs.rate)
  })
}
export function stopSpeech() {
  token++
  audio?.pause()
  if (supported) speechSynthesis.cancel()
  emit()
}

/* ─────────── textos de narración ─────────── */

const firstSentence = (s?: string) => (s ?? '').split(/(?<=\.)\s/)[0] ?? ''
/** "MASTER — ON (BAT)" → "MASTER: ON, BAT" y siglas comunes legibles */
function readable(t: string) {
  return t
    .replace(/\s—\s/g, ': ')
    .replace(/[()]/g, ', ')
    .replace(/\bON\b/g, 'on').replace(/\bOFF\b/g, 'off')
    .replace(/\bRPM\b/g, 'erre pe eme')
    .replace(/\bPOH\b/g, 'manual del avión')
    .replace(/\bFCOM\b/g, 'efe com')
    .replace(/(\d)\/(\d)"/g, '$1 de $2 de pulgada')
    .replace(/°/g, ' grados')
    .replace(/\s+,/g, ',')
}

export function stepNarration(ac: Aircraft, st: Step, i: number, total: number, detailed: boolean) {
  const c = controlById(ac, st.c)
  const role = st.r && ac.roles.length > 1 ? `${ac.roles.find(r => r.id === st.r)?.name.split('·')[0].trim() ?? st.r}. ` : ''
  const parts = [`Paso ${i + 1}${total ? ` de ${total}` : ''}. ${role}${readable(st.a)}.`]
  if (detailed) {
    if (st.w) parts.push(st.w)
    else if (c?.desc) parts.push(firstSentence(c.desc))
    if (st.n) parts.push(readable(st.n))
  }
  return parts.join(' ')
}

/** «Más contexto» del mando de un paso (explicación ampliada) */
export function contextFor(ac: Aircraft, controlId: string): string | undefined {
  return CONTEXT[ac.id]?.[controlId]
}

export const END_TEXT = 'Fin del flow. Ahora intenta repetirlo de memoria en el modo repaso.'
export const TEST_TEXT = 'Beacon: encender. La luz anticolisión avisa al personal de tierra de que vamos a arrancar el motor.'

export function flowIntro(ac: Aircraft, f: Flow) {
  return `${f.name}. ${ac.name}. ${f.desc ?? ''} Son ${f.steps.length} pasos. Sigue la línea sobre la cabina.`
}
