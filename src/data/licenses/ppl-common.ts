// PPL(A) — materias comunes: Derecho aéreo, Factores humanos, Meteorología, Comunicaciones, Navegación.
// Fuente principal: informe «Guía de estudio PPL EASA» (reports/), con EASA Easy Access Rules (nov. 2025),
// SERA, AIP España (ENAIRE), AEMET y la guía de exámenes de AESA.
import type { Subject } from './types'

export const URL = {
  fcl: 'https://www.easa.europa.eu/en/downloads/115485/en',
  syllabus: 'https://www.easa.europa.eu/en/downloads/136679/en',
  sera: 'https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-standardised-european-rules-air-sera',
  airops: 'https://www.easa.europa.eu/en/downloads/136682/en',
  aipGen17: 'https://aip.enaire.es/AIP/contenido_AIP/GEN/LE_GEN_1_7_en.html',
  aip: 'https://aip.enaire.es/AIP/',
  aemetGuide: 'https://www.aemet.es/documentos/es/conocermas/aeronautica/AU-GUI-0102.pdf',
  ama: 'https://ama.aemet.es/en/que-es-el-ama',
  aemetNotes: 'https://repositorio.aemet.es/bitstream/20.500.11765/16764/1/Apuntes_Meteorologia_Aeronautica_compressed.pdf',
  egast: 'https://www.easa.europa.eu/document-library/general-publications/egast-radiotelephony-guide-vfr-pilots',
  enaireVfr: 'https://enaire.es/AIS/vfr_guide_%28online%29_',
  vfr500: 'https://enaire.es/docs/es_ES/vfr500_index_map',
  icaoAnnexes: 'https://www.icao.int/safety/airnavigation/nationalitymarks/annexes_booklet_en.pdf',
  buckerParaninfo: 'https://buckerbook.es/gb/brand/paraninfo',
  apm: 'https://transair.co.uk/pilot-training/ppl-flight-training/air-pilots-manuals/air-pilots-manuals',
}

const APM = (vol: string) => ({ title: `The Air Pilot's Manual, ${vol} — Trevor Thom (Pooleys)`, url: URL.apm })

export const airLaw: Subject = {
  id: 'derecho', code: '010', name: 'Derecho aéreo y procedimientos ATC', icon: '⚖️',
  exam: { questions: 16, time: '25 min', pass: 12 },
  summary: 'Las normas que lo regulan todo: OACI y sus anexos, SERA (Reglamento del Aire europeo), espacios aéreos, mínimos VMC, derecho de paso, señales, plan de vuelo, Part-FCL y las diferencias españolas del AIP GEN 1.7. Es la materia donde más pesan las cifras exactas.',
  syllabus: [
    'Derecho internacional: Convenio de Chicago (1944), OACI, libertades del aire, Convenios de Tokio, La Haya y Montreal',
    'Aeronavegabilidad, nacionalidad y matrícula (en España, prefijo EC-)',
    'Licencias de la tripulación (Part-FCL) y certificados médicos (Part-MED)',
    'Reglamento del Aire: SERA (Reglamento 923/2012)',
    'Procedimientos de navegación aérea (PANS-OPS), servicios de tránsito aéreo (ATS) y espacio aéreo',
    'Servicios de información aeronáutica (AIS), aeródromos, búsqueda y salvamento (SAR)',
    'Seguridad, notificación e investigación de accidentes; derecho nacional',
  ],
  blocks: [
    {
      title: 'Mínimos VMC (SERA.5001, tabla S5-1)',
      text: ['Es la tabla más preguntada de todo el teórico. En clase A no se admite VFR; sus mínimos son solo orientativos. Si la altitud de transición es inferior a 10.000 ft, la primera fila empieza en FL100.'],
      table: {
        head: ['Banda de altitud', 'Clases', 'Visibilidad', 'Distancia a nubes'],
        rows: [
          ['FL100 o superior', 'A*–G', '8 km', '1500 m horizontal · 1000 ft vertical'],
          ['Bajo FL100 y por encima de 3000 ft AMSL o 1000 ft sobre el terreno (lo mayor)', 'A*–G', '5 km', '1500 m · 1000 ft'],
          ['A 3000 ft AMSL / 1000 ft AGL o por debajo', 'A*–E', '5 km', '1500 m · 1000 ft'],
          ['Misma banda', 'F y G', '5 km (la autoridad puede reducir a 1500 m a ≤ 140 kt)', 'Libre de nubes y con la superficie a la vista'],
        ],
        src: 'SERA.5001',
      },
      bullets: ['Mnemotecnia: «8-5-5 / 1500-1000» y «en F/G bajo: libre de nubes viendo el suelo».', 'No está verificado si España aplica la reducción a 1500 m en F/G: consulta el AIP.'],
    },
    {
      title: 'Más cifras de VFR (SERA.5005)',
      bullets: [
        'Sin VFR especial no se despega, aterriza ni entra en el circuito de una CTR con **techo < 1500 ft** o **visibilidad en tierra < 5 km**.',
        'VFR nocturno: plan de vuelo si se sale del entorno del aeródromo, techo ≥ 1500 ft, tabla S5-1 sin reducciones y superficie a la vista por debajo de 3000 ft AMSL/1000 ft AGL.',
        'Altitud mínima de noche: **1000 ft** sobre el obstáculo más alto en 8 km (**2000 ft** en terreno montañoso).',
        'Alturas mínimas: **1000 ft** sobre el obstáculo más alto en un radio de **600 m** sobre zonas congestionadas; **500 ft** en el resto. Volar más bajo en España requiere autorización de AESA (RD 1180/2018).',
        'No hay VFR por encima de **FL195** (salvo excepciones).',
      ],
    },
    {
      title: 'Niveles semicirculares VFR',
      text: ['Por encima de 3000 ft sobre el terreno, el nivel depende de la **derrota magnética** (no del rumbo).'],
      table: { head: ['Derrota magnética', 'Nivel VFR', 'Ejemplos'], rows: [['000°–179°', 'Miles impares + 500', 'FL35, FL55, FL75'], ['180°–359°', 'Miles pares + 500', 'FL45, FL65, FL85']] },
      examples: [{ q: 'Derrota 095° y quieres volar a unos 6000 ft.', a: 'Derrota entre 000 y 179: impares + 500 → FL55 o FL75.' }],
    },
    {
      title: 'Clases de espacio aéreo (SERA.6001)',
      table: {
        head: ['Clase', 'VFR', 'Separación del VFR', 'Autorización ATC', 'Radio'],
        rows: [
          ['A', 'No', '—', '—', '—'],
          ['B', 'Sí', 'De todos', 'Sí', 'Continua bilateral'],
          ['C', 'Sí', 'Del IFR; información VFR/VFR', 'Sí', 'Sí'],
          ['D', 'Sí', 'No; información de tráfico', 'Sí', 'Sí'],
          ['E', 'Sí', 'No', 'No', 'No exigida (salvo RMZ/TMZ)'],
          ['F y G', 'Sí', 'No; FIS', 'No', 'No exigida (salvo RMZ/TMZ)'],
        ],
      },
      bullets: ['Límite de 250 kt por debajo de FL100 para VFR en C–G.', 'Trampa: en clase **D** hace falta autorización pero **no** hay separación; en **E** el VFR no necesita autorización.', 'Zonas en España: LE-P (prohibidas), LE-R (restringidas), LE-D (peligrosas); ver AIP ENR 5.1.'],
    },
    {
      title: 'Derecho de paso (SERA.3210)',
      bullets: [
        'De frente: ambos viran a la **derecha**.',
        'Convergentes: cede el paso quien tiene al otro a su **derecha**.',
        'Alcance (por detrás, a menos de 70° del eje): el que alcanza adelanta por la **derecha**.',
        'Prioridad: **globos > planeadores > dirigibles > aeronaves remolcando > aerodinos propulsados**.',
        'La que aterriza tiene prioridad; entre dos, la más baja; una aeronave en emergencia, sobre todas.',
      ],
    },
    {
      title: 'Señales luminosas desde la torre (SERA, apéndice 1)',
      table: {
        head: ['Señal', 'En vuelo', 'En tierra'],
        rows: [
          ['Verde fija', 'Autorizado a aterrizar', 'Autorizado a despegar'],
          ['Roja fija', 'Ceda el paso y siga en circuito', 'Alto'],
          ['Destellos verdes', 'Regrese para aterrizar', 'Autorizado a rodar'],
          ['Destellos rojos', 'Aeródromo peligroso, no aterrice', 'Apártese del área de aterrizaje'],
          ['Destellos blancos', 'Aterrice aquí y vaya a la plataforma', 'Regrese al punto de partida'],
          ['Pirotecnia roja', 'No aterrice por ahora', '—'],
        ],
      },
      bullets: ['Acuse de recibo: alabear de día, destellar luces de noche.'],
    },
    {
      title: 'Transpondedor, interceptación, plan de vuelo y accidentes',
      bullets: [
        'Códigos: **7000** VFR · **7500** interferencia ilícita · **7600** fallo de radio · **7700** emergencia. Al cambiar, evita pasar por 75, 76 o 77.',
        'Interceptación: el interceptor alabea y vira lento a la izquierda («sígame»). El interceptado llama en **121,5 MHz** y pone **A7700**.',
        'Plan de vuelo: presentar **60 min** antes de la EOBT; modificar con 30 min de retraso (controlado) o 1 h (no controlado). **INCERFA** a los 30 min sin noticias.',
        'Accidentes: Reglamentos 996/2010 y 376/2014; notificación en **72 h**. En España investiga la **CIAIAC**; el fin es prevenir, no culpar.',
        'Número de pista = rumbo magnético / 10. Letreros obligatorios: blanco sobre rojo.',
      ],
    },
    {
      title: 'Anexos OACI que hay que saber',
      table: { head: ['Anexo', 'Tema'], rows: [['1', 'Licencias'], ['2', 'Reglamento del Aire'], ['3', 'Meteorología'], ['6', 'Operación de aeronaves'], ['7', 'Marcas de nacionalidad y matrícula'], ['8', 'Aeronavegabilidad'], ['10', 'Telecomunicaciones'], ['11', 'Servicios de tránsito aéreo'], ['12', 'Búsqueda y salvamento'], ['13', 'Investigación de accidentes'], ['14', 'Aeródromos'], ['15', 'AIS'], ['17', 'Seguridad (actos ilícitos)'], ['18', 'Mercancías peligrosas'], ['19', 'Gestión de la seguridad operacional']] },
      bullets: ['1.ª libertad: sobrevolar; 2.ª: aterrizar por motivos técnicos.', 'Trampa: el Anexo 2 no admite diferencias sobre alta mar.'],
    },
    {
      title: '🇪🇸 Lo que España añade (AIP GEN 1.7)',
      text: ['Material diferencial frente a los bancos británicos: estudia esto con especial cuidado.'],
      bullets: [
        '**VFR especial**: solo dentro de una CTR, **solo de día**, libre de nubes, superficie a la vista, visibilidad **1500 m**, ≤ **140 kt**. No se autoriza con visibilidad en tierra < 1500 m o **techo < 600 ft**.',
        'Plan de vuelo obligatorio para **todo vuelo nocturno** que abandone las inmediaciones del aeródromo.',
        'Lista de colaciones obligatorias más amplia que la estándar; números dígito a dígito; rumbos acabados en cero añaden «GRADOS».',
        'Los alumnos que vuelan solos usan el prefijo «**STUDENT**».',
      ],
    },
  ],
  traps: [
    'Los niveles semicirculares se eligen por **derrota magnética**, no por rumbo.',
    'Clase D: autorización sí, separación VFR/VFR no. Clase E: el VFR no necesita autorización.',
    'VFR especial en España: solo de día (en SERA genérico se permite de noche si la autoridad lo autoriza).',
    'El límite de 1500 ft de techo para entrar en una CTR es sin VFR especial.',
    'Roja fija en vuelo no es «no aterrice»: es «ceda el paso y siga en circuito». «No aterrice, aeródromo peligroso» son destellos rojos.',
    'Los mínimos «libre de nubes con superficie a la vista» solo valen por debajo de 3000 ft AMSL/1000 ft AGL en F y G.',
  ],
  mnemonics: ['VMC: «8-5-5 / 1500-1000».', 'Semicircular: «Este impar, Oeste par» (+500 en VFR).', 'Prioridad: «Globo, Planeador, Dirigible, Remolque, Avión».'],
  books: {
    es: [{ title: 'No hay un libro de Derecho aéreo de Paraninfo localizado; usa el Reglamento y el AIP', note: 'Comprueba la versión del banco de tu escuela' }],
    en: [APM('vol. 2: Law & Meteorology'), { title: 'AFE EASA PPL Revision Guide: Air Law — Jeremy M. Pratt', url: 'https://flightstore.co.uk/product/afe-easa-ppl-air-law-revision-guide-4793' }],
    free: [
      { title: 'SERA — Easy Access Rules (EASA)', url: URL.sera },
      { title: 'AIP España GEN 1.7: diferencias con OACI (ENAIRE)', url: URL.aipGen17 },
      { title: 'Guía VFR digital (ENAIRE)', url: URL.enaireVfr },
      { title: 'Part-FCL — Easy Access Rules for Aircrew (EASA)', url: URL.fcl },
    ],
  },
  quiz: [
    { q: 'Visibilidad mínima VMC a FL100 o superior:', options: ['5 km', '8 km', '1500 m', '10 km'], correct: 1, why: 'SERA.5001: a FL100 o más, 8 km y 1500 m / 1000 ft de las nubes.' },
    { q: 'En espacio clase G, a 800 ft AGL, ¿qué distancia a nubes exige SERA?', options: ['1500 m horizontal y 1000 ft vertical', 'Libre de nubes y con la superficie a la vista', '1000 m horizontal', '600 m y 500 ft'], correct: 1, why: 'Por debajo de 3000 ft AMSL / 1000 ft AGL en F y G basta con estar libre de nubes y ver la superficie.' },
    { q: 'Con derrota magnética 095° por encima de 3000 ft AGL, ¿qué nivel VFR es correcto?', options: ['FL60', 'FL45', 'FL55', 'FL50'], correct: 2, why: 'De 000° a 179°: miles impares + 500 → FL35, FL55, FL75…' },
    { q: 'Sin VFR especial, no puedes entrar en el circuito de una CTR si el techo es inferior a:', options: ['500 ft', '1000 ft', '1500 ft', '3000 ft'], correct: 2, why: 'SERA.5005: techo 1500 ft y visibilidad en tierra 5 km.' },
    { q: 'Una luz verde fija dirigida a una aeronave en vuelo significa:', options: ['Regrese para aterrizar', 'Autorizado a aterrizar', 'Siga en circuito', 'Aterrice y vaya a plataforma'], correct: 1, why: 'Verde fija en vuelo = autorizado a aterrizar; en tierra = autorizado a despegar.' },
    { q: 'Código de transpondedor para fallo de comunicaciones:', options: ['7500', '7700', '7600', '7000'], correct: 2, why: '7600 fallo de radio; 7500 interferencia ilícita; 7700 emergencia.' },
    { q: 'Dos aviones convergen a la misma altitud. ¿Quién cede el paso?', options: ['El más rápido', 'El que tiene al otro a su derecha', 'El que tiene al otro a su izquierda', 'El más alto'], correct: 1, why: 'SERA.3210: cede quien ve al otro por su derecha.' },
    { q: 'Según la tabla de prioridades, ¿quién tiene preferencia sobre todos los demás?', options: ['Un planeador', 'Un avión remolcando', 'Un globo', 'Un dirigible'], correct: 2, why: 'Globos > planeadores > dirigibles > aeronaves remolcando > aerodinos propulsados.' },
    { q: 'En España, el VFR especial se autoriza:', options: ['De día y de noche con 1500 m', 'Solo de día, con 1500 m de visibilidad y ≤ 140 kt', 'Solo de noche', 'Con 800 m en cualquier espacio'], correct: 1, why: 'AIP GEN 1.7: solo de día, dentro de una CTR, libre de nubes, 1500 m y ≤ 140 kt.' },
    { q: 'El Anexo OACI que trata las licencias del personal es el:', options: ['Anexo 2', 'Anexo 6', 'Anexo 1', 'Anexo 11'], correct: 2, why: 'Anexo 1 Licencias; 2 Reglamento del Aire; 6 Operación; 11 ATS.' },
    { q: 'Un vuelo VFR en espacio aéreo clase E:', options: ['Necesita autorización ATC', 'No necesita autorización ATC', 'No está permitido', 'Requiere plan de vuelo siempre'], correct: 1, why: 'En E el VFR no necesita autorización ni radio (salvo RMZ/TMZ).' },
    { q: 'Altura mínima sobre una ciudad (zona congestionada):', options: ['500 ft sobre el terreno', '1000 ft sobre el obstáculo más alto en 600 m', '1500 ft AGL', '2000 ft AMSL'], correct: 1, why: 'SERA.5005: 1000 ft sobre el obstáculo más alto en un radio de 600 m.' },
  ],
}

export const humanPerf: Subject = {
  id: 'factores-humanos', code: '040', name: 'Factores humanos', icon: '🧠',
  exam: { questions: 8, time: '15 min', pass: 6 },
  summary: 'Fisiología y psicología del piloto: hipoxia, ilusiones visuales y vestibulares, alcohol y medicación, estrés, fatiga, toma de decisiones, CRM y gestión de amenazas y errores (TEM). Pocas preguntas, pero de concepto: suelen buscar la dirección del error.',
  syllabus: [
    'Conceptos básicos: factor humano en los accidentes, modelo del queso suizo (Reason), modelo SHELL',
    'Fisiología aeronáutica: atmósfera y respiración, hipoxia, hiperventilación, CO, descompresión',
    'Visión, audición y sistema vestibular; ilusiones y desorientación espacial',
    'Salud e higiene: alcohol, medicación, fatiga, ritmo circadiano, buceo',
    'Psicología: procesamiento de información, atención, error, decisión, estrés, carga de trabajo',
    'TEM (amenazas, errores, estados no deseados) y CRM',
  ],
  blocks: [
    {
      title: 'Atmósfera y oxígeno',
      bullets: [
        'El oxígeno es **siempre el 21 %** del aire. Lo que baja con la altitud es su **presión parcial**.',
        'La presión total se reduce a la mitad hacia los 18.000 ft.',
        'NCO.OP.190: la tripulación usa oxígeno por encima de **10.000 ft durante más de 30 min**; todos los ocupantes, **siempre por encima de 13.000 ft**.',
      ],
    },
    {
      title: 'Etapas de la hipoxia',
      verify: true,
      table: {
        head: ['Etapa', 'Altitud', 'Efecto', 'Tiempo útil de consciencia'],
        rows: [['Indiferente', '0–10.000 ft', 'Visión nocturna degradada desde ~5000 ft', '—'], ['Compensatoria', '10.000–15.000 ft', 'Más respiración y pulso; juicio afectado', 'FL180: 20–30 min'], ['De alteración', '15.000–20.000 ft', 'Euforia, cianosis, descoordinación', 'FL250: 3–5 min'], ['Crítica', '> 20.000 ft', 'Incapacitación', 'FL300: 1–2 min · FL350: 30–60 s']],
      },
      bullets: [
        'La **euforia** es el síntoma más peligroso: el piloto no se da cuenta.',
        'Hiperventilación (expulsar demasiado CO₂, por ansiedad) da síntomas parecidos. En altitud, si dudas, **trátalo como hipoxia**.',
        'Monóxido de carbono: 200–250 veces más afinidad por la hemoglobina que el O₂; suele entrar por la calefacción.',
        'Tras bucear: esperar 12 h (24 h si hubo paradas de descompresión). El barotrauma de oído afecta más en el **descenso**.',
      ],
    },
    {
      title: 'Visión y oído interno',
      bullets: [
        'Conos (fóvea): color y detalle. Bastones (periferia): visión nocturna.',
        'Adaptación a la oscuridad: unos **30 min**. De noche se mira descentrado 10–20°.',
        'Un objeto con **marcación relativa constante** que crece está en **rumbo de colisión**.',
        'Canales semicirculares: aceleraciones angulares. Otolitos: aceleraciones lineales.',
        '*Leans*: tras un alabeo lento (< ~2°/s) te crees nivelado. Espiral mortal: en viraje prolongado dejas de sentir el giro. Coriolis: mover la cabeza en un viraje (la más peligrosa). Somatogravica: una aceleración se siente como morro arriba → tiendes a bajar el morro.',
      ],
    },
    {
      title: 'Ilusiones en la aproximación',
      table: {
        head: ['Situación', 'El piloto se cree…', 'Error resultante'],
        rows: [['Pista ascendente', 'Alto', 'Aproximación **baja**'], ['Pista descendente', 'Bajo', 'Aproximación alta'], ['Pista estrecha o larga', 'Alto', 'Aproximación **baja**'], ['Pista ancha', 'Bajo', 'Aproximación alta'], ['«Agujero negro» nocturno', 'Más alto', 'Aproximación **muy baja**'], ['Lluvia en el parabrisas o bruma', 'Más alto', 'Aproximación baja']],
      },
      bullets: ['Mnemotecnia: «arriba o estrecha: te crees alto y vas bajo».'],
    },
    {
      title: 'Alcohol, medicación y aptitud',
      bullets: [
        'No beber en las **8 h** previas y no superar **0,2 g/l** (0,02 %), o el límite nacional si es más estricto.',
        'Las 8 h no garantizan estar por debajo del límite.',
        'SERA.2020 prohíbe volar bajo sustancias psicoactivas. MED.A.020: no ejerzas atribuciones si sabes o sospechas que tu aptitud ha disminuido.',
        'Chequeo **IMSAFE**: enfermedad, medicación, estrés, alcohol, fatiga, alimentación/emociones.',
      ],
    },
    {
      title: 'Psicología, decisión y TEM',
      bullets: [
        'Modelos de decisión: **DECIDE** y **FOR-DEC**.',
        'Actitudes peligrosas y su antídoto: antiautoridad («las normas suelen tener razón»), impulsividad («más despacio»), invulnerabilidad («me puede pasar a mí»), machismo («arriesgarse es una tontería»), resignación («puedo cambiar las cosas»).',
        'Curva de Yerkes-Dodson: rendimiento óptimo con activación moderada; la infracarga también es un riesgo.',
        'Mínimo circadiano de alerta: 03:00–05:00.',
        'TEM: **amenazas** (externas: meteo, tráfico), **errores** (del piloto) y **estados no deseados** de la aeronave.',
      ],
    },
  ],
  traps: [
    'El % de oxígeno no cambia con la altitud; cambia su presión parcial.',
    'Ilusiones: las preguntas buscan la dirección del error (pista ascendente → aproximación baja).',
    'Duda entre hipoxia e hiperventilación en altura → trata como hipoxia.',
    'Somatogravica: aceleración = sensación de morro arriba; el peligro es bajar el morro hacia el terreno.',
    'La regla de las 8 h es un mínimo, no una garantía.',
  ],
  mnemonics: ['IMSAFE antes de cada vuelo.', '«Arriba o estrecha: te crees alto y vas bajo».'],
  books: {
    es: [{ title: 'Factores Humanos, 3.ª ed. (Paraninfo) — alineado con EASA', url: 'https://buckerbook.es/gb/human-performance-and-limitations/factores-humanos-3rd-edition-paraninfo', note: '≈ 25 €' }],
    en: [APM('vol. 6: Human Performance & Operational Procedures'), { title: "Pooleys — Human Performance for Pilots Simplified", note: 'Serie de bolsillo, ≈ 13–15 €' }],
    free: [{ title: 'Air Ops Easy Access Rules — Part-NCO (oxígeno NCO.OP.190)', url: URL.airops }, { title: 'Part-MED — Easy Access Rules (EASA)', url: URL.fcl }],
  },
  quiz: [
    { q: 'A 10.000 ft, el porcentaje de oxígeno en el aire es:', options: ['Un 15 %', 'El 21 %, igual que al nivel del mar', 'Un 10 %', 'Un 18 %'], correct: 1, why: 'El porcentaje no cambia; baja la presión parcial del oxígeno.' },
    { q: 'El síntoma de hipoxia más peligroso es:', options: ['El dolor de cabeza', 'La euforia', 'La cianosis', 'La somnolencia'], correct: 1, why: 'La euforia impide al piloto darse cuenta de su estado.' },
    { q: 'En altitud no distingues si tienes hipoxia o hiperventilación. Debes:', options: ['Tratarlo como hiperventilación', 'Tratarlo como hipoxia', 'Respirar en una bolsa', 'Ascender'], correct: 1, why: 'La hipoxia es la más peligrosa: se trata primero (oxígeno, descenso).' },
    { q: 'Una pista con pendiente ascendente hace que el piloto tienda a:', options: ['Aproximar alto', 'Aproximar bajo', 'Aterrizar largo', 'No tiene efecto'], correct: 1, why: 'Se cree alto y corrige bajando: aproximación baja.' },
    { q: 'Normativa EASA sobre alcohol para la tripulación:', options: ['12 h sin beber y 0,5 g/l', '8 h sin beber y ≤ 0,2 g/l', '24 h y 0,0 g/l', '4 h y 0,3 g/l'], correct: 1, why: 'No beber en las 8 h previas y no superar 0,2 g/l (o el límite nacional, si es más estricto).' },
    { q: 'Según Part-NCO, la tripulación debe usar oxígeno:', options: ['Siempre por encima de 8000 ft', 'Por encima de 10.000 ft durante más de 30 min', 'Solo por encima de 15.000 ft', 'Nunca en aviación general'], correct: 1, why: 'NCO.OP.190: > 10.000 ft más de 30 min; todos los ocupantes siempre por encima de 13.000 ft.' },
    { q: 'Un avión que mantiene una marcación relativa constante y aumenta de tamaño:', options: ['Se aleja', 'Está en rumbo de colisión', 'Va a cruzar por detrás', 'Es una ilusión'], correct: 1, why: 'Marcación constante y objeto creciendo = trayectoria de colisión.' },
    { q: '«A mí no me va a pasar» corresponde a la actitud de:', options: ['Impulsividad', 'Machismo', 'Invulnerabilidad', 'Resignación'], correct: 2, why: 'Invulnerabilidad; su antídoto es «me puede pasar a mí».' },
    { q: 'En el modelo TEM, una tormenta en la ruta es:', options: ['Un error', 'Una amenaza', 'Un estado no deseado', 'Una violación'], correct: 1, why: 'Las amenazas son externas al piloto; los errores, suyos.' },
    { q: 'La ilusión somatogravica en un despegue nocturno produce sensación de:', options: ['Morro abajo', 'Morro arriba', 'Alabeo a la izquierda', 'Descenso'], correct: 1, why: 'La aceleración se percibe como morro arriba y el piloto tiende a picar.' },
  ],
}

export const meteo: Subject = {
  id: 'meteorologia', code: '050', name: 'Meteorología', icon: '⛅',
  exam: { questions: 8, time: '15 min', pass: 6 },
  summary: 'La atmósfera estándar, altimetría, viento, estabilidad, nubes y nieblas, frentes, tormentas, engelamiento y, sobre todo, saber leer los productos de AEMET (METAR, TAF, SIGMET, GAMET, SIGWX).',
  syllabus: ['La atmósfera e ISA', 'Altimetría (QNH, QFE, QNE)', 'Viento (Buys Ballot, geostrófico, locales)', 'Termodinámica y estabilidad', 'Nubes y niebla', 'Precipitación', 'Masas de aire y frentes', 'Sistemas de presión y climatología', 'Riesgos para el vuelo: tormentas, engelamiento, turbulencia, cizalladura', 'Información meteorológica'],
  blocks: [
    {
      title: 'Atmósfera estándar ISA (OACI Doc 7488)',
      table: { head: ['Parámetro', 'Valor'], rows: [['Temperatura al nivel del mar', '+15 °C'], ['Presión al nivel del mar', '1013,25 hPa (29,92 inHg)'], ['Densidad', '1,225 kg/m³'], ['Gradiente térmico', '−1,98 °C/1000 ft (~2 °C) hasta 36.090 ft'], ['Tropopausa', '36.090 ft, −56,5 °C'], ['Presión frente a altura', '~27 ft/hPa cerca del suelo (30 en cálculo rápido)']] },
      formulas: [{ f: 'T ISA (°C) = 15 − 2 × (miles de ft)', note: 'A 8000 ft: −1 °C. Con OAT +9 °C → ISA+10.' }],
    },
    {
      title: 'Altimetría',
      bullets: [
        'Con **QNH** el altímetro indica **altitud**; con **QFE**, **altura** sobre el aeródromo; con **1013,25**, **nivel de vuelo**.',
        'Ascenso: cambia a 1013 al pasar la **altitud** de transición. Descenso: a QNH al pasar el **nivel** de transición.',
        '«**De alta a baja, cuidado abajo**»: volando hacia menor presión o aire más frío sin reajustar, estás más bajo de lo que indica.',
        'Aire frío: corrección de ~**4 % por cada 10 °C** por debajo de ISA.',
        'Trampa: el aire húmedo es **menos** denso que el seco.',
      ],
      examples: [{ q: 'Llevas 1013 calado, el QNH real es 1003 y el altímetro marca 3000 ft. ¿Altitud real?', a: '10 hPa × 27 ft ≈ 270 ft menos → unos 2730 ft.' }],
    },
    {
      title: 'Viento',
      bullets: [
        'Hemisferio norte, **Buys Ballot**: con la espalda al viento, la baja queda a la **izquierda**.',
        'Geostrófico: paralelo a las isobaras sobre la capa de fricción. Gradiente: supergeostrófico en anticiclones, subgeostrófico en borrascas.',
        'En superficie, sobre tierra, rola ~**30° a la izquierda** y pierde ~**50 %**; sobre el mar, ~10° y ~30 %. Al ascender rola a la derecha y aumenta.',
        'Foehn: aire más cálido y seco a sotavento (viento sur del Cantábrico, terral malagueño).',
        'Onda de montaña: viento > ~20 kt perpendicular a la cresta → lenticulares y rotores.',
      ],
    },
    {
      title: 'Estabilidad y nubes',
      formulas: [{ f: 'DALR = 3 °C/1000 ft · SALR ≈ 1,8 °C/1000 ft' }, { f: 'Base de cúmulos ≈ (T − Td) × 400 ft', note: '20 °C y 12 °C → 3200 ft AGL' }],
      bullets: [
        'Absolutamente estable: ELR < SALR. Inestable: ELR > DALR. Condicionalmente inestable: entre ambos.',
        'Nubes altas: Ci, Cc, Cs. Medias: Ac, As. Bajas: St, Sc, Ns. Desarrollo vertical: Cu, Cb.',
        'Llovizna de St; lluvia continua de Ns; chubascos de Cu/Cb; granizo de Cb.',
      ],
    },
    {
      title: 'Niebla, masas de aire y frentes',
      verify: true,
      bullets: [
        'Niebla (FG) < 1000 m; neblina (BR) 1000–5000 m; calima (HZ) partículas secas.',
        '**Radiación**: sobre tierra, cielo despejado, viento flojo (2–8 kt). **Advección**: aire húmedo sobre superficie fría; persiste con viento.',
        'Masas sobre España: polar marítima (chubascos, buena visibilidad), tropical marítima (estratos, llovizna), tropical continental (calima), polar continental (frío seco).',
        'Frente cálido: pendiente ~1:150, Ci-Cs-As-Ns, lluvia continua. Frente frío: 1:50–1:80, Cb, chubascos, viento rola bruscamente a la derecha.',
        'DANA (gota fría): tormentas en el Mediterráneo en otoño.',
      ],
    },
    {
      title: 'Tormentas, engelamiento y cizalladura',
      verify: true,
      bullets: [
        'Una tormenta necesita inestabilidad, humedad y un disparador. La fase de **madurez** es la más peligrosa.',
        'Sepárate **10 NM** de una tormenta (**20 NM** si es severa).',
        'Microrráfaga: < 4 km, 5–15 min. Secuencia: más viento de cara → descendente → viento en cola.',
        'Hielo claro (0 a −10 °C, gotas grandes): el más peligroso. Escarcha opaca (*rime*, −10 a −20 °C). Lluvia engelante: salir de inmediato.',
      ],
    },
    {
      title: 'Productos de AEMET',
      table: {
        head: ['Producto', 'Frecuencia / validez', 'Claves'],
        rows: [
          ['METAR', 'Cada 30 min', 'Viento medio 10 min; G si racha ≥ 10 kt sobre la media; 9999 = ≥ 10 km; RVR si vis < 1500 m'],
          ['TREND', '2 h', 'NOSIG, BECMG, TEMPO'],
          ['TAF', '24 o 30 h', 'BECMG en 2 h (máx. 4); PROB30/40'],
          ['SIGMET', '≤ 4 h (6 h cenizas)', 'Fenómenos severos; FIR Madrid y Barcelona desde LEVA'],
          ['AIRMET', '≤ 4 h', 'Fenómenos moderados bajo FL150'],
          ['GAMET', 'Cada 6 h, válido 6 h', 'Bajo FL150; secciones I y II (FZLVL, MNM QNH)'],
          ['SIGWX SFC/150', '±3 h', 'Mapa de baja cota'],
        ],
        src: 'AEMET AU-GUI-0102',
      },
      bullets: ['Nubosidad: FEW 1–2 octas, SCT 3–4, BKN 5–7, OVC 8. **Solo BKN y OVC son techo**.', '**CAVOK**: visibilidad ≥ 10 km, sin nubes bajo 5000 ft (o MSA), sin CB/TCU ni tiempo significativo.', 'Alturas del METAR: AGL. Alturas del SIGWX: AMSL.', 'Se consultan en el portal **AMA** de AEMET (requiere registro).'],
      examples: [{ q: 'METAR LEMD 081030Z 22012G25KT 190V250 6000 -RA SCT015 BKN030 18/14 Q1008 NOSIG', a: 'Madrid, día 8 a las 10:30 Z. Viento 220° 12 kt con rachas de 25, variable 190°–250°. Visibilidad 6 km, lluvia ligera. Nubes dispersas a 1500 ft, techo (BKN) a 3000 ft. 18 °C, rocío 14 °C, QNH 1008, sin cambios significativos.' }],
    },
  ],
  traps: ['El aire húmedo es menos denso que el seco.', 'Solo BKN y OVC cuentan como techo.', 'Alturas del METAR en AGL; las del SIGWX en AMSL.', 'De alta a baja presión sin reajustar: estás más bajo de lo que indica el altímetro.', 'El viento en superficie rola a la izquierda (HN) respecto al geostrófico.'],
  mnemonics: ['«De alta a baja, cuidado abajo».', 'Base de cúmulos: diferencia T–Td × 400 ft.'],
  books: {
    es: [{ title: 'Meteorología, 3.ª ed. (Paraninfo) — alineado con EASA, 150 preguntas', url: 'https://buckerbook.es/gb/meteorology/meteorologia-3rd-edition-paraninfo', note: '≈ 29 €' }, { title: 'Apuntes de Meteorología Aeronáutica (AEMET, gratis, v3 2025)', url: URL.aemetNotes, note: 'Escritos para alumnos militares de helicóptero' }],
    en: [APM('vol. 2: Law & Meteorology')],
    free: [{ title: 'Guía de productos aeronáuticos AU-GUI-0102 (AEMET)', url: URL.aemetGuide }, { title: 'Portal AMA — Meteorología aeronáutica (AEMET)', url: URL.ama }],
  },
  quiz: [
    { q: 'Valores ISA al nivel del mar:', options: ['10 °C y 1000 hPa', '15 °C y 1013,25 hPa', '20 °C y 1013 hPa', '15 °C y 1020 hPa'], correct: 1, why: 'ISA: +15 °C, 1013,25 hPa, 1,225 kg/m³.' },
    { q: 'Temperatura ISA a 8000 ft:', options: ['+1 °C', '−1 °C', '−5 °C', '+7 °C'], correct: 1, why: '15 − 2 × 8 = −1 °C.' },
    { q: 'Vuelas hacia una zona de menor presión sin reajustar el altímetro. Tu altitud real es:', options: ['Mayor que la indicada', 'Menor que la indicada', 'Igual', 'Depende del viento'], correct: 1, why: '«De alta a baja, cuidado abajo».' },
    { q: 'Temperatura 20 °C y punto de rocío 12 °C. Base aproximada de los cúmulos:', options: ['1600 ft', '3200 ft', '4800 ft', '800 ft'], correct: 1, why: '(20 − 12) × 400 = 3200 ft AGL.' },
    { q: 'En el hemisferio norte, con la espalda al viento, la baja presión queda:', options: ['A la derecha', 'A la izquierda', 'Delante', 'Detrás'], correct: 1, why: 'Ley de Buys Ballot.' },
    { q: 'La niebla de radiación se forma típicamente:', options: ['Con viento fuerte sobre el mar', 'Sobre tierra, en noches despejadas con viento flojo', 'Detrás de un frente frío', 'En tormentas'], correct: 1, why: 'Enfriamiento nocturno del suelo con cielo despejado y viento flojo (2–8 kt).' },
    { q: 'En un METAR, «BKN030» significa:', options: ['Nubes dispersas a 300 ft', '5–7 octas a 3000 ft AGL', '8 octas a 30.000 ft', '1–2 octas a 3000 ft'], correct: 1, why: 'BKN = 5–7 octas; altura en cientos de ft AGL. Es techo.' },
    { q: 'CAVOK exige, entre otras cosas:', options: ['Visibilidad ≥ 5 km', 'Visibilidad ≥ 10 km y sin CB ni TCU', 'Sin viento', 'Cielo totalmente despejado'], correct: 1, why: 'Visibilidad ≥ 10 km, sin nubes bajo 5000 ft (o MSA), sin CB/TCU y sin tiempo significativo.' },
    { q: 'La fase más peligrosa de una tormenta es:', options: ['Cúmulo', 'Madurez', 'Disipación', 'Todas por igual'], correct: 1, why: 'En madurez hay corrientes ascendentes y descendentes, microrráfagas y granizo.' },
    { q: 'Validez máxima de un SIGMET (que no sea de cenizas):', options: ['2 h', '4 h', '6 h', '12 h'], correct: 1, why: 'Hasta 4 h; 6 h para cenizas volcánicas.' },
  ],
}

export const comms: Subject = {
  id: 'comunicaciones', code: '090', name: 'Comunicaciones', icon: '📻',
  exam: { questions: 8, time: '15 min', pass: 6 },
  summary: 'Radiotelefonía VFR: alfabeto, técnica de transmisión, palabras normalizadas, colaciones obligatorias en España, fraseología de salida y llegada, socorro y urgencia, y fallo de comunicaciones.',
  syllabus: ['Definiciones y categorías de mensajes', 'Técnica de transmisión y pronunciación', 'Palabras y frases normalizadas', 'Distintivos de llamada', 'Colaciones', 'Procedimientos de salida, en ruta y llegada', 'Información meteorológica', 'Fallo de comunicaciones', 'Socorro y urgencia', 'Propagación VHF'],
  blocks: [
    {
      title: 'Prioridad de los mensajes',
      bullets: ['**Socorro** (MAYDAY) > **urgencia** (PAN PAN) > radiogoniometría > seguridad de vuelo > meteorología > regularidad.'],
    },
    {
      title: 'Pronunciación y números en España',
      bullets: [
        'Alfabeto OACI: Alfa… Zulu (*Juliett*, *X-ray*). En inglés: *tree*, *fower*, *fife*, *niner*.',
        'Distintivos, rumbos, pistas, viento y reglajes de altímetro: **dígito a dígito** (salvo centenas y millares redondos).',
        'Frecuencias: 6 dígitos en 8,33 kHz; 5 en 25 kHz.',
        'Transpondedor: dígito a dígito, salvo millares redondos («squawk seven thousand»).',
      ],
    },
    {
      title: 'Palabras normalizadas (trampas fijas)',
      bullets: [
        '**ROGER**: «he recibido toda su transmisión». Nunca sirve para responder a una pregunta ni a algo que haya que colacionar.',
        '**WILCO**: «recibido y cumpliré» (incluye ROGER).',
        '**AFFIRM** (no «affirmative»). **STANDBY**: «espere, le llamaré».',
        'Legibilidad de 1 (ilegible) a 5 (perfecta).',
        'El distintivo abreviado solo se usa después de que lo haga el ATS.',
      ],
    },
    {
      title: '🇪🇸 Colaciones obligatorias (AIP GEN 1.7)',
      bullets: ['Autorizaciones de ruta', 'Instrucciones de entrar, aterrizar, despegar, mantenerse fuera, cruzar, rodar o retroceder en pista', 'Pista en uso', 'Reglajes de altímetro', 'Códigos SSR', 'Cambios de frecuencia', 'Instrucciones de nivel, rumbo y velocidad', 'Niveles de transición', 'La colación termina con el distintivo.'],
      text: ['Mnemotecnia: «Ruta, Pista, Altímetro, Squawk, Frecuencia, Nivel-Rumbo-Velocidad, Transición».'],
    },
    {
      title: 'Ejemplo de salida',
      examples: [{ q: 'Piloto: «Sabadell Tower, EC-ABC, Cessna 172 at the aero club apron, information Bravo, QNH 1015, request taxi for VFR flight…»', a: 'Torre: «EC-BC, taxi holding point runway 13 via A, QNH 1015». Piloto (colación): «Taxi holding point runway 13 via A, QNH 1015, EC-BC».' }],
      bullets: ['Informe de posición: distintivo, posición, hora, altitud, siguiente punto y hora estimada.'],
    },
    {
      title: 'Socorro, urgencia y fallo de radio',
      bullets: [
        '**MAYDAY** (en la frecuencia en uso o en **121,5 MHz**, con **7700**): «MAYDAY» × 3, estación llamada, distintivo, naturaleza de la emergencia, intenciones, posición, nivel y rumbo, otros datos (personas a bordo, autonomía, «student pilot»).',
        '**PAN PAN**: mismo formato para urgencias que no requieren ayuda inmediata.',
        '«STOP TRANSMITTING, MAYDAY» impone silencio; «DISTRESS TRAFFIC ENDED» lo cierra; «MAYDAY RELAY» retransmite el socorro de otro.',
        '**Fallo de radio VFR**: comprueba el equipo, **7600**, transmite a ciegas repitiendo cada mensaje, sigue en VMC, aterriza en el **aeródromo adecuado más próximo** e informa de tu llegada. En un aeródromo controlado, obedece las señales luminosas.',
        'Trampa: mantener el último nivel y la ruta es un procedimiento **IFR**, no VFR.',
      ],
      formulas: [{ f: 'Alcance VHF ≈ 1,23 × √(altura en ft) NM', note: 'A 2500 ft: unas 61 NM. Banda COM: 118,000–136,975 MHz.' }],
    },
  ],
  traps: ['ROGER no colaciona nada.', 'Se dice AFFIRM, no affirmative.', 'Fallo de radio VFR: aeródromo adecuado más próximo en VMC (el procedimiento de mantener nivel y ruta es IFR).', 'El distintivo abreviado solo lo puedes usar si el ATS lo ha usado antes.'],
  mnemonics: ['Colaciones: «Ruta, Pista, Altímetro, Squawk, Frecuencia, Nivel-Rumbo-Velocidad, Transición».', 'MAYDAY: «quién, qué pasa, qué voy a hacer, dónde estoy».'],
  books: {
    es: [{ title: 'Comunicaciones (Seguridad en Vuelo), 2.ª ed. — Joaquín C. Adsuar (Paraninfo)', url: 'https://buckerbook.es/gb/communications/comunicaciones-seguridad-en-vuelo-paraninfo' }, { title: 'Guía de Fraseología del piloto VFR (Cépaduès)' }],
    en: [APM('vol. 7: Radiotelephony (fraseología británica CAP 413)')],
    free: [{ title: 'EGAST Radiotelephony Guide for VFR Pilots (EASA)', url: URL.egast }, { title: 'AIP España GEN 1.7 (ENAIRE)', url: URL.aipGen17 }, { title: 'Guía VFR digital (ENAIRE)', url: URL.enaireVfr }],
  },
  quiz: [
    { q: '«ROGER» significa:', options: ['Sí', 'He recibido toda su transmisión', 'Cumpliré', 'Repita'], correct: 1, why: 'Solo acusa recibo; no sirve para responder ni para colacionar.' },
    { q: '¿Cuál de estos elementos hay que colacionar en España?', options: ['La información de tráfico', 'El reglaje de altímetro (QNH)', 'La temperatura', 'La información ATIS'], correct: 1, why: 'Los reglajes de altímetro están en la lista de colaciones obligatorias.' },
    { q: '«WILCO» significa:', options: ['Repita', 'Recibido y cumpliré', 'Espere', 'Afirmativo'], correct: 1, why: 'WILCO = will comply; incluye ROGER.' },
    { q: 'Frecuencia internacional de emergencia:', options: ['118,0 MHz', '121,5 MHz', '123,45 MHz', '406 MHz'], correct: 1, why: '121,5 MHz (406 MHz es la frecuencia de satélite del ELT).' },
    { q: 'Fallo de radio en VFR. Debes:', options: ['Mantener el último nivel asignado y la ruta', 'Poner 7600, seguir en VMC y aterrizar en el aeródromo adecuado más próximo', 'Poner 7500', 'Volver siempre al aeródromo de salida'], correct: 1, why: 'Procedimiento VFR de SERA; mantener nivel y ruta es para IFR.' },
    { q: 'Alcance VHF aproximado a 2500 ft sobre una estación en el suelo:', options: ['25 NM', '61 NM', '120 NM', '200 NM'], correct: 1, why: '1,23 × √2500 = 1,23 × 50 ≈ 61 NM.' },
    { q: 'Mensaje con mayor prioridad:', options: ['PAN PAN', 'MAYDAY', 'Meteorología', 'Seguridad de vuelo'], correct: 1, why: 'Socorro (MAYDAY) > urgencia (PAN PAN) > …' },
    { q: '«STANDBY» significa:', options: ['Cumpliré', 'Espere, le llamaré', 'Repita', 'Fin de la transmisión'], correct: 1, why: 'Espere; el ATC le llamará.' },
    { q: 'En España, un alumno que vuela solo añade a su distintivo:', options: ['ALUMNO', 'STUDENT', 'TRAINEE', 'Nada'], correct: 1, why: 'AIP GEN 1.7: prefijo «STUDENT».' },
  ],
}

export const navigation: Subject = {
  id: 'navegacion', code: '060', name: 'Navegación', icon: '🧭',
  exam: { questions: 12, time: '25 min', pass: 9 },
  summary: 'Navegación general (la Tierra, el tiempo, magnetismo, cartas, estima con computador) y radionavegación (VOR, NDB/ADF, DME, VDF, GNSS). Muchas preguntas de cálculo: practica con el computador y la regla.',
  syllabus: ['9.1 La Tierra, tiempo, direcciones, distancias y magnetismo', 'Cartas: Mercator y Lambert; carta OACI 1:500.000', 'Navegación a estima: computador y triángulo de velocidades', 'Navegación en vuelo y procedimiento de extravío', '9.2 VDF, NDB/ADF, VOR, DME, radar y SSR, GNSS'],
  blocks: [
    {
      title: 'Fundamentos',
      verify: true,
      bullets: [
        '**1′ de latitud = 1 NM**. Un minuto de longitud solo mide 1 NM en el ecuador: distancia E-W = Δlong × cos(lat).',
        'Tiempo: 15° = 1 h; 1° = 4 min. Madrid (003° 40′ W): hora media local = UTC − 14 min 40 s.',
        'El crepúsculo civil termina con el Sol 6° bajo el horizonte.',
        'Carta de referencia en España: **VFR500 de ENAIRE**, 7 hojas a 1:500.000 (**1 cm = 5 km**). Proyección Lambert conforme: recta ≈ círculo máximo. En Mercator, una recta es una loxodrómica.',
      ],
      examples: [{ q: '¿Cuántas NM hay entre dos puntos separados 10° de longitud a 40° N?', a: '600 NM × cos 40° ≈ 459,6 NM.' }],
    },
    {
      title: 'TVMDC: verdadero → magnético → brújula',
      formulas: [{ f: 'Rumbo verdadero ± variación = magnético ± desvío = brújula', note: '«East is least, West is best»: la variación/desvío Este se resta, la Oeste se suma.' }],
      examples: [{ q: 'Rumbo verdadero 090°, variación 2° W, desvío 3° E.', a: 'Magnético 092° (oeste se suma); brújula 089° (este se resta).' }],
    },
    {
      title: 'Viento, deriva y regla de 1 en 60',
      formulas: [
        { f: 'Deriva máxima = viento × 60 / TAS', note: 'Regla del reloj: ¼, ½, ¾ o el total a 15°, 30°, 45° y 60° de ángulo de viento.' },
        { f: 'Error de derrota (°) = desplazamiento × 60 / distancia recorrida', note: 'Ángulo de cierre = desplazamiento × 60 / distancia restante.' },
        { f: 'Senda de 3° ≈ 300 ft/NM · régimen de descenso ≈ GS × 5 ft/min' },
      ],
      examples: [
        { q: 'Derrota 360°, TAS 100 kt, viento 270/20.', a: 'Corrección 12° a la izquierda: rumbo 348°, GS ≈ 98 kt.' },
        { q: 'Tramo de 90 NM; a las 30 NM estás 3 NM a la izquierda.', a: 'Error de derrota 6° + ángulo de cierre 3° → corrige **9° a la derecha**.' },
        { q: 'Bajar 4500 ft a 500 ft/min con 120 kt de GS.', a: '9 min × 2 NM/min = empieza el descenso 18 NM antes.' },
      ],
    },
    {
      title: 'Radioayudas',
      verify: true,
      table: {
        head: ['Ayuda', 'Banda', 'Qué indica', 'Regla clave', 'Trampa'],
        rows: [
          ['NDB/ADF', 'LF/MF 190–1750 kHz', 'Marcación relativa', 'QDM = RM + MR; QDR = QDM ± 180', 'Efecto nocturno y de costa; sin TO/FROM'],
          ['VOR', 'VHF 108–117,975 MHz', 'Radial magnético desde la estación', 'Deflexión completa 10°; 1 punto = 2°', 'El CDI no depende del rumbo'],
          ['DME', 'UHF 960–1215 MHz', 'Distancia oblicua', 'Sobre la estación a 6000 ft marca ~1 NM', 'GS solo correcta hacia/desde la estación'],
          ['VDF', 'VHF', 'QDM, QDR, QTE, QUJ desde tierra', 'Clases A ±2°, B ±5°, C ±10°', '—'],
          ['GNSS', 'Banda L', 'Posición 3D', '4 satélites para 3D; RAIM: 5 detecta, 6 excluye', 'Base de datos vigente; no sustituye a la visual'],
        ],
      },
      examples: [{ q: 'Rumbo magnético 050°, marcación relativa 030°.', a: 'QDM 080° (rumbo hacia la estación); QDR 260° (radial desde ella).' }],
    },
    {
      title: 'Procedimiento de extravío',
      bullets: ['Las «5 C»: **confesar**, **comunicar** (121,5 si hace falta), **ascender** (climb), **conservar** combustible y **comprobar** el direccional con la brújula.', 'Traza un círculo de incertidumbre de radio = 10 % de la distancia desde el último punto conocido.', 'Si se complica: aterrizaje de precaución mientras queden luz y combustible.'],
    },
  ],
  traps: ['La regla de 1 en 60 da el error de derrota y el de cierre: la corrección total es la suma.', 'El VOR indica radial (desde la estación), independientemente del rumbo del avión.', 'El DME mide distancia oblicua, no horizontal.', 'East is least, West is best: confundir el signo es el error más frecuente.'],
  mnemonics: ['«East is least, West is best».', 'Extraviado: las 5 C.'],
  books: {
    es: [{ title: 'Navegación Aérea, 3.ª ed. — Joaquín C. Adsuar (Paraninfo)', url: URL.buckerParaninfo, note: '≈ 43 €' }],
    en: [APM('vol. 3: Air Navigation (9.ª ed., 2024)'), APM('vol. 5: Radio Navigation & Instrument Flying'), { title: 'AFE EASA PPL Revision Guide: Navigation — Jeremy M. Pratt' }],
    free: [{ title: 'Cartas VFR500 (ENAIRE, consulta y descarga gratis)', url: URL.vfr500 }, { title: 'Insignia VFR (ENAIRE)', url: 'https://insignia.enaire.es/' }, { title: 'AIP España (ENAIRE)', url: URL.aip }],
  },
  quiz: [
    { q: 'Un minuto de latitud equivale a:', options: ['1 km', '1 NM', '1 milla terrestre', 'Depende de la latitud'], correct: 1, why: '1′ de latitud = 1 NM en cualquier lugar.' },
    { q: 'Rumbo verdadero 090° con variación 2° W. Rumbo magnético:', options: ['088°', '092°', '090°', '270°'], correct: 1, why: '«West is best»: se suma → 092°.' },
    { q: 'Viento de 20 kt y TAS 100 kt. Deriva máxima posible:', options: ['6°', '12°', '20°', '2°'], correct: 1, why: '20 × 60 / 100 = 12°.' },
    { q: 'En un tramo de 90 NM, a las 30 NM estás 3 NM desviado a la izquierda. Corrección para llegar al destino:', options: ['6° a la derecha', '3° a la derecha', '9° a la derecha', '9° a la izquierda'], correct: 2, why: 'Error 6° (3×60/30) + cierre 3° (3×60/60) = 9° a la derecha.' },
    { q: 'En una senda de 3° a 120 kt, el régimen de descenso aproximado es:', options: ['300 ft/min', '600 ft/min', '900 ft/min', '1200 ft/min'], correct: 1, why: 'GS × 5 = 600 ft/min.' },
    { q: 'Rumbo magnético 050° y marcación relativa del NDB 030°. QDM:', options: ['020°', '080°', '260°', '230°'], correct: 1, why: 'QDM = RM + MR = 080°.' },
    { q: 'El VOR proporciona:', options: ['Distancia a la estación', 'El radial magnético desde la estación', 'La marcación relativa', 'La posición GPS'], correct: 1, why: 'El VOR da radiales magnéticos desde la estación.' },
    { q: 'Sobrevolando una estación DME a 6000 ft, el DME indica:', options: ['0 NM', 'Aproximadamente 1 NM', '6 NM', 'No indica nada'], correct: 1, why: 'Mide distancia oblicua: 6000 ft ≈ 1 NM.' },
    { q: 'Satélites GNSS necesarios para una posición 3D:', options: ['3', '4', '5', '6'], correct: 1, why: '4 para 3D; 5 para detectar un fallo (RAIM) y 6 para excluirlo.' },
    { q: 'En una carta 1:500.000, 1 cm equivale a:', options: ['500 m', '5 km', '50 km', '5 NM'], correct: 1, why: '500.000 cm = 5 km.' },
  ],
}
