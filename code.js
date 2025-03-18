export const configurazione = {
  testo: "Hi :)",
  dimensione: 0.8,
  interlinea: 0.7,
  allineamento: "centro",
  percorsoFont: "./assets/InputMonoCondensed-BoldItalic.ttf",
  mostraTestoSotto: true,
  mostraTestoSopra: false,
};

/**
 * Disegna punto
 * Metti qui quello che vuoi disegnare per ogni punto della font!
 *
 * @typedef {Object} Ingredienti
 * @property {number} x - La coordinata x del punto
 * @property {number} y - La coordinata y del punto
 * @property {number} angolo - L'angolo della curva della font in quel punto
 * @property {number} indice - Il numero del punto nella sequenza
 * @property {number} unita - Unita' di misura di riferimento
 * @property {number} volume - Il volume del microfono
 * @property {number} [alpha] - Device orientation alpha angle (z-axis rotation)
 * @property {number} [beta] - Device orientation beta angle (front-to-back tilt)
 * @property {number} [gamma] - Device orientation gamma angle (left-to-right tilt)
 *
 * @param {Ingredienti} ingredienti
 */
export function disegnaPunto({
  x,
  y,
  angolo,
  indice,
  unita,
  volume,
  alpha = 0,
  beta = 0,
  gamma = 0,
}) {
  push();
  translate(x, y);

  noFill();
  stroke(0);

  // Use orientation data to influence color
  // Map alpha (z-rotation) to hue (0-360)
  const hue = map(alpha, 0, 360, 0, 360);

  // Map beta (front-to-back tilt) to saturation (50-100)
  const saturation = map(abs(beta), 0, 90, 50, 100);

  // Map gamma (left-to-right tilt) to brightness (50-100)
  const brightness = map(abs(gamma), 0, 90, 50, 100);

  colorMode(HSB, 360, 100, 100);
  fill(hue, saturation, brightness);
  noStroke();

  rectMode(CENTER);
  rotate(frameCount + indice);

  // Add slight variation based on device tilt
  scale(1 + volume * 10 + (abs(gamma) / 90) * 0.5);
  rect(0, 0, unita / 2);
  pop();
}

//

export function caricamentoRisorse() {}

export function impostazioni() {
  frameRate(30);
  angleMode(DEGREES);
}

/**
 * Disegna sotto i punti
 * @param {function} disegnaTesto - La funzione che disegna il testo
 */
export function sotto(disegnaTesto) {
  background(255);

  fill("deeppink");
  disegnaTesto();
}

/**
 * Disegna sopra i punti
 * @param {function} disegnaTesto - La funzione che disegna il testo
 */
export function sopra(disegnaTesto) {
  //   stroke("white");
  //   noFill();
  //   disegnaTesto();
}
