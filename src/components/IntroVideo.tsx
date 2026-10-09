import { useEffect, useRef } from 'react'
import { Icon } from './Icon'

/** Vídeo de presentación de la app: se abre solo la primera vez y se puede volver a ver cuando quieras */
export const openIntro = () => window.dispatchEvent(new Event('cf:intro'))
const key = (uid: string) => `cf.introSeen.${uid}`
export function introSeen(uid: string) { try { return localStorage.getItem(key(uid)) === '1' } catch { return true } }
export function markIntroSeen(uid: string) { try { localStorage.setItem(key(uid), '1') } catch { /* sin almacenamiento */ } }

export function IntroVideo({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    ref.current?.play().catch(() => { /* el navegador exige un toque para reproducir con sonido */ })
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="tour-backdrop video-modal" role="dialog" aria-modal="true" aria-label="Vídeo: cómo funciona Cockpit Flows" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="video-box">
        <div className="video-box-top">
          <b>Cómo funciona Cockpit Flows</b>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar el vídeo"><Icon name="x" /></button>
        </div>
        <video ref={ref} src="/video/guia.mp4" poster="/video/guia-poster.jpg" controls playsInline preload="metadata">
          <track kind="subtitles" src="/video/guia.vtt" srcLang="es" label="Español" />
        </video>
        <div className="video-box-foot">
          <span className="muted small">Puedes volver a verlo desde el menú o desde la Guía.</span>
          <button className="btn primary sm" onClick={onClose}>Empezar a estudiar</button>
        </div>
      </div>
    </div>
  )
}
