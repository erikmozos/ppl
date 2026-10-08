// PPL(A) — materias específicas de avión: Principios de vuelo, Procedimientos operacionales,
// Performance y planificación, Conocimiento general de la aeronave.
import type { Subject } from './types'
import { URL } from './ppl-common'

const APM4 = { title: "The Air Pilot's Manual, vol. 4: Aeroplane Technical — Trevor Thom (Pooleys)", url: URL.apm }

export const pof: Subject = {
  id: 'principios-vuelo', code: '080', name: 'Principios de vuelo', icon: '🪽',
  exam: { questions: 16, time: '25 min', pass: 12 },
  summary: 'Aerodinámica: sustentación y resistencia, pérdida y barrena, hipersustentadores, estabilidad y control, hélices y mecánica del viraje. La clave: la pérdida depende del ángulo de ataque, no de la velocidad.',
  syllabus: ['Aerodinámica subsónica', 'Flujo 2D y 3D; resistencia y efecto suelo', 'Pérdida y barrena', 'Dispositivos hipersustentadores', 'Hielo y contaminación', 'Estabilidad', 'Control', 'Limitaciones (envolvente, factores de carga)', 'Hélices', 'Mecánica del viraje'],
  blocks: [
    {
      title: 'Las cuatro fórmulas centrales',
      formulas: [
        { f: 'L = ½ · ρ · V² · S · CL', note: 'La resistencia tiene la misma forma con CD.' },
        { f: 'n = 1 / cos φ (viraje nivelado)', note: '1,15 g a 30°, 1,41 g a 45°, 2 g a 60°, ~2,9 g a 70°.' },
        { f: 'Vs(n) = Vs(1 g) × √n', note: 'La velocidad de pérdida sube con el factor de carga.' },
        { f: 'La pérdida ocurre SIEMPRE al mismo ángulo de ataque crítico', note: 'También la pérdida acelerada, solo que a más velocidad.' },
      ],
      table: { head: ['Inclinación', 'n', '√n', 'Vs si Vs(1 g) = 50 kt', 'Aumento'], rows: [['30°', '1,15', '1,075', '53,7 kt', '+7 %'], ['45°', '1,41', '1,189', '59,5 kt', '+19 %'], ['60°', '2,0', '1,414', '70,7 kt', '+41 %']] },
      bullets: ['Factores de carga límite: categoría normal +3,8/−1,52 g; *utility* +4,4/−1,76 g.', 'La Vs del POH es a masa máxima, 1 g y alas niveladas.'],
    },
    {
      title: 'Ejemplos resueltos',
      examples: [
        { q: 'Vs = 50 kt a 1000 kg. ¿Vs a 800 kg?', a: 'Vs ∝ √masa → 50 × √0,8 ≈ 44,7 kt. La velocidad de maniobra VA baja en la misma proporción (100 → ~89 kt).' },
        { q: 'Pasas de 80 a 120 kt con el mismo CL. ¿Cuánto aumenta la sustentación?', a: '(120/80)² = 2,25 veces.' },
        { q: 'Inclinación de un viraje de régimen 1 (3°/s) a 100 kt TAS.', a: '≈ TAS/10 + 7 = 17°.' },
        { q: 'Relación L/D = 10. ¿Distancia de planeo desde 3000 ft?', a: '30.000 ft ≈ 4,9 NM.' },
      ],
    },
    {
      title: 'Conceptos que concentran las preguntas',
      bullets: [
        'La Vs (IAS) **aumenta** con la masa, el factor de carga y el **CG adelantado**; **disminuye** con flaps y con potencia; prácticamente no cambia con la altitud en IAS (sí en TAS). El hielo la sube y elimina el aviso de pérdida.',
        'Resistencia parásita ∝ V²; inducida ∝ 1/V². La total es mínima en **VMD**, que coincide con la de mejor planeo.',
        'Más masa no cambia el ángulo de planeo, pero aumenta la velocidad de mejor planeo.',
        'Los flaps reducen el ángulo de ataque crítico; los *slats* lo aumentan.',
        'CG adelantado: más estable, mandos más pesados, Vs mayor. CG atrasado: menos estable y riesgo de no recuperar una barrena.',
        'Mucha estabilidad direccional y poca lateral → espiral picada; lo contrario → *dutch roll*.',
        'La guiñada adversa se corrige con timón o alerones diferenciales/Frise.',
        'El *trim tab* se mueve **al contrario** que la superficie; el *anti-balance tab*, en el mismo sentido.',
        'Arco blanco: VS0–VFE. Verde: VS1–VNO. Línea roja: VNE.',
      ],
    },
    {
      title: 'Barrena, espiral, hélice y estela',
      bullets: [
        'Recuperación de **barrena**: gases a ralentí, alerones neutros, timón a fondo contra el giro, profundidad adelante. En la **espiral picada** la velocidad aumenta: reduce potencia y nivela alas.',
        'Hélice a derechas: par, estela helicoidal, factor P y precesión llevan el morro a la **izquierda** → en el despegue, **pie derecho**.',
        'Efecto suelo: se nota hasta una envergadura de altura.',
        'Estela turbulenta máxima con un avión **pesado, limpio y lento**.',
      ],
    },
  ],
  traps: ['«La pérdida depende de la velocidad» es falso: depende del ángulo de ataque.', 'Con más masa el ángulo de planeo no cambia.', 'El trim tab se mueve al contrario que la superficie que compensa.', 'Los flaps bajan el ángulo de ataque crítico (aunque bajan la Vs).', 'CG adelantado = Vs mayor.'],
  mnemonics: ['Factor de carga: 30° → 1,15 · 45° → 1,41 · 60° → 2.', 'Barrena: PARE (Power idle, Ailerons neutral, Rudder opposite, Elevator forward).'],
  books: {
    es: [{ title: 'Principios de Vuelo — Joaquín C. Adsuar (Paraninfo)', url: URL.buckerParaninfo, note: '≈ 29,95 €' }, { title: 'Principios de Vuelo y Performance. Test (Paraninfo)', note: '≈ 42 €' }],
    en: [APM4],
    free: [{ title: 'Temario oficial AMC1 FCL.210; FCL.215 (EASA)', url: URL.syllabus }],
  },
  quiz: [
    { q: 'Factor de carga en un viraje nivelado de 60°:', options: ['1,41 g', '1,5 g', '2 g', '3 g'], correct: 2, why: 'n = 1/cos 60° = 2.' },
    { q: 'Vs = 50 kt en vuelo nivelado. En un viraje de 45° la Vs es aproximadamente:', options: ['50 kt', '53,7 kt', '59,5 kt', '70,7 kt'], correct: 2, why: '50 × √1,41 ≈ 59,5 kt.' },
    { q: 'La pérdida se produce siempre:', options: ['A la misma velocidad', 'Al mismo ángulo de ataque crítico', 'Con morro alto', 'A baja potencia'], correct: 1, why: 'Depende del ángulo de ataque, no de la velocidad ni de la actitud.' },
    { q: 'Un CG adelantado produce:', options: ['Menos estabilidad y Vs menor', 'Más estabilidad y Vs mayor', 'Más estabilidad y Vs menor', 'No afecta'], correct: 1, why: 'Más carga en la cola para equilibrar → más sustentación necesaria → Vs mayor.' },
    { q: 'Al aumentar la velocidad, la resistencia inducida:', options: ['Aumenta', 'Disminuye', 'No cambia', 'Se duplica'], correct: 1, why: 'Inducida ∝ 1/V²; la parásita ∝ V².' },
    { q: 'La velocidad de mínima resistencia (VMD) coincide con:', options: ['La de máximo alcance en todos los aviones', 'La de mejor planeo', 'Vx', 'VNE'], correct: 1, why: 'Mínima resistencia = máxima L/D = mejor planeo.' },
    { q: 'Un trim tab se mueve:', options: ['En el mismo sentido que la superficie', 'En sentido contrario a la superficie', 'Solo con flaps', 'Nunca en vuelo'], correct: 1, why: 'Genera la fuerza aerodinámica que mantiene la superficie en su posición.' },
    { q: 'En el despegue con hélice a derechas, el avión tiende a irse:', options: ['A la derecha', 'A la izquierda', 'Recto', 'Arriba'], correct: 1, why: 'Par, estela, factor P y precesión → izquierda; se corrige con pie derecho.' },
    { q: 'Recuperación estándar de barrena:', options: ['Gases a fondo y tirar', 'Ralentí, alerones neutros, timón contrario, profundidad adelante', 'Alerones contra el giro', 'Flaps abajo'], correct: 1, why: 'Siempre según el POH; esta es la técnica general.' },
    { q: 'Al aumentar la masa, el ángulo de planeo óptimo:', options: ['Aumenta', 'Disminuye', 'No cambia, pero la velocidad de mejor planeo sube', 'Se hace imposible planear'], correct: 2, why: 'La L/D máxima no depende de la masa; sí la velocidad a la que se obtiene.' },
  ],
}

export const ops: Subject = {
  id: 'procedimientos', code: '070', name: 'Procedimientos operacionales', icon: '🧯',
  exam: { questions: 12, time: '20 min', pass: 9 },
  summary: 'Anexo 6, Part-NCO (combustible, briefing, ELT, chalecos), ruido, incursiones en pista, fuego y humo, cizalladura, estela turbulenta, aterrizajes de emergencia y pistas contaminadas. Ojo: la regla de combustible cambió el 18-02-2026.',
  syllabus: ['Anexo 6 OACI', 'Atenuación de ruido', 'Prevención de incursiones en pista', 'Fuego y humo', 'Cizalladura y microrráfaga', 'Estela turbulenta', 'Aterrizajes de emergencia y de precaución', 'Pistas contaminadas', 'Part-NCO: combustible, briefing, equipos'],
  blocks: [
    {
      title: 'Reserva final de combustible (desde 18-02-2026)',
      text: ['NCO.OP.125 (Reglamento 2025/133) pasa a basarse en el riesgo y las cifras de reserva final (FRF) se van al AMC, calculadas a velocidad de espera a 1500 ft. Muchos bancos de preguntas aún usan el texto anterior.'],
      table: {
        head: ['Tipo de vuelo (avión)', 'FRF mínima (AMC1 NCO.OP.125(b))', 'Texto anterior'],
        rows: [['VFR de día local (mismo aeródromo, siempre a la vista)', '10 min a potencia máxima continua de crucero a 1500 ft', '10 min'], ['VFR de día', '30 min a velocidad de espera a 1500 ft sobre destino', '30 min a crucero normal'], ['VFR nocturno e IFR', '45 min a velocidad de espera a 1500 ft', '45 min']],
      },
      bullets: ['Bajar de la FRF es una emergencia: «**MAYDAY MAYDAY MAYDAY FUEL**» (NCO.OP.185).', '**«MINIMUM FUEL» no es emergencia** ni da prioridad.'],
    },
    {
      title: 'Otras normas de Part-NCO',
      bullets: [
        'Briefing a pasajeros: cinturones, salidas, equipo de emergencia (NCO.OP.130).',
        'Preparación: estudiar la meteorología y prever un alternativo (NCO.OP.135).',
        'Avión no certificado que encuentra hielo: salir de esas condiciones sin demora (NCO.OP.170).',
        'Con pasajeros no se simulan emergencias (NCO.OP.180). La seguridad prevalece sobre la atenuación de ruido (NCO.OP.120).',
        'ELT automático si el certificado de aeronavegabilidad es posterior al 1-7-2008 (en ≤ 6 asientos vale un PLB). Emite en **121,5 y 406 MHz**.',
        'Chaleco obligatorio en monomotor **más allá de la distancia de planeo**; 30 min o 50 NM para valorar balsas.',
        'Masa y CG se revisan si cambian más de un 0,5 %.',
      ],
    },
    {
      title: 'Estela turbulenta',
      verify: true,
      bullets: [
        'Separación en aterrizaje: **3 min** LIGHT detrás de HEAVY o MEDIUM; **2 min** MEDIUM detrás de HEAVY; **4 min** LIGHT detrás de SUPER.',
        'Categorías por MTOM: LIGHT ≤ 7000 kg; HEAVY ≥ 136.000 kg.',
        'Despegue tras un pesado: rota **antes** que él y asciende **por encima** de su trayectoria. Aterrizaje: toma tierra **más allá** de su punto de contacto.',
        'Cuidado con viento cruzado ligero de 3–5 kt: mantiene el torbellino sobre la pista.',
      ],
    },
    {
      title: 'Emergencias',
      verify: true,
      bullets: [
        'Fuego de motor en vuelo: combustible cerrado, mezcla a corte, gases a fondo, magnetos OFF, calefacción cerrada, aterrizaje forzoso.',
        'Fuego en el carburador durante el arranque: **sigue girando el motor** para que aspire las llamas.',
        'Microrráfaga: potencia máxima, morro arriba hasta el aviso de pérdida, sin cambiar configuración.',
        'Hidroplaneo: velocidad ≈ **9 × √(presión del neumático en psi)** kt.',
        'Estado de pista GRF: código RWYCC de 6 (seca) a 0.',
        'Amaraje: el chaleco no se infla dentro del avión; con mar de fondo fuerte, amarar paralelo a las crestas.',
      ],
    },
  ],
  traps: ['MINIMUM FUEL no es una emergencia.', 'La reserva diurna ahora se calcula a velocidad de espera a 1500 ft (no a crucero).', 'Tras un pesado: rotar antes y quedar por encima; aterrizar más allá de su toma.', 'Fuego de carburador en el arranque: seguir girando, no parar.'],
  books: {
    es: [{ title: 'No hay un libro específico de Paraninfo; usar Part-NCO y el manual de la escuela' }],
    en: [{ title: "The Air Pilot's Manual, vol. 6: Human Performance & Operational Procedures (Pooleys)", url: URL.apm }, { title: 'AFE EASA PPL Revision Guide: Operational Procedures' }],
    free: [{ title: 'Air Ops Easy Access Rules — Part-NCO (EASA, marzo 2026)', url: URL.airops }],
  },
  quiz: [
    { q: 'Reserva final de combustible para VFR de día (AMC desde el 18-02-2026):', options: ['10 min a crucero', '30 min a velocidad de espera a 1500 ft sobre destino', '45 min', '1 h'], correct: 1, why: 'AMC1 NCO.OP.125(b). El texto anterior hablaba de 30 min a altitud de crucero.' },
    { q: 'Declarar «MINIMUM FUEL»:', options: ['Es una emergencia', 'No es una emergencia ni da prioridad', 'Equivale a PAN PAN', 'Obliga a aterrizar de inmediato'], correct: 1, why: 'Es un aviso. La emergencia es «MAYDAY FUEL».' },
    { q: 'Fuego en el carburador durante el arranque:', options: ['Parar el motor de inmediato', 'Seguir girando el motor para que aspire las llamas', 'Abrir la puerta', 'Poner la mezcla rica'], correct: 1, why: 'El motor aspira el fuego hacia dentro.' },
    { q: 'Separación por estela para un LIGHT que aterriza detrás de un HEAVY:', options: ['1 min', '2 min', '3 min', '5 min'], correct: 2, why: '3 min LIGHT detrás de HEAVY o MEDIUM.' },
    { q: 'Despegando detrás de un avión pesado, debes:', options: ['Rotar después de su punto de rotación', 'Rotar antes y ascender por encima de su trayectoria', 'Mantenerte por debajo', 'Despegar inmediatamente'], correct: 1, why: 'Los torbellinos descienden: quédate por encima.' },
    { q: 'Frecuencias de un ELT moderno:', options: ['121,5 y 243 MHz', '121,5 y 406 MHz', '118 y 406 MHz', '406 MHz solo'], correct: 1, why: 'NCO.IDE: 121,5 y 406 MHz.' },
    { q: 'Ante una microrráfaga en la aproximación:', options: ['Reducir potencia', 'Potencia máxima, morro arriba hasta el aviso de pérdida, sin cambiar configuración', 'Subir flaps y tren', 'Picar para ganar velocidad'], correct: 1, why: 'Prioridad: no perder altura; no cambies la configuración.' },
    { q: 'En monomotor, el chaleco salvavidas es obligatorio:', options: ['Siempre sobre el mar', 'Más allá de la distancia de planeo hasta tierra', 'A más de 100 NM', 'Nunca'], correct: 1, why: 'Part-NCO: más allá de la distancia de planeo.' },
    { q: 'Velocidad aproximada de hidroplaneo con neumáticos a 36 psi:', options: ['36 kt', '54 kt', '72 kt', '90 kt'], correct: 1, why: '9 × √36 = 54 kt.' },
  ],
}

export const perf: Subject = {
  id: 'performance', code: '030', name: 'Performance y planificación', icon: '📐',
  exam: { questions: 16, time: '35 min', pass: 12 },
  summary: 'Masa y centrado (cálculo del CG), performance de despegue, ascenso y aterrizaje, altitud de presión y de densidad, y planificación VFR (navlog, combustible, plan de vuelo). Es la materia con más tiempo por pregunta: hay que calcular.',
  syllabus: ['7.1 Masa y centrado: terminología, límites, datum y brazo, cálculo del CG', '7.2 Performance de monomotores: masa, viento, altitud, pendiente y estado de la pista', '7.3 Planificación VFR: navlog, combustible, AIP, NOTAM, plan de vuelo OACI, seguimiento en vuelo'],
  blocks: [
    {
      title: 'Masas y centro de gravedad',
      verify: true,
      formulas: [
        { f: 'ZFM = BEM + piloto + pasajeros + carga · TOM = ZFM + combustible (≤ MTOM) · LM = TOM − combustible de viaje (≤ MLM)' },
        { f: 'Momento = masa × brazo · CG = Σ momentos / Σ masas' },
        { f: 'Mover una carga: ΔCG = m · d / M' },
        { f: 'AVGAS ≈ 0,72 kg/l · 1 US gal = 3,785 l' },
      ],
      table: {
        caption: 'Ejemplo de cálculo del CG',
        head: ['Elemento', 'Masa (kg)', 'Brazo (m)', 'Momento (kg·m)'],
        rows: [['BEM', '680', '2,10', '1428,0'], ['Piloto y pasajero delantero', '160', '2,05', '328,0'], ['Pasajero trasero', '70', '2,95', '206,5'], ['Equipaje', '20', '3,60', '72,0'], ['Combustible (120 l × 0,72)', '86,4', '2,40', '207,4'], ['Total al despegue', '1016,4', '2,206', '2241,9']],
      },
      examples: [
        { q: 'Tras consumir 60 l, ¿dónde queda el CG?', a: 'Masa 973,2 kg, CG 2,197 m: el combustible está detrás del CG, así que al gastarlo el CG avanza. Comprueba los dos puntos en la envolvente.' },
        { q: 'Avión de 1000 kg, CG en 2,25 m, límite trasero 2,24 m. ¿Cuánto equipaje mover 0,65 m hacia delante?', a: 'm = M · ΔCG / d = 1000 × 0,01 / 0,65 ≈ 15,4 kg.' },
      ],
    },
    {
      title: 'Altitud de presión y de densidad',
      verify: true,
      formulas: [{ f: 'PA = elevación + (1013 − QNH) × 27 ft' }, { f: 'DA ≈ PA + 120 ft × (OAT − T ISA)' }],
      examples: [{ q: 'Elevación 2000 ft, QNH 1003, OAT 30 °C.', a: 'PA = 2000 + 10 × 27 = 2270 ft. T ISA a 2270 ft ≈ 10,5 °C → DA ≈ 2270 + 120 × 19,5 ≈ 4610 ft: el avión rinde como a 4600 ft.' }],
      bullets: ['Hay fuentes que usan 30 ft/hPa: comprueba el factor que usa tu banco.'],
    },
    {
      title: 'Performance de despegue y aterrizaje',
      bullets: [
        'Las distancias aumentan con la masa, la DA, el viento en cola, la pendiente ascendente, la hierba y la contaminación.',
        'Muchas tablas del POH ya aplican el **50 % del viento de cara** y el **150 % del viento en cola**: no lo apliques dos veces.',
        'Factores de seguridad recomendados (CAA): ×1,33 en el despegue y ×1,43 en el aterrizaje.',
        'Vx = mejor ángulo de ascenso; Vy = mejor régimen. Con la altitud convergen hasta el techo absoluto.',
      ],
      formulas: [{ f: 'Viento cruzado = V × sen(ángulo) · de cara = V × cos(ángulo)', note: 'Pista 27, viento 300/20 → 10 kt cruzado y ~17 kt de cara.' }],
    },
    {
      title: 'Planificación del combustible y plan de vuelo',
      verify: true,
      bullets: [
        'Combustible total = rodaje + viaje + contingencia + alternativo (si aplica) + FRF + extra.',
        'Plan de vuelo OACI: casilla 8 (reglas V/I/Y/Z y tipo G), 15 (velocidad, nivel y ruta), 19 (autonomía y personas a bordo). Aeródromo sin indicador: **ZZZZ** y detalle en la casilla 18. Verifica en AIP ENR 1.10.',
      ],
      examples: [{ q: 'Viaje de 1 h 30 min a 30 l/h, 3 l de rodaje, 5 % de contingencia y 30 min de FRF diurna.', a: 'Viaje 45 l + rodaje 3 + contingencia ~2,3 + FRF ~15 → unos **66 l** mínimo.' }],
    },
  ],
  traps: ['Operar con litros sin pasarlos a kg.', 'No comprobar el CG al aterrizaje (con combustible gastado).', 'Aplicar dos veces el factor de viento.', 'Usar el QNH en vez de 1013 para la altitud de presión.'],
  books: {
    es: [{ title: 'Conocimiento General de la Aeronave (Paraninfo, incluye actuaciones)', url: 'https://buckerbook.es/gb/cga-principles-of-flight/conocimiento-general-de-la-aeronave-paraninfo' }],
    en: [APM4, { title: 'AFE EASA PPL Revision Guide: Flight Planning' }],
    free: [{ title: 'AIP España: ENR 1.10 plan de vuelo (ENAIRE)', url: URL.aip }, { title: 'Air Ops — AMC1 NCO.OP.125 combustible (EASA)', url: URL.airops }],
  },
  quiz: [
    { q: 'Elevación 2000 ft y QNH 1003 hPa. Altitud de presión (27 ft/hPa):', options: ['1730 ft', '2000 ft', '2270 ft', '2300 ft'], correct: 2, why: '2000 + (1013 − 1003) × 27 = 2270 ft.' },
    { q: 'Con PA 2270 ft y OAT 30 °C, la altitud de densidad es aproximadamente:', options: ['2270 ft', '3400 ft', '4600 ft', '6000 ft'], correct: 2, why: 'T ISA ≈ 10,5 °C; 2270 + 120 × 19,5 ≈ 4610 ft.' },
    { q: 'El momento de una carga se calcula como:', options: ['Masa / brazo', 'Masa × brazo', 'Brazo / masa', 'Masa + brazo'], correct: 1, why: 'Momento = masa × brazo.' },
    { q: '120 litros de AVGAS pesan aproximadamente:', options: ['120 kg', '86 kg', '100 kg', '72 kg'], correct: 1, why: '120 × 0,72 ≈ 86 kg.' },
    { q: 'Si el combustible está detrás del CG, al consumirlo el CG:', options: ['Se atrasa', 'Avanza', 'No cambia', 'Sube'], correct: 1, why: 'Se quita masa de detrás: el CG se mueve hacia delante.' },
    { q: 'Pista 27 con viento 300/20. Componente cruzada:', options: ['5 kt', '10 kt', '17 kt', '20 kt'], correct: 1, why: '20 × sen 30° = 10 kt.' },
    { q: 'Factor habitual aplicado al viento en cola en las tablas de performance:', options: ['50 %', '100 %', '150 %', '200 %'], correct: 2, why: '50 % del viento de cara y 150 % del de cola.' },
    { q: 'Vx es la velocidad de:', options: ['Mejor régimen de ascenso', 'Mejor ángulo de ascenso', 'Máximo alcance', 'Mejor planeo'], correct: 1, why: 'Vx: más altura por distancia (obstáculos). Vy: más altura por tiempo.' },
    { q: 'En el plan de vuelo, un aeródromo sin indicador OACI se escribe:', options: ['XXXX', 'ZZZZ', 'NONE', 'AAAA'], correct: 1, why: 'ZZZZ y se detalla en la casilla 18.' },
  ],
}

export const agk: Subject = {
  id: 'conocimiento-aeronave', code: '020', name: 'Conocimiento general de la aeronave', icon: '⚙️',
  exam: { questions: 24, time: '40 min', pass: 18 },
  summary: 'La materia con más preguntas (24): célula y sistemas, electricidad, motor de pistón (magnetos, carburador, mezcla, detonación), hélices e instrumentos (pitot-estática, giróscopos, brújula). Mucho conecta con las cabinas de la app.',
  syllabus: ['8.1 Célula y sistemas', 'Sistema eléctrico', 'Motor de pistón', 'Hélices', 'Nociones de turbina', '8.2 Instrumentación: sensores de motor', 'Sistema pitot-estático', 'Brújula magnética', 'Instrumentos giroscópicos', 'Avisos y pantallas'],
  blocks: [
    {
      title: 'Motor de pistón',
      verify: true,
      bullets: [
        'Ciclo de 4 tiempos (admisión, compresión, explosión, escape) en **2 vueltas** de cigüeñal.',
        '**Dos magnetos** independientes del sistema eléctrico. Caída típica en la prueba: 125–175 RPM, con ~50 RPM de diferencia.',
        'Si no hay caída: posible cable P suelto → **magneto vivo** (riesgo al mover la hélice a mano).',
        'El motor se para con la **mezcla**. En altitud la mezcla se enriquece: hay que empobrecer.',
        '**Detonación**: después de la chispa. **Preignición**: antes.',
        'AVGAS 100LL **azul**; UL91 incoloro; **Jet A-1 nunca** en un motor de pistón. El agua se va al fondo y se purga.',
        'Presión de aceite en ~30 s tras el arranque.',
        'Hélice de velocidad constante: para subir potencia, mezcla → RPM → MAP; para bajarla, MAP → RPM.',
      ],
    },
    {
      title: 'Hielo en el carburador',
      verify: true,
      bullets: [
        'Se forma con OAT de unos **−10 a +30 °C** y humedad alta, sobre todo con **potencia reducida**.',
        'Paso fijo: se nota como **caída de RPM**. Velocidad constante: caída de **MAP**.',
        'Al aplicar calefacción, las RPM **bajan** y, si había hielo, **suben** después. Si no suben, no había hielo.',
      ],
    },
    {
      title: 'Fallos del sistema pitot-estático',
      table: {
        head: ['Fallo', 'Altímetro', 'VSI', 'Anemómetro'],
        rows: [['Pitot bloqueado, drenaje abierto', 'Normal', 'Normal', 'Cae a 0'], ['Pitot y drenaje bloqueados', 'Normal', 'Normal', 'Actúa como altímetro (sube al ascender)'], ['Estática bloqueada', 'Congelado', '0', 'Indica menos al descender y más al ascender'], ['Fuente estática alterna en cabina', 'Algo alto', 'Salto momentáneo de ascenso', 'Algo alto']],
      },
    },
    {
      title: 'Giróscopos, brújula y electricidad',
      verify: true,
      bullets: [
        'En los aviones de escuela, horizonte y direccional van por **vacío** (4,5–5,5 inHg); el coordinador es **eléctrico**. Si falla el vacío, quedan el coordinador y la pitot-estática.',
        'Brújula: **ANDS** (aceleraciones, máximo con rumbos E/W) y **UNOS** (virajes, máximo con rumbos N/S). Solo es fiable en vuelo recto no acelerado.',
        'Direccional: realinear cada ~15 min. VSI: retraso de 6–9 s.',
        'TAS ≈ IAS + 2 % por cada 1000 ft (100 kt a 6000 ft → ~112 kt).',
        'Amperímetro negativo en vuelo: el alternador no carga; la batería dura ~30 min. Un breaker se rearma una sola vez.',
        'Ley de Ohm: V = I·R. Potencia: P = V·I.',
        'Documentación a bordo: matrícula, CofA, ARC, CRS, seguro y AFM.',
      ],
    },
  ],
  traps: ['Detonación (después de la chispa) frente a preignición (antes).', 'Hielo en el carburador con calor y humedad: puede ocurrir incluso con 25 °C.', 'Estática bloqueada: el altímetro se congela y el VSI marca 0.', 'Sin caída de RPM en la prueba de magnetos no es buena señal: magneto vivo.'],
  mnemonics: ['Brújula: ANDS (Accelerate North, Decelerate South) y UNOS (Undershoot North, Overshoot South).'],
  books: {
    es: [{ title: 'Conocimiento General de la Aeronave, 2.ª ed. — Joaquín C. Adsuar (Paraninfo)', url: 'https://buckerbook.es/gb/cga-principles-of-flight/conocimiento-general-de-la-aeronave-paraninfo', note: '≈ 29 €' }],
    en: [APM4, { title: 'AFE EASA PPL Revision Guide: Aircraft General', url: 'https://www.flightstore.co.uk/product/afe-easa-ppl-aircraft-general-revision-guide-4794' }],
    free: [{ title: 'Temario oficial AMC1 FCL.210; FCL.215 (EASA)', url: URL.syllabus }],
  },
  links: [{ label: 'Estudia los mandos y sistemas en la cabina del C172', href: '#/ac/c172' }, { label: 'Cabina de la PA-28 (carburador y cebador)', href: '#/ac/pa28' }],
  quiz: [
    { q: 'Con hélice de paso fijo, el hielo en el carburador se manifiesta como:', options: ['Subida de RPM', 'Caída de RPM', 'Subida de la presión de aceite', 'Caída de la temperatura de culatas'], correct: 1, why: 'Paso fijo: caída de RPM. Velocidad constante: caída de MAP.' },
    { q: 'Al aplicar calefacción del carburador con hielo formado, las RPM:', options: ['Suben de inmediato', 'Bajan y después suben', 'Bajan y siguen bajando', 'No cambian'], correct: 1, why: 'El aire caliente es menos denso (bajan) y al fundirse el hielo se recuperan.' },
    { q: 'En la prueba de magnetos no hay ninguna caída de RPM al seleccionar L. Indica:', options: ['Motor perfecto', 'Posible magneto vivo (cable P suelto)', 'Mezcla pobre', 'Hielo'], correct: 1, why: 'Sin caída, el interruptor no corta ese magneto: peligro al mover la hélice.' },
    { q: 'La detonación se produce:', options: ['Antes de la chispa', 'Después de la chispa', 'Solo en motores turbo', 'Con mezcla rica'], correct: 1, why: 'La preignición es antes de la chispa.' },
    { q: 'Color del AVGAS 100LL:', options: ['Verde', 'Azul', 'Rojo', 'Incoloro'], correct: 1, why: '100LL azul; UL91 incoloro.' },
    { q: 'Con la toma estática bloqueada, el altímetro:', options: ['Marca 0', 'Se queda congelado', 'Indica de más', 'Funciona normal'], correct: 1, why: 'No recibe cambios de presión estática.' },
    { q: 'Con pitot y drenaje bloqueados, el anemómetro:', options: ['Marca 0', 'Actúa como un altímetro', 'Funciona normal', 'Indica de menos siempre'], correct: 1, why: 'La presión atrapada no cambia: al subir baja la estática y el ASI indica más.' },
    { q: 'Si falla la bomba de vacío, normalmente dejan de ser fiables:', options: ['El anemómetro y el altímetro', 'El horizonte artificial y el direccional', 'El coordinador de viraje', 'La brújula'], correct: 1, why: 'Los giróscopos de vacío; el coordinador es eléctrico.' },
    { q: 'Amperímetro con descarga continua en vuelo:', options: ['Batería sobrecargada', 'El alternador no carga', 'Normal tras el arranque', 'Breaker de aviónica'], correct: 1, why: 'Se vuela solo con batería: reduce el consumo y aterriza.' },
    { q: 'TAS aproximada con IAS 100 kt a 6000 ft:', options: ['100 kt', '106 kt', '112 kt', '120 kt'], correct: 2, why: '+2 % por cada 1000 ft: 100 + 12 % ≈ 112 kt.' },
  ],
}
