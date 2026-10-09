// Genera los pasos de captura del vídeo a partir de scenes.json
import { readFileSync, writeFileSync } from 'node:fs'
const scenes = JSON.parse(readFileSync(new URL('./scenes.json', import.meta.url)))
const seed = readFileSync(new URL('./seed.js', import.meta.url), 'utf8')
const helpers = `
const sleep = ms => new Promise(r => setTimeout(r, ms));
window.confirm = () => true;
const shot = (title, sel, scrollSel) => {
  document.querySelectorAll('.__ov').forEach(e => e.remove());
  if (scrollSel) { const s = document.querySelector(scrollSel); if (s) s.scrollIntoView({ block: 'center' }) }
  else window.scrollTo(0, 0);
  const mk = (css, html = '') => { const d = document.createElement('div'); d.className = '__ov'; d.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;' + css; d.innerHTML = html; document.body.appendChild(d); return d };
  if (sel) { const e = document.querySelector(sel); if (e) {
    let r = e.getBoundingClientRect(); if (!scrollSel && (r.top < 60 || r.bottom > 650)) { e.scrollIntoView({ block: 'center' }); r = e.getBoundingClientRect() }
    const t = Math.max(62, r.top - 8), b = Math.min(706, r.bottom + 8);
    mk('left:' + (r.left - 8) + 'px;top:' + t + 'px;width:' + (r.width + 16) + 'px;height:' + (b - t) + 'px;border:3px solid #2350c8;border-radius:10px;box-shadow:0 0 0 9999px rgba(20,24,30,.16)') } }
  mk('left:32px;bottom:28px;background:#1b1d20;color:#fff;padding:12px 20px;border-radius:8px;font:600 22px -apple-system,sans-serif;letter-spacing:-.01em;box-shadow:0 6px 24px rgba(0,0,0,.25)', title);
};`
const actions = {
  answer: `const o = [...document.querySelectorAll('.option')]; const bad = o.find(b => true); bad && bad.click(); await sleep(300); document.querySelector('.reasons .chip-btn')?.click(); await sleep(200);`,
  flip: `[...document.querySelectorAll('button')].find(b => b.textContent.includes('Mostrar respuesta'))?.click(); await sleep(300);`,
  exam: `[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Empezar')?.click(); await sleep(1500);
    for (let k = 0; k < 5; k++) { document.querySelectorAll('.cell')[k]?.click(); await sleep(80); document.querySelectorAll('.option')[(k * 3) % 4]?.click(); await sleep(80) }
    document.querySelectorAll('.cell')[2]?.click(); await sleep(100); [...document.querySelectorAll('button')].find(b => b.textContent.includes('Marcar'))?.click(); document.querySelectorAll('.cell')[5]?.click(); await sleep(300);`,
  submit: `for (let k = 5; k < document.querySelectorAll('.cell').length; k++) { document.querySelectorAll('.cell')[k].click(); await sleep(60); document.querySelectorAll('.option')[k % 4]?.click(); await sleep(60) }
    [...document.querySelectorAll('.exam-bar button')].find(b => b.textContent.includes('Entregar'))?.click(); await sleep(800);`,
}
const steps = [{ js: seed, wait: 300 }, { js: 'location.reload()', wait: 3000 }]
for (const s of scenes) {
  const nav = s.route ? `location.hash = ${JSON.stringify(s.route.slice(1))}; await sleep(1800);` : ''
  steps.push({ js: `${helpers}\n${nav}\n${actions[s.action] ?? ''}\nshot(${JSON.stringify(s.title)}, ${JSON.stringify(s.sel ?? null)}, ${JSON.stringify(s.scroll ?? null)}); await sleep(400);`, wait: 500, out: `${s.id}.png` })
}
writeFileSync(process.argv[2], JSON.stringify(steps))
console.log(steps.length, 'pasos')
