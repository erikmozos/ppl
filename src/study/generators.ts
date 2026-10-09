// Generadores de preguntas de cálculo: valores nuevos en cada intento y distractores sacados de los errores típicos.
import type { BankQuestion } from '../data/licenses/types'

type Gen = () => BankQuestion
const rnd = (a: number, b: number, step = 1) => a + Math.floor(Math.random() * (Math.floor((b - a) / step) + 1)) * step
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]
const rad = (d: number) => (d * Math.PI) / 180
const norm = (d: number) => ((Math.round(d) % 360) + 360) % 360
const p3 = (d: number) => String(norm(d) === 0 ? 360 : norm(d)).padStart(3, '0')
const fmt = (n: number, dec = 0) => n.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec })
const uid = () => Math.random().toString(36).slice(2, 8)

/** cambia el primer número de la respuesta para fabricar un distractor cercano si dos errores dan el mismo valor */
function perturb(s: string, k: number) {
  return s.replace(/-?\d+(?:,\d+)?/, m => {
    const dec = (m.split(',')[1] ?? '').length
    const v = parseFloat(m.replace(',', '.'))
    const step = dec ? 15 * Math.pow(10, -dec) : Math.max(10, Math.round(Math.abs(v) * 0.08 / 10) * 10)
    return fmt(v + k * step, dec)
  })
}

/** Monta la pregunta barajando la correcta entre los distractores y garantizando 4 opciones distintas */
function make(block: string, kind: string, q: string, right: string, wrong: [string, string][], why: string, ref: string, level: 1 | 2 | 3 = 2, data?: string): BankQuestion {
  const seen = new Set([right])
  const ws = wrong.filter(([o]) => !seen.has(o) && (seen.add(o), true)).slice(0, 3)
  for (let k = 1; ws.length < 3 && k < 20; k++) {
    const o = perturb(right, k % 2 ? Math.ceil(k / 2) : -k / 2)
    if (!seen.has(o)) { seen.add(o); ws.push([o, 'Valor que no sale del cálculo correcto: repasa el procedimiento paso a paso.']) }
  }
  const at = Math.floor(Math.random() * 4)
  const options = ws.map(w => w[0]); options.splice(at, 0, right)
  const whyNot: (string | null)[] = ws.map(w => w[1]); whyNot.splice(at, 0, null)
  return { id: `g-${block}-${kind}-${uid()}`, type: 'calculo', level, q, data, options, correct: at, why, whyNot, ref }
}

const cg: Gen = () => {
  const em = rnd(640, 700, 5), ea = rnd(205, 215) / 100
  const front = rnd(140, 175, 5), rear = pick([0, 0, 70, 80]), bag = pick([0, 10, 20, 30])
  const litres = rnd(80, 180, 10), fuel = litres * 0.72
  const A = { front: 2.05, rear: 3.0, bag: 3.6, fuel: 2.4 }
  const items = [[em, ea], [front, A.front], [rear, A.rear], [bag, A.bag], [fuel, A.fuel]]
  const cgOf = (xs: number[][]) => xs.reduce((s, [m, a]) => s + m * a, 0) / xs.reduce((s, [m]) => s + m, 0)
  const ok = cgOf(items)
  const asKg = cgOf(items.map((x, i) => (i === 4 ? [litres, A.fuel] : x)))
  const noFuel = cgOf(items.slice(0, 4))
  const swapped = cgOf([[em, ea], [front, A.front], [rear, A.bag], [bag, A.rear], [fuel, A.fuel]])
  const f = (v: number) => `${fmt(v, 3)} m`
  const alt = Math.abs(swapped - ok) < 0.002 ? ok + 0.031 : swapped
  return make('030.04', 'cg', 'Calcula el centro de gravedad al despegue con estos datos (AVGAS 0,72 kg/l):', f(ok), [
    [f(asKg), 'Has sumado los litros de combustible como si fueran kilos.'],
    [f(noFuel), 'Has olvidado el combustible.'],
    [f(alt), 'Has cruzado los brazos del asiento trasero y del equipaje.'],
  ], `Masa total ${fmt(items.reduce((s, [m]) => s + m, 0), 1)} kg; momento ${fmt(items.reduce((s, [m, a]) => s + m * a, 0), 1)} kg·m; CG = momento / masa = ${f(ok)}. Combustible: ${litres} l × 0,72 = ${fmt(fuel, 1)} kg.`, 'Masa y centrado: CG = Σ momentos / Σ masas', 2,
  `Masa en vacío básica  ${em} kg   brazo ${fmt(ea, 2)} m\nPiloto y pasajero     ${front} kg   brazo 2,05 m\nAsiento trasero       ${rear} kg   brazo 3,00 m\nEquipaje              ${bag} kg   brazo 3,60 m\nCombustible           ${litres} l    brazo 2,40 m`)
}

const pressureAlt: Gen = () => {
  const elev = rnd(150, 3000, 50), qnh = pick([rnd(990, 1008), rnd(1018, 1035)])
  const ok = Math.round((elev + (1013 - qnh) * 27) / 10) * 10
  const rev = Math.round((elev - (1013 - qnh) * 27) / 10) * 10
  const only = Math.round(((1013 - qnh) * 27) / 10) * 10
  const f = (v: number) => `${fmt(v)} ft`
  return make('050.03', 'pa', `Aeródromo de elevación ${fmt(elev)} ft con QNH ${qnh} hPa. ¿Cuál es su altitud de presión? (27 ft por hPa)`, f(ok), [
    [f(rev), 'Has aplicado la corrección con el signo cambiado: con QNH bajo la altitud de presión es mayor que la elevación.'],
    [f(elev), 'Esa es la elevación: falta corregir de QNH a 1013.'],
    [f(only), 'Has calculado solo la corrección y has olvidado sumar la elevación.'],
  ], `Altitud de presión = elevación + (1013 − QNH) × 27 = ${fmt(elev)} + (${1013 - qnh}) × 27 ≈ ${f(ok)}.`, 'ISA; reglaje 1013,25 hPa', 1)
}

const densityAlt: Gen = () => {
  const pa = rnd(1000, 6000, 500), isa = 15 - (2 * pa) / 1000, oat = Math.round(isa + rnd(-10, 22))
  const dev = oat - isa
  const ok = Math.round((pa + 120 * dev) / 10) * 10
  const no = Math.round((pa + 120 * (oat - 15)) / 10) * 10
  const rev = Math.round((pa - 120 * dev) / 10) * 10
  const twelve = Math.round((pa + 12 * dev) / 10) * 10
  const f = (v: number) => `${fmt(v)} ft`
  return make('030.05', 'da', `Altitud de presión ${fmt(pa)} ft y temperatura exterior ${oat} °C. ¿Altitud de densidad aproximada? (120 ft por °C de desviación ISA)`, f(ok), [
    [f(no), 'Has comparado con 15 °C sin descontar el gradiente ISA de 2 °C por 1000 ft.'],
    [f(rev), 'Signo cambiado: con más calor que la ISA la altitud de densidad es mayor.'],
    [f(twelve), 'Has usado 12 ft por °C en lugar de 120.'],
  ], `ISA a ${fmt(pa)} ft = 15 − 2 × ${pa / 1000} = ${fmt(isa, 0)} °C; desviación ${dev >= 0 ? '+' : ''}${fmt(dev, 0)} °C. Altitud de densidad ≈ ${fmt(pa)} + 120 × (${fmt(dev, 0)}) = ${f(ok)}.`, 'ISA: −1,98 °C por 1000 ft', 2)
}

const tas: Gen = () => {
  const cas = rnd(90, 130, 5), pa = rnd(2000, 8000, 1000), oat = Math.round(15 - (2 * pa) / 1000 + rnd(-10, 10))
  const sigma = Math.pow(1 - 6.8756e-6 * pa, 5.2559) / ((oat + 273.15) / 288.15)
  const ok = Math.round(cas / Math.sqrt(sigma))
  const less = Math.round(cas * Math.sqrt(sigma))
  const double = Math.round(cas * (1 + (0.04 * pa) / 1000))
  const f = (v: number) => `${v} kt`
  return make('060.07', 'tas', `CAS ${cas} kt a una altitud de presión de ${fmt(pa)} ft con OAT ${oat} °C. ¿TAS aproximada?`, f(ok), [
    [f(cas), 'La TAS solo coincide con la CAS a nivel del mar en ISA.'],
    [f(less), 'Has corregido al revés: con menos densidad la TAS es mayor que la CAS.'],
    [f(double === ok ? double + 6 : double), 'Has aplicado un 4 % por cada 1000 ft en lugar de unos 2 %.'],
  ], `TAS = CAS / √σ. Con la densidad a ${fmt(pa)} ft y ${oat} °C, σ ≈ ${fmt(sigma, 3)}, TAS ≈ ${f(ok)}. Regla rápida: TAS ≈ CAS + 2 % por cada 1000 ft.`, 'Computador de navegación: corrección de TAS', 2)
}

function windSolve(tasKt: number, trk: number, wd: number, ws: number) {
  const a = rad(wd - trk)
  const wca = Math.asin((ws * Math.sin(a)) / tasKt)
  return { hdg: trk + (wca * 180) / Math.PI, gs: tasKt * Math.cos(wca) - ws * Math.cos(a), wca: (wca * 180) / Math.PI }
}
const wind: Gen = () => {
  const t = rnd(90, 130, 5), trk = rnd(0, 355, 5), wd = norm(trk + pick([rnd(30, 150, 10), -rnd(30, 150, 10)])), ws = rnd(10, 30, 5)
  const s = windSolve(t, trk, wd, ws)
  const f = (h: number, g: number) => `Rumbo ${p3(h)}°, GS ${Math.round(g)} kt`
  const tail = t * Math.cos(rad(s.wca)) + ws * Math.cos(rad(wd - trk))
  return make('060.07', 'wind', `TAS ${t} kt, derrota deseada ${p3(trk)}° y viento ${p3(wd)}°/${ws} kt. ¿Rumbo verdadero y velocidad sobre el suelo?`, f(s.hdg, s.gs), [
    [f(trk - s.wca, s.gs), 'Corrección de deriva hacia el lado contrario: hay que poner el morro hacia el viento.'],
    [f(s.hdg, tail), 'Has tratado la componente de cara como de cola (o al revés).'],
    [f(trk - s.wca, tail), 'Has invertido la dirección del viento: el viento se da «de dónde viene».'],
  ], `Ángulo viento-derrota ${norm(wd - trk)}°. Corrección = asen(${ws} × sen ${norm(wd - trk)}° / ${t}) ≈ ${fmt(Math.abs(s.wca), 0)}° hacia el viento → rumbo ${p3(s.hdg)}°. GS = TAS × cos(corrección) − viento × cos(ángulo) ≈ ${Math.round(s.gs)} kt.`, 'Triángulo de velocidades', 3)
}

const crosswind: Gen = () => {
  const rwy = rnd(1, 36), wd = norm(rwy * 10 + pick([rnd(20, 80, 10), -rnd(20, 80, 10)])), ws = rnd(10, 25)
  const a = rad(wd - rwy * 10)
  const xw = Math.round(Math.abs(ws * Math.sin(a))), hw = Math.round(ws * Math.cos(a))
  const f = (v: number) => `${v} kt`
  return make('030.07', 'xw', `Despegas por la pista ${String(rwy).padStart(2, '0')} con viento ${p3(wd)}°/${ws} kt. ¿Componente de viento cruzado?`, f(xw), [
    [f(Math.abs(hw) === xw ? xw + 3 : Math.abs(hw)), 'Esa es la componente de cara: has usado el coseno en lugar del seno.'],
    [f(ws === xw ? ws + 2 : ws), 'Ese es el viento total, no su componente perpendicular a la pista.'],
    [f(Math.round(ws / 2) === xw ? xw - 2 : Math.round(ws / 2)), 'La mitad del viento solo corresponde a un ángulo de 30°.'],
  ], `Ángulo entre viento y pista ${Math.abs(Math.round(((wd - rwy * 10 + 540) % 360) - 180))}°. Cruzado = ${ws} × sen(ángulo) ≈ ${f(xw)}; de cara = ${ws} × cos(ángulo) ≈ ${f(hw)}.`, 'Componentes de viento: V × sen α y V × cos α', 1)
}

const fuelLeg: Gen = () => {
  const gs = rnd(85, 130, 5), d = rnd(40, 160, 5), ff = rnd(26, 36)
  const h = d / gs, min = Math.round(h * 60)
  const ok = Math.round(h * ff)
  const dec = Math.round((min / 100) * ff)
  const kg = Math.round(h * ff * 0.72)
  const res = Math.round(h * ff + ff / 2)
  const f = (v: number) => `${v} l`
  return make('060.07', 'fuel', `Tramo de ${d} NM a una velocidad sobre el suelo de ${gs} kt con un consumo de ${ff} l/h. ¿Combustible del tramo?`, f(ok), [
    [f(dec === ok ? dec + 3 : dec), `Has tomado ${min} min como ${fmt(min / 100, 2)} h: los minutos no son decimales de hora.`],
    [f(kg === ok ? kg - 2 : kg), 'Has convertido a kilos (× 0,72) y lo das como litros.'],
    [f(res), 'Has sumado media hora de reserva: la pregunta pide solo el tramo.'],
  ], `Tiempo = ${d} / ${gs} = ${fmt(h, 2)} h (${min} min). Combustible = ${fmt(h, 2)} × ${ff} ≈ ${f(ok)}.`, 'Velocidad, tiempo, distancia y consumo', 1)
}

const oneInSixty: Gen = () => {
  const flown = rnd(20, 50, 5), off = rnd(1, 5), rem = rnd(20, 60, 5)
  const te = Math.round((off * 60) / flown), ca = Math.round((off * 60) / rem)
  const f = (v: number) => `${v}°`
  return make('060.08', '1in60', `Tras ${flown} NM estás ${off} NM a la derecha de la derrota y quedan ${rem} NM. ¿Cuántos grados debes corregir a la izquierda para llegar al destino?`, f(te + ca), [
    [f(te), 'Con solo el error de derrota vuelas paralelo a la derrota, sin volver a ella.'],
    [f(ca === te ? ca + 2 : ca), 'Te falta el error de derrota: primero se anula la deriva y luego se cierra el ángulo.'],
    [f(te * 2 === te + ca ? te * 2 + 3 : te * 2), 'Doblar el error de derrota solo sirve para volver a la derrota en el mismo tiempo, no para ir al destino.'],
  ], `Error de derrota = ${off} × 60 / ${flown} ≈ ${te}°. Ángulo de cierre = ${off} × 60 / ${rem} ≈ ${ca}°. Corrección total ≈ ${te + ca}°.`, 'Regla 1 en 60', 2)
}

const qdm: Gen = () => {
  const hdg = rnd(0, 355, 5), rb = rnd(10, 350, 5)
  const ok = norm(hdg + rb)
  const f = (v: number) => `${p3(v)}°`
  return make('060.11', 'qdm', `Rumbo magnético ${p3(hdg)}° y el ADF indica una marcación relativa de ${p3(rb)}°. ¿QDM a la estación?`, f(ok), [
    [f(ok + 180), 'Ese es el QDR (desde la estación).'],
    [f(hdg - rb), 'La marcación relativa se suma al rumbo, no se resta.'],
    [f(rb === ok ? rb + 10 : rb), 'La marcación relativa se mide desde el morro: hay que sumarle el rumbo.'],
  ], `QDM = rumbo magnético + marcación relativa = ${p3(hdg)} + ${p3(rb)} = ${f(ok)} (restando 360 si pasa). El QDR sería ${f(ok + 180)}.`, 'ADF: QDM = HDG(M) + RB', 1)
}

const localTime: Gen = () => {
  const zone = pick([['Madrid', 1, 2], ['Palma', 1, 2], ['Las Palmas', 0, 1]] as const)
  const summer = Math.random() < 0.5
  const off = summer ? zone[2] : zone[1]
  const hh = rnd(7, 20), mm = rnd(0, 55, 5)
  const t = (h: number) => `${String(((h % 24) + 24) % 24).padStart(2, '0')}:${String(mm).padStart(2, '0')} UTC`
  const other = summer ? zone[1] : zone[2]
  return make('060.02', 'time', `Son las ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} hora oficial en ${zone[0]} un día de ${summer ? 'julio' : 'enero'}. ¿Qué hora UTC es?`, t(hh - off), [
    [t(hh - other), summer ? 'Has usado la diferencia de invierno.' : 'Has usado la diferencia de verano.'],
    [t(hh + off), 'Has sumado en lugar de restar: la hora oficial de España va por delante de UTC.'],
    [t(off === 0 ? hh - 1 : hh), off === 0 ? 'En Canarias en invierno la hora oficial coincide con UTC.' : 'La hora oficial no es UTC.'],
  ], `${zone[0]}: UTC+${zone[1]} en invierno y UTC+${zone[2]} en verano. En ${summer ? 'julio' : 'enero'}, UTC = hora oficial − ${off} h = ${t(hh - off)}.`, 'Hora oficial de España (AIP GEN 2.1)', 1)
}

const turnVs: Gen = () => {
  const vs = rnd(45, 60), bank = pick([30, 45, 60])
  const n = 1 / Math.cos(rad(bank))
  const ok = Math.round(vs * Math.sqrt(n)), lin = Math.round(vs * n), inv = Math.round(vs / Math.sqrt(n))
  const f = (v: number) => `${v} kt`
  return make('080.08', 'vsn', `La velocidad de pérdida de tu avión en vuelo nivelado es de ${vs} kt. ¿Cuál será en un viraje nivelado de ${bank}° de inclinación?`, f(ok), [
    [f(lin), 'La Vs crece con la raíz cuadrada del factor de carga, no en proporción directa.'],
    [f(vs), 'En viraje el factor de carga aumenta y con él la velocidad de pérdida.'],
    [f(inv), 'Has dividido por √n: la velocidad de pérdida aumenta, no disminuye.'],
  ], `n = 1 / cos ${bank}° = ${fmt(n, 2)}. Vs en viraje = ${vs} × √${fmt(n, 2)} ≈ ${f(ok)}.`, 'Vs(n) = Vs × √n', 2)
}

const massVs: Gen = () => {
  const m1 = rnd(1000, 1100, 10), m2 = m1 - rnd(150, 300, 10), vs = rnd(48, 56)
  const ok = Math.round(vs * Math.sqrt(m2 / m1) * 10) / 10
  const lin = Math.round(vs * (m2 / m1) * 10) / 10, inv = Math.round(vs * Math.sqrt(m1 / m2) * 10) / 10
  const f = (v: number) => `${fmt(v, 1)} kt`
  return make('080.15', 'vsm', `Un avión entra en pérdida a ${vs} kt con ${m1} kg. ¿A qué velocidad, aproximadamente, con ${m2} kg?`, f(ok), [
    [f(lin), 'La velocidad de pérdida varía con la raíz cuadrada de la masa, no linealmente.'],
    [f(inv), 'Con menos masa la Vs baja, no sube.'],
    [f(vs), 'La velocidad de pérdida depende de la masa.'],
  ], `Vs₂ = Vs₁ × √(m₂/m₁) = ${vs} × √(${m2}/${m1}) ≈ ${f(ok)}. La VA baja en la misma proporción.`, 'Vs ∝ √masa', 2)
}

const descent: Gen = () => {
  const alt = rnd(2000, 6000, 500), d = rnd(10, 25), gs = rnd(90, 130, 10)
  const min = (d / gs) * 60
  const ok = Math.round(alt / min / 10) * 10
  const f = (v: number) => `${fmt(v)} ft/min`
  return make('060.08', 'rod', `Debes descender ${fmt(alt)} ft en ${d} NM con una velocidad sobre el suelo de ${gs} kt. ¿Régimen de descenso necesario?`, f(ok), [
    [f(Math.round(alt / d / 10) * 10), 'Eso son pies por milla, no pies por minuto.'],
    [f(ok * 2), 'Has tomado la mitad del tiempo disponible.'],
    [f(Math.round(ok / 2 / 10) * 10), 'Has tomado el doble del tiempo disponible.'],
  ], `Tiempo = ${d} / ${gs} × 60 = ${fmt(min, 1)} min. Régimen = ${fmt(alt)} / ${fmt(min, 1)} ≈ ${f(ok)}.`, 'Planificación del descenso', 2)
}

/** generadores por bloque del temario */
export const GENERATORS: Record<string, Gen[]> = {
  '030.04': [cg],
  '050.03': [pressureAlt],
  '030.05': [densityAlt],
  '030.07': [crosswind],
  '060.02': [localTime],
  '060.07': [tas, wind, fuelLeg],
  '060.08': [oneInSixty, descent],
  '060.11': [qdm],
  '080.08': [turnVs],
  '080.15': [massVs],
}
export const hasGenerator = (block: string) => !!GENERATORS[block]
export const generate = (block: string) => pick(GENERATORS[block])()
/** n preguntas generadas al azar entre los bloques indicados (o todos) */
export function generateMany(n: number, blocks = Object.keys(GENERATORS)): BankQuestion[] {
  const bs = blocks.filter(hasGenerator)
  return bs.length ? Array.from({ length: n }, () => generate(pick(bs))) : []
}
