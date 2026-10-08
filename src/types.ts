export type Kind =
  | 'gauge' | 'display' | 'toggle' | 'rocker' | 'push' | 'rotary' | 'knob'
  | 'lever' | 'handle' | 'guarded' | 'key' | 'wheel' | 'breaker' | 'annun' | 'blank'

export interface ControlDef {
  id: string
  label: string
  kind: Kind
  desc?: string
  /** ancho relativo dentro de la fila */
  span?: number
  /** alto relativo de la fila (se usa el máximo de la fila) */
  size?: number
  color?: string
}

export interface PanelDef {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  desc?: string
  rows: ControlDef[][]
}

/** Control ya posicionado en coordenadas del viewBox */
export interface Control extends ControlDef {
  panel: string
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
}

export interface Role { id: string; name: string; color: string }

/** c = id de control, a = acción, r = rol, n = nota (FCOM/POH), w = por qué (explicación narrada) */
export interface Step { c: string; a: string; r?: string; n?: string; w?: string }

export interface Flow {
  id: string
  name: string
  phase: string
  desc?: string
  steps: Step[]
  custom?: boolean
}

export interface Guide {
  intro: string
  specs: [string, string][]
  sections: { title: string; body: string }[]
}

export interface Theme {
  /** color de las placas de panel */
  panel: string
  /** rótulos serigrafiados */
  label: string
  /** fondo (estructura de la cabina) */
  bg: string
  /** paneles de avioneta: una única chapa continua con visera */
  sheet?: boolean
  /** entorno de cabina dibujado alrededor de los paneles */
  env?: 'ga' | 'airliner'
  envTop?: number
  envGap?: number
}

/** Foto real de la cabina con las zonas de cada mando ([x, y, ancho, alto] en píxeles de la imagen) */
export interface PhotoView {
  id: string
  name: string
  src: string
  w: number
  h: number
  credit: string
  license: string
  page: string
  spots: Record<string, [number, number, number, number]>
}

export interface Aircraft {
  id: string
  name: string
  short: string
  category: string
  tagline: string
  roles: Role[]
  viewBox: [number, number]
  panels: PanelDef[]
  flows: Flow[]
  guide: Guide
  refs: { title: string; url: string }[]
  theme?: Theme
  photos?: PhotoView[]
  /** cabinas propias: imagen de fondo + hotspots */
  image?: string
  hotspots?: Control[]
  custom?: boolean
}

export interface Pt { x: number; y: number }
