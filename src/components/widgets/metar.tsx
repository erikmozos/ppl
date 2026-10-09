// Descodificador de METAR, SPECI y TAF (formato OACI del Anexo 3 tal como lo emite AEMET)
import { useState } from 'react'
import { Widget } from './ui'

const WX: Record<string, string> = {
  MI: 'baja', BC: 'en bancos', PR: 'parcial', DR: 'ventisca baja', BL: 'ventisca alta', SH: 'chubascos de', TS: 'tormenta', FZ: 'engelante',
  DZ: 'llovizna', RA: 'lluvia', SN: 'nieve', SG: 'cinarra', PL: 'hielo granulado', GR: 'granizo', GS: 'granizo pequeño o nieve granulada', UP: 'precipitación desconocida',
  BR: 'neblina', FG: 'niebla', FU: 'humo', VA: 'ceniza volcánica', DU: 'polvo extendido', SA: 'arena', HZ: 'calima',
  PO: 'remolinos de polvo', SQ: 'turbonada', FC: 'nube embudo (tromba o tornado)', SS: 'tempestad de arena', DS: 'tempestad de polvo',
}
const CLOUD: Record<string, string> = { FEW: 'escasas (1–2 octas)', SCT: 'dispersas (3–4 octas)', BKN: 'muy nubosas (5–7 octas)', OVC: 'cubierto (8 octas)' }
const SAMPLES = [
  'METAR LEPA 091030Z 22012KT 190V250 9999 FEW030 SCT045 24/14 Q1016 NOSIG',
  'METAR LEMD 091200Z 34015G28KT 4000 -TSRA BKN015CB OVC040 18/16 Q1009 RETS TEMPO 2000 TSRA',
  'SPECI LEBL 090645Z 00000KT 0400 R25R/0550U FG VV002 12/12 Q1021 BECMG 2000',
  'TAF LEMD 090500Z 0906/1012 22010KT 9999 FEW040 PROB30 TEMPO 0914/0918 VRB20G35KT 3000 TSRA BKN030CB BECMG 0920/0922 34008KT',
]

function decodeWx(tok: string): string | null {
  const m = tok.match(/^([+-]|VC)?((?:MI|BC|PR|DR|BL|SH|TS|FZ)?)((?:DZ|RA|SN|SG|PL|GR|GS|UP|BR|FG|FU|VA|DU|SA|HZ|PO|SQ|FC|SS|DS)+)$/)
  if (!m) return null
  const int = m[1] === '+' ? 'fuerte' : m[1] === '-' ? 'débil' : m[1] === 'VC' ? 'en las proximidades' : 'moderada'
  const ph = (m[3].match(/../g) ?? []).map(p => WX[p]).join(' y ')
  const desc = m[2] ? WX[m[2]] : ''
  const txt = desc === 'tormenta' ? `tormenta${ph ? ' con ' + ph : ''}` : desc ? `${desc} ${ph}` : ph
  return `${txt}${['BR', 'FG', 'HZ', 'FU', 'DU', 'SA'].includes(m[3]) && !m[1] ? '' : ` (${int})`}`
}
const time = (d: string) => `día ${d.slice(0, 2)} a las ${d.slice(2, 4)}:${d.slice(4, 6)} UTC`
const period = (p: string) => { const [a, b] = p.split('/'); return `del día ${a.slice(0, 2)} a las ${a.slice(2, 4)} UTC al día ${b.slice(0, 2)} a las ${b.slice(2, 4)} UTC` }

export function decode(msg: string): [string, string][] {
  const toks = msg.trim().toUpperCase().replace(/=$/, '').split(/\s+/).filter(Boolean)
  const out: [string, string][] = []
  let taf = false, valid = false
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i]
    let m: RegExpMatchArray | null
    const add = (s: string) => out.push([t, s])
    if (t === 'METAR' || t === 'SPECI') add(t === 'METAR' ? 'Informe ordinario de aeródromo (cada 30 min en España)' : 'Informe especial: se emite cuando hay un cambio significativo')
    else if (t === 'TAF') { taf = true; add('Pronóstico de aeródromo') }
    else if (t === 'AMD' || t === 'COR') add(t === 'AMD' ? 'Enmendado' : 'Corregido')
    else if (/^[A-Z]{4}$/.test(t) && out.length <= 2 && !['CAVOK', 'NOSIG', 'AUTO', 'NSC', 'NCD', 'NSW'].includes(t)) add(`Aeródromo (indicador OACI ${t})`)
    else if ((m = t.match(/^(\d{6})Z$/))) add(`Emitido el ${time(m[1])}`)
    else if (taf && !valid && /^\d{4}\/\d{4}$/.test(t)) { valid = true; add(`Válido ${period(t)}`) }
    else if (t === 'AUTO') add('Observación automática, sin observador')
    else if (t === 'NIL') add('Informe ausente')
    else if ((m = t.match(/^(\d{3}|VRB)(\d{2,3})(?:G(\d{2,3}))?(KT|MPS)$/))) {
      const dir = m[1] === 'VRB' ? 'variable' : m[1] === '000' && m[2] === '00' ? '' : `de ${m[1]}° verdaderos`
      add(m[1] === '000' && m[2] === '00' ? 'Calma' : `Viento ${dir}, ${+m[2]} ${m[4] === 'KT' ? 'kt' : 'm/s'}${m[3] ? `, con rachas de ${+m[3]}` : ''}`)
    }
    else if ((m = t.match(/^(\d{3})V(\d{3})$/))) add(`Dirección del viento variable entre ${m[1]}° y ${m[2]}°`)
    else if (t === 'CAVOK') add('Ceiling And Visibility OK: visibilidad de 10 km o más, sin nubes por debajo de 5000 ft (o de la altitud mínima de sector, si es mayor) ni CB/TCU, y sin tiempo significativo')
    else if ((m = t.match(/^(\d{4})(N|NE|E|SE|S|SW|W|NW)?$/))) add(m[1] === '9999' ? 'Visibilidad de 10 km o más' : `Visibilidad ${m[2] ? 'mínima ' : ''}de ${+m[1]} m${m[2] ? ` hacia el ${m[2].replace('W', 'O')}` : ''}${+m[1] < 1000 ? ' (niebla si es por FG)' : ''}`)
    else if ((m = t.match(/^R(\d{2}[LCR]?)\/([PM])?(\d{4})(?:V(\d{4}))?([UDN])?$/))) add(`RVR en la pista ${m[1]}: ${m[2] === 'P' ? 'más de ' : m[2] === 'M' ? 'menos de ' : ''}${+m[3]} m${m[4] ? ` a ${+m[4]} m` : ''}${m[5] ? ` (${m[5] === 'U' ? 'aumentando' : m[5] === 'D' ? 'disminuyendo' : 'sin cambios'})` : ''}. Se informa con visibilidad o RVR por debajo de 1500 m`)
    else if ((m = t.match(/^(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?$/))) add(`Nubes ${CLOUD[m[1]]} a ${+m[2] * 100} ft sobre el aeródromo${m[3] === 'CB' ? ', cumulonimbos' : m[3] === 'TCU' ? ', cúmulos congestus' : ''}${m[1] === 'BKN' || m[1] === 'OVC' ? ' → techo' : ''}`)
    else if ((m = t.match(/^VV(\d{3}|\/\/\/)$/))) add(`Cielo oscurecido; visibilidad vertical ${m[1] === '///' ? 'no disponible' : `${+m[1] * 100} ft`}`)
    else if (t === 'NSC') add('Sin nubes significativas')
    else if (t === 'NCD') add('No se detectan nubes (estación automática)')
    else if (t === 'NSW') add('Fin del tiempo significativo')
    else if ((m = t.match(/^(M?\d{2})\/(M?\d{2})$/))) {
      const v = (s: string) => (s.startsWith('M') ? -+s.slice(1) : +s)
      add(`Temperatura ${v(m[1])} °C, punto de rocío ${v(m[2])} °C (diferencia ${v(m[1]) - v(m[2])} °C${v(m[1]) - v(m[2]) <= 2 ? ': riesgo de niebla' : ''})`)
    }
    else if ((m = t.match(/^Q(\d{4})$/))) add(`QNH ${+m[1]} hPa`)
    else if ((m = t.match(/^A(\d{4})$/))) add(`QNH ${m[1].slice(0, 2)},${m[1].slice(2)} inHg`)
    else if ((m = t.match(/^RE(\w+)$/))) add(`Tiempo reciente: ${decodeWx(m[1]) ?? m[1]}`)
    else if (t === 'WS') { const r = toks[i + 1]; add(`Cizalladura notificada${r ? ' (' + r + ')' : ''}`); if (r && /^(R\d{2}|ALL)/.test(r)) { i++; if (toks[i] === 'ALL') i++ } }
    else if (t === 'NOSIG') add('TREND: sin cambios significativos en las próximas 2 h')
    else if (t === 'BECMG') add('Cambio a estas condiciones, que se quedan')
    else if (t === 'TEMPO') add('Fluctuaciones temporales: cada una de menos de 1 h y en total menos de la mitad del periodo')
    else if ((m = t.match(/^PROB(30|40)$/))) add(`Probabilidad del ${m[1]} %`)
    else if (taf && /^\d{4}\/\d{4}$/.test(t)) add(`Periodo ${period(t)}`)
    else if ((m = t.match(/^FM(\d{6})$/))) add(`Desde el ${time(m[1])}: todo lo anterior se sustituye`)
    else if ((m = t.match(/^(TL|AT)(\d{4})$/))) add(`${m[1] === 'TL' ? 'Hasta' : 'A'} las ${m[2].slice(0, 2)}:${m[2].slice(2)} UTC`)
    else if (t === 'RMK') { add('Observaciones (uso nacional): ' + toks.slice(i + 1).join(' ')); break }
    else { const w = decodeWx(t); add(w ? `Tiempo presente: ${w}` : 'Grupo no reconocido') }
  }
  return out
}

export function MetarCalc() {
  const [msg, setMsg] = useState(SAMPLES[0])
  const rows = decode(msg)
  return (
    <Widget title="Descodificador de METAR y TAF" note="Mensajes de ejemplo. Los reales están en el portal AMA de AEMET (ama.aemet.es). El viento del METAR y del TAF es verdadero; el que da la torre o la ATIS, magnético.">
      <textarea className="input mono w-textarea" rows={3} value={msg} onChange={e => setMsg(e.target.value)} aria-label="Mensaje METAR o TAF" spellCheck={false} />
      <div className="seg-row wrap">{SAMPLES.map((s, i) => <button key={i} className={msg === s ? 'on' : ''} onClick={() => setMsg(s)}>{['METAR', 'Tormenta', 'Niebla', 'TAF'][i]}</button>)}</div>
      <table className="table w-table">
        <tbody>{rows.map(([k, v], i) => <tr key={i} className={v === 'Grupo no reconocido' ? 'weak' : ''}><td className="mono">{k}</td><td>{v}</td></tr>)}</tbody>
      </table>
    </Widget>
  )
}
