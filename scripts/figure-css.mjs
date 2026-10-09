// Vocabulario de clases de las figuras SVG del temario. Lo usan la web (con variables de tema) y la vista previa.
export const FIG_CLASSES = {
  ln: 'fill:none;stroke:var(--f-ink);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round',
  ln2: 'fill:none;stroke:var(--f-ink2);stroke-width:1;stroke-linecap:round;stroke-linejoin:round',
  dash: 'stroke-dasharray:5 4',
  thick: 'stroke-width:2.6',
  ac: 'fill:var(--f-acs);stroke:var(--f-ac);stroke-width:1.2',
  'ac-ln': 'fill:none;stroke:var(--f-ac);stroke-width:2;stroke-linecap:round;stroke-linejoin:round',
  'ac-fill': 'fill:var(--f-ac);stroke:none',
  wa: 'fill:var(--f-was);stroke:var(--f-wa);stroke-width:1.2',
  'wa-ln': 'fill:none;stroke:var(--f-wa);stroke-width:2;stroke-linecap:round;stroke-linejoin:round',
  'wa-fill': 'fill:var(--f-wa);stroke:none',
  ok: 'fill:var(--f-oks);stroke:var(--f-ok);stroke-width:1.2',
  'ok-ln': 'fill:none;stroke:var(--f-ok);stroke-width:2;stroke-linecap:round;stroke-linejoin:round',
  'ok-fill': 'fill:var(--f-ok);stroke:none',
  sky: 'fill:var(--f-sky);stroke:none',
  ground: 'fill:var(--f-ground);stroke:none',
  soft: 'fill:var(--f-soft);stroke:var(--f-ink2);stroke-width:0.8',
  'ink-fill': 'fill:var(--f-ink);stroke:none',
  'bg-fill': 'fill:var(--f-bg);stroke:none',
  tx: 'fill:var(--f-ink);font-size:13px',
  tx2: 'fill:var(--f-ink2);font-size:12px',
  txa: 'fill:var(--f-ac);font-size:13px',
  txw: 'fill:var(--f-wa);font-size:13px',
  txo: 'fill:var(--f-ok);font-size:13px',
  b: 'font-weight:600',
  mono: 'font-family:ui-monospace,Menlo,monospace',
}
export const FIG_LIGHT = {
  '--f-ink': '#1d2125', '--f-ink2': '#6b7178', '--f-ac': '#2a5bd7', '--f-acs': '#dfe7fb',
  '--f-wa': '#c4441a', '--f-was': '#fbe2d6', '--f-ok': '#1f7a45', '--f-oks': '#d9efe1',
  '--f-sky': '#e6f0fa', '--f-ground': '#eee6d8', '--f-soft': '#f2f2f0', '--f-bg': '#ffffff',
}
export const FIG_DARK = {
  '--f-ink': '#e6e6e3', '--f-ink2': '#9a9fa6', '--f-ac': '#7ea2ff', '--f-acs': '#1d2a47',
  '--f-wa': '#ff8a5c', '--f-was': '#3d2219', '--f-ok': '#5fcf8f', '--f-oks': '#17311f',
  '--f-sky': '#16222f', '--f-ground': '#2a251d', '--f-soft': '#202224', '--f-bg': '#161718',
}
export const figCss = (scope) => Object.entries(FIG_CLASSES).map(([k, v]) => `${scope} .${k}{${v}}`).join('\n')
