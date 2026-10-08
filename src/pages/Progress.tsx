import { useState } from 'react'
import { actions, allAircraft, useStore } from '../store'
import { firebaseEnabled, syncNow, useSession } from '../firebase'

export function Progress() {
  const s = useStore()
  const acs = allAircraft(s)
  const name = (id: string) => acs.find(a => a.id === id)?.short ?? id

  function exportJson() {
    const blob = new Blob([JSON.stringify(actions.snapshot())], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cockpit-flows-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }
  async function importJson(f: File) {
    try {
      const data = JSON.parse(await f.text())
      if (confirm('Esto reemplaza tus datos actuales por los de la copia. ¿Continuar?')) actions.restore(data)
    } catch { alert('Archivo no válido') }
  }

  const avg = s.attempts.length ? Math.round(s.attempts.reduce((a, b) => a + b.score, 0) / s.attempts.length) : 0
  const cards = Object.values(s.cards).flatMap(d => Object.values(d))

  return (
    <div className="wrap">
      <h1>Progreso</h1>
      <div className="kpis">
        <div className="card kpi"><b>{s.attempts.length}</b><span>repasos</span></div>
        <div className="card kpi"><b>{avg}%</b><span>nota media</span></div>
        <div className="card kpi"><b>{cards.filter(c => c.box >= 3).length}</b><span>mandos dominados</span></div>
        <div className="card kpi"><b>{Object.values(s.flows).flat().length}</b><span>flows propios</span></div>
        <div className="card kpi"><b>{Object.values(s.quiz).filter(q => q.best >= 75).length}</b><span>tests de licencias aprobados</span></div>
      </div>

      <h2 className="sec">Últimos repasos</h2>
      {s.attempts.length === 0 ? <p className="muted">Aún no has hecho ningún repaso.</p> : (
        <div className="card table-wrap">
          <table className="table">
            <thead><tr><th>Fecha</th><th>Avión</th><th>Flow</th><th>Nota</th><th>✓</th><th>✗</th><th>💡</th></tr></thead>
            <tbody>
              {s.attempts.slice(0, 50).map(a => (
                <tr key={a.id}>
                  <td>{new Date(a.date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{name(a.ac)}</td>
                  <td><a href={`#/ac/${a.ac}/flow/${a.flow}?mode=review`}>{a.flowName}</a></td>
                  <td><span className={`score ${a.score >= 90 ? 'good' : a.score >= 60 ? 'mid' : 'low'}`}>{a.score}%</span></td>
                  <td>{a.ok}/{a.total}</td><td>{a.bad}</td><td>{a.hints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(s.quiz).length > 0 && (
        <>
          <h2 className="sec">Tests de licencias</h2>
          <div className="card table-wrap">
            <table className="table">
              <thead><tr><th>Asignatura</th><th>Mejor</th><th>Último</th><th>Intentos</th></tr></thead>
              <tbody>
                {Object.entries(s.quiz).map(([k, q]) => (
                  <tr key={k}>
                    <td><a href={`#/licencias/${k}?tab=test`}>{k.replace('/', ' · ')}</a></td>
                    <td><span className={`score ${q.best >= 75 ? 'good' : q.best >= 50 ? 'mid' : 'low'}`}>{q.best}%</span></td>
                    <td>{q.last}%</td><td>{q.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 className="sec">Copia de seguridad</h2>
      <div className="card">
        <p className="muted small">Tus datos (repasos, flows propios, cabinas subidas y flashcards) se guardan en este navegador. Exporta una copia para pasarla a otro dispositivo.</p>
        <div className="row gap wrap-row">
          <button className="btn" onClick={exportJson}>Exportar JSON</button>
          <label className="btn">Importar JSON<input hidden type="file" accept="application/json" onChange={e => { const f = e.target.files?.[0]; if (f) importJson(f) }} /></label>
        </div>
      </div>

      <h2 className="sec">Sincronización en la nube</h2>
      <SyncCard />
    </div>
  )
}

function SyncCard() {
  const s = useSession()
  const [msg, setMsg] = useState('')
  if (!firebaseEnabled) {
    return <div className="card"><p className="muted small">La sincronización en la nube usa Firebase. Configura las variables VITE_FIREBASE_* en .env.local (ver README).</p></div>
  }
  return (
    <div className="card">
      <p>Conectado como <b>{s.user?.email}</b> ({s.profile?.role === 'admin' ? 'administrador' : 'alumno'}). Tu progreso se guarda automáticamente en la nube y lo verás en cualquier dispositivo con tu cuenta.</p>
      <p className="small muted">{s.syncing ? 'Sincronizando…' : s.lastSync ? `Última sincronización: ${new Date(s.lastSync).toLocaleTimeString('es-ES')}` : 'Pendiente de sincronizar'}{s.error ? ` · ⚠️ ${s.error}` : ''}</p>
      <button className="btn sm" onClick={() => syncNow().then(() => setMsg('Sincronizado ✓')).catch(e => setMsg('Error: ' + (e as Error).message))}>Sincronizar ahora</button>
      {msg && <p className="small">{msg}</p>}
      <p className="small muted">Las cabinas que subas con imágenes muy grandes (más de ~900 KB) se quedan solo en este navegador.</p>
    </div>
  )
}
