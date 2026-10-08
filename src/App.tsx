import { useEffect, useState } from 'react'
import { useRoute } from './router'
import { findAircraft, useStore } from './store'
import { Hub } from './pages/Hub'
import { Fleet } from './pages/Fleet'
import { Licenses } from './pages/Licenses'
import { ModulePage } from './pages/ModulePage'
import { SubjectPage } from './pages/SubjectPage'
import { moduleById } from './data/licenses/modules'
import { AircraftPage } from './pages/AircraftPage'
import { FlowPage } from './pages/FlowPage'
import { Editor } from './pages/Editor'
import { NewAircraft } from './pages/NewAircraft'
import { Progress } from './pages/Progress'
import { SpotEditor } from './pages/SpotEditor'
import { GuidePage } from './pages/GuidePage'
import { DISCLAIMER } from './data/h'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { firebaseEnabled, logout, useSession } from './firebase'

export function App() {
  const { parts, query } = useRoute()
  const s = useStore()
  const session = useSession()
  const [menu, setMenu] = useState(false)
  useEffect(() => { setMenu(false) }, [parts.join('/')])
  let page: React.ReactNode

  // con Firebase activo, la academia es privada: hay que entrar con una cuenta creada por el admin
  if (firebaseEnabled && !session.ready) return <div className="login-wrap"><p className="muted">Cargando…</p></div>
  if (firebaseEnabled && !session.user) return <Login />

  if (parts[0] === 'ac') {
    const ac = findAircraft(s, parts[1] ?? '')
    if (!ac) page = s.ready ? <NotFound /> : <div className="wrap muted">Cargando…</div>
    else if (parts[2] === 'flow' && parts[3]) page = <FlowPage key={parts[3] + query.get('mode')} ac={ac} flowId={parts[3]} mode={query.get('mode') === 'review' ? 'review' : 'study'} />
    else if (parts[2] === 'spots') page = <SpotEditor ac={ac} />
    else if (parts[2] === 'edit') page = <Editor key={parts[3] ?? 'new'} ac={ac} flowId={parts[3]} hotspots={query.get('tab') === 'hotspots'} />
    else page = <AircraftPage ac={ac} tab={query.get('tab') ?? 'guide'} />
  } else if (parts[0] === 'licencias') {
    const m = parts[1] ? moduleById(parts[1]) : undefined
    const sub = m && parts[2] ? m.subjects?.find(x => x.id === parts[2]) : undefined
    if (!parts[1]) page = <Licenses />
    else if (!m || (parts[2] && !sub)) page = <NotFound />
    else if (sub) page = <SubjectPage key={sub.id} m={m} sub={sub} tab={query.get('tab') ?? ''} />
    else page = <ModulePage m={m} tab={query.get('tab') ?? ''} sid={query.get('s')} />
  } else if (parts[0] === 'cockpits') page = <Fleet />
  else if (parts[0] === 'admin') page = <Admin />
  else if (parts[0] === 'new') page = <NewAircraft />
  else if (parts[0] === 'progress') page = <Progress />
  else if (parts[0] === 'guia') page = <GuidePage />
  else page = <Hub />

  return (
    <>
      <header className="top">
        <a href="#/" className="brand">
          <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden><rect width="64" height="64" rx="14" fill="#0f1720" stroke="#1e293b" /><path d="M14 46 C24 44 22 22 32 22 S44 40 50 18" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" /><circle cx="14" cy="46" r="5" fill="#f59e0b" /><circle cx="50" cy="18" r="5" fill="#f59e0b" /></svg>
          <span>Cockpit<b>Flows</b></span>
        </a>
        <button className="menu-btn" aria-label="Menú" aria-expanded={menu} onClick={() => setMenu(m => !m)}>{menu ? '✕' : '☰'}</button>
        <nav className={menu ? 'open' : ''}>
          <a href="#/licencias">Licencias</a>
          <a href="#/cockpits">Cockpits</a>
          <a href="#/guia">Guía</a>
          <a href="#/progress">Progreso</a>
          {session.profile?.role === 'admin' && <a href="#/admin">Admin</a>}
          {session.user && (
            <span className="user-chip" title={session.user.email ?? ''}>
              {session.syncing ? '⟳' : '☁️'} {session.profile?.name?.split(' ')[0] ?? session.user.email}
              <button className="btn ghost sm" onClick={() => logout()}>Salir</button>
            </span>
          )}
        </nav>
      </header>
      <main>{page}</main>
      <footer className="foot wrap">
        <p>{DISCLAIMER}</p>
      </footer>
    </>
  )
}

function NotFound() {
  return (
    <div className="wrap">
      <h1>No encontrado</h1>
      <p><a href="#/">Volver al inicio</a></p>
    </div>
  )
}
