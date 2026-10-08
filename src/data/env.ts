import type { Aircraft } from '../types'

/**
 * Coloca los paneles dentro de una "cabina": deja hueco para el parabrisas.
 * - Avioneta: todo baja `top` px y arriba se ve el parabrisas.
 * - Avión de línea: el overhead se queda arriba y el resto baja `gap` px; entre medias, el parabrisas.
 */
export function ga(ac: Aircraft, top = 250): Aircraft {
  return {
    ...ac,
    viewBox: [ac.viewBox[0], ac.viewBox[1] + top],
    panels: ac.panels.map(p => ({ ...p, y: p.y + top })),
    theme: { ...ac.theme!, env: 'ga', envTop: top },
  }
}

export function airliner(ac: Aircraft, split: number, gap = 230): Aircraft {
  return {
    ...ac,
    viewBox: [ac.viewBox[0], ac.viewBox[1] + gap],
    panels: ac.panels.map(p => (p.y >= split ? { ...p, y: p.y + gap } : p)),
    theme: { ...ac.theme!, env: 'airliner', envTop: split, envGap: gap },
  }
}
