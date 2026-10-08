import { useState } from 'react'
import { login, resetPassword, useSession } from '../firebase'

/** Acceso: las cuentas las crea el administrador */
export function Login() {
  const s = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try { await login(email, password) } catch { /* el error se muestra desde la sesión */ } finally { setBusy(false) }
  }
  async function forgot() {
    if (!email) { setMsg('Escribe tu email y vuelve a pulsar.'); return }
    try { await resetPassword(email); setMsg('Si el email existe, te hemos enviado un enlace para crear una nueva contraseña.') } catch (e) { setMsg((e as Error).message) }
  }

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={submit}>
        <div className="login-brand">
          <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden><rect width="64" height="64" rx="14" fill="#0f1720" stroke="#1e293b" /><path d="M14 46 C24 44 22 22 32 22 S44 40 50 18" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" /><circle cx="14" cy="46" r="5" fill="#f59e0b" /><circle cx="50" cy="18" r="5" fill="#f59e0b" /></svg>
          <div><h1>Cockpit<b>Flows</b></h1><p className="muted small">Academia de vuelo · acceso de alumnos</p></div>
        </div>
        <label className="field">Email<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label className="field">Contraseña<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        {s.error && <p className="bad-text small">{s.error}</p>}
        {msg && <p className="small">{msg}</p>}
        <button className="btn primary" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <button type="button" className="btn ghost sm" onClick={forgot}>He olvidado mi contraseña</button>
        <p className="small muted">¿No tienes cuenta? Las cuentas las crea el administrador de la academia.</p>
      </form>
    </div>
  )
}
