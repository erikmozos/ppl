// Iconos de trazo fino (sustituyen a los emojis de la interfaz)
const P: Record<string, string> = {
  speaker: 'M4 9h3l4-4v14l-4-4H4zM15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11',
  stop: 'M7 7h10v10H7z',
  play: 'M8 5l11 7-11 7z',
  pause: 'M8 5v14M16 5v14',
  check: 'M5 12l5 5 9-10',
  x: 'M6 6l12 12M18 6L6 18',
  flag: 'M6 21V4M6 4h11l-2 4 2 4H6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  ext: 'M14 5h5v5M19 5l-8 8M18 14v5H5V6h5',
  calc: 'M7 3h10v18H7zM9 6h6v3H9zM9 12h1M12 12h1M15 12h0M9 15h1M12 15h1M9 18h1M12 18h1M15 15v3',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
}
export function Icon({ name, size = 16, title }: { name: keyof typeof P | string; size?: number; title?: string }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <path d={P[name] ?? ''} />
    </svg>
  )
}
