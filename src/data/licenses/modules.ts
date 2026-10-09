// Recorrido modular EASA Part-FCL en España: de la PPL(A) a la ATPL(A).
// Fuente: informe «Guía de estudio PPL EASA» (EASA Easy Access Rules nov. 2025, AESA FOR-EFT-GU01, BOE).
import type { Module } from './types'
import { URL, airLaw, comms, humanPerf, meteo, navigation } from './ppl-common'
import { agk, ops, perf, pof } from './ppl-aircraft'
import { phraseology } from './phraseology'

const EASA_P = (p: number) => `https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-aircrew-regulation-eu-no?page=${p}`
const AESA_GUIDE = 'https://www.senasa.es/recursos/adobePDF/2025/pdf/FOR-EFT-GU01_Ed_01_Examenes_teoricos_PART_%20FCL.pdf'

export const AIRHISPANIA = {
  title: 'Curso PPL VFR · Escuela AirHispania (simulación online)',
  url: 'https://pplvfrhispania.vercel.app/',
  text: 'Tu web de estudio del curso PPL VFR de la escuela de AirHispania, organizado en tutorías (VFR0 a VFR4): normativa, AHS-Connect, Bender, TeamSpeak, circuito de tráfico con la C172S y fraseología. Es formación en simulador, complementaria a la licencia real.',
}

export const PPL_REVIEWED = '2026-10-09'

export const ppl: Module = {
  id: 'ppl', name: 'PPL(A) · Licencia de piloto privado de avión', short: 'PPL(A)', icon: '', status: 'completo', stage: '1',
  summary: 'La puerta de entrada: volar aviones como piloto al mando sin remuneración. 17 años, certificado médico de clase 2, 45 h de vuelo, 9 exámenes teóricos de AESA y una prueba de pericia.',
  facts: [
    ['Edad', '17 años (16 para el primer solo)'],
    ['Médico', 'Clase 2, antes del primer solo'],
    ['Vuelo', '45 h: 25 de doble mando y 10 de solo supervisado'],
    ['Teoría', '9 materias, 120 preguntas en 3 h 35 min, 75 % en cada una'],
    ['Plazos', '4 intentos por materia, 18 meses para aprobarlas'],
    ['Habilitación', 'SEP, válida 24 meses'],
  ],
  featured: [AIRHISPANIA],
  sections: [
    {
      title: 'Cronología de la licencia',
      bullets: [
        '**1. Escuela.** Te matriculas en una ATO o DTO. La teoría y el vuelo se pueden hacer a la vez; FCL.210 no fija horas mínimas de teoría (las fija el programa de cada escuela).',
        '**2. Médico de clase 2** en un AeMC o con un AME, antes del primer vuelo solo.',
        '**3. Curso teórico** de las 9 materias. Al terminarlo, la escuela emite la **recomendación**, válida 12 meses (FCL.025(a)).',
        '**4. Exámenes de AESA.** Tienes **18 meses** desde el final del mes natural del primer intento para aprobar las 9 materias, con un máximo de **4 intentos por materia** (FCL.025(b)).',
        '**5. Vuelo.** Al menos 45 h (25 de doble mando, 10 de solo supervisado con 5 de travesía y una travesía de 150 NM con dos aterrizajes completos fuera del aeródromo de salida), con 2 h de pérdidas y prevención de barrena. Antes del primer solo, el instructor comprueba que manejas la radio y los sistemas.',
        '**6. Prueba de pericia** con un examinador, dentro de los **24 meses** desde que apruebas la última materia (FCL.025(c)).',
        '**7. Emisión** de la licencia por AESA, con la habilitación de clase SEP y la anotación de competencia lingüística.',
      ],
    },
    {
      title: 'Requisitos de la licencia',
      table: {
        head: ['', 'LAPL(A)', 'PPL(A)'],
        rows: [
          ['Edad mínima', '17 años (FCL.100)', '17 años (FCL.200)'],
          ['Certificado médico', 'LAPL', 'Clase 2'],
          ['Instrucción mínima', '30 h: 15 de doble mando y 6 de solo supervisado (travesía de 150 km / 80 NM)', '45 h: 25 de doble mando y 10 de solo supervisado (travesía de 270 km / 150 NM con 2 aterrizajes fuera)'],
          ['Aeronaves', 'SEP o TMG de hasta 2000 kg', 'Aviones y TMG, sin remuneración y no comercial'],
          ['Pasajeros', 'Hasta 3, tras 10 h como PIC', 'Con 3 despegues, aproximaciones y aterrizajes en 90 días (FCL.060)'],
          ['Mantener atribuciones', 'Experiencia reciente en 24 meses (12 h como PIC, 12 despegues y aterrizajes, 1 h de refresco)', 'Habilitación SEP de 24 meses'],
        ],
        src: 'FCL.105.A, FCL.110.A, FCL.140.A, FCL.205.A, FCL.210.A',
      },
      bullets: [
        'Hasta 5 h de las 45 pueden hacerse en un simulador (FSTD).',
        'Durante el curso hay al menos **2 h de entrenamiento de pérdidas y prevención de barrena** (AMC1 FCL.210, ejercicio 11).',
        'Crédito por otra licencia: el 10 % del tiempo como PIC en otra categoría, con un máximo de 10 h, nunca para el vuelo solo.',
        'De LAPL(A) a PPL(A): según el Reglamento (UE) 2024/2076, con un instructor habilitado para PPL, **5 h de doble mando y 10 h de solo supervisado** con 5 h de travesía, incluida la travesía de 150 NM. Confirma con tu escuela el texto consolidado.',
        'Médico de clase 2 (MED.A.045): 60 meses hasta los 40 años (el emitido antes de cumplirlos caduca a los 42), 24 meses de 40 a 50 y 12 meses desde los 50.',
      ],
    },
    {
      title: 'Idioma y radio en España',
      bullets: [
        'FCL.055: competencia lingüística de nivel 4 como mínimo en inglés **o** en el idioma que uses en la radio.',
        'Validez: nivel 4, 4 años; nivel 5, 6 años; el nivel 6 no caduca.',
        'Orden FOM/1146/2019: los **hablantes nativos de castellano obtienen el nivel 6 en castellano sin examen**.',
        'Para volar fuera de España o usar la radio en inglés necesitas inglés de nivel 4 o superior.',
      ],
    },
    {
      title: 'Revalidación y experiencia reciente',
      bullets: [
        'La PPL no caduca; caduca la **habilitación SEP (24 meses)**.',
        'Revalidación (FCL.740.A): verificación de competencia en los 3 meses anteriores al vencimiento, **o** en los 12 meses anteriores 12 h de vuelo (6 como PIC), 12 despegues, 12 aterrizajes y 1 h de refresco con instructor.',
        'La hora de refresco no hace falta si en ese periodo superaste una verificación de competencia o una prueba de pericia en otra clase o tipo; esa exención ya estaba en FCL.740.A y el Reglamento (UE) 2024/2076 la ha retocado: confirma la redacción vigente con tu escuela.',
        'Pasajeros: 3 despegues, aproximaciones y aterrizajes en los 90 días anteriores; de noche, al menos uno nocturno, salvo que tengas IR (FCL.060(b)).',
      ],
    },
    {
      title: 'El examen teórico de AESA',
      table: {
        head: ['Materia', 'Preguntas', 'Tiempo', 'Aciertos para el 75 %'],
        rows: [['Derecho aéreo y procedimientos ATC', '16', '0:25', '12'], ['Factores humanos', '8', '0:15', '6'], ['Meteorología', '8', '0:15', '6'], ['Comunicaciones', '8', '0:15', '6'], ['Principios de vuelo', '16', '0:25', '12'], ['Procedimientos operacionales', '12', '0:20', '9'], ['Performance y planificación', '16', '0:35', '12'], ['Conocimiento general de la aeronave', '24', '0:40', '18'], ['Navegación', '12', '0:25', '9'], ['Total', '120', '3:35', '—']],
        src: 'AMC1 FCL.215; FCL.235 y web de AESA',
      },
      bullets: [
        'Te matricula tu **ATO o DTO** en la aplicación de AESA, con su recomendación (válida 12 meses).',
        'No hay convocatorias fijas: se reserva fecha con antelación. Llega con tiempo y con tu documento de identidad.',
        'Tipo test de 4 opciones, sin penalización por fallo. Calculadora y regla en pantalla; el computador de navegación es físico.',
        'El banco de preguntas PPL/LAPL es **propio de AESA** (no el ECQB de EASA) y AESA prevé revisarlo en el **primer trimestre de 2027**.',
        'Puedes examinarte en **castellano o en inglés**.',
      ],
    },
    {
      title: 'Si suspendes',
      bullets: [
        'Cada materia admite **4 intentos**. Suspender una no te obliga a repetir las aprobadas mientras sigas dentro de los 18 meses.',
        'Si agotas los 4 intentos de una materia o pasan los 18 meses sin aprobarlas todas, la escuela te da **formación adicional** y tienes que **repetir todas las materias** (FCL.025(b)).',
        'Si no te presentas a ninguna materia en los 12 meses de la recomendación, la escuela decide si necesitas más formación antes de recomendarte de nuevo.',
        'El aprobado de la teoría vale **24 meses** para emitir la licencia: la prueba de pericia y la solicitud deben caer dentro de ese plazo.',
      ],
    },
    {
      title: 'Programa de vuelo (AMC1 FCL.210)',
      table: {
        head: ['Ejercicio', 'Contenido', 'Sección de la prueba'],
        rows: [['1a / 1b', 'Familiarización; emergencias', '1 y 5'], ['2 / 3 / 4', 'Preparación y después del vuelo; experiencia; efectos de los mandos', '1'], ['5a / 5b', 'Rodaje; fallo de frenos o dirección', '1'], ['6 / 7 / 8 / 9', 'Recto y nivelado; ascenso; descenso; virajes', '2'], ['10a / 10b / 11', 'Vuelo lento; pérdidas; prevención de barrena', '2'], ['12 / 13', 'Despegue; circuito, aterrizaje y motor y al aire', '1 y 4'], ['14', 'Primer solo', '—'], ['15', 'Virajes de 45°, actitudes anormales y picados en espiral', '2'], ['16 / 17', 'Aterrizaje forzoso; aterrizaje de precaución', '5'], ['18a / 18b / 18c', 'Navegación; baja altura y mala visibilidad; radionavegación', '3'], ['19', 'Vuelo básico por instrumentos', '3']],
      },
      bullets: ['El programa integra la gestión de amenazas y errores (TEM) y la prevención de la pérdida de control.'],
    },
    {
      title: 'Prueba de pericia (FCL.235)',
      table: {
        head: ['Sección', 'Elementos principales'],
        rows: [['1. Prevuelo y salida', 'Documentación, NOTAM, meteorología, masa y centrado, performance, inspección, arranque, rodaje, despegue, salida, radio'], ['2. Maniobras generales', 'Recto y nivelado, ascenso, virajes de 30° y 45° con recuperación de espiral, vuelo lento, pérdidas, descensos'], ['3. En ruta', 'Navegación por estima y a la vista, desvío a un alternativo, radioayudas, viraje de 180° en IMC simulada, gestión del vuelo'], ['4. Llegada y aterrizaje', 'Aterrizaje de precisión, sin flaps, con motor al ralentí, toma y despegue, motor y al aire'], ['5. Anormales y emergencias', 'Fallo de motor tras el despegue, aterrizaje forzoso y de precaución, preguntas orales']],
      },
      bullets: [
        'Tolerancias: **±150 ft**, **±10°** de rumbo, **+15/−5 kt** en despegue y aproximación y **±15 kt** en el resto.',
        'La ruta la elige el examinador, con al menos 3 puntos de notificación.',
        'Cada maniobra se puede repetir una vez. Con una sección suspendida se repite solo esa; con más de una, toda la prueba. No hay límite de intentos, pero tras un suspenso el examinador puede pedir formación adicional.',
      ],
    },
    {
      title: 'Normativa vigente que afecta al examen',
      table: {
        head: ['Norma', 'Qué cambia', 'Desde'],
        rows: [
          ['Reglamento (UE) 1178/2011 (Aircrew)', 'Part-FCL y Part-MED: licencias, habilitaciones, médico', '2012, con enmiendas'],
          ['Reglamento (UE) 923/2012 (SERA) y Real Decreto 1180/2018', 'Reglamento del aire europeo y su aplicación en España', '2014 / 2018'],
          ['Reglamento (UE) 2020/359', 'Revisión de LAPL y PPL', '2020'],
          ['Reglamento (UE) 2020/2193', 'Exámenes teóricos (FCL.025)', '2020'],
          ['Reglamento (UE) 2021/1296', 'Combustible basado en riesgo (NCO.OP.125) y MINIMUM FUEL / MAYDAY FUEL (NCO.OP.185)', '30-10-2022'],
          ['Reglamento (UE) 2024/2076', 'Paso de LAPL a PPL y otros ajustes de Part-FCL', '2024'],
          ['Banco de preguntas de AESA', 'Revisión del banco PPL/LAPL', 'Prevista en el 1.er trimestre de 2027'],
        ],
      },
      bullets: [`Última revisión de esta sección: ${PPL_REVIEWED.split('-').reverse().join('-')}. La normativa cambia: comprueba siempre la versión vigente antes del examen.`],
    },
  ],
  sources: [
    { title: 'EASA — Easy Access Rules for Aircrew, subparte A (FCL.020, FCL.025, FCL.055, FCL.060)', url: EASA_P(5) },
    { title: 'EASA — Easy Access Rules for Aircrew, subparte C (FCL.210, temario AMC1 FCL.210, FCL.215, FCL.235)', url: EASA_P(9) },
    { title: 'EASA — Easy Access Rules for Aircrew, PPL(A) (FCL.205.A, FCL.210.A)', url: EASA_P(10) },
    { title: 'AESA — Guía de exámenes teóricos FOR-EFT-GU01', url: AESA_GUIDE },
    { title: 'AESA — Bancos de preguntas', url: 'https://www.seguridadaerea.gob.es/en/ambitos/formacion-y-examenes/examenes-de-piloto/examenes-teoricos/bancos-de-preguntas' },
    { title: 'AESA — Formulario de prueba de pericia PPL(A) LIC-PVLO-P01-F03', url: 'https://www.seguridadaerea.gob.es/sites/default/files/LIC-PVLO-P01-F03_Ed_01.pdf' },
    { title: 'BOE — Orden FOM/1146/2019 (competencia lingüística)', url: 'https://www.boe.es/eli/es/o/2019/11/13/fom1146/con' },
    { title: 'Reglamento (UE) 2021/1296 (combustible)', url: 'https://lawplayer.com/eu/act/32021R1296' },
  ],
  subjects: [airLaw, humanPerf, meteo, comms, pof, ops, perf, agk, navigation],
}

const prog = (m: Omit<Module, 'status'>): Module => ({ ...m, status: 'en-progreso' })

export const MODULES: Module[] = [
  ppl,
  phraseology,
  prog({
    id: 'nvfr', name: 'Habilitación nocturna (VFR-N)', short: 'VFR-N', icon: '🌙', stage: '2',
    summary: 'Volar VFR de noche. Corta y muy útil para el hour building; no caduca.',
    facts: [['Requisito', 'LAPL o PPL'], ['Vuelo', '5 h nocturnas: 3 doble mando (1 de navegación, travesía ≥ 50 km) + 5 despegues y aterrizajes solo'], ['Teoría', 'Sin horas fijadas (las ATO suelen dar ~7 h)'], ['Plazo', 'Curso en 6 meses'], ['Examen', 'Sin examen oficial ni prueba de pericia'], ['Validez', 'No caduca']],
    sections: [{ title: 'A tener en cuenta', bullets: ['Hasta el 50 % de los ejercicios de instrumentos y radionavegación pueden hacerse en simulador; circuitos y travesía, en avión.', 'Médico: hay que ser *colour safe*.', 'En España el AIP exige plan de vuelo para todo vuelo nocturno que salga del entorno del aeródromo.', 'No es obligatoria para todo IR: FCL.610 solo la exige al titular de PPL que vaya a usar el IR de noche.'] }],
    sources: [{ title: 'FCL.810 — EASA Easy Access Rules', url: EASA_P(28) }],
  }),
  prog({
    id: 'hours', name: 'Hour building', short: 'Horas', icon: '⏱️', stage: '3',
    summary: 'Acumular horas como piloto al mando hasta los umbrales que desbloquean el resto: 50 h de travesía PIC (IR), 70 h PIC (MEP) y 150 h totales (inicio de la CPL).',
    facts: [['Objetivo', '~150 h totales'], ['PIC', '≥ 70 h (MEP)'], ['Travesía PIC', '≥ 50 h (IR)'], ['CPL', '150 h para empezar · 200 h para la licencia']],
    sections: [{ title: 'Consejos', bullets: ['Combínalo con la habilitación nocturna: necesitarás 5 h de noche para la CPL.', 'Planifica travesías largas: la CPL exige una de 540 km (300 NM) con 2 tomas fuera.', 'Lleva un libro de vuelo ordenado por tipo de hora (PIC, travesía, noche, instrumentos).'] }],
    sources: [{ title: 'EASA — umbrales de FCL.610, FCL.720.A y FCL.315', url: EASA_P(19) }],
  }),
  prog({
    id: 'atpl-theory', name: 'ATPL(A) teórico («frozen ATPL»)', short: 'ATPL teórico', icon: '📚', stage: '4',
    summary: 'El gran bloque teórico: 13 materias en 14 exámenes del banco ECQB de EASA, en inglés. Cubre la teoría de CPL e IR.',
    facts: [['Curso', '650 h con PPL (400 con CPL, 500 con IR, 250 con CPL+IR)'], ['Exámenes', '14 (ECQB), solo en inglés'], ['Aprobado', '75 % por materia'], ['Límites', '4 intentos por materia, 6 sesiones, 18 meses'], ['Tasa 2026', '77,79 € por examen'], ['Validez', '36 meses para CPL/IR; 7 años ligados a un IR vigente']],
    sections: [{
      title: 'Materias (syllabus 2020)',
      table: { head: ['Código', 'Materia'], rows: [['010', 'Derecho aéreo'], ['021', 'Estructura, sistemas y motor'], ['022', 'Instrumentos'], ['031', 'Masa y centrado'], ['032', 'Performance'], ['033', 'Planificación y seguimiento del vuelo'], ['040', 'Factores humanos'], ['050', 'Meteorología'], ['061', 'Navegación general'], ['062', 'Radionavegación'], ['070', 'Procedimientos operacionales'], ['081', 'Principios de vuelo'], ['090', 'Comunicaciones'], ['100', 'KSA (la evalúa la escuela)']] },
      bullets: ['El número de preguntas y tiempos por examen varía entre fuentes: consulta la tabla oficial de SENASA.', '«ATPL congelado» = CPL + IR multimotor + ATPL teórico sin las 1500 h.'],
    }],
    sources: [{ title: 'FCL.025 / FCL.515 — EASA', url: EASA_P(5) }, { title: 'One Air — exámenes ATPL SENASA (orientativo)', url: 'https://www.oneair.es/examenes-de-piloto-atpl-senasa/' }],
  }),
  prog({
    id: 'cpl', name: 'CPL(A) · Licencia de piloto comercial', short: 'CPL(A)', icon: '💼', stage: '5',
    summary: 'Permite volar cobrando. Exige 200 h y una prueba de pericia en avión complejo.',
    facts: [['Para empezar', '150 h con 50 h PIC (10 h de travesía)'], ['Teoría', '250 h (o el ATPL teórico)'], ['Vuelo', '25 h doble mando: 10 instrumentos, 5 en avión complejo'], ['Licencia', '200 h, 100 PIC, 20 h travesía con un vuelo de 540 km, 5 h noche'], ['Prueba', '≥ 90 min, ±100 ft, ±10°, ±5 kt'], ['Edad', '18 años']],
    sections: [{ title: 'Notas', bullets: ['La prueba se hace en un avión de 4 plazas con paso variable y tren retráctil.', 'La teoría aprobada vale 36 meses para emitir la CPL.'] }],
    sources: [{ title: 'FCL.300–FCL.325 — EASA', url: EASA_P(46) }],
  }),
  prog({
    id: 'mep', name: 'Habilitación multimotor de pistón (MEP)', short: 'MEP', icon: '✈️', stage: '6',
    summary: 'Volar bimotores de pistón. Clave el fallo de motor y el vuelo asimétrico. Practica con el Aztec en la sección de cabinas.',
    facts: [['Requisito', '70 h como PIC'], ['Teoría', '7 h'], ['Vuelo', '2:30 h normal + 3:30 h de fallo de motor y asimétrico (6 h)'], ['Examen', 'Escrito + prueba de pericia en 6 meses'], ['Validez', '1 año']],
    sections: [{ title: 'Revalidación', bullets: ['Verificación de competencia en los 3 meses previos a la caducidad y 10 sectores de ruta durante su validez (o 1 con examinador).', 'Ojo: algunas webs dan 6 h de teoría o 2,5 h de fallo de motor; lo correcto es 7 h, 2:30 y 3:30.'] }],
    sources: [{ title: 'FCL.720.A / FCL.725.A — EASA', url: EASA_P(24) }],
  }),
  prog({
    id: 'ir', name: 'Habilitación instrumental: IR, CB-IR y BIR', short: 'IR', icon: '☁️', stage: '7',
    summary: 'Volar IFR. Tres caminos vigentes: IR modular clásico, IR por competencias (CB-IR) y la Basic Instrument Rating (solo UE). La EIR está suprimida desde 2021.',
    facts: [['Requisito IR', '50 h de travesía como PIC'], ['IR modular', '150 h teoría · 50 h SE / 55 h ME'], ['CB-IR', '80 h teoría · 40 h SE'], ['BIR', '4 módulos sin horas mínimas, 3 exámenes'], ['Exámenes IR', '7 materias'], ['Validez', '1 año']],
    sections: [{
      title: 'Detalles',
      bullets: ['IR modular: hasta 35 de las 50 h SE (o 40 de las 55 ME) en simulador; al menos 15 h en avión multimotor.', 'Si el IR pasa 7 años sin revalidarse, hay que repetir teoría y prueba.', 'BIR: DH +200 ft, visibilidad mínima 1500 m, techo 600 ft para iniciar IFR; tolerancias ±100 ft, ±5°, ±5 kt; da hasta 10 h de crédito hacia el IR.', 'EIR suprimida el 8-9-2021 (transición hasta el 8-9-2022).', 'El médico exige audiometría con estándar de clase 1.'],
    }],
    sources: [{ title: 'FCL.600–FCL.625 y FCL.835 — EASA', url: EASA_P(19) }, { title: 'Reglamento (UE) 2020/359 (BIR)', url: 'https://www.easa.europa.eu/community/system/files/2020-12/CELEX_32020R0359_EN_TXT.pdf' }],
  }),
  prog({
    id: 'mcc', name: 'MCC / APS MCC y UPRT avanzado', short: 'MCC', icon: '👥', stage: '8',
    summary: 'Trabajo en tripulación múltiple y recuperación de pérdida de control. Requisitos para la primera habilitación de tipo.',
    facts: [['MCC', '25 h teoría + 20 h en FNPT II MCC o FFS (15 integrado; 10 si va combinado con el tipo)'], ['APS MCC', 'MCC ampliado a estándar de aerolínea (~40 h de simulador); no es reglamentario'], ['UPRT avanzado', '5 h teoría + 3 h de vuelo con instructor']],
    sections: [{ title: 'Practícalo en la app', bullets: ['Los flows de ATR 72 y Boeing 737 están pensados en reparto CM1/CM2 y Capitán/FO, como en un curso MCC.'] }],
    sources: [{ title: 'FCL.735.A / FCL.745.A — EASA', url: EASA_P(24) }],
  }),
  prog({
    id: 'type', name: 'Habilitación de tipo', short: 'Type rating', icon: '🛫', stage: '9',
    summary: 'El curso del avión concreto de la aerolínea (A320, B737, ATR…). Aquí entran de lleno las cabinas y procedimientos de esta web.',
    facts: [['Primer tipo multipiloto', '70 h PIC, IR multimotor, ATPL teórico, MCC y UPRT avanzado'], ['Examen', '≥ 100 preguntas tipo test'], ['Prueba', 'En los 6 meses siguientes al curso'], ['Validez', '1 año']],
    sections: [{ title: 'Después', bullets: ['*Base training* y *line training* son requisitos del operador, no de Part-FCL.'] }],
    sources: [{ title: 'FCL.720.A — EASA', url: EASA_P(24) }],
  }),
  prog({
    id: 'atpl', name: 'ATPL(A) · Licencia de piloto de transporte de línea aérea', short: 'ATPL(A)', icon: '👨‍✈️', stage: '10',
    summary: 'La licencia de comandante en transporte aéreo comercial. Se «descongela» al alcanzar la experiencia.',
    facts: [['Edad', '21 años'], ['Total', '1500 h'], ['Multipiloto', '500 h'], ['Mando', '500 h PIC bajo supervisión, o 250 h PIC, o 250 h (70 PIC + resto supervisado)'], ['Otras', '200 h travesía · 75 h instrumentos · 100 h noche'], ['Simulador', 'Hasta 100 h (máx. 25 en FNPT)']],
    sections: [{ title: 'Secuencia típica modular', table: { head: ['Fase', 'Horas aprox.', 'Desbloquea'], rows: [['PPL(A)', '45–50 h', 'Vuelo como PIC'], ['Hour building + VFR-N', 'Hasta ~150 h', 'MEP, IR y CPL'], ['ATPL teórico', '650 h de curso', 'Teoría de CPL e IR'], ['CPL(A)', '~25 h', 'Licencia comercial'], ['MEP + IR ME', '~6 h + ~55 h', 'Requisito de aerolínea'], ['MCC/APS + UPRT', '20–40 h sim + 3 h', 'Primer tipo'], ['Tipo + line training', 'Según operador', 'Copiloto'], ['ATPL', '1500 h', 'Comandante']] }, bullets: ['Costes orientativos de baja confianza: PPL 8.000–14.000 €; CPL 28.000–45.000 €; tipo 22.000–35.000 €.'] }],
    sources: [{ title: 'FCL.510.A — EASA', url: EASA_P(17) }],
  }),
]

export const moduleById = (id: string) => MODULES.find(m => m.id === id)
