# Cockpit Flows

Entrenador personal de flows de cabina: guía de cada panel, flows animados, repaso de memoria con validación por clic, flashcards de ubicación y editor de flows. También permite subir cabinas propias.

## Arrancar

```bash
npm install
npm run dev
```

## Flotas incluidas

| Avión | Roles | Flows |
|---|---|---|
| Cessna 172S (analógico) | Piloto | Prevuelo, antes de arrancar, arranque, run-up, después de aterrizar, apagado |
| Piper PA-28-181 Archer II | Piloto | Prevuelo, arranque en frío, run-up, antes del despegue, después de aterrizar, apagado |
| Piper PA-27 Aztec | Piloto | Antes de arrancar, arranque L→R, run-up, antes del despegue, después de aterrizar, apagado |
| ATR 42/72-600 | CM1 / CM2 | Seguridad, overhead preliminar, preparación de cabina, arranque (Hotel), antes del rodaje, después de aterrizar, parking |
| Boeing 737-800 NG | CPT / FO | Power up, preflight FO, preflight CPT, before start, engine start, before taxi, after landing, shutdown |

Las cabinas son esquemas SVG generados en `src/data/*.ts`: no están a escala, pero respetan el orden de los paneles. Cada mando tiene su descripción, y cada paso es `{ c: idMando, a: acción, r: rol, n: nota }`.

> ⚠️ Los procedimientos son plantillas de estudio redactadas a partir de procedimientos estándar del tipo, no copias del POH/FCOM. Verifícalos con tu documentación y con los SOP de tu escuela u operador. Desde la app puedes **duplicarlos y editarlos**.

## Datos

- Se guardan en el navegador (localStorage + IndexedDB para las imágenes de cabinas propias).
- Copia de seguridad en JSON desde **Progreso**.
- **Cuentas y progreso en la nube con Firebase** (ver «Usuarios y Firebase»).

## Estructura

```
src/data/        aviones (paneles, mandos, flows, guía)
src/layout.ts    posiciona los mandos en cada panel + curvas del flow
src/components/  Cockpit (SVG) y ControlShape (dibujo de cada tipo de mando)
src/pages/       Home, AircraftPage (guía/procedimientos/flashcards), FlowPage (estudio/repaso), Editor, NewAircraft, Progress
```

## Fotos reales (Wikimedia Commons)

Las cabinas tienen vistas con **fotos reales** además del esquema. Se puede pasar de una a otra con las pestañas que hay sobre la cabina, y en modo estudio la vista cambia sola según el paso. Cada mando es una zona clicable sobre la foto. Si alguna no encaja, se ajusta en **Ajustar mandos en fotos** (`#/ac/<id>/spots`); los ajustes se guardan en el navegador y se pueden exportar en JSON para pasarlos a `src/data/photos.ts`.

| Archivo | Autor | Licencia |
|---|---|---|
| [Flight training cockpit-0.jpg](https://commons.wikimedia.org/wiki/File:Flight_training_cockpit-0.jpg) (C172) | Matthew Piatt | CC BY-SA 2.0 |
| [Virgin Australia ATR cockpit in hangar](https://commons.wikimedia.org/wiki/File:Virgin_Australia_ATR_cockpit_in_hangar_-_Brisbane_Airport.jpg) (ATR panel) | Aviationbystirling | CC BY 4.0 |
| [Overhead panel of an ATR 72 cockpit](https://commons.wikimedia.org/wiki/File:Overhead_panel_of_an_ATR_72_cockpit.jpg) (ATR overhead, 72-500) | Olivier Cleynen | CC BY-SA 3.0 |
| [Power and Condition levers of ATR72](https://commons.wikimedia.org/wiki/File:Power_and_Condition_levers_of_ATR72.jpg) (ATR pedestal) | Mir ridowan sayeed | CC BY-SA 4.0 |
| [WN 737-8H4 Flight Deck](https://commons.wikimedia.org/wiki/File:WN_737-8H4_Flight_Deck.jpg) (737 panel) | N717JG | CC BY-SA 4.0 |
| [OVHD B737NG](https://commons.wikimedia.org/wiki/File:OVHD_B737NG.jpg) (737 overhead) | Dreznicek009 | CC BY-SA 4.0 |

Las fotos se han reducido a un máximo de 2000 px. El PA-27 Aztec solo tiene esquema, porque en Commons no hay ninguna foto usable de su panel.

## Estudio guiado

- **🎬 Tutorial guiado** (en cada procedimiento): un vídeo que se genera en tiempo real. La cámara viaja a cada mando sobre la foto real (o el esquema), una voz narra el paso y su porqué, salen subtítulos y el flow se va dibujando. Atajos: espacio para pausar, ← → para cambiar de paso y Esc para salir.
- **Narración en modo estudio:** cada paso se lee en voz alta; el avance automático espera a que termine la voz. Usa las voces neuronales del sistema (Web Speech API), sin claves ni coste. En Mac, para que suene más natural, instala una voz «Mejorada» o «Premium» en español.
- **Vídeos reales:** pestaña «Vídeos» en cada avión y vídeos relacionados dentro de cada procedimiento (YouTube sin cookies hasta pulsar play). Se indica cuáles están grabados en simulador.
- **Explicaciones (`w`)** en los pasos: el porqué de cada acción, que lee la voz y aparece en pantalla.

## Esquemas tipo cabina

Los esquemas incluyen el entorno de la cabina (`src/data/env.ts` + `components/Environment.tsx`): parabrisas con pista y horizonte, montantes, brújula, capó, visera, techo del overhead, pedestal en perspectiva, suelo y volantes. Las zonas clicables no cambian.

### Fotos añadidas

| Archivo | Autor | Licencia |
|---|---|---|
| [Cockpit of Piper PA28-181 Archer II ‘G-SAPI’](https://commons.wikimedia.org/wiki/File:Cockpit_of_Piper_PA28-181_Archer_II_%E2%80%98G-SAPI%E2%80%99_(34105117476).jpg) | Alan Wilson | CC BY-SA 2.0 |
| [Piper PA-28-181 Archer II Instrumentbräda](https://commons.wikimedia.org/wiki/File:Piper_PA-28-181_Archer_II_Instrumentbr%C3%A4da.jpg) | Gzy84c | CC BY-SA 3.0 |
| [Cessna-172-trim-control.jpg](https://commons.wikimedia.org/wiki/File:Cessna-172-trim-control.jpg) | BenFrantzDale | CC BY-SA 3.0 |
| [Cockpit Cessna 172 PD 005.JPG](https://commons.wikimedia.org/wiki/File:Cockpit_Cessna_172_PD_005.JPG) | Bin im Garten | CC BY-SA 3.0 |

## Voz neuronal (Piper)

Las narraciones (pasos, intros, guía) se pregeneran con **[Piper](https://github.com/OHF-Voice/piper1-gpl)**, un TTS neuronal de código abierto que funciona sin conexión. La voz es `es_ES-davefx-medium` (español de España).

```bash
npm run audio                                   # genera solo lo que falta
PIPER_VOICE=es_ES-sharvard-medium npm run audio # otra voz (borra antes public/audio/*.m4a)
```

- `scripts/narrations.ts` exporta todos los textos y `scripts/tts_piper.py` crea `public/audio/<hash>.m4a` y `manifest.json`. Necesita `uv`; Python 3.12 y Piper se instalan solos en un entorno aislado.
- La app reproduce el audio neuronal si existe para ese texto exacto. Si no (por ejemplo, flows creados o editados por ti), usa la voz del sistema.
- Vuelve a ejecutarlo después de cambiar textos de los procedimientos.

## Guía de uso

Al abrir la app por primera vez aparece una presentación narrada de 11 pasos. También está siempre en **Guía** (`#/guia`) y en el botón «▶ Cómo funciona» del inicio.

## Secciones

- **Inicio** (`#/`): acceso a las dos secciones y al curso PPL VFR de AirHispania.
- **🎓 Licencias** (`#/licencias`): recorrido modular EASA en España (PPL → VFR-N → hour building → ATPL teórico → CPL → MEP → IR/BIR → MCC/UPRT → tipo → ATPL).
  - **PPL(A) completa**: requisitos, examen de AESA (tabla oficial de 120 preguntas), programa de vuelo, prueba de pericia y las **9 asignaturas**. Cada asignatura incluye temario oficial (AMC1 FCL.210; FCL.215), bloques de estudio con tablas, fórmulas y ejemplos resueltos, trampas de examen, mnemotecnias, libros en castellano e inglés, recursos oficiales gratuitos y un **test** con corrección explicada.
  - Las demás etapas tienen los requisitos verificados y están marcadas como «en progreso».
  - Los contenidos están en `src/data/licenses/` y salen de la investigación `reports/Guía de estudio PPL EASA.md`. Las cifras de manual sin verificar en fuente primaria van marcadas como «valor de manual».
- **🛩️ Cockpits** (`#/cockpits`): las cabinas y procedimientos.

## Usuarios y Firebase

Proyecto: `cockpit-flows-academy` (configuración en `.env.local`, que no se sube a git).

- **Acceso privado**: con Firebase configurado, la app pide iniciar sesión. Las cuentas las crea el administrador; no hay registro libre.
- **Roles**: `admin` y `student`, en `users/{uid}`. La cuenta de `VITE_ADMIN_EMAIL` es administradora desde su primer acceso.
- **Progreso**: `users/{uid}/data/progress` (repasos, flows propios, flashcards, tests, zonas de fotos y un resumen) y `users/{uid}/aircraft/{id}` (cabinas propias de menos de ~900 KB). Se descarga al entrar y se guarda solo, a los 2,5 s de cada cambio.
- **Panel `#/admin`**: crear usuarios (con contraseña inicial y email para que elijan la suya), cambiar rol, desactivar, ver progreso, borrar progreso y eliminar perfil. Borrar la cuenta de Authentication requiere la consola (o un servidor con Admin SDK).
- **Seguridad**: `firestore.rules.template` → `npm run deploy:rules` (genera `firestore.rules` con el email admin y lo despliega). Cada alumno solo puede leer y escribir lo suyo; el admin, todo.
- **Despliegue en Firebase Hosting**: `npm run deploy`.

## Fraseología (español e inglés OACI)

Módulo `#/licencias/fraseologia` (`src/data/licenses/phraseology.ts`):
- **Fundamentos**: alfabeto con pronunciación, números (ES/EN), cómo se dice cada dato (altitudes, niveles, rumbos, frecuencias, códigos SSR…), las 27 palabras normalizadas en los dos idiomas, colaciones obligatorias del AIP GEN 1.7, estructura de las llamadas y errores típicos.
- **Simulador de radio** con 4 escenarios: vuelo VFR completo, circuito con tomas y motor y al aire, MAYDAY/PAN PAN y fallo de radio. Cada mensaje está en español, en inglés o en ambos, con voz de piloto y de controlador (Piper: `es_ES-davefx`, `es_ES-sharvard`, `en_GB-alan` y `en_US-ryan`). Las matrículas, números y siglas se pronuncian como en radio (`radioSpeech` en `src/speech.ts`). En el **modo práctica** contestas tú como piloto y recibes una explicación de cada error.
- **Test** de 12 preguntas.
- El aeródromo «Villanueva», sus puntos y frecuencias son ficticios.

## Responsive

Con menos de 860 px aparece un menú ☰, y en móvil se adaptan cabeceras, tutorial, simulador y tablas, que hacen scroll dentro de su caja. Se comprobó que las 27 páginas caben en 375 px sin scroll horizontal. Para probar en local sin cuentas: `VITE_NO_AUTH=1 npm run dev`.
