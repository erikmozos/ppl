// Configuración web de Firebase. Es pública por diseño (va dentro de la app en el navegador):
// la seguridad la dan las reglas de Firestore (firestore.rules.template). Se puede sobrescribir con VITE_FIREBASE_* en .env.local.
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCj3-h-6IUBdgvI9-Qn-4SkkpW_fWVOc7Q',
  authDomain: 'cockpit-flows-academy.firebaseapp.com',
  projectId: 'cockpit-flows-academy',
  storageBucket: 'cockpit-flows-academy.firebasestorage.app',
  messagingSenderId: '1033647937724',
  appId: '1:1033647937724:web:9e82050a643f380579d8b9',
}
