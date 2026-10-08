import { useState } from 'react'
import type { Video } from '../data/videos'

const LANG: Record<string, string> = { es: '🇪🇸 Español', en: '🇬🇧 Inglés', pt: '🇧🇷 Portugués' }

/** Miniatura que solo carga el reproductor de YouTube al pulsar (rápido y sin cookies hasta entonces) */
function VideoCard({ v }: { v: Video }) {
  const [play, setPlay] = useState(false)
  return (
    <div className="card video">
      <div className="video-frame">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button className="video-thumb" onClick={() => setPlay(true)} aria-label={`Reproducir: ${v.title}`}>
            <img src={`https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="play">▶</span>
          </button>
        )}
      </div>
      <div className="video-meta">
        <b>{v.title}</b>
        <span className="small muted">{v.lang && LANG[v.lang]}{v.sim ? ' · simulador' : ''} · <a href={`https://www.youtube.com/watch?v=${v.yt}`} target="_blank" rel="noreferrer">YouTube ↗</a></span>
      </div>
    </div>
  )
}

export function VideoList({ videos, empty }: { videos: Video[]; empty?: string }) {
  if (!videos.length) return empty ? <p className="muted">{empty}</p> : null
  return (
    <div className="video-grid">
      {videos.map(v => <VideoCard key={v.yt} v={v} />)}
    </div>
  )
}
