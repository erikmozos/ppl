// Guía de uso de la app (onboarding + página #/guia). `say` es el texto que narra la voz.

export interface GuideSlide { icon: string; title: string; body: string[]; say: string; link?: { href: string; label: string } }

export const GUIDE: GuideSlide[] = [
  {
    icon: '', title: 'Bienvenido a Cockpit Flows',
    body: [
      'Una academia de vuelo en la web, pensada para el recorrido modular EASA en España: de la PPL hasta la cabina de un avión de línea.',
      'Tiene dos grandes secciones: Licencias y Cockpits.',
    ],
    say: 'Bienvenido a Cockpit Flows, una academia de vuelo para el recorrido modular en España: de la licencia de piloto privado hasta la cabina de un avión de línea. Tiene dos grandes secciones: licencias y cockpits.',
  },
  {
    icon: '', title: 'Licencias: el PPL completo y el recorrido modular',
    body: [
      'El PPL(A) tiene el temario oficial entero: 138 lecciones, una por bloque del temario de EASA, con explicaciones, figuras, calculadoras, ejemplos resueltos, cifras para memorizar y trampas de examen.',
      'Cada lección trae sus preguntas con la explicación de todas las opciones y sus fichas. Cada respuesta se guarda: lo que fallas vuelve en el «Repaso de hoy» con repetición espaciada.',
      'El simulacro reproduce el examen de AESA materia a materia (mismas preguntas, mismo tiempo, 75 %), y cada materia te dice cuándo estás lista para examinarte.',
      'El resto de etapas (VFR nocturno, ATPL teórico, CPL, MEP, IR, MCC, tipo y ATPL) tienen sus requisitos verificados.',
    ],
    say: 'En licencias tienes el PPL completo: ciento treinta y ocho lecciones, una por bloque del temario oficial, con sus preguntas y fichas. Cada respuesta se guarda, y lo que fallas vuelve en el repaso de hoy. El simulacro reproduce el examen de AESA materia a materia, y cada materia te dice cuándo estás lista para examinarte. El resto del recorrido modular tiene sus requisitos verificados.',
    link: { href: '#/licencias/ppl', label: 'Ir al PPL' },
  },
  {
    icon: '', title: 'Cockpits: aprende los flows',
    body: [
      'Cinco aviones con fotos reales y esquemas: Cessna 172, Piper Archer, Piper Aztec, ATR 72 y Boeing 737.',
      'Los procedimientos se basan en el POH y el FCOM de cada uno, con la sección del manual indicada.',
    ],
    say: 'En cockpits tienes cinco aviones con fotos reales y esquemas interactivos. Sus procedimientos se basan en el manual de cada avión, y siempre verás en qué sección se apoyan. A continuación te explico cómo usarlos.',
  },
  {
    icon: '', title: '1 · Elige un avión',
    body: [
      'En el inicio, toca la tarjeta de una flota.',
      'Encima de la cabina hay pestañas para cambiar de vista: fotos reales (panel, overhead, pedestal…) y esquema, donde salen todos los mandos.',
      'Con los botones + y − puedes hacer zoom.',
    ],
    say: 'Primero elige un avión en el inicio. Encima de la cabina verás pestañas para cambiar entre las fotos reales y el esquema, que tiene todos los mandos. Puedes hacer zoom con los botones más y menos.',
  },
  {
    icon: '', title: '2 · Guía de cabina',
    body: [
      'Toca cualquier mando para ver qué hace y en qué procedimientos aparece.',
      'En la columna derecha tienes el resumen del avión, sus velocidades, la lista de paneles (tócalos para resaltarlos) y cómo funcionan sus sistemas.',
    ],
    say: 'En la guía de cabina, toca cualquier mando para saber qué hace y en qué procedimientos aparece. A la derecha tienes los datos del avión, sus paneles y cómo funcionan sus sistemas.',
  },
  {
    icon: '', title: '3 · Estudia un procedimiento',
    body: [
      'En «Procedimientos», pulsa «Estudiar». El flow se dibuja sobre la cabina paso a paso, con números y una línea de color por tripulante (CM1/CM2, Capitán/FO).',
      'Pulsa Reproducir o usa las flechas ← →. Cada paso se lee en voz alta con su explicación; puedes cambiar la voz y la velocidad.',
      'La vista cambia sola a la foto donde está cada mando.',
    ],
    say: 'Para estudiar, entra en Procedimientos y pulsa Estudiar. El flow se dibuja sobre la cabina paso a paso, con un color para cada tripulante. Pulsa reproducir o usa las flechas. Cada paso se lee en voz alta con su explicación, y la vista cambia sola a la foto donde está cada mando.',
  },
  {
    icon: '', title: '4 · Tutorial guiado',
    body: [
      'El botón «Tutorial guiado» abre un vídeo a pantalla completa: la cámara viaja a cada mando, la voz explica qué haces y por qué, y salen subtítulos.',
      'Espacio para pausar, flechas para saltar, Esc para salir. Es la mejor forma de ver un flow por primera vez.',
    ],
    say: 'El tutorial guiado es como un vídeo: la cámara viaja a cada mando, la voz explica qué haces y por qué, y salen subtítulos. Pulsa espacio para pausar y escape para salir. Es la mejor forma de ver un flow por primera vez.',
  },
  {
    icon: '', title: '5 · Repasa de memoria',
    body: [
      'En «Repaso» el flow se oculta: toca los mandos en el orden correcto.',
      'Cada acierto se marca con y cada fallo con . Con tres fallos en un paso, se revela. Hay dos pistas: la acción y la ubicación (una onda sobre el mando).',
      'Al terminar ves tu nota y puedes superponer el flow correcto. Practica solo tu rol o el de toda la tripulación.',
    ],
    say: 'En el repaso, el flow se oculta y tienes que tocar los mandos en el orden correcto. Con tres fallos en un paso, se revela. Tienes dos pistas: la acción y la ubicación. Al terminar verás tu nota y podrás comparar con el flow correcto.',
  },
  {
    icon: '🃏', title: '6 · Flashcards',
    body: [
      'Te pregunta «¿Dónde está…?» y tú lo tocas en la cabina, en la foto o en el esquema.',
      'Repite más los mandos que fallas. Activa el modo difícil para ocultar los rótulos.',
    ],
    say: 'Las flashcards te preguntan dónde está un mando y tú lo tocas en la cabina. Repiten más los que fallas. Activa el modo difícil para ocultar los rótulos.',
  },
  {
    icon: '', title: '7 · Vídeos reales',
    body: [
      'En la pestaña «Vídeos» de cada avión, y dentro de cada procedimiento, hay vídeos de pilotos e instructores para ver el ritmo y la técnica reales.',
    ],
    say: 'En la pestaña vídeos tienes grabaciones de pilotos e instructores reales para ver el ritmo y la técnica.',
  },
  {
    icon: '', title: '8 · Hazlo tuyo',
    body: [
      '«Duplicar y editar» copia un procedimiento para adaptarlo al checklist de tu escuela: toca mandos para añadir pasos y escribe la acción, el rol y las notas.',
      '«Ajustar mandos en fotos» corrige dónde está cada zona sobre una foto.',
      '«+ Subir mi cabina» crea un avión nuevo a partir de una foto o un póster.',
    ],
    say: 'Puedes adaptar todo a tu escuela. Duplica un procedimiento y edítalo, ajusta las zonas de los mandos sobre las fotos o sube la foto de tu propia cabina para crear un avión nuevo.',
  },
  {
    icon: '', title: '9 · Progreso',
    body: [
      'En «Progreso» ves tus notas y los mandos dominados.',
      'Todo se guarda en este navegador. Exporta una copia en JSON para pasarla a otro dispositivo, o activa la sincronización con Supabase.',
    ],
    say: 'En progreso verás tus notas y los mandos que dominas. Todo se guarda en este navegador, y puedes exportar una copia para pasarla a otro dispositivo.',
  },
  {
    icon: '', title: 'Importante',
    body: [
      'Los procedimientos son plantillas de estudio, no el POH, el AFM ni el FCOM. Verifica cada paso con la documentación de tu avión y con los SOP de tu escuela u operador.',
      'Método recomendado: tutorial guiado, luego estudio, luego repaso hasta sacar más del 90 % sin pistas, y flashcards para lo que falle.',
    ],
    say: 'Importante: estos procedimientos son plantillas de estudio. Verifica siempre cada paso con la documentación de tu avión y con los procedimientos de tu escuela. El método recomendado es: tutorial guiado, después estudio, y repaso hasta sacar más del noventa por ciento sin pistas. ¡Buen vuelo!',
    link: { href: '#/ac/c172', label: 'Empezar con la Cessna 172' },
  },
]
