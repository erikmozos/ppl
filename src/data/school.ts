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
]

export const schoolSubject = (id: string) => SCHOOL_SUBJECTS.find(s => s.id === id)
