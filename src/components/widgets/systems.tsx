// Modelos interactivos de Conocimiento general de la aeronave: turbofán, ciclo de 4 tiempos, tabs y ley de Ohm
import { useEffect, useMemo, useState } from 'react'
import { Arrow, Num, Out, Seg, Widget, fmt } from './ui'

/* ───── Partes del turbofán (imagen de Wikimedia Commons) ───── */
const TF: [string, string, string][] = [
  ['1', 'Góndola (nacelle)', 'El carenado exterior. Guía el aire hacia el fan y envuelve todo el motor, como la carcasa de un secador de pelo.'],
  ['2', 'Fan', 'El gran ventilador delantero. Mueve muchísimo aire: la mayor parte rodea el núcleo (flujo secundario) y produce casi todo el empuje en un turbofán moderno.'],
  ['3', 'Compresor de baja presión', 'Primeras etapas de compresión del aire que entra en el núcleo. Gira en el mismo eje que el fan y la turbina de baja.'],
  ['4', 'Compresor de alta presión', 'Sigue apretando el aire hasta muchas veces la presión exterior. Va en el eje de alta, que gira más rápido.'],
  ['5', 'Cámara de combustión', 'Aquí se inyecta el combustible y arde de forma continua, no a golpes como en un motor de pistón.'],
  ['6', 'Turbina de alta presión', 'Los gases calientes la hacen girar; con esa energía mueve el compresor de alta.'],
  ['7', 'Turbina de baja presión', 'Aprovecha lo que queda de energía para mover el compresor de baja y el fan.'],
  ['8', 'Tobera del núcleo', 'Salida de los gases calientes del núcleo (flujo primario).'],
  ['9', 'Tobera del fan', 'Salida del aire frío que ha rodeado el núcleo (flujo secundario o de derivación).'],
  ['A', 'Eje de baja presión (turquesa)', 'Une fan, compresor de baja y turbina de baja.'],
  ['B', 'Eje de alta presión (amarillo)', 'Une compresor de alta y turbina de alta.'],
  ['C', 'Partes fijas (verde)', 'Góndola y carcasas: no giran.'],
]
export function TurbofanSim() {
  const [mode, setMode] = useState<'ver' | 'test'>('ver')
  const [sel, setSel] = useState('2')
  const [q, setQ] = useState(() => Math.floor(Math.random() * 9))
  const [ans, setAns] = useState<string | null>(null)
  const [score, setScore] = useState<[number, number]>([0, 0])
  const cur = TF.find(x => x[0] === sel)!
  const next = () => { setAns(null); setQ(x => (x + 1 + Math.floor(Math.random() * 8)) % 9) }
  return (
    <Widget title="Partes de un turbofán" note={<>Imagen: «Turbofan3 Labelled» de Zephyris (Richard Wheeler), Wikimedia Commons, CC BY-SA 3.0 / GFDL. En un PPL no vuelas reactores, pero el esquema ayuda a ver la diferencia con el motor de pistón: aquí todo gira y la combustión es continua.</>}>
      <Seg value={mode} onChange={m => { setMode(m); setAns(null) }} options={[['ver', 'Explorar'], ['test', 'Pruébate']]} />
      <img src="/photos/turbofan.gif" alt="Corte de un motor turbofán con sus partes numeradas del 1 al 9" className="tf-img" />
      {mode === 'ver' ? (
        <>
          <div className="seg-row wrap">{TF.map(([k]) => <button key={k} className={sel === k ? 'on' : ''} onClick={() => setSel(k)}>{k}</button>)}</div>
          <div className="w-results"><Out k={`${cur[0]} · ${cur[1]}`} v={cur[2]} strong /></div>
        </>
      ) : (
        <>
          <p><b>¿Qué número es: {TF[q][1].toLowerCase()}?</b> <span className="muted small">{score[0]}/{score[1]} aciertos</span></p>
          <div className="seg-row wrap">{TF.slice(0, 9).map(([k]) => (
            <button key={k} className={ans === null ? '' : k === TF[q][0] ? 'on' : k === ans ? 'bad' : ''} disabled={ans !== null}
              onClick={() => { setAns(k); setScore(([o, n]) => [o + (k === TF[q][0] ? 1 : 0), n + 1]) }}>{k}</button>
          ))}</div>
          {ans !== null && <p className="small">{ans === TF[q][0] ? 'Correcto. ' : `Era el ${TF[q][0]}. `}{TF[q][2]} <button className="link-btn" onClick={next}>Siguiente</button></p>}
        </>
      )}
    </Widget>
  )
}

/* ───── Ciclo de cuatro tiempos ───── */
const STROKES = [
  { n: 'Admisión', adm: true, esc: false, down: true, txt: 'El pistón baja del PMS al PMI con la válvula de admisión abierta: entra la mezcla de aire y combustible. Como una jeringa que aspira.' },
  { n: 'Compresión', adm: false, esc: false, down: false, txt: 'Válvulas cerradas, el pistón sube y aprieta la mezcla. Cuanto más se comprime, más energía saca luego la explosión.' },
  { n: 'Explosión (potencia)', adm: false, esc: false, down: true, txt: 'Las dos bujías saltan cerca del PMS, la mezcla arde y empuja el pistón hacia abajo. Es el único tiempo que da trabajo.' },
  { n: 'Escape', adm: false, esc: true, down: false, txt: 'Se abre la de escape y el pistón, al subir, expulsa los gases quemados. Y vuelta a empezar.' },
]
export function OttoSim() {
  const [k, setK] = useState(0)
  const [play, setPlay] = useState(false)
  const [p, setP] = useState(0) // progreso dentro del tiempo (0..1)
  useEffect(() => {
    if (!play) return
    const t = setInterval(() => setP(x => { if (x >= 1) { setK(s => (s + 1) % 4); return 0 } return x + 0.05 }), 60)
    return () => clearInterval(t)
  }, [play])
  const s = STROKES[k]
  const y = s.down ? 40 + p * 70 : 110 - p * 70 // posición del pistón
  const crank = k * 180 + p * 180
  return (
    <Widget title="Ciclo de cuatro tiempos (Otto)" note="Cuatro carreras del pistón = dos vueltas de cigüeñal (720°). Cada carrera es media vuelta. Solo el tiempo de explosión empuja; los otros tres los mueve la inercia del cigüeñal y de la hélice.">
      <div className="w-split">
        <svg className="fig w-svg" viewBox="0 0 220 220" role="img" aria-label={`Tiempo de ${s.n}`}>
          <title>Cilindro en el tiempo de {s.n.toLowerCase()}</title>
          <rect x="60" y="30" width="100" height="130" className="soft" />
          <line x1="85" y1="30" x2={s.adm ? 75 : 85} y2={s.adm ? 18 : 22} className={s.adm ? 'ok-ln thick' : 'ln thick'} />
          <line x1="135" y1="30" x2={s.esc ? 145 : 135} y2={s.esc ? 18 : 22} className={s.esc ? 'wa-ln thick' : 'ln thick'} />
          <text x="62" y="14" className="tx2" fontSize="10">admisión</text><text x="128" y="14" className="tx2" fontSize="10">escape</text>
          {k === 2 && p < 0.3 && <circle cx="110" cy="38" r="9" className="wa" />}
          <rect x="64" y={y} width="92" height="22" className="ac" />
          <line x1="110" y1={y + 22} x2={110 + 26 * Math.sin((crank * Math.PI) / 180)} y2={185 - 26 * Math.cos((crank * Math.PI) / 180)} className="ln thick" />
          <circle cx="110" cy="185" r="26" className="ln2 dash" />
          <text x="200" y="45" className="tx2" fontSize="10" textAnchor="end">PMS</text><text x="200" y="135" className="tx2" fontSize="10" textAnchor="end">PMI</text>
        </svg>
        <div>
          <Seg value={String(k)} onChange={v => { setK(+v); setP(0); setPlay(false) }} options={STROKES.map((x, i) => [String(i), `${i + 1}. ${x.n}`])} />
          <p className="small">{s.txt}</p>
          <p className="small muted">Cigüeñal: {Math.round(crank)}° de 720°</p>
          <button className="btn sm" onClick={() => setPlay(x => !x)}>{play ? 'Pausa' : 'Animar el ciclo'}</button>
        </div>
      </div>
    </Widget>
  )
}

/* ───── Tabs y compensación ───── */
type Tab = 'balance' | 'antibalance' | 'servo' | 'spring' | 'trim'
const TABS: Record<Tab, { name: string; dir: 1 | -1 | 0; drive: string; effort: string; eff: string; idea: string }> = {
  balance: { name: 'Balance tab', dir: -1, drive: 'El piloto mueve la superficie; el tab se mueve solo, en sentido contrario.', effort: 'Menos esfuerzo', eff: 'Algo menos de eficacia (reduce la curvatura)', idea: 'Como un ayudante que empuja la puerta desde el otro lado cuando tú tiras: cuesta menos, pero la puerta se abre algo menos.' },
  antibalance: { name: 'Anti-balance tab', dir: 1, drive: 'El piloto mueve la superficie; el tab va en el mismo sentido.', effort: 'Más esfuerzo', eff: 'Más eficacia (aumenta la curvatura)', idea: 'Le pones peso al mando a propósito para que no sea demasiado ligero y no te pases.' },
  servo: { name: 'Servo tab', dir: -1, drive: 'El piloto mueve solo el tab; el aire sobre el tab mueve la superficie en sentido contrario.', effort: 'Mucho menos esfuerzo', eff: 'Menos eficacia; a baja IAS casi no ayuda', idea: 'Como el timón pequeño que gira un barco enorme: tú mueves lo pequeño y el agua mueve lo grande.' },
  spring: { name: 'Spring tab', dir: -1, drive: 'Como el servo tab, pero un resorte une mando y superficie: a baja IAS mueves la superficie directamente.', effort: 'Menos esfuerzo a alta IAS', eff: 'Algo menos de eficacia; funciona también a baja IAS', idea: 'Un servo tab con red de seguridad: si el aire no empuja lo bastante, el muelle hace el trabajo.' },
  trim: { name: 'Trim tab', dir: -1, drive: 'El piloto lo ajusta con la rueda de trim y se queda fijo, desplazado al contrario que la superficie que quieres mantener.', effort: 'Esfuerzo cero en esa actitud', eff: 'No cambia la eficacia del mando', idea: 'Es como poner un taco bajo la puerta: ya no tienes que sujetarla.' },
}
export function TabsSim() {
  const [tab, setTab] = useState<Tab>('balance')
  const [def, setDef] = useState(15) // deflexión de la superficie (positivo = hacia abajo)
  const T = TABS[tab]
  const tabDef = T.dir * def * 1.4
  const surf = (deg: number, x0: number, len: number) => ({ x: x0 + len * Math.cos((deg * Math.PI) / 180), y: 90 + len * Math.sin((deg * Math.PI) / 180) })
  const e = surf(def, 240, 110), tb = { x: e.x + 40 * Math.cos(((def + tabDef) * Math.PI) / 180), y: e.y + 40 * Math.sin(((def + tabDef) * Math.PI) / 180) }
  return (
    <Widget title="Tipos de tab" note="Tabs = pequeñas superficies en el borde de salida de un mando. Reducen o aumentan el esfuerzo del piloto usando el propio aire. El momento de bisagra crece con el tamaño de la superficie y con el cuadrado de la velocidad.">
      <Seg value={tab} onChange={setTab} options={(Object.keys(TABS) as Tab[]).map(k => [k, TABS[k].name])} />
      <label className="w-field w-slider"><span>Deflexión de la superficie <b>{def > 0 ? `${def}° abajo` : def < 0 ? `${-def}° arriba` : 'neutra'}</b></span><input type="range" min={-25} max={25} value={def} onChange={e => setDef(+e.target.value)} /></label>
      <svg className="fig w-svg" viewBox="0 0 420 180" role="img" aria-label={`${T.name} con la superficie deflectada`}>
        <title>{T.name}: estabilizador, superficie de mando y tab</title>
        <path d="M40 90 Q60 75 120 78 L240 84 L240 96 L120 102 Q60 105 40 90 Z" className="soft" />
        <line x1="240" y1="90" x2={e.x} y2={e.y} className="ac-ln thick" />
        <line x1={e.x} y1={e.y} x2={tb.x} y2={tb.y} className="wa-ln thick" />
        <circle cx="240" cy="90" r="4" className="ink-fill" />
        <text x="80" y="125" className="tx2" fontSize="11">estabilizador</text>
        <text x={240 + 50} y={def > 0 ? 70 : 135} className="txa" fontSize="11">superficie</text>
        <text x={tb.x + 6} y={tb.y + (tabDef > 0 ? 16 : -6)} className="txw" fontSize="11">tab</text>
        <Arrow x1={10} y1={150} x2={60} y2={150} cls="ln2" />
        <text x="66" y="154" className="tx2" fontSize="10">aire</text>
      </svg>
      <div className="w-results">
        <Out k="Cómo se mueve" v={T.drive} />
        <Out k="Esfuerzo en el mando" v={T.effort} strong />
        <Out k="Eficacia del mando" v={T.eff} strong />
      </div>
      <div className="callout idea"><b>Para entenderlo.</b> {T.idea}</div>
    </Widget>
  )
}

/* ───── Ley de Ohm ───── */
export function OhmCalc() {
  const [v, setV] = useState(14)
  const [r1, setR1] = useState(2)
  const [r2, setR2] = useState(4)
  const [mode, setMode] = useState<'una' | 'serie' | 'paralelo'>('una')
  const r = useMemo(() => (mode === 'una' ? r1 : mode === 'serie' ? r1 + r2 : (r1 * r2) / (r1 + r2)), [mode, r1, r2])
  const i = v / r
  return (
    <Widget title="Ley de Ohm: V = I × R" note="Piensa en una manguera: la tensión (V) es la presión del agua, la corriente (I) es cuánta agua pasa y la resistencia (R) es lo estrecha que es la manguera. En serie las resistencias se suman (más estrechamientos seguidos); en paralelo la total baja (abres más mangueras). La potencia es P = V × I.">
      <Seg value={mode} onChange={setMode} options={[['una', 'Una resistencia'], ['serie', 'Dos en serie'], ['paralelo', 'Dos en paralelo']]} />
      <div className="w-grid">
        <Num label="Tensión" value={v} onChange={setV} unit="V" />
        <Num label="R1" value={r1} onChange={x => setR1(Math.max(0.1, x))} step={0.5} unit="Ω" />
        {mode !== 'una' && <Num label="R2" value={r2} onChange={x => setR2(Math.max(0.1, x))} step={0.5} unit="Ω" />}
      </div>
      <div className="w-results">
        <Out k="Resistencia total" v={`${fmt(r, 2)} Ω`} />
        <Out k="Corriente total" v={`${fmt(i, 2)} A`} strong />
        <Out k="Potencia total" v={`${fmt(v * i, 1)} W`} strong />
        {mode === 'serie' && <Out k="Tensión en R1 / R2" v={`${fmt(i * r1, 2)} V / ${fmt(i * r2, 2)} V (misma corriente)`} />}
        {mode === 'paralelo' && <Out k="Corriente en R1 / R2" v={`${fmt(v / r1, 2)} A / ${fmt(v / r2, 2)} A (misma tensión)`} />}
      </div>
    </Widget>
  )
}
