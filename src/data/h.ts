import type { ControlDef, Kind } from '../types'

let n = 0
const mk = (kind: Kind) => (id: string, label: string, desc = '', o: Partial<ControlDef> = {}): ControlDef => ({ id, label, kind, desc, ...o })

export const G = mk('gauge')
export const D = mk('display')
export const T = mk('toggle')
export const R = mk('rocker')
export const P = mk('push')
export const Rot = mk('rotary')
export const K = mk('knob')
export const L = mk('lever')
export const H = mk('handle')
export const Gd = mk('guarded')
export const Key = mk('key')
export const W = mk('wheel')
export const CB = mk('breaker')
export const A = mk('annun')
export const _ = (span = 1): ControlDef => ({ id: `_b${n++}`, label: '', kind: 'blank', span })

export const DISCLAIMER =
  'Contenido didáctico redactado a partir de procedimientos estándar conocidos del tipo. No sustituye al POH/AFM/FCOM ni a los SOP de tu escuela u operador: verifica cada paso con tu documentación y edítalo si difiere.'
