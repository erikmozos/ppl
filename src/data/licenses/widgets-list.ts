// Calculadoras y simuladores interactivos que una lección puede insertar con figure: 'calc:<id>'.
// La implementación de cada uno está en src/components/widgets/.

export const WIDGETS: Record<string, string> = {
  'calc:vmc': 'Mínimos VMC: eliges clase de espacio aéreo, altitud y día o noche y muestra visibilidad y distancia a nubes (SERA.5001 + España).',
  'calc:altimetry': 'Altimetría: QNH, QFE, 1013, elevación y temperatura → altitud de presión, altitud de densidad e indicación del altímetro.',
  'calc:metar': 'Descodificador de METAR y TAF: pega un mensaje y lo explica grupo a grupo.',
  'calc:wind': 'Triángulo de velocidades: TAS, derrota y viento → corrección de deriva, rumbo y velocidad sobre el suelo, con dibujo.',
  'calc:crosswind': 'Componentes de viento: pista y viento → viento cruzado y de cara o de cola.',
  'calc:cg': 'Masa y centrado de un PA-28-161 de ejemplo: cargas → masa, momento y CG sobre la envolvente (despegue y aterrizaje).',
  'calc:turn': 'Viraje: inclinación y TAS → factor de carga, aumento de la Vs, radio y régimen de viraje.',
  'calc:1in60': 'Regla 1 en 60: desviación, distancia recorrida y restante → error de derrota y corrección total.',
  'calc:time': 'Tiempo: longitud, UTC, hora media local y hora oficial de la península, Baleares y Canarias.',
  'calc:tas': 'Velocidades: IAS/CAS, altitud de presión y temperatura → TAS y número de Mach aproximado.',
  'calc:fuel': 'Velocidad, tiempo, distancia y combustible (litros, kilos y galones US).',
  'sim:vor': 'VOR: mueve el avión y el OBS y observa el CDI y la bandera TO/FROM.',
  'sim:adf': 'ADF/RBI: rumbo y marcación relativa → QDM, QDR y marcación magnética, con el instrumento dibujado.',
}
