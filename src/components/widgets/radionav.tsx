// Simuladores de VOR (CDI con OBS y TO/FROM) y ADF (RBI y RMI)
import { useState } from 'react'
import { Arrow, Out, Slider, Widget, norm360, p3, rad } from './ui'

const sd = (a: number) => ((a + 540) % 360) - 180 // diferencia con signo en (−180, 180]

export function VorSim() {
  const [radial, setRadial] = useState(70)
  const [obs, setObs] = useState(90)
  const [hdg, setHdg] = useState(90)
  const from = Math.abs(sd(radial - obs)) < 90
  const dev = from ? sd(obs - radial) : sd(radial + 180 - obs)
  const dots = Math.max(-5, Math.min(5, dev / 2))
  const abeam = Math.abs(Math.abs(sd(radial - obs)) - 90) < 2
  const px = 150 + Math.sin(rad(radial)) * 95, py = 150 - Math.cos(rad(radial)) * 95
  return (
    <Widget title="VOR: OBS, CDI y TO/FROM" note="El VOR no depende del rumbo del avión: la indicación solo cambia con tu posición (radial) y con el OBS. Con el rumbo parecido al curso seleccionado, la aguja indica hacia dónde está el curso. Cada punto son 2°; a fondo de escala, 10° o más.">
      <div className="w-split">
        <div className="w-grid">
          <Slider label="Tu radial (posición desde la estación)" value={radial} onChange={setRadial} min={0} max={359} unit="°" />
          <Slider label="OBS (curso seleccionado)" value={obs} onChange={setObs} min={0} max={359} unit="°" />
          <Slider label="Rumbo del avión (no afecta al VOR)" value={hdg} onChange={setHdg} min={0} max={359} unit="°" />
        </div>
        <div className="w-pair">
          <svg className="fig w-svg" viewBox="0 0 300 300" role="img" aria-label="Posición respecto a la estación VOR">
            <title>Posición del avión y curso seleccionado</title>
            <circle cx="150" cy="150" r="120" className="ln2" />
            <line x1={150 - Math.sin(rad(obs)) * 140} y1={150 + Math.cos(rad(obs)) * 140} x2={150 + Math.sin(rad(obs)) * 140} y2={150 - Math.cos(rad(obs)) * 140} className="ac-ln dash" />
            <text x={150 + Math.sin(rad(obs)) * 128} y={150 - Math.cos(rad(obs)) * 128} className="txa" fontSize="11" textAnchor="middle">{p3(obs)}</text>
            <polygon points="150,140 159,155 141,155" className="ink-fill" />
            <text x="150" y="172" className="tx2" textAnchor="middle" fontSize="11">VOR</text>
            <line x1="150" y1="150" x2={px} y2={py} className="ln2" />
            <g transform={`translate(${px} ${py}) rotate(${hdg})`}><path d="M0 -12 L3 -2 L12 2 L12 5 L3 3 L2 10 L6 13 L6 15 L0 13 L-6 15 L-6 13 L-2 10 L-3 3 L-12 5 L-12 2 L-3 -2 Z" className="wa-fill" /></g>
            <text x="150" y="20" className="tx2" textAnchor="middle" fontSize="11">N</text>
          </svg>
          <svg className="fig w-svg" viewBox="0 0 200 200" role="img" aria-label="Indicador CDI">
            <title>CDI con OBS, aguja y bandera TO/FROM</title>
            <circle cx="100" cy="100" r="92" className="soft" />
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(k => <circle key={k} cx={100 + k * 14} cy="100" r="3" className="ln2" />)}
            <circle cx="100" cy="100" r="6" className="ln" />
            <line x1={100 + dots * 14} y1="36" x2={100 + dots * 14} y2="164" className="wa-ln thick" />
            <text x="100" y="30" className="tx b" textAnchor="middle">{p3(obs)}</text>
            <text x="150" y="80" className={abeam ? 'txw b' : 'txa b'} textAnchor="middle">{abeam ? 'OFF' : from ? 'FROM' : 'TO'}</text>
          </svg>
        </div>
      </div>
      <div className="w-results">
        <Out k="Bandera" v={abeam ? 'Zona de ambigüedad (a 90° del curso)' : from ? 'FROM: el curso seleccionado se aleja de la estación' : 'TO: el curso seleccionado lleva hacia la estación'} strong />
        <Out k="Aguja" v={Math.abs(dev) < 1 ? 'Centrada: estás sobre el curso' : `${Math.abs(dev) >= 10 ? 'A fondo' : `${Math.abs(dots).toFixed(1)} puntos`} a la ${dev > 0 ? 'derecha' : 'izquierda'}: el curso está a la ${dev > 0 ? 'derecha' : 'izquierda'}`} strong />
        <Out k="QDR (radial)" v={`${p3(radial)}°`} />
        <Out k="QDM (rumbo a la estación sin viento)" v={`${p3(radial + 180)}°`} />
      </div>
    </Widget>
  )
}

function Dial({ card, needle, label }: { card: number; needle: number; label: string }) {
  return (
    <svg className="fig w-svg" viewBox="0 0 200 200" role="img" aria-label={label}>
      <title>{label}</title>
      <circle cx="100" cy="100" r="92" className="soft" />
      <g transform={`rotate(${-card} 100 100)`}>
        {Array.from({ length: 36 }, (_, k) => <line key={k} x1="100" y1="10" x2="100" y2={k % 3 ? 16 : 22} className="ln2" transform={`rotate(${k * 10} 100 100)`} />)}
        {['N', '3', '6', 'E', '12', '15', 'S', '21', '24', 'W', '30', '33'].map((t, k) => <text key={t} x="100" y="36" className="tx2" fontSize="11" textAnchor="middle" transform={`rotate(${k * 30} 100 100)`}>{t}</text>)}
      </g>
      <polygon points="100,4 95,12 105,12" className="ink-fill" />
      <g transform={`rotate(${needle} 100 100)`}><Arrow x1={100} y1={170} x2={100} y2={34} cls="ac-ln" head={10} /></g>
      <path d="M100 88 L104 100 L114 103 L104 105 L102 114 L98 114 L96 105 L86 103 L96 100 Z" className="ink-fill" />
    </svg>
  )
}

export function AdfSim() {
  const [hdg, setHdg] = useState(270)
  const [rb, setRb] = useState(90)
  const qdm = norm360(hdg + rb)
  return (
    <Widget title="ADF: RBI y RMI" note="QDM = rumbo magnético + marcación relativa (restando 360 si pasa). QDR = QDM ± 180. En el RBI la rosa está fija (morro arriba = 0); en el RMI la rosa gira con el rumbo y la aguja señala directamente el QDM.">
      <div className="w-split">
        <div className="w-grid">
          <Slider label="Rumbo magnético" value={hdg} onChange={setHdg} min={0} max={359} unit="°" />
          <Slider label="Marcación relativa (aguja del RBI)" value={rb} onChange={setRb} min={0} max={359} unit="°" />
        </div>
        <div className="w-pair">
          <div><Dial card={0} needle={rb} label="RBI: rosa fija" /><p className="small muted center">RBI · rosa fija</p></div>
          <div><Dial card={hdg} needle={rb} label="RMI: rosa con el rumbo" /><p className="small muted center">RMI · rosa móvil</p></div>
        </div>
      </div>
      <div className="w-results">
        <Out k="QDM (rumbo magnético a la estación)" v={`${p3(qdm)}°`} strong />
        <Out k="QDR (marcación magnética desde la estación)" v={`${p3(qdm + 180)}°`} strong />
        <Out k="La estación está" v={rb === 0 ? 'justo delante' : rb === 180 ? 'justo detrás' : `${rb < 180 ? 'a la derecha' : 'a la izquierda'}${rb > 90 && rb < 270 ? ', por detrás del través' : ''}`} />
      </div>
    </Widget>
  )
}
