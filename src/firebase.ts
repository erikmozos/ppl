// Firebase: autenticación, perfiles con rol y progreso de cada usuario en Firestore.
// Se activa solo si existen las variables VITE_FIREBASE_* (en .env.local).
import { initializeApp, deleteApp, type FirebaseApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut, type User,
} from 'firebase/auth'
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc,
  type Timestamp,
} from 'firebase/firestore'
import { useSyncExternalStore } from 'react'
import type { Aircraft } from './types'
import { actions, subscribe, getState } from './store'
import { FIREBASE_CONFIG } from './firebase.config'

const env = import.meta.env
const config = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string | undefined) || FIREBASE_CONFIG.apiKey,
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) || FIREBASE_CONFIG.authDomain,
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string | undefined) || FIREBASE_CONFIG.projectId,
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) || FIREBASE_CONFIG.storageBucket,
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) || FIREBASE_CONFIG.messagingSenderId,
  appId: (env.VITE_FIREBASE_APP_ID as string | undefined) || FIREBASE_CONFIG.appId,
}
export const firebaseEnabled = !!(config.apiKey && config.projectId && config.appId)

const app: FirebaseApp | null = firebaseEnabled ? initializeApp(config) : null
const auth = app ? getAuth(app) : null
const db = app ? getFirestore(app) : null

export type Role = 'admin' | 'student'
export interface Profile {
  uid: string
  email: string
  name: string
  role: Role
  disabled?: boolean
  createdAt?: Timestamp
  lastSeen?: Timestamp
  createdBy?: string
}

/* ───────────── estado de sesión ───────────── */

interface Session { ready: boolean; user: User | null; profile: Profile | null; error: string | null; syncing: boolean; lastSync: number | null }
let session: Session = { ready: !firebaseEnabled, user: null, profile: null, error: null, syncing: false, lastSync: null }
const subs = new Set<() => void>()
const setSession = (p: Partial<Session>) => { session = { ...session, ...p }; subs.forEach(f => f()) }
export const useSession = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, () => session)

/* ───────────── progreso en la nube ───────────── */

const progressRef = (uid: string) => doc(db!, 'users', uid, 'data', 'progress')
const aircraftCol = (uid: string) => collection(db!, 'users', uid, 'aircraft')
const MAX_DOC = 900_000 // Firestore admite 1 MiB por documento

let unsubStore: (() => void) | null = null
let pushTimer: ReturnType<typeof setTimeout> | null = null
let applyingRemote = false

/** Descarga el progreso del usuario; si no hay nada en la nube, sube lo que haya en este navegador */
async function pullProgress(uid: string) {
  setSession({ syncing: true })
  const snap = await getDoc(progressRef(uid))
  const acs = await getDocs(aircraftCol(uid))
  const customAc = acs.docs.map(d => d.data().aircraft as Aircraft)
  if (snap.exists()) {
    applyingRemote = true
    actions.restore({ ...(snap.data().data ?? {}), customAc })
    applyingRemote = false
  } else {
    await pushProgress(uid)
  }
  setSession({ syncing: false, lastSync: Date.now() })
}

/** Sube el progreso (y cada cabina propia en su documento si cabe en el límite de Firestore) */
async function pushProgress(uid: string) {
  const { attempts, flows, cards, quiz, spots, customAc } = getState()
  setSession({ syncing: true })
  await setDoc(progressRef(uid), {
    data: { attempts, flows, cards, quiz, spots },
    summary: {
      attempts: attempts.length,
      avgScore: attempts.length ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length) : 0,
      quizPassed: Object.values(quiz).filter(q => q.best >= 75).length,
      quizzes: Object.keys(quiz).length,
      cardsMastered: Object.values(cards).flatMap(d => Object.values(d)).filter(c => c.box >= 3).length,
      customFlows: Object.values(flows).flat().length,
    },
    updatedAt: serverTimestamp(),
  })
  const remote = await getDocs(aircraftCol(uid))
  const keep = new Set<string>()
  for (const ac of customAc) {
    const size = JSON.stringify(ac).length
    if (size > MAX_DOC) continue // imágenes demasiado grandes: se quedan solo en este navegador
    keep.add(ac.id)
    await setDoc(doc(aircraftCol(uid), ac.id), { aircraft: ac, updatedAt: serverTimestamp() })
  }
  for (const d of remote.docs) if (!keep.has(d.id)) await deleteDoc(d.ref)
  setSession({ syncing: false, lastSync: Date.now() })
}

function startSync(uid: string) {
  unsubStore?.()
  unsubStore = subscribe(() => {
    if (applyingRemote) return
    if (pushTimer) clearTimeout(pushTimer)
    pushTimer = setTimeout(() => pushProgress(uid).catch(e => setSession({ error: String(e.message ?? e), syncing: false })), 2500)
  })
}
function stopSync() {
  unsubStore?.(); unsubStore = null
  if (pushTimer) clearTimeout(pushTimer)
}

/* ───────────── autenticación ───────────── */

if (auth && db) {
  onAuthStateChanged(auth, async user => {
    stopSync()
    if (!user) { setSession({ ready: true, user: null, profile: null }); return }
    try {
      const ref = doc(db, 'users', user.uid)
      let snap = await getDoc(ref)
      // sin perfil: si es la cuenta administradora de arranque, las reglas de Firestore le dejan crearse el suyo;
      // a cualquier otra cuenta se lo deniegan (así el email admin no tiene que estar en el código del cliente)
      if (!snap.exists()) {
        try {
          await setDoc(ref, { uid: user.uid, email: user.email, name: 'Administrador', role: 'admin', createdAt: serverTimestamp(), lastSeen: serverTimestamp() })
          snap = await getDoc(ref)
        } catch { /* no es la cuenta de arranque */ }
      }
      if (!snap.exists()) {
        await signOut(auth)
        setSession({ ready: true, user: null, profile: null, error: 'Tu cuenta no tiene perfil. Pide al administrador que te dé de alta.' })
        return
      }
      const profile = snap.data() as Profile
      if (profile.disabled) {
        await signOut(auth)
        setSession({ ready: true, user: null, profile: null, error: 'Tu cuenta está desactivada. Contacta con el administrador.' })
        return
      }
      setSession({ ready: true, user, profile, error: null })
      updateDoc(ref, { lastSeen: serverTimestamp() }).catch(() => {})
      await pullProgress(user.uid)
      startSync(user.uid)
    } catch (e) {
      setSession({ ready: true, user, profile: null, error: 'No se pudo cargar tu perfil: ' + ((e as Error).message ?? e) })
    }
  })
}

export async function login(email: string, password: string) {
  if (!auth) return
  setSession({ error: null })
  try { await signInWithEmailAndPassword(auth, email.trim(), password) } catch (e) { setSession({ error: authError(e) }); throw e }
}
export async function logout() {
  if (!auth) return
  const uid = session.user?.uid
  if (uid) await pushProgress(uid).catch(() => {})
  stopSync()
  await signOut(auth)
  // que el siguiente usuario de este navegador empiece limpio
  applyingRemote = true
  actions.restore({})
  applyingRemote = false
}
export async function resetPassword(email: string) {
  if (!auth) return
  await sendPasswordResetEmail(auth, email.trim())
}
export async function syncNow() {
  if (session.user) await pushProgress(session.user.uid)
}

function authError(e: unknown) {
  const code = (e as { code?: string }).code ?? ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Email o contraseña incorrectos.'
  if (code.includes('too-many-requests')) return 'Demasiados intentos. Espera unos minutos.'
  if (code.includes('operation-not-allowed')) return 'El acceso por email no está activado en Firebase (Authentication › Sign-in method).'
  if (code.includes('email-already-in-use')) return 'Ya existe una cuenta con ese email.'
  if (code.includes('weak-password')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (code.includes('invalid-email')) return 'Email no válido.'
  return (e as Error).message ?? String(e)
}

/* ───────────── administración (solo rol admin; lo garantizan las reglas de Firestore) ───────────── */

export interface UserRow extends Profile { summary?: Record<string, number>; updatedAt?: Timestamp }

export async function listUsers(): Promise<UserRow[]> {
  const snap = await getDocs(collection(db!, 'users'))
  const rows = await Promise.all(snap.docs.map(async d => {
    const p = d.data() as Profile
    const prog = await getDoc(progressRef(d.id)).catch(() => null)
    return { ...p, uid: d.id, summary: prog?.data()?.summary, updatedAt: prog?.data()?.updatedAt }
  }))
  return rows.sort((a, b) => (a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'admin' ? -1 : 1))
}

export async function getUserProgress(uid: string) {
  const snap = await getDoc(progressRef(uid))
  return snap.exists() ? snap.data() : null
}

/**
 * Crea un usuario sin cerrar la sesión del admin: se usa una segunda instancia de Firebase
 * para el alta en Authentication y luego el admin escribe su perfil en Firestore.
 */
export async function createUser(input: { email: string; password: string; name: string; role: Role }) {
  if (!auth || !db) throw new Error('Firebase no está configurado')
  const second = initializeApp(config, 'alta-' + Date.now())
  try {
    const cred = await createUserWithEmailAndPassword(getAuth(second), input.email.trim(), input.password)
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid, email: input.email.trim().toLowerCase(), name: input.name.trim() || input.email.split('@')[0],
      role: input.role, disabled: false, createdAt: serverTimestamp(), createdBy: session.user?.email ?? null,
    })
    await signOut(getAuth(second))
    return cred.user.uid
  } catch (e) {
    throw new Error(authError(e))
  } finally {
    await deleteApp(second)
  }
}

export async function updateUser(uid: string, patch: Partial<Pick<Profile, 'name' | 'role' | 'disabled'>>) {
  await updateDoc(doc(db!, 'users', uid), patch)
}

export async function resetUserProgress(uid: string) {
  await deleteDoc(progressRef(uid))
  const acs = await getDocs(aircraftCol(uid))
  for (const d of acs.docs) await deleteDoc(d.ref)
}

/** Borra el perfil y el progreso. La cuenta de Authentication solo se puede borrar desde la consola (requiere Admin SDK). */
export async function deleteUserData(uid: string) {
  await resetUserProgress(uid)
  await deleteDoc(doc(db!, 'users', uid))
}
