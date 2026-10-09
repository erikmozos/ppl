// Calculadoras del temario: VMC, altimetría, viento, componentes, masa y centrado, viraje, 1 en 60, tiempo, TAS y combustible
import { useState } from 'react'
import { Arrow, Num, Out, Seg, Slider, Widget, deg, fmt, norm360, p3, rad } from './ui'

/* ───── Mínimos VMC (SERA.5001, tabla S5-1) ───── */
type Band = 'alto' | 'medio' | 'bajo'
export function VmcCalc() {
  const [cls, setCls] = useState('D')
  const [band, setBand] = useState<Band>('bajo')
  const [night, setNight] = useState<'dia' | 'noche'>('dia')
  const low = band === 'bajo' && (cls === 'F' || cls === 'G')
  const vis = band === 'alto' ? '8 km' : '5 km'
  const clouds = low ? 'Libre de nubes y con la superficie a la vista' : '1500 m en horizontal y 1000 ft (300 m) en vertical'
  const notes: string[] = []
  if (cls === 'A') notes.push('En clase A no se permite el vuelo VFR: los valores son solo de referencia.')
  if (low && night === 'dia') notes.push('SERA permite a la autoridad reducir la visibilidad a 1500 m a 140 kt IAS o menos en F y G; consulta el AIP GEN 1.7 para su aplicación en España.')
  if (night === 'noche') notes.push('VFR nocturno (SERA.5005(c)): techo de al menos 1500 ft, sin las reducciones de visibilidad, superficie a la vista por debajo de 3000 ft AMSL o 1000 ft sobre el terreno en B a G, y comunicación bilateral con el ATS cuando haya canal.')
  if (['C', 'D', 'E', 'F', 'G'].includes(cls) && band !== 'alto') notes.push('Por debajo de FL100, el VFR está limitado a 250 kt IAS en C a G.')
  if (['B', 'C', 'D'].includes(cls)) notes.push('Necesitas autorización del ATC y comunicación bilateral.')
  return (
    <Widget title="Mínimos VMC" note="Para entrar o salir de una CTR, o despegar en ella, hacen falta además techo de 1500 ft y visibilidad en tierra de 5 km (SERA.5005(b)); si no, VFR especial: en España solo de día, 1500 m y 140 kt.">
      <div className="w-grid">
        <Seg label="Clase de espacio aéreo" value={cls} onChange={setCls} options={['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => [c, c])} />
        <Seg label="Altitud" value={band} onChange={setBand} options={[['alto', 'FL100 o más'], ['medio', 'Bajo FL100, sobre 3000 ft AMSL / 1000 ft AGL'], ['bajo', 'A 3000 ft AMSL / 1000 ft AGL o menos']]} />
        <Seg label="Periodo" value={night} onChange={setNight} options={[['dia', 'Día'], ['noche', 'Noche']]} />
      </div>
      <div className="w-results">
        <Out k="Visibilidad de vuelo" v={vis} strong />
        <Out k="Distancia a nubes" v={clouds} strong />
      </div>
      {notes.length > 0 && <ul className="widget-list">{notes.map(n => <li key={n}>{n}</li>)}</ul>}
    </Widget>
  )
}

/* ───── Altimetría ───── */
export function AltimetryCalc() {
  const [elev, setElev] = useState(1500)
  const [qnh, setQnh] = useState(1003)
  const [oat, setOat] = useState(25)
  const [ind, setInd] = useState(4500)
  const pa = elev + (1013 - qnh) * 27
  const isa = 15 - (2 * pa) / 1000
  const dev = oat - isa
  const da = pa + 120 * dev
  const qfe = qnh - elev / 27
  const devInd = oat + (2 * elev) / 1000 - 15 // desviación ISA aproximada en la columna
  const tru = ind + ((ind - elev) * 4 * devInd) / 1000
  return (
    <Widget title="Altimetría" note="27 ft por hPa cerca del suelo; 120 ft de altitud de densidad por cada °C de desviación ISA; corrección de temperatura ≈ 4 % de la altura sobre la estación por cada 10 °C. «De alto a bajo, cuidado abajo».">
      <div className="w-grid">
        <Num label="Elevación del aeródromo" value={elev} onChange={setElev} step={50} unit="ft" />
        <Num label="QNH" value={qnh} onChange={setQnh} unit="hPa" />
        <Num label="Temperatura exterior" value={oat} onChange={setOat} unit="°C" />
        <Num label="Altitud indicada en vuelo (QNH)" value={ind} onChange={setInd} step={100} unit="ft" />
      </div>
      <div className="w-results">
        <Out k="QFE aproximado" v={`${fmt(qfe)} hPa`} />
        <Out k="En tierra con QNH marca" v={`${fmt(elev)} ft (elevación)`} />
        <Out k="En tierra con QFE marca" v="0 ft (altura)" />
        <Out k="En tierra con 1013 marca" v={`${fmt(pa)} ft (altitud de presión)`} strong />
        <Out k="Temperatura ISA a esa altitud" v={`${fmt(isa, 1)} °C (ISA ${dev >= 0 ? '+' : ''}${fmt(dev, 0)})`} />
        <Out k="Altitud de densidad" v={`${fmt(da)} ft`} strong />
        <Out k={`Altitud verdadera con ${fmt(ind)} ft indicados`} v={`≈ ${fmt(tru)} ft`} />
      </div>
    </Widget>
  )
}

/* ───── Triángulo de velocidades ───── */
export function windTriangle(tas: number, trk: number, wd: number, ws: number) {
  const a = rad(wd - trk)
  const s = (ws * Math.sin(a)) / tas
  if (Math.abs(s) > 1) return null
  const wca = deg(Math.asin(s))
  return { wca, hdg: norm360(trk + wca), gs: tas * Math.cos(rad(wca)) - ws * Math.cos(a) }
}
export function WindCalc() {
  const [tas, setTas] = useState(105)
  const [trk, setTrk] = useState(70)
  const [wd, setWd] = useState(130)
  const [ws, setWs] = useState(20)
  const [vari, setVari] = useState(1)
  const r = windTriangle(tas, trk, wd, ws)
  // dibujo: vector viento desde el origen, rumbo (TAS) y derrota (GS)
  const S = 1.2, cx = 70, cy = 190
  const vx = (b: number, m: number) => Math.sin(rad(b)) * m * S, vy = (b: number, m: number) => -Math.cos(rad(b)) * m * S
  return (
    <Widget title="Triángulo de velocidades" note="El viento se da «de dónde viene». El rumbo se corrige hacia el lado del viento. Variación oeste se suma y este se resta para pasar de verdadero a magnético.">
      <div className="w-split">
        <div className="w-grid">
          <Num label="TAS" value={tas} onChange={setTas} unit="kt" />
          <Num label="Derrota verdadera" value={trk} onChange={setTrk} unit="°" />
          <Num label="Viento de" value={wd} onChange={setWd} unit="°" />
          <Num label="Velocidad del viento" value={ws} onChange={setWs} unit="kt" />
          <Num label="Variación (oeste +, este −)" value={vari} onChange={setVari} unit="°" />
        </div>
        {r ? (() => {
          // coordenadas en nudos (x hacia el este, y hacia el sur) y caja ajustada a los tres vectores
          const H = [Math.sin(rad(r.hdg)) * tas, -Math.cos(rad(r.hdg)) * tas], G = [Math.sin(rad(trk)) * r.gs, -Math.cos(rad(trk)) * r.gs]
          const xs = [0, H[0], G[0]], ys = [0, H[1], G[1]]
          const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 60)
          const pad = size * 0.12, head = size * 0.05
          const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad]
          return (
            <div>
              <svg className="fig w-svg" viewBox={vb.join(' ')} role="img" aria-label="Triángulo de velocidades">
                <title>Triángulo de velocidades</title>
                <line x1={0} y1={0} x2={0} y2={-size * 0.35} className="ln2 dash" style={{ strokeWidth: size / 240 }} />
                <Arrow x1={0} y1={0} x2={H[0]} y2={H[1]} cls="ln" head={head} sw={size / 110} />
                <Arrow x1={H[0]} y1={H[1]} x2={G[0]} y2={G[1]} cls="wa-ln" head={head} sw={size / 110} />
                <Arrow x1={0} y1={0} x2={G[0]} y2={G[1]} cls="ac-ln" head={head} sw={size / 110} />
              </svg>
              <p className="w-legend small"><span className="lg ink" />rumbo y TAS <span className="lg wa" />viento <span className="lg ac" />derrota y GS <span className="muted">· discontinua: norte verdadero</span></p>
            </div>
          )
        })() : <p className="muted">El viento cruzado es mayor que la TAS: no hay solución.</p>}
      </div>
      {r && (
        <div className="w-results">
          <Out k="Corrección de deriva" v={`${fmt(Math.abs(r.wca), 0)}° a la ${r.wca >= 0 ? 'derecha' : 'izquierda'}`} />
          <Out k="Rumbo verdadero" v={`${p3(r.hdg)}°`} strong />
          <Out k="Rumbo magnético" v={`${p3(r.hdg + vari)}°`} strong />
          <Out k="Velocidad sobre el suelo" v={`${fmt(r.gs)} kt`} strong />
          <Out k="Deriva máxima posible (viento × 60 / TAS)" v={`${fmt((ws * 60) / tas, 0)}°`} />
        </div>
      )}
    </Widget>
  )
}

/* ───── Componentes de viento ───── */
export function CrosswindCalc() {
  const [rwy, setRwy] = useState(24)
  const [wd, setWd] = useState(280)
  const [ws, setWs] = useState(15)
  const [gust, setGust] = useState(0)
  const ang = ((wd - rwy * 10 + 540) % 360) - 180
  const v = Math.max(ws, gust)
  const xw = v * Math.sin(rad(ang)), hw = v * Math.cos(rad(ang))
  return (
    <Widget title="Viento cruzado y de cara" note="Cruzado = V × sen α; de cara = V × cos α. Atajo: 30° → ½, 45° → 0,7, 60° → 0,9 del viento como cruzado. Con racha, calcula con la racha.">
      <div className="w-split">
        <div className="w-grid">
          <Num label="Pista" value={rwy} onChange={v => setRwy(Math.min(36, Math.max(1, Math.round(v))))} />
          <Num label="Viento de" value={wd} onChange={setWd} unit="°" />
          <Num label="Velocidad" value={ws} onChange={setWs} unit="kt" />
          <Num label="Racha (0 si no hay)" value={gust} onChange={setGust} unit="kt" />
        </div>
        <svg className="fig w-svg" viewBox="0 0 200 200" role="img" aria-label="Pista y viento">
          <title>Pista y dirección del viento</title>
          <g transform={`rotate(${rwy * 10} 100 100)`}>
            <rect x="88" y="20" width="24" height="160" className="soft" />
            <line x1="100" y1="30" x2="100" y2="170" className="ln2 dash" />
            <text x="100" y="172" className="tx2" textAnchor="middle" fontSize="11">{String(rwy).padStart(2, '0')}</text>
          </g>
          <g transform={`rotate(${wd} 100 100)`}><Arrow x1={100} y1={4} x2={100} y2={60} cls="wa-ln" /></g>
        </svg>
      </div>
      <div className="w-results">
        <Out k="Ángulo viento-pista" v={`${fmt(Math.abs(ang))}°`} />
        <Out k="Viento cruzado" v={`${fmt(Math.abs(xw))} kt desde la ${xw >= 0 ? 'derecha' : 'izquierda'}`} strong />
        <Out k={hw >= 0 ? 'Viento de cara' : 'Viento de cola'} v={`${fmt(Math.abs(hw))} kt`} strong />
      </div>
    </Widget>
  )
}

/* ───── Masa y centrado (PA-28-161 de ejemplo) ───── */
const ENV = { fwdLight: 2.108, fwdHeavy: 2.21, aft: 2.362, kink: 885, mtom: 1107, min: 640 }
const ARM = { front: 2.045, rear: 3.0, bag: 3.627, fuel: 2.413 }
const fwdLimit = (m: number) => (m <= ENV.kink ? ENV.fwdLight : ENV.fwdLight + ((m - ENV.kink) * (ENV.fwdHeavy - ENV.fwdLight)) / (ENV.mtom - ENV.kink))
export function CgCalc() {
  const [em, setEm] = useState(690)
  const [ea, setEa] = useState(2.18)
  const [front, setFront] = useState(160)
  const [rear, setRear] = useState(0)
  const [bag, setBag] = useState(20)
  const [fuel, setFuel] = useState(150)
  const [burn, setBurn] = useState(60)
  const rows: [string, number, number][] = [['Masa en vacío básica', em, ea], ['Asientos delanteros', front, ARM.front], ['Asientos traseros', rear, ARM.rear], ['Equipaje', bag, ARM.bag], [`Combustible (${fmt(fuel)} l)`, fuel * 0.72, ARM.fuel]]
  const m = rows.reduce((a, r) => a + r[1], 0), mo = rows.reduce((a, r) => a + r[1] * r[2], 0)
  const cg = mo / m
  const ml = m - burn * 0.72, cgl = (mo - burn * 0.72 * ARM.fuel) / ml
  const inEnv = (mm: number, c: number) => mm <= ENV.mtom && c >= fwdLimit(mm) - 1e-9 && c <= ENV.aft
  const okTo = inEnv(m, cg), okLd = inEnv(ml, cgl)
  // gráfico de la envolvente
  const X = (c: number) => 40 + ((c - 2.05) / (2.4 - 2.05)) * 250, Y = (mm: number) => 190 - ((mm - 600) / (1150 - 600)) * 170
  const env = [[ENV.fwdLight, 600], [ENV.fwdLight, ENV.kink], [ENV.fwdHeavy, ENV.mtom], [ENV.aft, ENV.mtom], [ENV.aft, 600]]
  return (
    <Widget title="Masa y centrado · PA-28-161 de ejemplo" note="Datos aproximados de un PA-28-161 para practicar el método (MTOM 1107 kg, equipaje máx. 90 kg, 182 l utilizables). No los uses para tu avión: cada uno tiene su informe de pesada y su POH.">
      <div className="w-split">
        <div className="w-grid">
          <Num label="Masa en vacío básica" value={em} onChange={setEm} unit="kg" />
          <Num label="Su brazo" value={ea} onChange={setEa} step={0.01} unit="m" />
          <Num label="Asientos delanteros" value={front} onChange={setFront} unit="kg" />
          <Num label="Asientos traseros" value={rear} onChange={setRear} unit="kg" />
          <Num label="Equipaje" value={bag} onChange={setBag} unit="kg" />
          <Num label="Combustible al despegue" value={fuel} onChange={v => setFuel(Math.min(182, v))} unit="l" />
          <Num label="Combustible consumido" value={burn} onChange={v => setBurn(Math.min(fuel, v))} unit="l" />
        </div>
        <svg className="fig w-svg" viewBox="0 0 300 220" role="img" aria-label="Envolvente de centrado">
          <title>Envolvente de centrado con los puntos de despegue y aterrizaje</title>
          <polygon points={env.map(([c, mm]) => `${X(c)},${Y(mm)}`).join(' ')} className="ok" />
          <line x1="40" y1="190" x2="290" y2="190" className="ln2" /><line x1="40" y1="20" x2="40" y2="190" className="ln2" />
          {[2.1, 2.2, 2.3, 2.4].map(c => <text key={c} x={X(c)} y="204" className="tx2" textAnchor="middle" fontSize="10">{fmt(c, 1)}</text>)}
          {[700, 900, 1100].map(mm => <text key={mm} x="36" y={Y(mm) + 3} className="tx2" textAnchor="end" fontSize="10">{mm}</text>)}
          <text x="165" y="216" className="tx2" textAnchor="middle" fontSize="10">CG (m desde el datum)</text>
          <line x1={X(cg)} y1={Y(m)} x2={X(cgl)} y2={Y(ml)} className="ln2 dash" />
          <circle cx={X(cg)} cy={Y(m)} r="5" className={okTo ? 'ac-fill' : 'wa-fill'} />
          <circle cx={X(cgl)} cy={Y(ml)} r="4" className="bg-fill" /><circle cx={X(cgl)} cy={Y(ml)} r="4" className={okLd ? 'ac-ln' : 'wa-ln'} />
          <text x={X(cg) + 8} y={Y(m) - 6} className="tx" fontSize="11">despegue</text>
          <text x={X(cgl) + 8} y={Y(ml) + 12} className="tx2" fontSize="11">aterrizaje</text>
        </svg>
      </div>
      <div className="table-wrap">
        <table className="table w-table">
          <thead><tr><th>Partida</th><th>Masa (kg)</th><th>Brazo (m)</th><th>Momento (kg·m)</th></tr></thead>
          <tbody>
            {rows.map(([k, mm, a]) => <tr key={k}><td>{k}</td><td>{fmt(mm, 1)}</td><td>{fmt(a, 3)}</td><td>{fmt(mm * a, 1)}</td></tr>)}
            <tr className="total"><td>Total al despegue</td><td>{fmt(m, 1)}</td><td>{fmt(cg, 3)}</td><td>{fmt(mo, 1)}</td></tr>
          </tbody>
        </table>
      </div>
      <div className="w-results">
        <Out k="CG al despegue" v={`${fmt(cg, 3)} m · ${okTo ? 'dentro' : 'FUERA'} de la envolvente`} strong />
        <Out k="CG al aterrizaje" v={`${fmt(cgl, 3)} m con ${fmt(ml, 0)} kg · ${okLd ? 'dentro' : 'FUERA'}`} strong />
        {m > ENV.mtom && <Out k="Masa" v={`Supera la MTOM en ${fmt(m - ENV.mtom, 0)} kg`} />}
        {bag > 90 && <Out k="Equipaje" v="Supera los 90 kg del compartimento" />}
      </div>
    </Widget>
  )
}

/* ───── Viraje ───── */
export function TurnCalc() {
  const [bank, setBank] = useState(45)
  const [tas, setTas] = useState(100)
  const [vs, setVs] = useState(50)
  const n = 1 / Math.cos(rad(bank))
  const vT = tas * 0.514444
  const r = bank > 0 ? (vT * vT) / (9.81 * Math.tan(rad(bank))) : Infinity
  const rate = bank > 0 ? deg(vT / r) : 0
  return (
    <Widget title="Viraje nivelado" note="n = 1 / cos φ; Vs en viraje = Vs × √n; radio = V² / (g · tan φ). Régimen 1 = 3°/s (2 min por vuelta), con una inclinación ≈ TAS/10 + 7.">
      <div className="w-grid">
        <Slider label="Inclinación" value={bank} onChange={setBank} min={0} max={75} unit="°" />
        <Num label="TAS" value={tas} onChange={setTas} unit="kt" />
        <Num label="Vs en vuelo nivelado" value={vs} onChange={setVs} unit="kt" />
      </div>
      <div className="w-results">
        <Out k="Factor de carga" v={`${fmt(n, 2)} g`} strong />
        <Out k="Velocidad de pérdida en el viraje" v={`${fmt(vs * Math.sqrt(n), 0)} kt (+${fmt((Math.sqrt(n) - 1) * 100, 0)} %)`} strong />
        <Out k="Radio de viraje" v={Number.isFinite(r) ? `${fmt(r, 0)} m · ${fmt(r / 1852, 2)} NM` : '—'} />
        <Out k="Régimen de viraje" v={`${fmt(rate, 1)}°/s · vuelta completa en ${rate ? fmt(360 / rate, 0) : '—'} s`} />
        <Out k="Inclinación para régimen 1" v={`≈ ${fmt(tas / 10 + 7, 0)}°`} />
      </div>
    </Widget>
  )
}

/* ───── 1 en 60 ───── */
export function OneInSixty() {
  const [flown, setFlown] = useState(30)
  const [off, setOff] = useState(3)
  const [side, setSide] = useState<'der' | 'izq'>('der')
  const [rem, setRem] = useState(40)
  const [hdg, setHdg] = useState(90)
  const te = (off * 60) / flown, ca = (off * 60) / rem
  const corr = te + ca
  const newH = side === 'der' ? hdg - corr : hdg + corr
  return (
    <Widget title="Regla 1 en 60" note="1 NM de separación a 60 NM equivale a 1°. Error de derrota = desviación × 60 / distancia recorrida; ángulo de cierre = desviación × 60 / distancia que queda. La suma te lleva al destino; solo el error de derrota te deja paralelo.">
      <div className="w-grid">
        <Num label="Distancia recorrida" value={flown} onChange={setFlown} unit="NM" />
        <Num label="Desviación" value={off} onChange={setOff} unit="NM" step={0.5} />
        <Seg label="Estás a la" value={side} onChange={setSide} options={[['der', 'derecha'], ['izq', 'izquierda']]} />
        <Num label="Distancia que queda" value={rem} onChange={setRem} unit="NM" />
        <Num label="Rumbo actual" value={hdg} onChange={setHdg} unit="°" />
      </div>
      <div className="w-results">
        <Out k="Error de derrota" v={`${fmt(te, 0)}°`} />
        <Out k="Ángulo de cierre" v={`${fmt(ca, 0)}°`} />
        <Out k="Corrección total" v={`${fmt(corr, 0)}° a la ${side === 'der' ? 'izquierda' : 'derecha'}`} strong />
        <Out k="Nuevo rumbo al destino" v={`${p3(newH)}°`} strong />
        <Out k="Para volver a la derrota en el mismo tiempo" v={`${fmt(te * 2, 0)}° y, al llegar, corregir ${fmt(te, 0)}°`} />
      </div>
    </Widget>
  )
}

/* ───── Tiempo ───── */
function lastSunday(y: number, m: number) { const d = new Date(Date.UTC(y, m + 1, 0)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d }
export function TimeCalc() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [utc, setUtc] = useState('12:00')
  const [lon, setLon] = useState(-3.7)
  const d = new Date(date + 'T00:00:00Z')
  const y = d.getUTCFullYear()
  const summer = d >= lastSunday(y, 2) && d < lastSunday(y, 9)
  const [h, mi] = utc.split(':').map(Number)
  const base = (h || 0) * 60 + (mi || 0)
  const hm = (m: number) => { const x = ((Math.round(m) % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}` }
  const lmtOff = lon * 4
  return (
    <Widget title="UTC, hora media local y hora oficial" note="15° de longitud = 1 h y 1° = 4 min; al este se suma, al oeste se resta. En aviación se usa siempre UTC. Horario de verano: del último domingo de marzo al último domingo de octubre.">
      <div className="w-grid">
        <label className="w-field"><span>Fecha</span><input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <label className="w-field"><span>Hora UTC</span><input className="input" type="time" value={utc} onChange={e => setUtc(e.target.value)} /></label>
        <Num label="Longitud (este +, oeste −)" value={lon} onChange={setLon} step={0.1} unit="°" />
      </div>
      <div className="w-results">
        <Out k="Península y Baleares" v={`${hm(base + (summer ? 120 : 60))} (UTC+${summer ? 2 : 1})`} strong />
        <Out k="Canarias" v={`${hm(base + (summer ? 60 : 0))} (UTC+${summer ? 1 : 0})`} strong />
        <Out k="Hora media local en esa longitud" v={`${hm(base + lmtOff)} (UTC ${lmtOff >= 0 ? '+' : '−'} ${fmt(Math.abs(lmtOff), 1)} min)`} />
        <Out k="Periodo" v={summer ? 'Horario de verano' : 'Horario de invierno'} />
      </div>
    </Widget>
  )
}

/* ───── TAS ───── */
export function TasCalc() {
  const [cas, setCas] = useState(110)
  const [pa, setPa] = useState(5000)
  const [oat, setOat] = useState(5)
  const T = oat + 273.15
  const sigma = Math.pow(1 - 6.8756e-6 * pa, 5.2559) / (T / 288.15)
  const tas = cas / Math.sqrt(sigma)
  const mach = (tas * 0.514444) / Math.sqrt(1.4 * 287.05 * T)
  return (
    <Widget title="De CAS a TAS" note="TAS = CAS / √σ (σ = densidad relativa). Regla rápida: TAS ≈ CAS + 2 % por cada 1000 ft. Con aire más caliente que la ISA, la TAS es aún mayor.">
      <div className="w-grid">
        <Num label="CAS (≈ IAS corregida)" value={cas} onChange={setCas} unit="kt" />
        <Num label="Altitud de presión" value={pa} onChange={setPa} step={500} unit="ft" />
        <Num label="Temperatura exterior" value={oat} onChange={setOat} unit="°C" />
      </div>
      <div className="w-results">
        <Out k="Densidad relativa σ" v={fmt(sigma, 3)} />
        <Out k="TAS" v={`${fmt(tas)} kt`} strong />
        <Out k="Regla del 2 %" v={`${fmt(cas * (1 + (0.02 * pa) / 1000))} kt`} />
        <Out k="Número de Mach" v={fmt(mach, 2)} />
      </div>
    </Widget>
  )
}

/* ───── Velocidad, tiempo, distancia y combustible ───── */
export function FuelCalc() {
  const [gs, setGs] = useState(100)
  const [d, setD] = useState(85)
  const [ff, setFf] = useState(32)
  const [onboard, setOnboard] = useState(150)
  const h = d / gs
  const min = h * 60
  const l = h * ff
  return (
    <Widget title="Tiempo, distancia y combustible" note="Tiempo = distancia / GS; combustible = tiempo × consumo. AVGAS 100LL ≈ 0,72 kg/l; 1 galón US = 3,785 l. Los minutos no son decimales de hora: 0,75 h = 45 min.">
      <div className="w-grid">
        <Num label="Velocidad sobre el suelo" value={gs} onChange={setGs} unit="kt" />
        <Num label="Distancia" value={d} onChange={setD} unit="NM" />
        <Num label="Consumo" value={ff} onChange={setFf} unit="l/h" />
        <Num label="Combustible a bordo" value={onboard} onChange={setOnboard} unit="l" />
      </div>
      <div className="w-results">
        <Out k="Tiempo" v={`${Math.floor(min / 60)} h ${fmt(min % 60, 0)} min (${fmt(h, 2)} h)`} strong />
        <Out k="Combustible del tramo" v={`${fmt(l, 1)} l · ${fmt(l * 0.72, 1)} kg · ${fmt(l / 3.785, 1)} USG`} strong />
        <Out k="Autonomía con lo que llevas" v={`${Math.floor(onboard / ff)} h ${fmt(((onboard / ff) % 1) * 60, 0)} min`} />
        <Out k="Alcance en aire en calma a esa GS" v={`${fmt((onboard / ff) * gs, 0)} NM (sin reservas)`} />
      </div>
    </Widget>
  )
}
