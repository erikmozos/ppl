import { useState } from 'react'
import type { Aircraft, Role } from '../types'
import { actions, uid } from '../store'
import { go } from '../router'

const ROLESETS: Record<string, Role[]> = {
  single: [{ id: 'P', name: 'Piloto', color: '#38bdf8' }],
  pfpm: [{ id: 'PF', name: 'Pilot Flying', color: '#38bdf8' }, { id: 'PM', name: 'Pilot Monitoring', color: '#f59e0b' }],
  cm: [{ id: 'CM1', name: 'CM1', color: '#38bdf8' }, { id: 'CM2', name: 'CM2', color: '#f472b6' }],
  cptfo: [{ id: 'CPT', name: 'Capitán', color: '#38bdf8' }, { id: 'FO', name: 'Primer Oficial', color: '#f59e0b' }],
}

/** Reduce la imagen a 2000 px de ancho como máximo para no llenar el almacenamiento */
async function loadImage(file: File): Promise<{ url: string; w: number; h: number }> {
  const src = URL.createObjectURL(file)
  const img = new Image()
  img.src = src
  await img.decode()
  const scale = Math.min(1, 2000 / img.naturalWidth)
  const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale)
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  c.getContext('2d')!.drawImage(img, 0, 0, w, h)
  URL.revokeObjectURL(src)
  return { url: c.toDataURL('image/jpeg', 0.85), w, h }
}

export function NewAircraft() {
  const [name, setName] = useState('')
  const [roles, setRoles] = useState('single')
  const [img, setImg] = useState<{ url: string; w: number; h: number } | null>(null)
  const [busy, setBusy] = useState(false)

  function create() {
    if (!img || !name.trim()) return
    const ac: Aircraft = {
      id: 'c-' + uid(), name: name.trim(), short: name.trim().slice(0, 10), category: 'Cabina propia', tagline: 'Cabina subida por ti.',
      roles: ROLESETS[roles], viewBox: [img.w, img.h], panels: [], flows: [], hotspots: [], image: img.url, custom: true,
      guide: { intro: 'Cabina personalizada. Marca los mandos y crea tus flows.', specs: [], sections: [] }, refs: [],
    }
    actions.saveAircraft(ac)
    go(`#/ac/${ac.id}/edit?tab=hotspots`)
  }

  return (
    <div className="wrap narrow">
      <a className="back" href="#/cockpits">← Cockpits</a>
      <h1>Subir mi cabina</h1>
      <p className="muted">Usa una foto o un póster de la cabina de tu avión (JPG/PNG). Si tienes un PDF, expórtalo antes a imagen. Todo se guarda solo en este navegador.</p>
      <div className="card form">
        <label className="field">Nombre del avión<input placeholder="p. ej. Tecnam P2008 EC-XXX" value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="field">Tripulación
          <select value={roles} onChange={e => setRoles(e.target.value)}>
            <option value="single">Un piloto</option>
            <option value="pfpm">PF / PM</option>
            <option value="cm">CM1 / CM2</option>
            <option value="cptfo">Capitán / Primer Oficial</option>
          </select>
        </label>
        <label className="field">Imagen de la cabina
          <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { setImg(await loadImage(f)) } finally { setBusy(false) } }} />
        </label>
        {busy && <p className="muted">Procesando imagen…</p>}
        {img && <img className="preview" src={img.url} alt="Vista previa de la cabina" />}
        <button className="btn primary" disabled={!img || !name.trim()} onClick={create}>Crear y marcar mandos →</button>
      </div>
    </div>
  )
}
