# Temario PPL(A) — guía de redacción

Este directorio contiene el temario completo del PPL(A) para el examen teórico de AESA: una lección por bloque del temario oficial, con sus preguntas y fichas. El objetivo es exigente: **una persona que solo estudie con esta web debe poder aprobar las 9 materias del examen oficial de AESA**. Todo lo que se escriba aquí tiene que servir para eso.

- Mapa de bloques, temas y preguntas objetivo: `src/data/licenses/ppl-syllabus.ts` (`PPL_SYLLABUS`).
- Tipos: `src/data/licenses/types.ts` (`LessonFile`, `Lesson`, `Block`, `BankQuestion`, `Card`).
- Un fichero por bloque: `src/content/ppl/<código>/<id>.json`, por ejemplo `src/content/ppl/010/010.07.json`.
- Figuras: `src/content/ppl/figures/<nombre>.svg`, con el prefijo del código de la materia (`080-perfil.svg`).
- Validación obligatoria: `npx tsx scripts/validate-content.ts 010.07` (o `010` para toda la materia). Tiene que terminar con **0 errores**.
- Vista previa de una figura: `node scripts/figure-preview.mjs src/content/ppl/figures/080-perfil.svg` y abrir los PNG que imprime (tema claro y oscuro).

## Formato del fichero

```json
{
  "lesson": {
    "id": "010.07",
    "title": "Reglas de vuelo visual (VFR)",
    "summary": "Mínimos VMC por clase de espacio aéreo, VFR especial, VFR nocturno, alturas mínimas y niveles de crucero.",
    "objectives": ["Aplicar la tabla VMC según clase y altitud", "…"],
    "sections": [
      {
        "title": "Mínimos VMC (SERA.5001)",
        "text": ["Párrafo explicativo con **negritas** para lo esencial."],
        "bullets": ["…"],
        "table": { "caption": "…", "head": ["…"], "rows": [["…"]], "src": "SERA.5001" },
        "formulas": [{ "f": "L = ½ · ρ · V² · S · CL", "note": "…" }],
        "examples": [{ "q": "Enunciado de un ejemplo resuelto", "a": "Resolución paso a paso" }],
        "figure": "svg:010-vmc" ,
        "caption": "Pie de la figura",
        "note": { "kind": "es", "text": "En España…" },
        "verify": false
      }
    ],
    "numbers": ["8 km de visibilidad a FL100 o por encima", "…"],
    "traps": ["La reducción a libre de nubes solo existe en F y G", "…"],
    "spain": ["El VFR especial solo de día…"],
    "sources": [{ "title": "SERA (Reglamento 923/2012), Easy Access Rules", "url": "https://…" }],
    "reviewed": "2026-10-09",
    "links": [{ "label": "Prueba de motor en la cabina del PA-28", "href": "#/ac/pa28/flow/runup" }]
  },
  "questions": [
    {
      "id": "010.07.001",
      "type": "regla",
      "level": 2,
      "es": true,
      "q": "En España, el VFR especial se autoriza:",
      "options": ["De día y de noche con 1500 m", "Solo de día, con 1500 m de visibilidad de vuelo y 140 kt IAS o menos", "Solo de noche", "Con 800 m en cualquier espacio aéreo"],
      "correct": 1,
      "why": "AIP España GEN 1.7 (SERA.5010): solo de día, libre de nubes y con la superficie a la vista, visibilidad de vuelo de al menos 1500 m y 140 kt IAS o menos.",
      "whyNot": ["De noche no se autoriza en España.", null, "Es justo al revés: de noche no.", "800 m es el valor para helicópteros."],
      "ref": "SERA.5010; AIP GEN 1.7",
      "url": "https://aip.enaire.es/AIP/contenido_AIP/GEN/LE_GEN_1_7_en.html"
    }
  ],
  "cards": [
    { "id": "c.010.07.01", "front": "VFR especial en España: visibilidad mínima", "back": "1500 m de visibilidad de vuelo, solo de día y 140 kt IAS o menos" }
  ]
}
```

Campos opcionales: `spain`, `links`, y en cada sección `text`, `bullets`, `table`, `formulas`, `examples`, `figure`, `caption`, `note`, `verify` (al menos uno con contenido). En las preguntas, `es`, `data` (texto monoespaciado: METAR, TAF, NOTAM, casillas de plan de vuelo…), `figure` y `url`.

Marcado de texto (en cualquier cadena): `**negrita**` y nada más. Sin Markdown, sin HTML, sin emojis.

## La lección

Cada lección enseña su bloque **entero** y lo hace como un buen profesor de escuela, no como un resumen:

1. **Cubre todos los temas** que lista `topics` en `PPL_SYLLABUS` y lo que pide la auditoría para ese bloque. Si un tema es largo, dedícale una sección propia.
2. **Explica antes de enumerar.** Párrafos que cuentan el porqué (la física, el motivo de la norma, el peligro que evita), y después la lista o la tabla. Quien no sabe nada tiene que entenderlo; quien repasa tiene que encontrar la cifra rápido.
3. **Ejemplos resueltos** en todo lo que se calcula o se lee (cartas, METAR, gráficas, CG, viento, altímetro…), paso a paso y con las unidades del examen.
4. **Cifras exactas con su norma** (SERA.5001, FCL.210.A, NCO.OP.125, Anexo 14…). Si un valor viene de un manual o de un POH concreto y no de la norma, márcalo con `"verify": true` en la sección y dilo en el texto.
5. **Particularidades de España** (AIP GEN 1.7, ENAIRE, AEMET, AESA) en `spain` o en una `note` de tipo `es`.
6. Anclaje práctico: el avión del curso es el **PA-28-161 Warrior III** (ala baja, carburador, flaps manuales, bomba eléctrica de combustible) y como contraste el **Cessna 172S** (ala alta, inyección, flaps eléctricos, selector BOTH). Las cabinas de la app están en `#/ac/pa28` y `#/ac/c172`; sus procedimientos en `#/ac/pa28/flow/<id>` (preflight, start, runup, beforeto, beforelanding, afterlanding, shutdown) y `#/ac/c172/flow/<id>` (preflight, beforestart, start, runup, takeoff, beforelanding, afterlanding, secure). La fraseología está en `#/licencias/fraseologia`.
7. Extensión orientativa: 900–2500 palabras según el peso del bloque (más preguntas objetivo → más contenido). Una lección de menos de 500 palabras no se acepta.
8. `numbers`: las cifras y reglas para memorizar (de ahí salen las fichas). `traps`: los errores típicos de examen y por qué se cometen.
9. Tono: castellano de España, claro, sobrio y directo, segunda persona («tú»). Nada de frases de relleno («en este apasionante tema…»), ni exclamaciones, ni emojis. Términos como en el examen: «altitud de presión», «masa en vacío básica», «reserva final»; unidades ft, kt, NM, hPa, °C, kg, l. Siglas inglesas en su forma oficial (VMC, QNH, TODA) y explicadas la primera vez.
10. Fecha `reviewed`: `2026-10-09`.

## Las preguntas

Reglas del banco (formato de AESA):

1. Enunciado en castellano, **4 opciones y una sola correcta**. Prohibido «todas las anteriores» o «ninguna de las anteriores».
2. **Originales**, redactadas desde la norma, el AMC, el POH o la guía de AEMET. No copies el banco de AESA, el ECQB ni bancos comerciales o libros.
3. Distractores sacados de **errores reales**: signo de la variación, QDM frente a QDR, litros frente a kilos, QNH frente a 1013, viento verdadero frente a magnético, confundir clases de espacio aéreo, etc. Las cuatro opciones deben ser plausibles y de longitud parecida (la correcta no puede ser siempre la más larga).
4. **Explicación obligatoria**: `why` explica por qué acierta la correcta (con el razonamiento o el cálculo) y `whyNot` por qué falla cada distractor (`null` en la posición de la correcta).
5. `ref`: la norma o fuente exacta. `es: true` si depende de una particularidad española.
6. `type`: `concepto` (≈40 %), `regla` (cifra o norma, ≈25 %), `calculo` (≈20 % en las materias con cálculo: 030, 060, 080, 050, 020; menos en las demás), `lectura` (carta, gráfica o mensaje, ≈15 %). `level`: 1 fácil (30 %), 2 media (50 %), 3 difícil (20 %).
7. Reparte la posición de la correcta entre 0, 1, 2 y 3 de forma equilibrada.
8. Ids correlativos: `<bloque>.001`, `<bloque>.002`…
9. Número de preguntas por bloque: el `target` de `PPL_SYLLABUS` (es el mínimo a alcanzar). Cubre todos los temas del bloque, no repitas la misma pregunta con otras palabras.
10. Una pregunta que necesita imagen (instrumento, carta, señal, gráfica) usa `figure` con una figura SVG; un mensaje de texto (METAR, TAF, NOTAM) va en `data`.

## Las fichas

Una sola idea por ficha, con la respuesta verificable en la lección. Anverso corto (pregunta o concepto), reverso con la respuesta exacta. Reparto orientativo por materia: 010 → 120, 050 → 90, 020 → 70, 090 → 60, 080 → 60, 060 → 50, 040 → 50, 070 → 50, 030 → 50 (repártelas entre los bloques según su peso). Ids `c.<bloque>.01`, `c.<bloque>.02`…

## Las figuras SVG

Esquemas propios, limpios y legibles en tema claro y oscuro. Nada de reproducir gráficas del POH, cartas de ENAIRE o productos de AEMET tal cual: dibuja versiones propias con datos de ejemplo.

- Solo `viewBox` (ancho 640 recomendado), sin `width`/`height`, con un `<title>` descriptivo.
- Sin colores fijos, sin `<style>`, sin scripts ni imágenes: usa **solo estas clases**:
  - Trazos: `ln` (principal), `ln2` (secundario, gris fino), `ac-ln` (acento azul), `wa-ln` (aviso rojo-naranja), `ok-ln` (verde). Modificadores: `dash` (discontinua), `thick` (grueso).
  - Áreas: `ac` (azul suave con borde), `wa`, `ok`, `soft` (gris suave con borde), `sky` (cielo), `ground` (terreno), `ink-fill` (relleno de tinta, p. ej. puntas de flecha), `ac-fill`, `wa-fill`, `ok-fill`, `bg-fill` (color del fondo, para tapar).
  - Texto: `tx` (13 px), `tx2` (gris, 12 px), `txa` (azul), `txw` (aviso), `txo` (verde); modificadores `b` (negrita) y `mono`. Tamaño distinto con el atributo `font-size`; alineación con `text-anchor`.
- Flechas: define el `<marker>` dentro del propio SVG con un id único que empiece por el nombre de la figura (`080-perfil-flecha`) y pinta su punta con `class="ink-fill"` (o `ac-fill`).
- Texto en castellano, mínimo 11 px efectivos, sin solapes. Revisa siempre las dos vistas previas antes de darla por buena.
- Calidad antes que cantidad: 3–8 figuras buenas por materia en los temas que de verdad lo piden (perfil alar, curvas CL–α y de resistencia, diagrama V‑n, frentes, nubes, circuito de aeródromo, letreros y marcas de pista, señales, espacios aéreos, motor de cuatro tiempos, carburador, pitot‑estático, CDI del VOR, envolvente de CG, triángulo de velocidades…).

## Calculadoras interactivas

Una sección puede insertar un widget con `"figure": "calc:<id>"`. Disponibles (`src/data/licenses/widgets-list.ts`):

| id | Qué hace |
| --- | --- |
| `calc:vmc` | Mínimos VMC por clase, altitud y día o noche |
| `calc:altimetry` | QNH, QFE, 1013 → altitud de presión y de densidad |
| `calc:metar` | Descodificador de METAR y TAF |
| `calc:wind` | Triángulo de velocidades (deriva, rumbo, GS) |
| `calc:crosswind` | Viento cruzado y de cara |
| `calc:cg` | Masa y centrado del PA-28-161 de ejemplo con envolvente |
| `calc:turn` | Viraje: factor de carga, Vs, radio y régimen |
| `calc:1in60` | Regla 1 en 60 |
| `calc:time` | UTC, hora media local y hora oficial de España |
| `calc:tas` | IAS → TAS |
| `calc:fuel` | Velocidad, tiempo, distancia y combustible |
| `sim:vor` | CDI del VOR con OBS y TO/FROM |
| `sim:adf` | RBI del ADF: QDM y QDR |

## Fuentes de referencia

Prioriza las oficiales y vigentes a octubre de 2026: EASA Easy Access Rules (Aircrew/Part-FCL, Part-MED, Air Operations/Part-NCO, SERA), Reglamento (UE) 923/2012 (SERA), anexos de la OACI, AIP España de ENAIRE (GEN 1.7 con las diferencias nacionales, ENR, AD), AESA, AEMET (Guía MET AU-GUI-0102, apuntes de meteorología aeronáutica), BOE. Como material didáctico de apoyo (para entender, no para copiar): FAA Pilot's Handbook of Aeronautical Knowledge, Airplane Flying Handbook, manuales de Trevor Thom, Jeppesen, CAE Oxford y Paraninfo.

Correcciones ya detectadas que hay que respetar (auditoría): la reserva final basada en riesgo y MINIMUM FUEL / MAYDAY FUEL aplican desde el **30-10-2022** (Reg. (UE) 2021/1296), no desde 2026; frecuencias: se dicen los 6 dígitos salvo que el 5.º y el 6.º sean cero, y entonces los 4 primeros («118,100» → «uno uno ocho decimal uno»); distintivo abreviado de EC-ABC → «E-BC»; la PPL no tiene horas mínimas de teoría en FCL.210; niveles semicirculares por debajo de la altitud de transición en altitudes (3500, 4500, 5500 ft); SERA.5005(f): 150 m (500 ft) sobre el suelo o el agua o sobre el obstáculo más alto en 150 m a la redonda; VFR nocturno con comunicación bilateral cuando haya canal; documentos a bordo según NCO.GEN.135; fuego de motor según el POH del avión (PA-28 y C172 tienen listas distintas); alcohol: SERA.2020 y MED.A.020, las 8 h son una recomendación; Ns: la OMM lo clasifica como nube media que se extiende a niveles bajos; arco amarillo del anemómetro VNO–VNE solo en aire en calma.
