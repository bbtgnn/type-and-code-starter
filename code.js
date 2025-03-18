export function caricamentoRisorse() {}

//

export function impostazioni() {}

//

export function sfondo() {}

//

/**
 * Questa funzione si occupa di disegnare un punto della lettera.
 *
 * @typedef {Object} Ingredienti
 * @property {number} x - La coordinata x del punto
 * @property {number} y - La coordinata y del punto
 * @property {number} angolo - L'angolo della curva della font in quel punto
 * @property {number} indice - Il numero del punto nella sequenza
 * @property {number} unita - Unita' di misura di riferimento
 * @property {number} volume - Il volume del microfono
 *
 * @param {Ingredienti} ingredienti
 */
export function disegnaPunto({ x, y, angolo, indice, unita, volume }) {
  push();
  translate(x, y);

  noFill();
  stroke(0);

  rectMode(CENTER);
  fill("deeppink");
  noStroke();
  rotate(frameCount + indice);
  scale(1 + volume * 10);
  rect(0, 0, unita / 2);
  pop();
}
