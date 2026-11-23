// DreamAir, la escuela de vuelo del alumno: asignaturas con el temario tal como lo dan sus instructores.
// Las lecciones son las del temario PPL (src/content/ppl), reescritas con las diapositivas del curso.

export interface SchoolSubject {
  /** id en la URL: #/dreamair/<id> */
  id: string
  /** código de la materia del PPL */
  code: string
  name: string
  short: string
  /** temas del curso, en el orden de los instructores, con los bloques del temario que cubre cada uno */
  temas: { title: string; blocks: string[] }[]
}

export const SCHOOL = {
  name: 'DreamAir',
  summary: 'Tu escuela de vuelo. Aquí está cada asignatura tal como la dan tus instructores: los mismos temas y en el mismo orden, con lecciones ampliadas, ejemplos para entenderlo, esquemas, autoevaluación, preguntas y fichas.',
}

export const SCHOOL_SUBJECTS: SchoolSubject[] = [
  {
    id: 'cga', code: '020', name: 'Conocimiento general de la aeronave', short: 'CGA',
    temas: [
      { title: 'Tema 1 · Fuselaje y estructura', blocks: ['020.01', '020.02', '020.03'] },
      { title: 'Tema 2 · Mandos de vuelo', blocks: ['020.04'] },
      { title: 'Tema 3 · Sistemas neumáticos y presurización', blocks: ['020.25'] },
      { title: 'Tema 4 · Antihielo y deshielo', blocks: ['020.05'] },
      { title: 'Tema 5 · Sistema de combustible', blocks: ['020.06', '020.10'] },
      { title: 'Tema 6 · Electricidad', blocks: ['020.07', '020.08'] },
      { title: 'Tema 7 · Motores y hélices', blocks: ['020.09', '020.11', '020.12', '020.13', '020.14', '020.15', '020.16', '020.17', '020.18'] },
    ],
  },
  {
    id: 'pof', code: '080', name: 'Principios de vuelo', short: 'POF',
    temas: [
      { title: 'Tema 1 · Magnitudes, definiciones y leyes de Newton', blocks: ['080.01'] },
      { title: 'Tema 2 · El perfil, la atmósfera, Bernoulli y el pitot', blocks: ['080.03', '080.02'] },
      { title: 'Tema 3 · Flujo y sustentación', blocks: ['080.04', '080.05'] },
      { title: 'Tema 4 · Resistencia, torbellinos y efecto suelo', blocks: ['080.06', '080.07'] },
      { title: 'Tema 5 · Hipersustentadores', blocks: ['080.09'] },
      { title: 'Tema 6 · La pérdida', blocks: ['080.08'] },
      { title: 'Tema 7 · Estabilidad', blocks: ['080.11'] },
      { title: 'Tema 8 · Control', blocks: ['080.12'] },
      { title: 'Tema 9 · Limitaciones y factores de carga', blocks: ['080.13'] },
    ],
  },
  {
    id: 'meteo', code: '050', name: 'Meteorología', short: 'METEO',
    temas: [
      { title: 'Tema 1 · La atmósfera', blocks: ['050.01'] },
      { title: 'Tema 2 · Presión, densidad y altitud de densidad', blocks: ['050.02'] },
      { title: 'Tema 3 · Altimetría', blocks: ['050.03'] },
      { title: 'Tema 4 · Masas de aire', blocks: ['050.12'] },
      { title: 'Tema 5 · Frentes', blocks: ['050.13'] },
      { title: 'Tema 6 · Sistemas de presión y climatología', blocks: ['050.14', '050.05'] },
      { title: 'Tema 7 · Peligros: engelamiento, turbulencia y niebla', blocks: ['050.15', '050.07', '050.10'] },
      { title: 'Tema 8 · Mapas y símbolos del tiempo significativo', blocks: ['050.18'] },
    ],
  },
  {
    id: 'nav', code: '060', name: 'Navegación', short: 'NAV',
    temas: [
      { title: 'Tema 1 · La Tierra y el Sol', blocks: ['060.01'] },
      { title: 'Tema 2 · Distancias y direcciones', blocks: ['060.03'] },
      { title: 'Tema 3 · Proyecciones y cartas', blocks: ['060.05'] },
      { title: 'Tema 4 · Magnetismo terrestre', blocks: ['060.04'] },
      { title: 'Tema 5 · Velocidades y ETA', blocks: ['060.06'] },
      { title: 'Tema 6 · Hora y fecha', blocks: ['060.02'] },
      { title: 'Tema 7 · Computador CR3', blocks: ['060.07'] },
    ],
  },
  {
    id: 'coms', code: '090', name: 'Comunicaciones', short: 'COMS',
    temas: [
      { title: 'Tema 1 · Principios de radio y propagación', blocks: ['090.11'] },
      { title: 'Tema 2 · Radiotelefonía VHF y técnica de transmisión', blocks: ['090.03', '090.04'] },
      { title: 'Tema 3 · Categorías de mensajes, socorro y urgencia', blocks: ['090.01', '090.10'] },
      { title: 'Tema 4 · Distintivos y colaciones', blocks: ['090.05', '090.06'] },
      { title: 'Tema 5 · Fallo de comunicaciones, reglas del aire y señales', blocks: ['090.09'] },
    ],
  },
]

export const schoolSubject = (id: string) => SCHOOL_SUBJECTS.find(s => s.id === id)
