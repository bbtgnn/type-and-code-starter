import { AudioController } from "./modules/audioController.js";
import { calculateTextProperties } from "./modules/textCalculations.js";
import { DeviceOrientationController } from "./modules/deviceOrientationController.js";
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

let mostraTesto = true;
let densita = 1;

/* Controllers */

const audioController = new AudioController();
const orientationController = new DeviceOrientationController();

/* Font */

let font;

function preload() {
  font = loadFont(percorsoFont);
  caricamentoRisorse();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  audioController.init();
  // Don't initialize orientation controller yet - wait for permission

  frameRate(30);
  angleMode(DEGREES);

  setupStartButtonClick();
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

  if (mostraTesto) {
    push();
    stileTesto();
    text(testo, position.x, position.y);
    pop();
  }

  // Points

  const points = font.textToPoints(testo, position.x, position.y, fontSize, {
    sampleFactor: densita / 10,
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

function setupStartButtonClick() {
  const startButton = document.getElementById("start");
  if (startButton) {
    startButton.addEventListener("click", () => {
      const introElement = document.getElementById("intro");
      if (introElement) introElement.style.display = "none";

      document.querySelectorAll(".control-button").forEach((button) => {
        // @ts-ignore - Element.style is not recognized by TypeScript
        if (button) button.style.opacity = "0";
      });

      document
        .querySelectorAll(".control-description-container")
        .forEach((description) => {
          // @ts-ignore - Element.style is not recognized by TypeScript
          if (description) description.style.display = "none";
        });

      // Request device orientation permission and start audio
      orientationController.requestPermission().then((granted) => {
        // Initialize orientation controller only after permission is granted
        if (granted) orientationController.init();
        // Start audio regardless of orientation permission
        audioController.start();
      });
    });
  }

  const decreaseSensitivityButton = document.getElementById(
    "decrease-sensitivity"
  );
  if (decreaseSensitivityButton) {
    decreaseSensitivityButton.addEventListener("click", () => {
      audioController.decreaseSensitivity();
    });
  }

  const increaseSensitivityButton = document.getElementById(
    "increase-sensitivity"
  );
  if (increaseSensitivityButton) {
    increaseSensitivityButton.addEventListener("click", () => {
      audioController.increaseSensitivity();
    });
  }

  const resetSensitivityButton = document.getElementById("reset-sensitivity");
  if (resetSensitivityButton) {
    resetSensitivityButton.addEventListener("click", () => {
      audioController.resetSensitivity();
    });
  }

  const decreaseDensityButton = document.getElementById("decrease-density");
  if (decreaseDensityButton) {
    decreaseDensityButton.addEventListener("click", () => {
      densita -= 0.1;
    });
  }

  const increaseDensityButton = document.getElementById("increase-density");
  if (increaseDensityButton) {
    increaseDensityButton.addEventListener("click", () => {
      densita += 0.1;
    });
  }

  const resetDensityButton = document.getElementById("reset-density");
  if (resetDensityButton) {
    resetDensityButton.addEventListener("click", () => {
      densita = 1;
    });
  }
}

// @ts-ignore
window.preload = preload;
// @ts-ignore
window.setup = setup;
// @ts-ignore
window.draw = draw;

window.windowResized = windowResized;
