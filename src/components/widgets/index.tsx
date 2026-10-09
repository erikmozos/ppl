// Registro de calculadoras y simuladores (se carga bajo demanda desde Figure)
import { AltimetryCalc, CgCalc, CrosswindCalc, FuelCalc, OneInSixty, TasCalc, TimeCalc, TurnCalc, VmcCalc, WindCalc } from './calcs'
import { MetarCalc } from './metar'
import { AdfSim, VorSim } from './radionav'

const REGISTRY: Record<string, () => React.ReactNode> = {
  'calc:vmc': () => <VmcCalc />,
  'calc:altimetry': () => <AltimetryCalc />,
  'calc:metar': () => <MetarCalc />,
  'calc:wind': () => <WindCalc />,
  'calc:crosswind': () => <CrosswindCalc />,
  'calc:cg': () => <CgCalc />,
  'calc:turn': () => <TurnCalc />,
  'calc:1in60': () => <OneInSixty />,
  'calc:time': () => <TimeCalc />,
  'calc:tas': () => <TasCalc />,
  'calc:fuel': () => <FuelCalc />,
  'sim:vor': () => <VorSim />,
  'sim:adf': () => <AdfSim />,
}

export default function Widget({ id }: { id: string }) {
  const W = REGISTRY[id]
  return W ? <>{W()}</> : <p className="muted small">Herramienta no disponible: {id}</p>
}

export const TOOL_IDS = Object.keys(REGISTRY)
