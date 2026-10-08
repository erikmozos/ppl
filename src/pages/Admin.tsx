import { useEffect, useState } from 'react'
import {
  createUser, deleteUserData, getUserProgress, listUsers, resetPassword, resetUserProgress, updateUser,
  useSession, type Role, type UserRow,
} from '../firebase'
import { MODULES } from '../data/licenses/modules'

const fmt = (t?: { toDate: () => Date }) => (t ? t.toDate().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—')
const genPassword = () => Array.from(crypto.getRandomValues(new Uint8Array(9)), b => 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'[b % 55]).join('')
const subjectName = (key: string) => {
  const [m, sub] = key.split('/')
  const mod = MODULES.find(x => x.id === m)
  return `${mod?.short ?? m} · ${mod?.subjects?.find(x => x.id === sub)?.name ?? sub}`
}

/** Panel de administración: alta de usuarios, roles, estado y progreso de cada uno */
export function Admin() {
  const s = useSession()
  const [rows, setRows] = useState<UserRow[] | null>(null)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState('')
  const [detail, setDetail] = useState<UserRow | null>(null)

  const reload = () => listUsers().then(setRows).catch(e => setErr((e as Error).message))
  useEffect(() => { reload() }, [])

  if (s.profile?.role !== 'admin') return <div className="wrap"><h1>Acceso restringido</h1><p>Esta pantalla es solo para administradores.</p></div>

  const list = (rows ?? []).filter(r => !filter || `${r.email} ${r.name}`.toLowerCase().includes(filter.toLowerCase()))
  const students = (rows ?? []).filter(r => r.role === 'student')
  const active7 = (rows ?? []).filter(r => r.lastSeen && Date.now() - r.lastSeen.toDate().getTime() < 7 * 864e5).length

  return (
    <div className="wrap">
      <div className="ac-head">
        <div>
          <p className="eyebrow">Administración</p>
          <h1>Usuarios y progreso</h1>
          <p className="muted">Da de alta alumnos, cambia roles, desactiva cuentas y revisa el progreso de cada uno.</p>
        </div>
        <button className="btn ghost" onClick={reload}>↻ Actualizar</button>
      </div>
      {err && <div className="card note-card">⚠️ {err}</div>}

      <div className="kpis">
        <div className="card kpi"><b>{rows?.length ?? '…'}</b><span>usuarios</span></div>
        <div className="card kpi"><b>{students.length}</b><span>alumnos</span></div>
        <div className="card kpi"><b>{active7}</b><span>activos en 7 días</span></div>
        <div className="card kpi"><b>{students.reduce((n, r) => n + (r.summary?.quizPassed ?? 0), 0)}</b><span>tests aprobados (total)</span></div>
      </div>

      <div className="admin-grid">
        <CreateUser onCreated={reload} />
        <div className="card">
          <div className="row between wrap-row gap">
            <h3>Usuarios</h3>
            <input className="input" placeholder="Buscar por nombre o email…" value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
          {!rows ? <p className="muted">Cargando…</p> : (
            <div className="table-wrap">
              <table className="table admin-table">
                <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Repasos</th><th>Nota media</th><th>Tests ✓</th><th>Última conexión</th><th></th></tr></thead>
                <tbody>
                  {list.map(r => (
                    <tr key={r.uid} className={r.disabled ? 'off' : ''}>
                      <td><b>{r.name}</b><br /><span className="muted small">{r.email}</span></td>
                      <td>
                        <select value={r.role} disabled={r.uid === s.user?.uid} onChange={async e => { await updateUser(r.uid, { role: e.target.value as Role }); reload() }}>
                          <option value="student">Alumno</option><option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{r.disabled ? <span className="bad-text small">Desactivado</span> : <span className="ok-text small">Activo</span>}</td>
                      <td>{r.summary?.attempts ?? 0}</td>
                      <td>{r.summary?.attempts ? `${r.summary.avgScore}%` : '—'}</td>
                      <td>{r.summary?.quizPassed ?? 0}</td>
                      <td className="small">{fmt(r.lastSeen)}</td>
                      <td><button className="btn sm" onClick={() => setDetail(r)}>Ver</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {detail && <UserDetail row={detail} self={detail.uid === s.user?.uid} onClose={() => setDetail(null)} onChanged={() => { reload(); setDetail(null) }} />}
    </div>
  )
}

function CreateUser({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(genPassword)
  const [role, setRole] = useState<Role>('student')
  const [sendReset, setSendReset] = useState(true)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ email: string; password: string } | null>(null)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(''); setDone(null)
    try {
      await createUser({ email, password, name, role })
      if (sendReset) await resetPassword(email).catch(() => {})
      setDone({ email, password })
      setName(''); setEmail(''); setPassword(genPassword()); setRole('student')
      onCreated()
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  return (
    <form className="card form admin-create" onSubmit={submit}>
      <h3>➕ Nuevo usuario</h3>
      <label className="field">Nombre<input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre y apellidos" /></label>
      <label className="field">Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label className="field">Contraseña inicial
        <div className="row gap"><input className="grow" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required /><button type="button" className="btn sm" onClick={() => setPassword(genPassword())}>↻</button></div>
      </label>
      <label className="field">Rol
        <select value={role} onChange={e => setRole(e.target.value as Role)}><option value="student">Alumno</option><option value="admin">Administrador</option></select>
      </label>
      <label className="check"><input type="checkbox" checked={sendReset} onChange={e => setSendReset(e.target.checked)} /> Enviarle un email para que elija su contraseña</label>
      {err && <p className="bad-text small">{err}</p>}
      {done && (
        <div className="card ok-box">
          <b>✓ Usuario creado</b>
          <p className="small">Email: <code>{done.email}</code><br />Contraseña: <code>{done.password}</code></p>
          <button type="button" className="btn ghost sm" onClick={() => navigator.clipboard?.writeText(`Acceso a Cockpit Flows\nEmail: ${done.email}\nContraseña: ${done.password}\n${location.origin}`)}>Copiar datos de acceso</button>
        </div>
      )}
      <button className="btn primary" disabled={busy}>{busy ? 'Creando…' : 'Crear usuario'}</button>
    </form>
  )
}

function UserDetail({ row, self, onClose, onChanged }: { row: UserRow; self: boolean; onClose: () => void; onChanged: () => void }) {
  const [prog, setProg] = useState<Record<string, any> | null | undefined>(undefined)
  const [name, setName] = useState(row.name)
  const [msg, setMsg] = useState('')
  useEffect(() => { getUserProgress(row.uid).then(setProg).catch(() => setProg(null)) }, [row.uid])
  const data = prog?.data ?? {}
  const quiz = Object.entries((data.quiz ?? {}) as Record<string, { best: number; last: number; n: number }>)
  const attempts = (data.attempts ?? []) as { id: string; date: number; ac: string; flowName: string; score: number }[]

  const act = async (f: () => Promise<unknown>, ok: string, confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return
    try { await f(); setMsg(ok) } catch (e) { setMsg('Error: ' + (e as Error).message) }
  }

  return (
    <div className="tour-backdrop" role="dialog" aria-modal="true" aria-label={`Usuario ${row.email}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tour admin-detail">
        <div className="tour-top"><span className="eyebrow">{row.role === 'admin' ? 'Administrador' : 'Alumno'}</span><button className="btn ghost sm" onClick={onClose} aria-label="Cerrar">✕</button></div>
        <h2>{row.name}</h2>
        <p className="muted small">{row.email} · alta {fmt(row.createdAt)}{row.createdBy ? ` por ${row.createdBy}` : ''} · última conexión {fmt(row.lastSeen)}</p>

        <div className="row gap wrap-row">
          <label className="field grow">Nombre<input value={name} onChange={e => setName(e.target.value)} /></label>
          <button className="btn sm" onClick={() => act(() => updateUser(row.uid, { name }), 'Nombre guardado')}>Guardar</button>
        </div>

        <h3>Progreso</h3>
        {prog === undefined ? <p className="muted">Cargando…</p> : !prog ? <p className="muted">Todavía no tiene progreso guardado.</p> : (
          <>
            <div className="kpis small-kpis">
              <div className="card kpi"><b>{prog.summary?.attempts ?? 0}</b><span>repasos</span></div>
              <div className="card kpi"><b>{prog.summary?.avgScore ?? 0}%</b><span>nota media</span></div>
              <div className="card kpi"><b>{prog.summary?.quizPassed ?? 0}/{prog.summary?.quizzes ?? 0}</b><span>tests aprobados</span></div>
              <div className="card kpi"><b>{prog.summary?.cardsMastered ?? 0}</b><span>mandos dominados</span></div>
            </div>
            {quiz.length > 0 && (
              <table className="table"><thead><tr><th>Test</th><th>Mejor</th><th>Intentos</th></tr></thead>
                <tbody>{quiz.map(([k, q]) => <tr key={k}><td>{subjectName(k)}</td><td><span className={`score ${q.best >= 75 ? 'good' : q.best >= 50 ? 'mid' : 'low'}`}>{q.best}%</span></td><td>{q.n}</td></tr>)}</tbody>
              </table>
            )}
            {attempts.length > 0 && (
              <>
                <p className="small muted">Últimos repasos de cabina</p>
                <ul className="mini-list">{attempts.slice(0, 8).map(a => <li key={a.id}>{new Date(a.date).toLocaleDateString('es-ES')} · {a.ac} · {a.flowName} — <b>{a.score}%</b></li>)}</ul>
              </>
            )}
            <p className="small muted">Actualizado: {fmt(prog.updatedAt)}</p>
          </>
        )}

        <h3>Acciones</h3>
        <div className="row gap wrap-row">
          <button className="btn sm" onClick={() => act(() => resetPassword(row.email), 'Email de nueva contraseña enviado')}>📧 Enviar cambio de contraseña</button>
          {!self && <button className="btn sm" onClick={() => act(() => updateUser(row.uid, { disabled: !row.disabled }).then(onChanged), row.disabled ? 'Activado' : 'Desactivado')}>{row.disabled ? '✅ Activar cuenta' : '⛔ Desactivar cuenta'}</button>}
          <button className="btn ghost sm" onClick={() => act(() => resetUserProgress(row.uid).then(() => setProg(null)), 'Progreso borrado', '¿Borrar todo el progreso de este usuario?')}>🧹 Borrar progreso</button>
          {!self && <button className="btn ghost sm danger" onClick={() => act(() => deleteUserData(row.uid).then(onChanged), 'Usuario eliminado', '¿Eliminar el perfil y el progreso? (La cuenta de acceso se borra después desde la consola de Firebase › Authentication.)')}>🗑️ Eliminar usuario</button>}
        </div>
        {msg && <p className="small">{msg}</p>}
        <p className="small muted">Desactivar impide entrar en la app. Para borrar del todo la cuenta de acceso, usa la consola de Firebase › Authentication: el SDK web no puede hacerlo sin un servidor.</p>
      </div>
    </div>
  )
}
