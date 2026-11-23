import type { LessonVideoRef } from '../data/licenses/types'

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

/** Vídeo explicativo animado de una sección del temario, con subtítulos y carga diferida */
export function LessonVideo({ v }: { v: LessonVideoRef }) {
  return (
    <figure className="lesson-video">
      <video src={v.src} poster={v.poster} controls playsInline preload="none" aria-label={`Vídeo: ${v.title}`}>
        {v.vtt && <track kind="subtitles" src={v.vtt} srcLang="es" label="Español" />}
      </video>
      <figcaption><span className="lesson-video-k">Vídeo</span> {v.title}{v.duration ? <span className="muted"> · {mmss(v.duration)}</span> : null}</figcaption>
    </figure>
  )
}
