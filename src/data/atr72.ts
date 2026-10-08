import type { Aircraft } from '../types'
import { ATR_PHOTOS } from './photos'
import { D, G, Gd, H, L, P, Rot, T, W, _ } from './h'

export const atr72: Aircraft = {
  id: 'atr72',
  name: 'ATR 42 / 72-600',
  short: 'ATR 72',
  category: 'Turbohélice regional · Type rating',
  tagline: 'Turbohélice de dos tripulantes con cabina glass (5 pantallas), lógica de botones iluminados y modo "Hotel" con freno de hélice.',
  roles: [
    { id: 'CM1', name: 'CM1 · Comandante', color: '#38bdf8' },
    { id: 'CM2', name: 'CM2 · Copiloto', color: '#f472b6' },
  ],
  photos: ATR_PHOTOS,
  theme: { panel: '#5d6873', label: '#ffffff', bg: '#16191d' },
  viewBox: [1600, 1320],
  panels: [
    // ── Overhead fila superior
    {
      id: 'aice', name: 'Overhead · Anti-icing', x: 40, y: 20, w: 340, h: 210,
      desc: 'Antihielo (eléctrico: sondas, parabrisas, hélices) y deshielo neumático (botas de borde de ataque y entradas de motor).',
      rows: [
        [P('probes', 'PROBES HTG', 'Calefacción de sondas (pitot, estáticas, AOA).'), P('wshld', 'WINDSHIELD HTG', 'Calefacción de parabrisas.')],
        [P('afDeice', 'AIRFRAME DE-ICE', 'Botas neumáticas de ala y cola.'), P('eng1Deice', 'ENG 1 DE-ICE', 'Deshielo de la entrada del motor 1.'), P('eng2Deice', 'ENG 2 DE-ICE', 'Deshielo de la entrada del motor 2.')],
        [P('prop1Ai', 'PROP 1 AI', 'Antihielo de la hélice 1.'), P('prop2Ai', 'PROP 2 AI', 'Antihielo de la hélice 2.'), P('aoa', 'ICING AOA', 'Umbral de aviso de pérdida en condiciones de hielo.')],
      ],
    },
    {
      id: 'elec', name: 'Overhead · Elec', x: 400, y: 20, w: 380, h: 210,
      desc: 'DC: dos generadores-arrancadores (DC GEN), batería principal y de emergencia. AC: dos ACW (frecuencia variable) para las cargas pesadas; inversores para AC de frecuencia constante.',
      rows: [
        [P('bat', 'BAT', 'Batería principal y de emergencia.'), P('extPwr', 'EXT PWR', 'Grupo de tierra DC (luz AVAIL cuando está conectado).'), P('btc', 'BTC', 'Bus tie contactor.')],
        [P('dcGen1', 'DC GEN 1', 'Generador DC 1 (starter-generator).'), P('dcGen2', 'DC GEN 2', 'Generador DC 2.'), P('acw1', 'ACW GEN 1', 'Generador AC wild 1.'), P('acw2', 'ACW GEN 2', 'Generador AC wild 2.')],
        [P('inv1', 'INV 1', 'Inversor 1 (AC 400 Hz).'), P('inv2', 'INV 2', 'Inversor 2.'), P('dcUtl', 'DC UTLY BUS', 'Bus de servicios DC.')],
      ],
    },
    {
      id: 'engf', name: 'Overhead · Eng start / Fuel', x: 800, y: 20, w: 380, h: 210,
      rows: [
        [Rot('engStart', 'ENG START', 'Selector: OFF/START ABORT – START A&B – CRANK.', { span: 2 }), P('start1', 'START 1', 'Pulsador de arranque del motor 1.'), P('start2', 'START 2', 'Pulsador de arranque del motor 2.')],
        [P('fuelPump1', 'FUEL PUMP 1', 'Bomba eléctrica del depósito 1.'), P('xfeed', 'X FEED', 'Válvula de alimentación cruzada.'), P('fuelPump2', 'FUEL PUMP 2', 'Bomba eléctrica del depósito 2.')],
      ],
    },
    {
      id: 'hyd', name: 'Overhead · Hyd', x: 1200, y: 20, w: 360, h: 210,
      desc: 'Dos sistemas, azul y verde, cada uno con una bomba principal eléctrica (ACW). Bomba auxiliar DC en el azul y válvula de interconexión.',
      rows: [
        [P('bluePump', 'BLUE MAIN PUMP', 'Bomba principal del sistema azul.'), P('greenPump', 'GREEN MAIN PUMP', 'Bomba principal del sistema verde.')],
        [P('auxPump', 'AUX HYD PUMP', 'Bomba auxiliar DC (sistema azul).'), P('hydX', 'HYD X FEED', 'Interconexión azul-verde.')],
      ],
    },
    // ── Overhead fila inferior
    {
      id: 'extlt', name: 'Overhead · Ext lights', x: 40, y: 240, w: 340, h: 210,
      rows: [
        [T('bcn', 'BEACON', 'Anticolisión.'), T('nav', 'NAV', 'Navegación.'), T('strb', 'STROBE', 'Estroboscópicas.'), T('logo', 'LOGO', 'Luz de logotipo.')],
        [T('taxiTo', 'TAXI & TO', 'Luces de rodaje y despegue.'), T('landL', 'LAND L', 'Aterrizaje izquierda.'), T('landR', 'LAND R', 'Aterrizaje derecha.'), T('wing', 'WING', 'Luces de ala (inspección de hielo).')],
      ],
    },
    {
      id: 'air', name: 'Overhead · Air / Bleed', x: 400, y: 240, w: 380, h: 210,
      rows: [
        [P('bleed1', 'BLEED 1', 'Sangrado del motor 1.'), P('xValve', 'X VALVE', 'Válvula de interconexión de sangrado.'), P('bleed2', 'BLEED 2', 'Sangrado del motor 2.')],
        [P('pack1', 'PACK 1', 'Pack de aire acondicionado 1.'), P('fans', 'RECIRC FANS', 'Ventiladores de recirculación.'), P('pack2', 'PACK 2', 'Pack 2.')],
        [Rot('comptT', 'COMPT TEMP', 'Temperatura de cabina de vuelo.'), Rot('cabT', 'CABIN TEMP', 'Temperatura de cabina de pasaje.')],
      ],
    },
    {
      id: 'press', name: 'Overhead · Press / Oxy', x: 800, y: 240, w: 180, h: 210,
      rows: [[Rot('ldgElev', 'LDG ELEV', 'Elevación del aeropuerto de destino (AUTO o manual).')], [Gd('dump', 'DUMP', 'Despresurización rápida (protegido).'), P('oxy', 'OXY MAIN', 'Suministro de oxígeno de la tripulación.')]],
    },
    {
      id: 'fire', name: 'Overhead · Fire', x: 1000, y: 240, w: 180, h: 210,
      rows: [[H('fire1', 'ENG 1 FIRE', 'Maneta de fuego 1: cierra combustible, sangrado y arma agentes.'), H('fire2', 'ENG 2 FIRE', 'Maneta de fuego 2.')], [P('fireTest', 'FIRE TEST', 'Prueba de detección de fuego.', { span: 2 })]],
    },
    {
      id: 'signs', name: 'Overhead · Signs / Misc', x: 1200, y: 240, w: 360, h: 210,
      rows: [
        [T('seatBelts', 'SEAT BELTS', 'Señal de cinturones.'), T('noSmoke', 'NO SMOKING', 'Señal de no fumar.'), Gd('emerLt', 'EMER EXIT LT', 'Luces de emergencia: ARM (protegido).')],
        [P('cvr', 'CVR TEST', 'Prueba del registrador de voz.'), T('elt', 'ELT', 'Radiobaliza: ARM/AUTO.'), Rot('wipers', 'WIPERS', 'Limpiaparabrisas.')],
      ],
    },
    // ── Glareshield
    {
      id: 'glare', name: 'Glareshield · AFCS', x: 40, y: 470, w: 1520, h: 130,
      desc: 'Avisos maestros (MW rojo, MC ámbar), paneles EFIS y el AFCS: modos laterales (HDG, NAV, APP) y verticales (IAS, VS, ALT), más AP y YD.',
      rows: [[
        P('mw1', 'MASTER WARN', 'Aviso maestro (rojo) — CM1.'), P('mc1', 'MASTER CAUT', 'Precaución maestra (ámbar) — CM1.'), D('efis1', 'EFIS CTL 1', 'Control de PFD/ND del CM1.', { span: 2 }), _(0.5),
        Rot('hdgKnob', 'HDG', 'Selector de rumbo.'), P('hdgP', 'HDG SEL', 'Modo rumbo.'), P('navP', 'NAV', 'Modo navegación lateral.'), P('appP', 'APP', 'Modo aproximación.'), P('iasP', 'IAS', 'Modo velocidad.'), P('vsP', 'VS', 'Modo velocidad vertical.'), P('altP', 'ALT', 'Mantener altitud.'),
        Rot('altSel', 'ALT SEL', 'Altitud seleccionada.'), P('ap', 'AP', 'Piloto automático.'), P('yd', 'YD', 'Amortiguador de guiñada.'), _(0.5),
        D('efis2', 'EFIS CTL 2', 'Control de PFD/ND del CM2.', { span: 2 }), P('mc2', 'MASTER CAUT', 'Precaución maestra — CM2.'), P('mw2', 'MASTER WARN', 'Aviso maestro — CM2.'),
      ]],
    },
    // ── Panel principal
    {
      id: 'main', name: 'Panel principal', x: 40, y: 620, w: 1520, h: 330,
      desc: 'Cinco pantallas: PFD y ND de cada piloto y la EWD central (parámetros de motor y avisos). El ISIS es el instrumento de reserva.',
      rows: [[
        D('pfd1', 'PFD 1', 'Pantalla primaria de vuelo del CM1.', { span: 3, size: 3.2 }), D('nd1', 'ND 1', 'Navegación del CM1.', { span: 3 }), D('isis', 'ISIS', 'Instrumento de reserva integrado.'),
        D('ewd', 'EWD', 'Parámetros de motor (TQ, NP, ITT, NH, FF) y alertas.', { span: 3 }),
        L('gear', 'LANDING GEAR', 'Palanca de tren.', { color: '#f8fafc' }),
        D('nd2', 'ND 2', 'Navegación del CM2.', { span: 3 }), D('pfd2', 'PFD 2', 'PFD del CM2.', { span: 3 }),
      ], [
        _(3), Rot('pwrMgt', 'PWR MGT', 'Selector de gestión de potencia: TO – MCT – CLB – CRZ. Fija el par objetivo (bug) para cada fase.'),
        P('stickPusher', 'STICK PUSHER', 'Corte del stick shaker/pusher (protección de pérdida).'), _(1), P('antiskid', 'ANTISKID', 'Antideslizante de frenos.'), _(8),
      ]],
    },
    // ── Pedestal
    {
      id: 'ped', name: 'Pedestal', x: 300, y: 970, w: 1000, h: 330,
      desc: 'Power levers (PL: potencia y reversa), condition levers (CL: FUEL SO – FTR – AUTO – 100 % OVRD), flaps, gust lock y freno de hélice.',
      rows: [
        [D('mcdu1', 'MCDU 1', 'FMS del CM1.', { span: 3 }), L('pl1', 'PL 1', 'Power lever 1.', { color: '#111827' }), L('pl2', 'PL 2', 'Power lever 2.', { color: '#111827' }), L('cl1', 'CL 1', 'Condition lever 1: FUEL SO / FTR / AUTO / 100 % OVRD.', { color: '#2563eb' }), L('cl2', 'CL 2', 'Condition lever 2.', { color: '#2563eb' }), D('mcdu2', 'MCDU 2', 'FMS del CM2.', { span: 3 })],
        [L('flaps', 'FLAPS', 'Flaps 0 – 15 – 30 (– 45 en el 42).', { color: '#e5e7eb' }), L('gustLock', 'GUST LOCK', 'Bloqueo de mandos: impide además avanzar los PL a potencia de despegue.', { color: '#dc2626' }), Gd('propBrk', 'PROP BRK', 'Freno de hélice del motor 2 ("modo Hotel": motor 2 como APU).'),
          W('pitchTrim', 'PITCH TRIM', 'Compensador de profundidad (de reserva).'), Rot('rudTrim', 'RUD TRIM', 'Compensador de dirección.'), Rot('ailTrim', 'AIL TRIM', 'Compensador de alabeo.'), D('xpdr', 'XPDR / TCAS', 'Transpondedor y TCAS.', { span: 2 }), D('acp', 'RCP / ACP', 'Paneles de radio y audio.', { span: 2 }), P('toConfig', 'TO CONFIG', 'Prueba de configuración de despegue: comprueba flaps, trims, freno de hélice, gust lock y PWR MGT.')],
      ],
    },
    {
      id: 'left', name: 'Lateral CM1', x: 40, y: 970, w: 240, h: 330,
      rows: [[H('park', 'PARK BRAKE', 'Freno de emergencia / aparcamiento.', { color: '#9ca3af' })], [Rot('tiller', 'TILLER', 'Volante de dirección de la rueda de morro.')]],
    },
    {
      id: 'right', name: 'Lateral CM2', x: 1320, y: 970, w: 240, h: 330,
      rows: [[D('efb', 'EFB', 'Maleta electrónica: performances, cartas y masa y centrado.')], [D('techLog', 'TECH LOG', 'Parte técnico, MEL y carga de combustible.')]],
    },
  ],
  flows: [
    {
      id: 'safety', name: 'Comprobaciones de seguridad y puesta en tensión', phase: 'Prevuelo',
      desc: 'Antes de dar tensión: comprobar que nada se moverá ni arrancará solo.',
      steps: [
        { c: 'techLog', a: 'Parte técnico / MEL — COMPROBADO', r: 'CM1' },
        { c: 'park', a: 'Freno de aparcamiento — ON (presión)', r: 'CM2' },
        { c: 'gear', a: 'Palanca de tren — DOWN', r: 'CM2' },
        { c: 'pl1', a: 'Power levers — GI', r: 'CM2' },
        { c: 'cl1', a: 'Condition levers — FUEL SO', r: 'CM2' },
        { c: 'fire1', a: 'Manetas de fuego — EMPUJADAS', r: 'CM2' },
        { c: 'bat', a: 'BAT — ON', r: 'CM2' },
        { c: 'extPwr', a: 'EXT PWR — ON (si está disponible)', r: 'CM2' },
        { c: 'emerLt', a: 'Luces de emergencia — ARM', r: 'CM2' },
      ],
    },
    {
      id: 'prelim', name: 'Preparación preliminar — escaneo del overhead', phase: 'Prevuelo',
      desc: 'Barrido de izquierda a derecha y de arriba abajo, panel por panel. Lo habitual es que lo haga un solo tripulante.',
      steps: [
        { c: 'probes', a: 'Anti-icing / de-icing — OFF; sondas según SOP', r: 'CM2' },
        { c: 'afDeice', a: 'Airframe de-icing — OFF', r: 'CM2' },
        { c: 'eng1Deice', a: 'Engine de-icing — OFF', r: 'CM2' },
        { c: 'prop1Ai', a: 'Prop anti-icing — OFF', r: 'CM2' },
        { c: 'wshld', a: 'Calefacción de parabrisas — ON', r: 'CM2', n: 'Muchos operadores la conectan desde el inicio para tener los parabrisas preparados (verificar SOP).' },
        { c: 'dcGen1', a: 'Panel eléctrico — COMPROBAR (sin luces FAULT)', r: 'CM2' },
        { c: 'acw1', a: 'ACW GEN — COMPROBAR', r: 'CM2' },
        { c: 'inv1', a: 'Inversores — COMPROBAR', r: 'CM2' },
        { c: 'engStart', a: 'ENG START — OFF / START ABORT', r: 'CM2' },
        { c: 'fuelPump1', a: 'Bombas de combustible — COMPROBAR', r: 'CM2' },
        { c: 'xfeed', a: 'X FEED — CERRADO', r: 'CM2' },
        { c: 'bluePump', a: 'Bombas hidráulicas — ON (sin luces)', r: 'CM2' },
        { c: 'auxPump', a: 'AUX HYD PUMP — AUTO / según SOP', r: 'CM2' },
        { c: 'hydX', a: 'HYD X FEED — CERRADA', r: 'CM2' },
        { c: 'nav', a: 'Luces de navegación — ON', r: 'CM2' },
        { c: 'bleed1', a: 'Sangrados — ON', r: 'CM2' },
        { c: 'pack1', a: 'Packs — ON', r: 'CM2' },
        { c: 'xValve', a: 'X VALVE — CERRADA (AUTO)', r: 'CM2' },
        { c: 'fans', a: 'Recirc fans — ON', r: 'CM2' },
        { c: 'comptT', a: 'Temperatura cabina — AUTO', r: 'CM2' },
        { c: 'ldgElev', a: 'LDG ELEV — AUTO / AJUSTADA', r: 'CM2' },
        { c: 'oxy', a: 'Oxígeno — ON y comprobar presión', r: 'CM2' },
        { c: 'fireTest', a: 'Prueba de fuego — REALIZAR', r: 'CM2' },
        { c: 'seatBelts', a: 'Señales — ON', r: 'CM2' },
        { c: 'noSmoke', a: 'No smoking — ON', r: 'CM2' },
        { c: 'wipers', a: 'Limpiaparabrisas — OFF', r: 'CM2' },
        { c: 'cvr', a: 'CVR — PROBAR', r: 'CM2' },
        { c: 'elt', a: 'ELT — ARM', r: 'CM2' },
      ],
    },
    {
      id: 'cockpit', name: 'Preparación de cabina — panel y pedestal', phase: 'Prevuelo',
      steps: [
        { c: 'efis1', a: 'EFIS y PFD/ND — AJUSTADOS', r: 'CM1' },
        { c: 'efis2', a: 'EFIS y PFD/ND — AJUSTADOS', r: 'CM2' },
        { c: 'mcdu1', a: 'FMS — INICIALIZAR (ruta, performances)', r: 'CM1' },
        { c: 'mcdu2', a: 'FMS — VERIFICAR (cross-check)', r: 'CM2' },
        { c: 'ap', a: 'AFCS — COMPROBAR', r: 'CM1' },
        { c: 'ewd', a: 'EWD — COMPROBAR combustible y avisos', r: 'CM1' },
        { c: 'gustLock', a: 'Gust lock — ENGAGED', r: 'CM1' },
        { c: 'flaps', a: 'Flaps — 0, de acuerdo con la indicación', r: 'CM1' },
        { c: 'pitchTrim', a: 'Compensadores — CENTRADOS / COMPROBADOS', r: 'CM1' },
        { c: 'xpdr', a: 'Transpondedor — STBY y código', r: 'CM2' },
        { c: 'acp', a: 'Radios — AJUSTADAS', r: 'CM2' },
      ],
    },
    {
      id: 'start', name: 'Arranque de motores (motor 2 en modo Hotel)', phase: 'Arranque',
      desc: 'Habitualmente se arranca primero el motor 2 con el freno de hélice puesto (modo Hotel, hace de APU) y después el 1. Los valores de NH/ITT para mover las CL están en el FCOM.',
      steps: [
        { c: 'fuelPump1', a: 'Bomba 1 — ON', r: 'CM2' },
        { c: 'fuelPump2', a: 'Bomba 2 — ON', r: 'CM2' },
        { c: 'bcn', a: 'Beacon — ON', r: 'CM1' },
        { c: 'propBrk', a: 'Freno de hélice — ON / READY (modo Hotel)', r: 'CM1', w: 'Con el freno de hélice puesto, el motor 2 puede funcionar sin mover la hélice y dar aire y electricidad como un APU.' },
        { c: 'engStart', a: 'ENG START — START A&B', r: 'CM1', w: 'Selecciona la secuencia de arranque con los dos sistemas de encendido.' },
        { c: 'start2', a: 'START 2 — PULSAR', r: 'CM1', w: 'El generador-arrancador empieza a girar el motor 2; vigila cómo sube NH.' },
        { c: 'cl2', a: 'CL 2 — FTR al NH indicado en el FCOM', r: 'CM1', w: 'Al poner la condition lever en FTR entra combustible y el motor se enciende. Vigila el pico de ITT.' },
        { c: 'ewd', a: 'NH / ITT — VIGILAR', r: 'CM2' },
        { c: 'propBrk', a: 'Freno de hélice — OFF (cuando proceda)', r: 'CM1', w: 'Al soltar el freno, la hélice 2 empieza a girar.' },
        { c: 'start1', a: 'START 1 — PULSAR', r: 'CM1' },
        { c: 'cl1', a: 'CL 1 — FTR al NH indicado', r: 'CM1' },
        { c: 'engStart', a: 'ENG START — OFF / START ABORT', r: 'CM1' },
        { c: 'extPwr', a: 'EXT PWR — OFF / desconectado', r: 'CM2' },
        { c: 'dcGen1', a: 'Generadores — COMPROBAR', r: 'CM2' },
        { c: 'bleed1', a: 'Sangrados — ON', r: 'CM2' },
      ],
    },
    {
      id: 'beforetaxi', name: 'Antes del rodaje', phase: 'Rodaje',
      steps: [
        { c: 'cl1', a: 'CL 1 + 2 — AUTO', r: 'CM1', w: 'En AUTO las hélices salen de bandera y el sistema gestiona sus RPM.' },
        { c: 'gustLock', a: 'Gust lock — OFF', r: 'CM1', w: 'El gust lock también impide avanzar las power levers a potencia de despegue: hay que quitarlo.' },
        { c: 'flaps', a: 'Flaps — 15 (o según performances)', r: 'CM2' },
        { c: 'pwrMgt', a: 'PWR MGT — TO', r: 'CM1', w: 'En TO, el sistema calcula el par de despegue y lo muestra como objetivo en la EWD.' },
        { c: 'pitchTrim', a: 'Compensadores — AJUSTADOS para el despegue', r: 'CM1' },
        { c: 'probes', a: 'Anti-icing — SEGÚN CONDICIONES', r: 'CM2' },
        { c: 'taxiTo', a: 'Luces de rodaje — ON', r: 'CM1' },
        { c: 'park', a: 'Freno de aparcamiento — OFF', r: 'CM1' },
        { c: 'tiller', a: 'Tiller — RODAR', r: 'CM1' },
      ],
    },
    {
      id: 'afterlanding', name: 'Después de aterrizar', phase: 'Tierra',
      steps: [
        { c: 'flaps', a: 'Flaps — 0', r: 'CM2' },
        { c: 'afDeice', a: 'De-icing / anti-icing — OFF', r: 'CM2' },
        { c: 'strb', a: 'Strobes — OFF', r: 'CM2' },
        { c: 'landL', a: 'Luces de aterrizaje — OFF', r: 'CM1' },
        { c: 'taxiTo', a: 'Luces de rodaje — ON', r: 'CM1' },
        { c: 'xpdr', a: 'Transpondedor — STBY (según aeropuerto)', r: 'CM2' },
      ],
    },
    {
      id: 'parking', name: 'Aparcamiento y apagado', phase: 'Tierra',
      steps: [
        { c: 'park', a: 'Freno de aparcamiento — ON', r: 'CM1' },
        { c: 'cl1', a: 'CL 1 — FUEL SO', r: 'CM1' },
        { c: 'propBrk', a: 'Freno de hélice — ON si se queda el motor 2 en Hotel', r: 'CM1' },
        { c: 'extPwr', a: 'EXT PWR — ON (si está disponible)', r: 'CM2' },
        { c: 'cl2', a: 'CL 2 — FUEL SO (si no hay modo Hotel)', r: 'CM1' },
        { c: 'bcn', a: 'Beacon — OFF', r: 'CM1' },
        { c: 'fuelPump1', a: 'Bombas de combustible — OFF', r: 'CM2' },
        { c: 'seatBelts', a: 'Señal de cinturones — OFF', r: 'CM2' },
        { c: 'gustLock', a: 'Gust lock — ENGAGED', r: 'CM1' },
      ],
    },
    {
      id: 'beforeto', name: 'Antes del despegue (alineación)', phase: 'Despegue',
      steps: [
        { c: 'cl1', a: 'CL 1 + 2 — AUTO (comprobar)', r: 'CM1' },
        { c: 'toConfig', a: 'TO CONFIG — TEST (sin avisos)', r: 'CM2', w: 'La prueba simula el despegue: si algo no está bien configurado (flaps, trims, freno de hélice, gust lock o PWR MGT), suena el aviso. Mejor descubrirlo aquí que al avanzar las palancas.' },
        { c: 'flaps', a: 'Flaps — 15 (verificar indicación)', r: 'CM1' },
        { c: 'pitchTrim', a: 'Trims — EN VERDE / AJUSTADOS', r: 'CM1' },
        { c: 'pwrMgt', a: 'PWR MGT — TO (verificar)', r: 'CM2' },
        { c: 'ewd', a: 'Bug de par de despegue — COMPROBADO', r: 'CM1', w: 'Compara el par objetivo con el de las performances del día: es la referencia que vigilaréis en la carrera.' },
        { c: 'probes', a: 'Anti-icing — SEGÚN CONDICIONES', r: 'CM2' },
        { c: 'seatBelts', a: 'Cabina — LISTA / señal ON', r: 'CM2' },
        { c: 'xpdr', a: 'TCAS — TA/RA', r: 'CM2', w: 'En TA/RA el TCAS da avisos de tráfico y órdenes de maniobra para evitar colisiones.' },
        { c: 'strb', a: 'Strobes — ON (al entrar en pista)', r: 'CM1' },
        { c: 'landL', a: 'Luces de aterrizaje — ON', r: 'CM1' },
        { c: 'pl1', a: 'Power levers — a la muesca de despegue (en la carrera)', r: 'CM1', w: 'El CM1 avanza las palancas hasta la muesca y el CM2 confirma el par en la EWD con el callout correspondiente.' },
      ],
    },
  ],
  guide: {
    intro: 'El ATR 72-600 (y su hermano pequeño el 42-600) es un turbohélice de ala alta con dos PW127. Su cabina glass tiene cinco pantallas y sigue la filosofía de "cabina oscura": con todo normal no hay luces encendidas en el overhead. Una luz blanca indica un sistema desconectado manualmente, y una ámbar o FAULT, una avería. Los flows reales los fija el FCOM / FCTM de ATR y los SOP de tu operador: estos son una plantilla de estudio.',
    specs: [
      ['Motores', '2 × Pratt & Whitney PW127M (PW127F/E en el 42)'],
      ['Hélices', 'Hamilton Sundstrand 568F, seis palas'],
      ['Tripulación', '2 pilotos (CM1 / CM2)'],
      ['Aviónica', '5 pantallas LCD + ISIS, FMS doble'],
      ['Particularidad', 'Freno de hélice en el motor 2 (modo Hotel)'],
    ],
    sections: [
      { title: 'PL y CL', body: 'Las power levers (PL) controlan el par motor y la reversa, con posiciones GI (ground idle), FI (flight idle) y RAMP hasta el tope de despegue. Las condition levers (CL) controlan la hélice y el combustible: FUEL SO – FTR (bandera) – AUTO – 100 % OVRD.' },
      { title: 'Modo Hotel', body: 'Con el freno de hélice puesto, el motor 2 puede girar sin mover la hélice y hacer de APU (aire acondicionado y electricidad). Por eso el motor 2 se arranca primero y se apaga el último.' },
      { title: 'Hielo', body: 'Es crucial en el ATR. Antihielo eléctrico en sondas, parabrisas y hélices, y deshielo con botas neumáticas en bordes de ataque y entradas de motor. Hay un umbral de aviso de pérdida específico para hielo (ICING AOA) y velocidades mínimas mayores en condiciones de hielo.' },
      { title: 'CM1 / CM2', body: 'El reparto de tareas lo fija la posición del asiento, no quién vuela (PF/PM). En general, el CM2 hace el overhead y la preparación preliminar, y el CM1 el FMS y los mandos de motor.' },
    ],
  },
  refs: [
    { title: 'ATR — Flight Operations (FCOM / FCTM, acceso para operadores)', url: 'https://www.atr-aircraft.com/' },
    { title: 'ATR FCTM — Normal procedures (copia antigua, 72-200/500)', url: 'https://www.theairlinepilots.com/forumarchive/atr/fctm-norm-proc.pdf' },
  ],
}
