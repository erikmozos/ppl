// Temario oficial del PPL(A) por bloques (AMC1 FCL.210 y FCL.215) con el reparto objetivo del banco de preguntas.
// Cada bloque es una lección: su contenido vive en src/content/ppl/<código>/<id>.json y se carga bajo demanda.

export interface SyllabusBlock { id: string; title: string; topics: string; target: number }
export interface SyllabusSubject {
  code: string
  id: string
  name: string
  exam: { questions: number; minutes: number; pass: number }
  blocks: SyllabusBlock[]
}

export const PPL_SYLLABUS: SyllabusSubject[] = [
  {
    "code": "010",
    "id": "derecho",
    "name": "Derecho aéreo y procedimientos ATC",
    "exam": {
      "questions": 16,
      "minutes": 25,
      "pass": 12
    },
    "blocks": [
      {
        "id": "010.01",
        "title": "Convenios y OACI",
        "topics": "Convenio de Chicago (Doc 7300): soberanía (art. 1), vuelos no regulares (art. 5), cabotaje (art. 7), nacionalidad (arts. 17–21), documentos a bordo (art. 29), certificados y licencias (arts. 31–33), normas y diferencias (arts. 37–38). OACI: Asamblea, Consejo y Comisión de Aeronavegación. Libertades 1.ª a 5.ª. Tokio 1963, La Haya 1970, Montreal 1971, Varsovia 1929 y Montreal 1999, Roma 1952",
        "target": 20
      },
      {
        "id": "010.02",
        "title": "Marco europeo y español",
        "topics": "Reglamento Base 2018/1139 y EASA; Reglamentos 1178/2011 (Part-FCL, Part-MED), 965/2012 (Part-NCO), 923/2012 (SERA), 1321/2014 (Part-ML) y 748/2012 (Part 21); AESA, ENAIRE, AEMET y CIAIAC; Ley 48/1960, Ley 21/2003 (infracciones y sanciones) y RD 1180/2018",
        "target": 12
      },
      {
        "id": "010.03",
        "title": "Aeronavegabilidad (Anexo 8)",
        "topics": "Certificado de aeronavegabilidad y cuándo deja de valer, certificado de revisión (ARC, 12 meses), permiso de vuelo, mantenimiento por el piloto-propietario (Part-ML)",
        "target": 12
      },
      {
        "id": "010.04",
        "title": "Matrícula (Anexo 7)",
        "topics": "Marca EC más matrícula, colocación y tamaño (alas ≥ 50 cm; fuselaje o cola ≥ 30 cm), certificado de matrícula, placa de identificación ignífuga",
        "target": 8
      },
      {
        "id": "010.05",
        "title": "Licencias y médico (Anexo 1, Part-FCL, Part-MED)",
        "topics": "Definiciones (PIC, tiempo de vuelo, travesía, solo), atribuciones PPL y LAPL, documentos (FCL.045), registro del tiempo de vuelo (FCL.050), idioma (FCL.055), experiencia reciente (FCL.060), SEP y su revalidación, nocturna (FCL.810), clase 2 y disminución de aptitud (MED.A.020)",
        "target": 35
      },
      {
        "id": "010.06",
        "title": "Reglas generales (Anexo 2, SERA)",
        "topics": "Definiciones (noche, techo, VMC, altitud, altura, nivel), operación negligente, alturas mínimas, lanzamientos, remolque, paracaidismo, acrobacia, formación, zonas P, R y D, derecho de paso completo (también en tierra), luces de las aeronaves, vuelo simulado por instrumentos con piloto de seguridad, normas en el aeródromo, sustancias psicoactivas (SERA.2020), hora UTC",
        "target": 30
      },
      {
        "id": "010.07",
        "title": "VFR (SERA.5001 a 5010)",
        "topics": "Tabla VMC completa con notas, condiciones para entrar en una CTR, VFR nocturno completo, VFR especial (piloto y ATC; en España solo de día), límite de FL195, niveles de crucero",
        "target": 35
      },
      {
        "id": "010.08",
        "title": "Plan de vuelo y servicio ATC",
        "topics": "Cuándo es obligatorio, presentación (60 min; en vuelo, 10 min antes de entrar en espacio controlado), retrasos (30 y 60 min), cierre y aviso de llegada, casillas del plan OACI, autorizaciones, desviaciones (TAS ±5 %, ETA más de 2 min), informes de posición, fallo de radio, interferencia ilícita, interceptación",
        "target": 25
      },
      {
        "id": "010.09",
        "title": "Espacio aéreo y ATS (Anexo 11, Doc 4444)",
        "topics": "Clases A a G, RMZ y TMZ, CTR, CTA, TMA, ATZ, FIZ y FIR (Madrid, Barcelona, Canarias); control, información de vuelo, AFIS y alerta (INCERFA, ALERFA, DETRESFA con sus tiempos); separación visual, circuito y posiciones críticas, servicio radar",
        "target": 30
      },
      {
        "id": "010.10",
        "title": "Altimetría y transpondedor (Doc 8168, Doc 7030)",
        "topics": "QNH, QFE y 1013,25; altitud y nivel de transición, capa de transición, cuándo cambiar el reglaje; modos A, C y S, códigos especiales, IDENT",
        "target": 15
      },
      {
        "id": "010.11",
        "title": "Información aeronáutica (Anexo 15)",
        "topics": "AIP (GEN, ENR, AD), suplementos y enmiendas, ciclo AIRAC de 28 días, NOTAM, AIC, boletines de información previa; el AIP de ENAIRE",
        "target": 10
      },
      {
        "id": "010.12",
        "title": "Aeródromos (Anexo 14)",
        "topics": "Pista, franja, zona de parada, zona libre de obstáculos, TORA, TODA, ASDA y LDA; señales (umbral, umbral desplazado, puntos de espera), luces (borde blanco, umbral verde, extremo rojo, rodaje azul y verde, PAPI), letreros, área de señales, balizamiento de obstáculos, zonas fuera de servicio, salvamento y extinción",
        "target": 25
      },
      {
        "id": "010.13",
        "title": "Salvamento (Anexo 12)",
        "topics": "Fases, actuación ante un accidente o una llamada de socorro, señales con embarcaciones, código visual tierra-aire, acuse de recibo desde el aire",
        "target": 8
      },
      {
        "id": "010.14",
        "title": "Seguridad y accidentes (Anexos 17 y 13)",
        "topics": "Objetivo de la seguridad; accidente, incidente grave e incidente; fin de la investigación; notificación de sucesos en 72 h (Reg. 376/2014); CIAIAC",
        "target": 8
      },
      {
        "id": "010.15",
        "title": "Diferencias de España",
        "topics": "AIP GEN 1.7 (VFR especial solo de día, plan de vuelo nocturno, colaciones, «grados», STUDENT, «SUBA», «REINCORPORAR»), zonas LE-P, R y D (ENR 5.1) y zonas sensibles de fauna (ENR 5.6)",
        "target": 7
      }
    ]
  },
  {
    "code": "040",
    "id": "factores-humanos",
    "name": "Factores humanos",
    "exam": {
      "questions": 8,
      "minutes": 15,
      "pass": 6
    },
    "blocks": [
      {
        "id": "040.01",
        "title": "Conceptos básicos",
        "topics": "Peso del factor humano en los accidentes, modelos SHELL y del queso suizo (Reason), cultura justa, competencias del piloto",
        "target": 8
      },
      {
        "id": "040.02",
        "title": "Atmósfera y gases",
        "topics": "Composición (N₂ 78 %, O₂ 21 %), leyes de Dalton (presión parcial), Boyle (gases atrapados en oído, senos, dientes e intestino) y Henry (descompresión y buceo)",
        "target": 8
      },
      {
        "id": "040.03",
        "title": "Respiración y circulación",
        "topics": "Hipoxia hipóxica y anémica (CO, tabaco, anemia, donación de sangre), síntomas, tiempo útil de consciencia, contramedidas; hiperventilación (causas, síntomas, tratamiento); aceleraciones +Gz (visión gris, en túnel, negra y pérdida de consciencia); hipertensión y cardiopatía",
        "target": 18
      },
      {
        "id": "040.04",
        "title": "Sistema nervioso y visión",
        "topics": "Sistemas central, periférico y autónomo; fóvea y punto ciego, visión central y periférica, binocular y claves monoculares, visión nocturna, exploración por sectores, miopía de campo vacío, defectos de la visión y gafas de sol",
        "target": 14
      },
      {
        "id": "040.05",
        "title": "Oído y equilibrio",
        "topics": "Anatomía, trompa de Eustaquio, barotrauma, ruido y pérdida auditiva (conductiva y neurosensorial), canales semicirculares y otolitos, mareo cinético",
        "target": 8
      },
      {
        "id": "040.06",
        "title": "Desorientación e ilusiones",
        "topics": "Tipos de desorientación espacial, leans, espiral mortal, Coriolis, somatogravica, autocinesia, parpadeo (flicker), falso horizonte, whiteout, ilusiones de aproximación",
        "target": 14
      },
      {
        "id": "040.07",
        "title": "Salud e higiene",
        "topics": "Forma física, resfriado y gripe, problemas gastrointestinales, obesidad, higiene alimentaria, infecciones, nutrición e hipoglucemia, gases tóxicos, buceo",
        "target": 8
      },
      {
        "id": "040.08",
        "title": "Intoxicación",
        "topics": "Medicación con y sin receta, automedicación, tabaco, alcohol (eliminación lenta y efectos), cafeína, drogas; SERA.2020 y MED.A.020",
        "target": 10
      },
      {
        "id": "040.09",
        "title": "Ritmos y sueño",
        "topics": "Ritmo circadiano, desfase horario, fases del sueño, deuda de sueño, siestas",
        "target": 6
      },
      {
        "id": "040.10",
        "title": "Procesamiento de la información",
        "topics": "Atención selectiva y dividida, vigilancia, percepción y expectativas, memoria sensorial, de trabajo (unos 7 elementos durante segundos) y a largo plazo, memoria motora",
        "target": 10
      },
      {
        "id": "040.11",
        "title": "Error y fiabilidad",
        "topics": "Deslices, lapsus, equivocaciones y violaciones; fiabilidad humana; entorno social y de la organización; listas de chequeo como defensa",
        "target": 8
      },
      {
        "id": "040.12",
        "title": "Decisión y riesgo",
        "topics": "Fases (DECIDE, FOR-DEC), sesgos (confirmación, empeño en continuar el plan), evaluación del riesgo, mínimos personales",
        "target": 8
      },
      {
        "id": "040.13",
        "title": "Conciencia situacional y comunicación",
        "topics": "Niveles (percibir, comprender, anticipar), cómo se pierde, comunicación verbal y no verbal, barreras, briefing",
        "target": 6
      },
      {
        "id": "040.14",
        "title": "Personalidad y actitudes",
        "topics": "Desarrollo, influencias, actitudes peligrosas y sus antídotos",
        "target": 4
      },
      {
        "id": "040.15",
        "title": "Carga, estrés y fatiga",
        "topics": "Activación (Yerkes-Dodson), sobrecarga e infracarga, estrés agudo y crónico, síndrome general de adaptación, fatiga (tipos, efectos y gestión)",
        "target": 6
      },
      {
        "id": "040.16",
        "title": "TEM y vuelo monopiloto",
        "topics": "Amenazas, errores y estados no deseados; contramedidas; uso disciplinado de la lista de chequeo",
        "target": 4
      }
    ]
  },
  {
    "code": "050",
    "id": "meteorologia",
    "name": "Meteorología",
    "exam": {
      "questions": 8,
      "minutes": 15,
      "pass": 6
    },
    "blocks": [
      {
        "id": "050.01",
        "title": "Atmósfera y temperatura",
        "topics": "Composición y capas (altura de la tropopausa en polos y ecuador), radiación, conducción, convección, advección y calor latente, gradientes, inversiones (radiación, subsidencia, frontal, turbulencia), variación diurna y efecto de nubes y viento",
        "target": 12
      },
      {
        "id": "050.02",
        "title": "Presión y densidad",
        "topics": "Isobaras, variación con la altura (más rápida en aire frío), QFF frente a QNH, relación entre sistemas en superficie y en altura, densidad y sus factores",
        "target": 10
      },
      {
        "id": "050.03",
        "title": "ISA y altimetría",
        "topics": "Valores ISA, reglajes, cálculos en hPa y ft, corrección por temperatura, error del altímetro por flujo acelerado sobre el relieve",
        "target": 16
      },
      {
        "id": "050.04",
        "title": "Viento",
        "topics": "Medida (verdadero en METAR y TAF, magnético en torre y ATIS), gradiente de presión, Coriolis, viento geostrófico y del gradiente, capa de fricción, convergencia y divergencia",
        "target": 12
      },
      {
        "id": "050.05",
        "title": "Circulación general y climatología",
        "topics": "Células de Hadley, Ferrel y polar, ZCIT, anticiclón de las Azores, oestes y corriente en chorro, zonas climáticas, situaciones típicas (del oeste, anticiclónica, pantano barométrico)",
        "target": 10
      },
      {
        "id": "050.06",
        "title": "Vientos locales",
        "topics": "Anabáticos y catabáticos, montaña y valle, efecto Venturi, brisas; en España: Levante y Poniente, Tramontana, Cierzo, Mistral, Terral, Galerna y efecto Foehn",
        "target": 8
      },
      {
        "id": "050.07",
        "title": "Ondas de montaña y turbulencia",
        "topics": "Condiciones de las ondas, lenticulares y rotores; turbulencia convectiva, mecánica, orográfica, frontal, en aire claro y de estela; intensidades",
        "target": 8
      },
      {
        "id": "050.08",
        "title": "Humedad y termodinámica",
        "topics": "Vapor, relación de mezcla, punto de rocío, humedad relativa, cambios de estado y calor latente, procesos adiabáticos, estabilidad absoluta, condicional e inestabilidad",
        "target": 12
      },
      {
        "id": "050.09",
        "title": "Nubes",
        "topics": "Formación (convección, relieve, frentes, mezcla, convergencia), los 10 géneros por pisos, relación con la estabilidad y las inversiones",
        "target": 10
      },
      {
        "id": "050.10",
        "title": "Niebla, neblina y calima",
        "topics": "Radiación, advección, de vapor, frontal y orográfica: cómo se forman y cómo se disipan",
        "target": 10
      },
      {
        "id": "050.11",
        "title": "Precipitación",
        "topics": "Procesos (cristales de hielo y coalescencia), tipos (llovizna, lluvia, nieve, granizo, granizo blando, lluvia engelante) y nube que los produce",
        "target": 6
      },
      {
        "id": "050.12",
        "title": "Masas de aire",
        "topics": "Clasificación, regiones de origen, modificación al moverse, las que llegan a España",
        "target": 8
      },
      {
        "id": "050.13",
        "title": "Frentes",
        "topics": "Cálido, frío, sector cálido, tiempo tras el frente frío, oclusiones, estacionario, ciclo de vida de la onda frontal, cambios de presión, temperatura, viento y visibilidad al paso",
        "target": 14
      },
      {
        "id": "050.14",
        "title": "Sistemas de presión",
        "topics": "Anticiclones cálidos y fríos, dorsales, subsidencia; depresiones térmicas (baja térmica ibérica), orográficas y polares, vaguadas, DANA",
        "target": 8
      },
      {
        "id": "050.15",
        "title": "Engelamiento",
        "topics": "Condiciones, tipos (claro, opaco, escarcha, mixto), lluvia engelante, peligros y cómo evitarlo; enlace con el hielo de carburador",
        "target": 10
      },
      {
        "id": "050.16",
        "title": "Tormentas y cizalladura",
        "topics": "Condiciones, tipos y ciclo de vida, líneas de turbonada, electricidad, granizo, reventones y microrráfagas, evitación; cizalladura en frentes, inversiones y relieve",
        "target": 14
      },
      {
        "id": "050.17",
        "title": "Montaña y visibilidad",
        "topics": "Peligros en montaña, inversiones de valle, fenómenos que reducen la visibilidad (precipitación, bruma, polvo, humo, ceniza volcánica)",
        "target": 6
      },
      {
        "id": "050.18",
        "title": "Observación y mapas",
        "topics": "Observación en superficie, radiosondeo, satélite visible, infrarrojo y de vapor, radar, AIREP; mapa de superficie, SIGWX de baja cota, mapas de viento y temperatura",
        "target": 8
      },
      {
        "id": "050.19",
        "title": "Mensajes y servicios",
        "topics": "METAR y SPECI, TAF, TREND, SIGMET, AIRMET, GAMET, avisos de aeródromo, ATIS, VOLMET, portal AMA, oficinas meteorológicas y WAFS",
        "target": 18
      }
    ]
  },
  {
    "code": "090",
    "id": "comunicaciones",
    "name": "Comunicaciones",
    "exam": {
      "questions": 8,
      "minutes": 15,
      "pass": 6
    },
    "blocks": [
      {
        "id": "090.01",
        "title": "Definiciones y estaciones",
        "topics": "Términos, estaciones (Torre, Rodadura, Autorizaciones, Aproximación, Control, Información, AFIS, Radio), categorías de mensajes y su prioridad",
        "target": 14
      },
      {
        "id": "090.02",
        "title": "Abreviaturas y códigos Q",
        "topics": "ATIS, ETA, CAVOK, RVR, FIS, AFIS, ATZ, CTR, TMA, FIZ; QDM, QDR, QTE, QUJ, QFE, QNH, QNE y QFU",
        "target": 14
      },
      {
        "id": "090.03",
        "title": "Transmisión",
        "topics": "Letras, números (niveles, altitudes, rumbos, velocidades; QNH 1000 se dice «mil»), hora, frecuencias (regla de los ceros finales), técnica (escuchar antes, preparar el mensaje, ritmo constante), escala de legibilidad",
        "target": 20
      },
      {
        "id": "090.04",
        "title": "Palabras normalizadas",
        "topics": "La lista completa en español e inglés y cuándo se usa cada una",
        "target": 16
      },
      {
        "id": "090.05",
        "title": "Distintivos",
        "topics": "De estaciones y de aeronaves; abreviados (solo después de que los use el ATS); distintivos parecidos (al principio y al final del mensaje)",
        "target": 10
      },
      {
        "id": "090.06",
        "title": "Colaciones y acuses",
        "topics": "Lista obligatoria (SERA.8015), autorizaciones condicionales, terminar con el distintivo, qué basta con acusar",
        "target": 14
      },
      {
        "id": "090.07",
        "title": "Procedimientos VFR",
        "topics": "Llamada inicial, rodaje, salida, tránsito por una CTR con puntos de notificación VFR, información de vuelo, llegada y circuito, aeródromo no controlado, FIZ con AFIS, cambio de frecuencia",
        "target": 18
      },
      {
        "id": "090.08",
        "title": "Meteorología por radio",
        "topics": "Información de aeródromo, ATIS (letra, contenido y acuse), VOLMET, AIREP",
        "target": 10
      },
      {
        "id": "090.09",
        "title": "Fallo de comunicaciones",
        "topics": "Comprobaciones, 7600, transmisión a ciegas, seguir en VMC y aterrizar en el aeródromo adecuado más próximo, señales luminosas, procedimientos del AIP para cada CTR",
        "target": 10
      },
      {
        "id": "090.10",
        "title": "Socorro y urgencia",
        "topics": "Definiciones, frecuencias y escucha (121,5), mensajes, imposición de silencio, retransmisión, fin del tráfico de socorro, 7700",
        "target": 10
      },
      {
        "id": "090.11",
        "title": "Propagación y frecuencias",
        "topics": "Línea de vista, alcance 1,23 × √altura, factores que lo limitan, banda de 118 a 136,975 MHz, canalización de 25 y 8,33 kHz",
        "target": 4
      }
    ]
  },
  {
    "code": "080",
    "id": "principios-vuelo",
    "name": "Principios de vuelo",
    "exam": {
      "questions": 16,
      "minutes": 25,
      "pass": 12
    },
    "blocks": [
      {
        "id": "080.01",
        "title": "Leyes y definiciones",
        "topics": "Unidades, leyes de Newton, Bernoulli y Venturi, presión estática, dinámica y total, densidad, IAS y TAS",
        "target": 14
      },
      {
        "id": "080.02",
        "title": "Flujo y fuerzas",
        "topics": "Líneas de corriente, flujo 2D y 3D, resultante aerodinámica, sustentación, resistencia, ángulo de ataque frente a ángulo de calaje",
        "target": 12
      },
      {
        "id": "080.03",
        "title": "Perfil y ala",
        "topics": "Cuerda, curvatura, línea media, espesor relativo; alargamiento, estrechamiento, planta y torsión (washout)",
        "target": 12
      },
      {
        "id": "080.04",
        "title": "Flujo sobre el perfil",
        "topics": "Punto de remanso, distribución de presiones, centro de presiones y cómo se mueve con α, separación, curva CL–α",
        "target": 14
      },
      {
        "id": "080.05",
        "title": "Coeficientes",
        "topics": "CL y CD y las fórmulas de sustentación y resistencia",
        "target": 10
      },
      {
        "id": "080.06",
        "title": "Flujo 3D",
        "topics": "Flujo en envergadura, torbellinos de punta, downwash, estela turbulenta; resistencia inducida y efecto del alargamiento",
        "target": 14
      },
      {
        "id": "080.07",
        "title": "Resistencia",
        "topics": "Parásita (forma, interferencia, fricción) y su relación con V, inducida, total, VMD, efecto suelo",
        "target": 16
      },
      {
        "id": "080.08",
        "title": "Pérdida",
        "topics": "Capa límite, separación, bataneo; Vs y sus factores (CG, potencia, altitud, carga alar, n); por dónde empieza en el ala; avisos (bocina, lámina, interruptor); recuperación; pérdida con potencia y en viraje; cola en T; barrena (desarrollo, reconocimiento, recuperación)",
        "target": 26
      },
      {
        "id": "080.09",
        "title": "Hipersustentadores",
        "topics": "Flaps simple, de intradós, ranurado y Fowler; efecto en la curva CL–α y en el cabeceo; asimetría; ranuras y slats",
        "target": 12
      },
      {
        "id": "080.10",
        "title": "Contaminación",
        "topics": "Hielo, escarcha, nieve y lluvia; borde de ataque sucio; efectos en la pérdida, el control y los hipersustentadores",
        "target": 8
      },
      {
        "id": "080.11",
        "title": "Estabilidad",
        "topics": "Equilibrio; estabilidad estática y dinámica; longitudinal y posición del CG; lateral (diedro, ala alta, flecha); direccional; espiral y balanceo holandés",
        "target": 18
      },
      {
        "id": "080.12",
        "title": "Control",
        "topics": "Ejes y planos; profundidad y downwash; timón; alerones y guiñada adversa (Frise, diferenciales); compensación aerodinámica; tabs de compensación, antibalance y servo; balance de masas",
        "target": 16
      },
      {
        "id": "080.13",
        "title": "Limitaciones",
        "topics": "Flameo, VFE, VNO, VNE y arcos del anemómetro; diagrama de maniobra (n, pérdida acelerada, VA, categorías); efecto de la masa; diagrama de ráfagas",
        "target": 16
      },
      {
        "id": "080.14",
        "title": "Hélices",
        "topics": "Paso y ángulo de pala, torsión de la pala, hielo, hélice en molinete, par de reacción, estela, factor P y precesión",
        "target": 12
      },
      {
        "id": "080.15",
        "title": "Mecánica de vuelo",
        "topics": "Fuerzas en vuelo recto y nivelado, en ascenso (gradiente), en descenso y planeo (L/D) y en viraje (inclinación, n, radio y régimen 1)",
        "target": 20
      }
    ]
  },
  {
    "code": "070",
    "id": "procedimientos",
    "name": "Procedimientos operacionales",
    "exam": {
      "questions": 12,
      "minutes": 20,
      "pass": 9
    },
    "blocks": [
      {
        "id": "070.01",
        "title": "Anexo 6 y Part-NCO",
        "topics": "Definiciones y aplicabilidad; responsabilidades del PIC; documentos a bordo (NCO.GEN.135); mercancías peligrosas; dispositivos electrónicos; briefing (NCO.OP.130); preparación del vuelo y alternativos (NCO.OP.135); meteorología; hielo en tierra y en vuelo; situaciones simuladas; oxígeno; equipos (ELT, chalecos, balsas, botiquín)",
        "target": 36
      },
      {
        "id": "070.02",
        "title": "Combustible",
        "topics": "NCO.OP.125 y su AMC (reserva final), NCO.OP.185 (MINIMUM FUEL y MAYDAY FUEL), gestión en vuelo",
        "target": 14
      },
      {
        "id": "070.03",
        "title": "Atenuación de ruido",
        "topics": "Procedimientos y efecto del perfil de vuelo en la salida, el crucero y la aproximación",
        "target": 8
      },
      {
        "id": "070.04",
        "title": "Incursiones en pista",
        "topics": "Marcas y letreros, puntos de espera, luces de protección de pista, puntos conflictivos (hot spots), colación de cruces, buenas prácticas en rodaje",
        "target": 14
      },
      {
        "id": "070.05",
        "title": "Fuego y humo",
        "topics": "Fuego de carburador en el arranque, fuego de motor, fuego eléctrico y en cabina, clases de fuego y agentes extintores, humo en cabina; siempre según el POH",
        "target": 18
      },
      {
        "id": "070.06",
        "title": "Cizalladura y microrráfaga",
        "topics": "Reconocimiento en salida y aproximación, cómo evitarla, maniobra de escape",
        "target": 12
      },
      {
        "id": "070.07",
        "title": "Estela turbulenta",
        "topics": "Causa, factores (masa, configuración, velocidad), comportamiento de los torbellinos, separaciones de llegada y salida, cruce de trayectorias, despegue y aterrizaje tras un pesado, rotores de helicóptero",
        "target": 16
      },
      {
        "id": "070.08",
        "title": "Aterrizajes de emergencia y de precaución",
        "topics": "Diferencia entre ambos, causas, elección del campo, información a pasajeros y posición de seguridad, evacuación, qué hacer después (ELT, protección, aviso), amaraje",
        "target": 20
      },
      {
        "id": "070.09",
        "title": "Pistas contaminadas",
        "topics": "Agua, nieve fundente, nieve y hielo; rozamiento y eficacia de frenado; formato global de notificación (RWYCC); hidroplaneo",
        "target": 12
      },
      {
        "id": "070.10",
        "title": "Emergencias del avión",
        "topics": "Fallo de motor tras el despegue y en vuelo, fallo eléctrico, con las listas del POH del avión de la escuela",
        "target": 10
      }
    ]
  },
  {
    "code": "030",
    "id": "performance",
    "name": "Performance y planificación",
    "exam": {
      "questions": 16,
      "minutes": 35,
      "pass": 12
    },
    "blocks": [
      {
        "id": "030.01",
        "title": "Por qué importan masa y CG",
        "topics": "Límites estructurales y de performance; efecto del CG en estabilidad, control y performance",
        "target": 8
      },
      {
        "id": "030.02",
        "title": "Terminología",
        "topics": "Masa en vacío básica, carga útil y de pago, MZFM, MTOM, MLM, masa de rampa, combustible utilizable e inutilizable, aceite, masas estándar",
        "target": 16
      },
      {
        "id": "030.03",
        "title": "Límites",
        "topics": "Estructurales, de performance y del compartimento de equipaje (kg y kg/m²)",
        "target": 8
      },
      {
        "id": "030.04",
        "title": "Cálculo del CG",
        "topics": "Equilibrio de fuerzas y momentos, datum y brazo, método aritmético, tablas de momentos, envolvente gráfica, hoja de carga, CG al aterrizaje, mover o añadir carga, informe de pesada",
        "target": 34
      },
      {
        "id": "030.05",
        "title": "Conceptos de performance",
        "topics": "Clases de performance, fases del vuelo, efecto de masa, viento, altitud de densidad, pendiente y estado de la pista; gradientes",
        "target": 14
      },
      {
        "id": "030.06",
        "title": "Distancias y velocidades",
        "topics": "TORA, TODA, ASDA y LDA; carrera y distancia hasta 50 ft; VR, Vx, Vy y velocidad de aproximación",
        "target": 12
      },
      {
        "id": "030.07",
        "title": "Despegue y aterrizaje con el manual",
        "topics": "Leer gráficas y tablas de estilo POH (PA-28 y C172), factores de superficie y pendiente, viento ya factorizado, márgenes de seguridad",
        "target": 28
      },
      {
        "id": "030.08",
        "title": "Ascenso, crucero, autonomía y alcance",
        "topics": "Gráficas de ascenso, potencia de crucero, velocidades de máxima autonomía y de máximo alcance, alcance en aire en calma, efecto del viento",
        "target": 20
      },
      {
        "id": "030.09",
        "title": "Plan de navegación VFR",
        "topics": "Rutas, aeródromos, alturas y altitudes de la carta, altitud mínima de seguridad, rumbos y distancias, cartas de aeródromo, frecuencias y radioayudas, navlog completo",
        "target": 24
      },
      {
        "id": "030.10",
        "title": "Combustible",
        "topics": "Rodaje, viaje, contingencia, alternativo, reserva final y extra; registro de combustible en vuelo",
        "target": 16
      },
      {
        "id": "030.11",
        "title": "Preparación previa",
        "topics": "AIP, NOTAM y boletines de información previa, servicios, aeródromos de salida, destino y alternativo, estructura del espacio aéreo, briefing meteorológico",
        "target": 14
      },
      {
        "id": "030.12",
        "title": "Plan de vuelo OACI",
        "topics": "Formato y casillas, cómo se rellena, presentación, activación y cierre",
        "target": 14
      },
      {
        "id": "030.13",
        "title": "Seguimiento en vuelo",
        "topics": "Control de derrota y tiempo, gestión del combustible y replanificación",
        "target": 12
      }
    ]
  },
  {
    "code": "020",
    "id": "conocimiento-aeronave",
    "name": "Conocimiento general de la aeronave",
    "exam": {
      "questions": 24,
      "minutes": 40,
      "pass": 18
    },
    "blocks": [
      {
        "id": "020.01",
        "title": "Cargas y estructura",
        "topics": "Tracción, compresión, cortadura, torsión y flexión; estructura de tubos, monocasco y semimonocasco; materiales; alas, fuselaje, empenaje y parabrisas; límites",
        "target": 16
      },
      {
        "id": "020.02",
        "title": "Tren, frenos y neumáticos",
        "topics": "Tipos de tren, amortiguadores, dirección de la rueda de morro y amortiguador de shimmy, frenos de disco hidráulicos, freno de aparcamiento, neumáticos",
        "target": 14
      },
      {
        "id": "020.03",
        "title": "Hidráulica básica",
        "topics": "Principio de Pascal, sistema de frenos, fluidos",
        "target": 6
      },
      {
        "id": "020.04",
        "title": "Mandos de vuelo",
        "topics": "Primarios y secundarios, cables y varillas, flaps eléctricos (C172) y manuales (PA-28), compensadores, fallos y bloqueos",
        "target": 14
      },
      {
        "id": "020.05",
        "title": "Antihielo",
        "topics": "Calefacción del pitot y del parabrisas; límites de un avión no certificado para hielo",
        "target": 6
      },
      {
        "id": "020.06",
        "title": "Sistema de combustible",
        "topics": "Depósitos y ventilación, selector (PA-28: izquierdo, derecho y cerrado; C172: ambos), gravedad frente a bomba mecánica más eléctrica en ala baja, filtro y drenajes, indicadores, contaminación, bloqueo por vapor",
        "target": 20
      },
      {
        "id": "020.07",
        "title": "Electricidad básica",
        "topics": "Tensión, corriente, resistencia, ley de Ohm, potencia, corriente continua y alterna, serie y paralelo, magnetismo",
        "target": 12
      },
      {
        "id": "020.08",
        "title": "Sistema eléctrico del avión",
        "topics": "Batería, alternador frente a generador, regulador y protección contra sobretensión, barras, maestro y aviónica, disyuntores y fusibles, relés, amperímetro, estática y descargadores, rayos",
        "target": 22
      },
      {
        "id": "020.09",
        "title": "Motor de pistón",
        "topics": "Tipos, componentes, ciclo de cuatro tiempos con avance y retraso de válvulas, relación de compresión",
        "target": 18
      },
      {
        "id": "020.10",
        "title": "Combustibles",
        "topics": "Grados y colores, octanaje, alternativos (mogas, UL91) y sus límites",
        "target": 10
      },
      {
        "id": "020.11",
        "title": "Carburador e inyección",
        "topics": "Carburador de flotador, control de mezcla, bomba de aceleración, calefacción del carburador, tipos de hielo; inyección y arranque en caliente",
        "target": 22
      },
      {
        "id": "020.12",
        "title": "Refrigeración",
        "topics": "Por aire, deflectores, flaps de capó, temperatura de culatas, sobrecalentamiento",
        "target": 8
      },
      {
        "id": "020.13",
        "title": "Lubricación",
        "topics": "Funciones del aceite, cárter húmedo, tipos de aceite, presión y temperatura, qué hacer ante un fallo",
        "target": 12
      },
      {
        "id": "020.14",
        "title": "Encendido",
        "topics": "Magnetos, acoplamiento de impulsos, bujías, doble encendido, interruptor, prueba de magnetos y magneto vivo",
        "target": 14
      },
      {
        "id": "020.15",
        "title": "Mezcla",
        "topics": "Estequiométrica, de máxima potencia y de máxima economía; empobrecimiento con EGT; efectos de mezcla rica y pobre; detonación y preencendido",
        "target": 14
      },
      {
        "id": "020.16",
        "title": "Hélices",
        "topics": "Ángulo de pala, paso fijo de ascenso y de crucero, paso variable y velocidad constante, regulador, orden de las palancas, fallos",
        "target": 14
      },
      {
        "id": "020.17",
        "title": "Manejo del motor",
        "topics": "Influencia de presión de admisión y RPM, de la atmósfera y de la sobrealimentación; potencia y mezcla en cada fase; enfriamiento brusco",
        "target": 12
      },
      {
        "id": "020.18",
        "title": "Sensores de motor",
        "topics": "Tubo de Bourdon, termopares y termorresistencias, indicadores de combustible, caudalímetro, tacómetro",
        "target": 10
      },
      {
        "id": "020.19",
        "title": "Pitot-estático y temperatura",
        "topics": "Presiones, tomas, drenajes, fuente alternativa, errores, temperatura exterior",
        "target": 12
      },
      {
        "id": "020.20",
        "title": "Altímetro",
        "topics": "Cápsulas, reglajes, errores, lectura",
        "target": 12
      },
      {
        "id": "020.21",
        "title": "Anemómetro y variómetro",
        "topics": "IAS, CAS, EAS y TAS; arcos; errores; retardo del variómetro",
        "target": 12
      },
      {
        "id": "020.22",
        "title": "Brújula",
        "topics": "Magnetismo terrestre e inclinación magnética, construcción, desvío y compensación, errores en virajes y aceleraciones",
        "target": 12
      },
      {
        "id": "020.23",
        "title": "Giróscopos",
        "topics": "Rigidez y precesión, derivas real y aparente, coordinador de viraje y bola, horizonte artificial, direccional; de vacío o eléctricos",
        "target": 16
      },
      {
        "id": "020.24",
        "title": "Comunicaciones, avisos y pantallas",
        "topics": "VHF, HF y satélite; aviso de pérdida neumático o eléctrico; pantallas electrónicas, AHRS y ordenador de datos de aire",
        "target": 12
      }
    ]
  },
  {
    "code": "060",
    "id": "navegacion",
    "name": "Navegación",
    "exam": {
      "questions": 12,
      "minutes": 25,
      "pass": 9
    },
    "blocks": [
      {
        "id": "060.01",
        "title": "Sistema solar y la Tierra",
        "topics": "Rotación, traslación, estaciones y movimiento aparente del Sol; forma de la Tierra, círculo máximo y menor, loxodrómica, latitud y longitud, coordenadas",
        "target": 16
      },
      {
        "id": "060.02",
        "title": "Tiempo",
        "topics": "Tiempo aparente, UTC, hora media local, hora oficial (península y Baleares UTC+1 y +2 en verano; Canarias UTC+0 y +1), línea de cambio de fecha, orto, ocaso, crepúsculo civil y noche",
        "target": 14
      },
      {
        "id": "060.03",
        "title": "Direcciones y distancias",
        "topics": "Norte verdadero, magnético y de brújula, variación e isógonas, desvío; NM, SM, km, m y ft; minutos de latitud y de longitud",
        "target": 18
      },
      {
        "id": "060.04",
        "title": "Magnetismo",
        "topics": "Magnetismo terrestre, componentes e inclinación, cambio anual de la variación, magnetismo del propio avión",
        "target": 8
      },
      {
        "id": "060.05",
        "title": "Cartas",
        "topics": "Mercator y Lambert (propiedades; meridianos, paralelos, círculo máximo y loxodrómica); carta OACI 1:500.000 de ENAIRE: relieve, símbolos, espacios aéreos, puntos VFR; medir y trazar",
        "target": 26
      },
      {
        "id": "060.06",
        "title": "Navegación a estima",
        "topics": "Derrota, rumbos verdadero, magnético y de brújula, viento, IAS, CAS, TAS, GS, ETA, deriva y corrección, posición estimada",
        "target": 18
      },
      {
        "id": "060.07",
        "title": "Computador de navegación",
        "topics": "Velocidad, tiempo, distancia, consumo, conversiones, TAS, triángulo de velocidades, hallar el viento, altitud verdadera",
        "target": 34
      },
      {
        "id": "060.08",
        "title": "Navegación en vuelo",
        "topics": "Lectura de carta, correcciones de GS y de derrota (1 en 60, ángulo de cierre), cálculo del viento en vuelo, revisión de ETA, log, procedimiento de extravío",
        "target": 24
      },
      {
        "id": "060.09",
        "title": "Propagación",
        "topics": "Antenas, bandas, onda de tierra, ionosférica y directa, alcance",
        "target": 10
      },
      {
        "id": "060.10",
        "title": "VDF",
        "topics": "Principio, QDM, QDR y QTE, clases de precisión, alcance",
        "target": 8
      },
      {
        "id": "060.11",
        "title": "NDB y ADF",
        "topics": "Principio, RBI y RMI, alcance, errores, cálculo de marcaciones, acercamiento y seguimiento",
        "target": 20
      },
      {
        "id": "060.12",
        "title": "VOR",
        "topics": "Principio, radiales, OBS y CDI, TO/FROM, cono de silencio, alcance, errores, identificación, interceptar un radial",
        "target": 22
      },
      {
        "id": "060.13",
        "title": "DME",
        "topics": "Principio, distancia oblicua, GS y tiempo, alcance",
        "target": 8
      },
      {
        "id": "060.14",
        "title": "Radar y SSR",
        "topics": "Primario y secundario, 1030 y 1090 MHz, modos A, C y S, códigos, IDENT, ADS-B",
        "target": 6
      },
      {
        "id": "060.15",
        "title": "GNSS",
        "topics": "GPS, GLONASS y Galileo; segmentos; principio; errores; RAIM y EGNOS; uso en VFR y base de datos vigente",
        "target": 8
      }
    ]
  }
]

export const syllabusByCode = (code: string) => PPL_SYLLABUS.find(s => s.code === code)
export const syllabusById = (id: string) => PPL_SYLLABUS.find(s => s.id === id)
export const blockById = (id: string) => syllabusByCode(id.slice(0, 3))?.blocks.find(b => b.id === id)
