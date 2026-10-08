// Manual y sección en los que se basa cada procedimiento.
// Los pasos están redactados siguiendo el orden y el contenido de esas secciones; no son una
// transcripción literal (los manuales tienen copyright y cada operador los adapta).

export interface Source { manual: string; section: string; extra?: string }

interface AcSources { manual: string; level: string; note: string; flows: Record<string, { section: string; extra?: string }> }

export const SOURCES: Record<string, AcSources> = {
  c172: {
    manual: 'Cessna 172S Skyhawk — Pilot\'s Operating Handbook / AFM (Textron Aviation), Sección 4: Procedimientos normales',
    level: 'PPL / LAPL',
    note: 'Valores para el 172S de inyección (IO-360-L2A). Los 172 de carburador (N/P/R) tienen otros pasos: calefacción del carburador y cebador.',
    flows: {
      preflight: { section: 'Preflight Inspection — Cabin' },
      beforestart: { section: 'Before Starting Engine' },
      start: { section: 'Starting Engine (With Battery)' },
      runup: { section: 'Before Takeoff' },
      takeoff: { section: 'Takeoff — Normal Takeoff / Enroute Climb' },
      beforelanding: { section: 'Landing — Before Landing / Normal Landing' },
      afterlanding: { section: 'After Landing' },
      secure: { section: 'Securing Airplane' },
    },
  },
  pa28: {
    manual: 'Piper PA-28-181 Archer II — Pilot\'s Operating Handbook (Piper Aircraft), Sección 4: Normal Procedures',
    level: 'PPL / LAPL',
    note: 'Archer II con Lycoming O-360-A4M de carburador. Los Archer III y TX/DX (G1000) tienen diferencias.',
    flows: {
      preflight: { section: 'Preflight Check — Cockpit' },
      start: { section: 'Before Starting Engine · Starting Engine When Cold' },
      runup: { section: 'Warm-up · Ground Check' },
      beforeto: { section: 'Before Takeoff' },
      beforelanding: { section: 'Approach and Landing' },
      afterlanding: { section: 'After Landing' },
      shutdown: { section: 'Stopping Engine' },
    },
  },
  pa27: {
    manual: 'Piper PA-23-250 Aztec — Owner\'s / Pilot\'s Operating Handbook, Sección de procedimientos normales',
    level: 'Habilitación MEP (multimotor de pistón)',
    note: 'Complementado con el FAA Airplane Flying Handbook (FAA-H-8083-3), cap. 12: Transition to Multiengine Airplanes. Los procedimientos varían según el modelo (B a F) y las modificaciones.',
    flows: {
      beforestart: { section: 'Before Starting Engines' },
      start: { section: 'Starting Engines' },
      runup: { section: 'Warm-up and Ground Check (Run-up)' },
      beforeto: { section: 'Before Takeoff', extra: 'Briefing de fallo de motor: FAA-H-8083-3 cap. 12' },
      beforelanding: { section: 'Approach and Landing (GUMPS)' },
      afterlanding: { section: 'After Landing' },
      shutdown: { section: 'Stopping Engines' },
    },
  },
  atr72: {
    manual: 'ATR 42/72-600 — Flight Crew Operating Manual (FCOM), Procedimientos normales (SOP) + Flight Crew Training Manual (FCTM), reparto de tareas',
    level: 'Type rating (MCC, 2 pilotos)',
    note: 'Secuencia y reparto CM1/CM2 según la estructura de las SOP de ATR. Los valores de NH/ITT, los tiempos y los callouts exactos salen del FCOM de tu operador.',
    flows: {
      safety: { section: 'Preliminary Cockpit Preparation — Safety checks / Power up' },
      prelim: { section: 'Preliminary Cockpit Preparation — Overhead panel scan' },
      cockpit: { section: 'Cockpit Preparation — Main panel and pedestal' },
      start: { section: 'Before Propeller Rotation · Engine Start (Hotel mode)', extra: 'FCTM: arranque del motor 2 con freno de hélice' },
      beforetaxi: { section: 'Before Taxi · Taxi' },
      beforeto: { section: 'Before Takeoff · Line-up' },
      afterlanding: { section: 'After Landing' },
      parking: { section: 'Parking · Leaving the Aircraft' },
    },
  },
  b737: {
    manual: 'Boeing 737-600/700/800/900 — Flight Crew Operations Manual (FCOM) Vol. 1: Normal Procedures — Amplified Procedures',
    level: 'Type rating (MCC, 2 pilotos)',
    note: 'Áreas de responsabilidad CPT/FO según el FCOM de Boeing. Cada aerolínea (Ryanair, TUI, Air Europa…) añade sus propias variaciones en las SOP.',
    flows: {
      powerup: { section: 'Supplementary Procedures — Electrical: Electrical Power Up' },
      fopreflight: { section: 'Preliminary Preflight Procedure · Preflight Procedure – First Officer' },
      cdu: { section: 'CDU Preflight Procedure' },
      cptpreflight: { section: 'Preflight Procedure – Captain' },
      beforestart: { section: 'Before Start Procedure' },
      start: { section: 'Engine Start Procedure' },
      beforetaxi: { section: 'Before Taxi Procedure' },
      beforeto: { section: 'Before Takeoff Procedure · Takeoff Procedure' },
      afterlanding: { section: 'After Landing Procedure' },
      shutdown: { section: 'Shutdown Procedure' },
      secure: { section: 'Secure Procedure' },
    },
  },
}

export function sourceOf(acId: string, flowId: string): (Source & { level: string; note: string }) | null {
  const a = SOURCES[acId]
  const f = a?.flows[flowId]
  if (!a || !f) return null
  return { manual: a.manual, section: f.section, extra: f.extra, level: a.level, note: a.note }
}
