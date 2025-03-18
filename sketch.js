import { AudioController } from "./modules/audioController.js";
import { calculateTextProperties } from "./modules/textCalculations.js";
import { DeviceOrientationController } from "./modules/deviceOrientationController.js";
import { DensityController } from "./modules/densityController.js";
import { InputController } from "./modules/inputController.js";
import {
  disegnaPunto,
  caricamentoRisorse,
  impostazioni,
  sfondo,
  stileTesto,
} from "./code.js";

// /* Variabili */

let testo = "gas\nqd";

let dimensione = 0.8;
let interlinea = 0.9;
let allineamento = "centro";

let percorsoFont = "./assets/InputMonoCondensed-BoldItalic.ttf";

let mostraTestoSotto = true;
let mostraTestoSopra = false;

/* Controllers */

const audioController = new AudioController();
const orientationController = new DeviceOrientationController();
const densityController = new DensityController();
const inputController = new InputController(
  audioController,
  densityController,
  orientationController
);

/* Font */

let font;

function preload() {
  font = loadFont(percorsoFont);
  caricamentoRisorse();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  audioController.init();
  // Initialize input controller which handles all UI interactions
  inputController.init();

  frameRate(30);
  angleMode(DEGREES);

  impostazioni();
}

function draw() {
  sfondo();

  // Calculate text properties

  const { fontSize, position } = calculateTextProperties(
    testo,
    dimensione,
    interlinea,
    font,
    allineamento,
    width,
    height
  );

  // Text setup

  textFont(font);
  textSize(fontSize);
  textLeading(fontSize * interlinea);

  switch (allineamento) {
    case "centro":
      textAlign(CENTER);
      break;
    case "sinistra":
      textAlign(LEFT);
      break;
    case "destra":
      textAlign(RIGHT);
      break;
    default:
      textAlign(CENTER);
  }

  if (mostraTestoSotto) {
    push();
    stileTesto();
    text(testo, position.x, position.y);
    pop();
  }

  // Points

  const points = font.textToPoints(testo, position.x, position.y, fontSize, {
    sampleFactor: densityController.getDensity(),
  });

  const micLevel = audioController.getLevel();

  points.forEach((point, index) =>
    disegnaPunto({
      x: point.x,
      y: point.y,
      angolo: point.alpha,
      indice: index,
      unita: min(width / 10, height / 10),
      volume: micLevel,
    })
  );

  //

  if (mostraTestoSopra) {
    push();
    stileTesto();
    text(testo, position.x, position.y);
    pop();
  }

  // Motion permissions

  if (!orientationController.isPermissionGranted()) {
    push();
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Please grant sensor permissions", width / 2, height / 2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// @ts-ignore
window.preload = preload;
// @ts-ignore
window.setup = setup;
// @ts-ignore
window.draw = draw;

window.windowResized = windowResized;
