// Vídeos públicos de YouTube (de terceros) sobre los procedimientos. Se incrustan con youtube-nocookie.
// flow = id del procedimiento relacionado. sim = grabado en simulador (no en el avión real).

export interface Video { yt: string; title: string; flow?: string; lang?: 'es' | 'en' | 'pt'; sim?: boolean }

export const VIDEOS: Record<string, Video[]> = {
  c172: [
    { yt: 'IA6UgeuI9Mc', title: 'How to Start a Cessna 172 — paso a paso con un instructor real', flow: 'start', lang: 'en', sim: true },
    { yt: 'FD1SLgEEOYw', title: 'Cessna 172 — Before starting engine (con briefing a pasajeros)', flow: 'beforestart', lang: 'en' },
    { yt: 'Y2OB5krnrTc', title: 'Cessna 172: arranque, rodaje y run-up (Melbourne Flight Training)', flow: 'runup', lang: 'en' },
    { yt: 'tJ6PR2kfT-o', title: 'C-172 pre-takeoff checks y despegue', flow: 'runup', lang: 'en' },
  ],
  pa28: [
    { yt: 'JF7foXjGN58', title: 'How to Start a Piper PA-28', flow: 'start', lang: 'en' },
    { yt: 'iQjqgVRjzvc', title: 'PA28-181 Archer II (PH-DRT) — arranque completo con todos los checks', flow: 'start', lang: 'en' },
    { yt: 'A5iO2iQaTSc', title: 'Piper Archer II — run-up con checklist Checkmate', flow: 'runup', lang: 'en' },
    { yt: '9NgCPk8dztk', title: 'Run-up y checks antes del despegue — Piper Archer', flow: 'beforeto', lang: 'en' },
  ],
  pa27: [
    { yt: 'N9FaMGhmNlE', title: 'Piper Aztec 1972 (PA-23-250) — arranque y rodaje', flow: 'start', lang: 'en' },
    { yt: 'qLvjEFWDAlo', title: 'Piper Aztec — arranque en caliente y rodaje (vista del piloto)', flow: 'start', lang: 'en' },
    { yt: 'vJ9T-s8Mn9c', title: 'Piper Aztec — despegue (4K)', flow: 'beforeto', lang: 'en' },
  ],
  atr72: [
    { yt: 'MFEOv_aPoBM', title: 'ATR 72-600 — Preliminary cockpit preparation (tests de fuego y humo…)', flow: 'prelim', lang: 'en' },
    { yt: '_joQk6iNF0E', title: 'ATR 72 — sistema de arranque de motores (real y simulado)', flow: 'start', lang: 'en' },
    { yt: 'LcdOAeU-naI', title: 'ATR 72-600 por un instructor de ATR — FMS, arranque y rodaje', flow: 'start', lang: 'en', sim: true },
    { yt: 'AMAEXsVRMw4', title: 'ATR 72-600 — arranque y despegue', flow: 'beforetaxi', lang: 'en' },
  ],
  b737: [
    { yt: 'eGrRRhHEzXE', title: 'B737NG — First Officer preflight: overhead panel', flow: 'fopreflight', lang: 'en' },
    { yt: '1ajRoYZyKOo', title: 'Domina el overhead panel del 737 (en español)', flow: 'fopreflight', lang: 'es' },
    { yt: 'AH1tI2TgblU', title: 'B737 Preliminary preflight procedure — First Officer', flow: 'powerup', lang: 'en' },
    { yt: 'o9ulKa8-cro', title: '737 Preliminary preflight explicado por un piloto de línea', flow: 'powerup', lang: 'en', sim: true },
    { yt: 'VWVNITtxiH0', title: 'Boeing 737 NG — preflight del primer oficial (portugués)', flow: 'fopreflight', lang: 'pt' },
  ],
}
