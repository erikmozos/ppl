import { useEffect, useState } from 'react'
import { useRoute } from './router'
import { findAircraft, useStore } from './store'
import { Hub } from './pages/Hub'
import { Fleet } from './pages/Fleet'
import { Licenses } from './pages/Licenses'
import { ModulePage } from './pages/ModulePage'
import { SubjectPage } from './pages/SubjectPage'
import { moduleById, ppl } from './data/licenses/modules'
import { syllabusById } from './data/licenses/ppl-syllabus'
import { PplHome } from './pages/ppl/PplHome'
import { PplSubject } from './pages/ppl/PplSubject'
import { PplLesson } from './pages/ppl/PplLesson'
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
import { Icon } from './components/Icon'

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
  } else if (parts[0] === 'licencias' && parts[1] === 'ppl') {
    const syl = parts[2] ? syllabusById(parts[2]) : undefined
    const tab = query.get('tab') ?? ''
    if (!parts[2]) page = <PplHome m={ppl} tab={tab} />
    else if (!syl) page = <NotFound />
    else if (parts[3]) page = <PplLesson key={parts[3]} syl={syl} id={parts[3]} tab={tab} />
    else page = <PplSubject key={syl.id} syl={syl} sub={ppl.subjects?.find(x => x.id === syl.id)} tab={tab} />
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
        <a href="#/" className="brand" aria-label="Cockpit Flows, inicio">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><rect x="1" y="1" width="22" height="22" rx="5" className="brand-box" /><path d="M5 16c3-1 4-8 7-8s4 5 7-1" fill="none" className="brand-line" strokeWidth="2" strokeLinecap="round" /></svg>
          <span>Cockpit Flows</span>
        </a>
        <button className="menu-btn" aria-label="Menú" aria-expanded={menu} onClick={() => setMenu(m => !m)}><Icon name={menu ? 'x' : 'menu'} size={20} /></button>
        <nav className={menu ? 'open' : ''}>
          {([['licencias/ppl', 'PPL'], ['licencias', 'Licencias'], ['cockpits', 'Cockpits'], ['progress', 'Progreso'], ['guia', 'Guía']] as const).map(([href, label]) => {
            const on = href === 'licencias/ppl' ? parts[0] === 'licencias' && parts[1] === 'ppl' : href === 'licencias' ? parts[0] === 'licencias' && parts[1] !== 'ppl' : parts[0] === href
            return <a key={href} href={`#/${href}`} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>{label}</a>
          })}
          {session.profile?.role === 'admin' && <a href="#/admin" className={parts[0] === 'admin' ? 'on' : ''}>Admin</a>}
          <ThemeToggle />
          {session.user && (
            <span className="user-chip" title={session.user.email ?? ''}>
              <span className={`sync-dot ${session.syncing ? 'busy' : ''}`} title={session.syncing ? 'Sincronizando' : 'Progreso guardado en la nube'} />
              {session.profile?.name?.split(' ')[0] ?? session.user.email}
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

/** Tema claro, oscuro o el del sistema (se recuerda en este navegador) */
function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(() => { try { return localStorage.getItem('cf.theme') } catch { return null } })
  useEffect(() => {
    const el = document.documentElement
    if (theme) el.dataset.theme = theme
    else delete el.dataset.theme
    try { if (theme) localStorage.setItem('cf.theme', theme); else localStorage.removeItem('cf.theme') } catch { /* sin almacenamiento */ }
  }, [theme])
  const dark = theme ? theme === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return (
    <button className="icon-btn theme-btn" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Tema claro' : 'Tema oscuro'} title={dark ? 'Tema claro' : 'Tema oscuro'}>
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  )
}
