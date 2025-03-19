import { AudioController } from "./modules/audioController.js";
import {
  calculateTextProperties,
  getTextAlignment,
} from "./modules/textCalculations.js";
import { DeviceOrientationController } from "./modules/deviceOrientationController.js";
import { DensityController } from "./modules/densityController.js";
import { InputController } from "./modules/inputController.js";
import {
  disegnaPunto,
  caricamentoRisorse,
  impostazioni,
  sotto,
  sopra,
  configurazione,
} from "./code.js";

// /* Variabili */

/* Controllers */

const audioController = new AudioController(
  configurazione.sensibilitàMicrofonoBase
);
const orientationController = new DeviceOrientationController();
const densityController = new DensityController(
  configurazione.densitàPuntiBase
);
const inputController = new InputController(
  audioController,
  densityController,
  orientationController,
  configurazione.nascondiInterfaccia
);

/* Font */

let font;

function preload() {
  font = loadFont(configurazione.percorsoFont);
  caricamentoRisorse();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  audioController.init();
  inputController.init();
  impostazioni();
}

function draw() {
  // Calculate text properties

  const { fontSize, position } = calculateTextProperties(
    configurazione.testo,
    configurazione.dimensione,
    configurazione.interlinea,
    font,
    configurazione.allineamento,
    width,
    height
  );

  // Text setup

  textFont(font);
  textSize(fontSize);
  textLeading(fontSize * configurazione.interlinea);
  textAlign(getTextAlignment(configurazione.allineamento));

  function testo() {
    text(configurazione.testo, position.x, position.y);
  }

  sotto(testo);

  // Points

  const points = font.textToPoints(
    configurazione.testo,
    position.x,
    position.y,
    fontSize,
    {
      sampleFactor: densityController.getDensity(),
    }
  );

  const micLevel = audioController.getLevel();
  const orientationData = orientationController.getOrientationData();

  points.forEach((point, index) =>
    disegnaPunto({
      x: point.x,
      y: point.y,
      angolo: point.alpha,
      indice: index,
      unita: min(width / 10, height / 10),
      volume: micLevel,
      alpha: orientationData.alpha,
      beta: orientationData.beta,
      gamma: orientationData.gamma,
      frameCount,
    })
  );

  //

  sopra(testo);

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

//

// @ts-ignore
window.preload = preload;
// @ts-ignore
window.setup = setup;
// @ts-ignore
window.draw = draw;
// @ts-ignore
window.windowResized = windowResized;
