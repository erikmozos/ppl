// Genera firestore.rules a partir del template con el email de administrador de .env.local / .env
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
const env = ['.env.local', '.env'].filter(existsSync).map(f => readFileSync(f, 'utf8')).join('\n')
const admin = env.match(/^VITE_ADMIN_EMAIL=(.+)$/m)?.[1]?.trim()
if (!admin) { console.error('Falta VITE_ADMIN_EMAIL en .env.local'); process.exit(1) }
writeFileSync('firestore.rules', readFileSync('firestore.rules.template', 'utf8').replace('__ADMIN_EMAIL__', admin))
console.log('firestore.rules generado (admin:', admin + ')')
