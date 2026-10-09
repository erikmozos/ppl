// Datos de ejemplo para las capturas del vídeo (progreso de un alumno a mitad del curso)
const now = Date.now(), H = 3600e3, D = 24 * H
const blocks = { '010': 15, '020': 24, '030': 13, '040': 16, '050': 19, '060': 15, '070': 10, '080': 15, '090': 11 }
const acc = { '010': 0.88, '020': 0.81, '030': 0.74, '040': 0.9, '050': 0.78, '060': 0.69, '070': 0.84, '080': 0.86, '090': 0.92 }
const st = { q: {}, srs: {}, answers: [], exams: [], plan: {}, lessons: {}, gen: {} }
let k = 0, seedN = 7
const rnd = () => { seedN = (seedN * 16807) % 2147483647; return seedN / 2147483647 }
for (const [c, n] of Object.entries(blocks)) for (let b = 1; b <= n; b++) {
  const id = `${c}.${String(b).padStart(2, '0')}`
  const read = ['010', '040', '080', '090'].includes(c) || (c === '050' && b < 12) || (c === '020' && b < 15) || (c === '060' && b < 9) || (c === '030' && b < 7) || (c === '070' && b < 5)
  if (read) st.lessons[id] = now - (k++) * H * 3
  if (read) for (let i = 1; i <= 8; i++) { const ok = rnd() < acc[c]; st.q[`${id}.${String(i).padStart(3, '0')}`] = { n: 3, ok: ok ? 3 : 1, t: now - D, last: ok } }
}
Object.keys(st.q).filter(x => !st.q[x].last).slice(0, 14).forEach(x => { st.srs['q:' + x] = { due: now - H, ivl: 0, ef: 2.3, reps: 0, lapses: 1 }; st.q[x].r = ['nolosabia', 'confusion', 'calculo', 'lectura'][x.length % 4] })
;['010.07.01', '010.07.02', '010.07.03', '050.03.01', '080.08.01', '020.11.01', '090.03.01', '040.03.01', '010.06.01', '060.06.01'].forEach(x => { st.srs['c:' + x] = { due: now - H, ivl: 1, ef: 2.5, reps: 1, lapses: 0 } })
const N = { '010': 16, '040': 8, '090': 8, '080': 16, '020': 24, '050': 8, '060': 12 }
for (const [c, arr] of [['010', [14, 15, 15]], ['040', [7, 8, 7]], ['090', [7, 8, 8]], ['080', [13, 14, 14]], ['020', [19, 20]], ['050', [6]], ['060', [8]]])
  arr.forEach((ok, i) => st.exams.push({ id: c + i, code: c, mode: 'materia', t: now - i * D - 3 * H, ok, n: N[c], ms: 20 * 60e3, blocks: {} }))
st.exams.sort((a, b) => b.t - a.t)
st.plan = { '010': { rec: '2026-09-15', attempts: [{ date: '2026-10-02', pass: true }] }, '040': { rec: '2026-09-15', attempts: [{ date: '2026-10-02', pass: true }] }, '090': { rec: '2026-09-15', attempts: [{ date: '2026-10-02', pass: true }] }, '020': { rec: '2026-09-15', attempts: [{ date: '2026-10-02', pass: false }] } }
for (const c of ['010', '040', '090']) for (let b = 1; b <= blocks[c]; b++) st.gen[`${c}.${String(b).padStart(2, '0')}`] = [19, 21]
localStorage.setItem('cf.study', JSON.stringify(st))
localStorage.setItem('cf.guideSeen', '1')
localStorage.setItem('cf.introSeen.local', '1')
