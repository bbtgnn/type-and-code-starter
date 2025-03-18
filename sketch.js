import { AudioController } from "./modules/audioController.js";
import {
  disegnaPunto,
  caricamentoRisorse,
  impostazioni,
  sfondo,
} from "./code.js";

// /* Variabili */

let testo = "g";

let dimensione = 0.8;
let interlinea = 0.9;
let allineamento = "centro";

let percorsoFont = "./assets/InputMonoCondensed-BoldItalic.ttf";

let mostraTesto = true;
let densita = 1;

// Device orientation variables
let permissionGranted = false;
let f = 0;

/* Funzione */

const audioController = new AudioController();

let micLevel = 0;

/* Procedure (cose brutte) */

let font;
let actualFontSize = 1;

function preload() {
  font = loadFont(percorsoFont);
  caricamentoRisorse();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  audioController.init();

  textAlign(getTextAlignment());
  getTextBounds(true);
  frameRate(30);
  angleMode(DEGREES);

  setupStartButtonClick();
  impostazioni();

  // Set default permission for non-iOS devices
  if (
    !(
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    )
  ) {
    permissionGranted = true;
  }
}

// will handle first time visiting to grant access
function requestDevicePermission() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          permissionGranted = true;
        } else {
          permissionGranted = false;
        }
      })
      .catch(console.error);
  }
}

function draw() {
  // Create a background color that changes when shaken
  background(f, 20, 100);
  sfondo();

  if (!permissionGranted) {
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Please grant sensor permissions", width / 2, height / 2);
    return;
  }

  micLevel = audioController.getLevel();

  fill("deeppink");
  textFont(font);
  textSize(actualFontSize);
  textLeading(actualFontSize * interlinea);

  // Get the current text bounds at the actual text size
  const bounds = getTextBounds();

  // Calculate position based on alignment
  let xPos, yPos;

  if (allineamento === "centro") {
    xPos = width / 2;
    // Adjust y position to account for the actual center of the text bounds
    // rather than just using height/2
    yPos = height / 2 - bounds.y - bounds.h / 2;
  } else if (allineamento === "sinistra") {
    xPos = width * 0.1; // 10% margin from left
    yPos = height / 2 - bounds.y - bounds.h / 2;
  } else if (allineamento === "destra") {
    xPos = width * 0.9; // 10% margin from right
    yPos = height / 2 - bounds.y - bounds.h / 2;
  }

  // Draw text at calculated position
  if (mostraTesto) {
    push();
    text(testo, xPos, yPos);
    pop();
  }

  const points = font.textToPoints(testo, xPos, yPos, actualFontSize, {
    sampleFactor: densita / 10,
  });

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

  // Debug: draw bounding box (uncomment to visualize)
  // noFill();
  // stroke('blue');
  // if (allineamento === "centro") {
  //   rect(xPos - bounds.w/2, yPos + bounds.y, bounds.w, bounds.h);
  // } else if (allineamento === "sinistra") {
  //   rect(xPos, yPos + bounds.y, bounds.w, bounds.h);
  // } else if (allineamento === "destra") {
  //   rect(xPos - bounds.w, yPos + bounds.y, bounds.w, bounds.h);
  // }
}

/*The deviceShaken() function is called when the device total acceleration changes of accelerationX and accelerationY values is more than the threshold value. The default threshold is set to 30. The threshold value can be changed using setShakeThreshold()*/

function deviceShaken() {
  f = (f + 30) % 360;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  getTextBounds(true);
}

function getTextBounds(recalculateSize = false) {
  const testFontSize = 10;
  let bounds;

  if (recalculateSize) {
    // Calculate scaling with test font size
    push();
    textSize(testFontSize);
    textLeading(testFontSize * interlinea);
    textAlign(getTextAlignment());
    bounds = font.textBounds(testo, 0, 0);
    pop();

    // Calculate the ratio needed to fit the width and height within canvas
    const widthRatio = width / bounds.w;
    const heightRatio = height / bounds.h;

    // Use the smaller ratio to ensure text fits in both dimensions
    // Apply some margin by multiplying by 0.9 (90% of available space)
    const ratio = Math.min(widthRatio, heightRatio) * 0.9;

    // Calculate the base font size (without user scaling)
    const baseFontSize = testFontSize * ratio;

    // Apply user's dimensione scaling factor to get the actual font size
    actualFontSize = baseFontSize * dimensione;
  }

  // Get bounds at current actualFontSize
  push();
  textSize(actualFontSize);
  textLeading(actualFontSize * interlinea);
  textAlign(getTextAlignment());
  bounds = font.textBounds(testo, 0, 0);
  pop();

  // Return the actual bounds at the current text size
  return bounds;
}

function getTextAlignment() {
  switch (allineamento) {
    case "centro":
      return CENTER;
    case "sinistra":
      return LEFT;
    case "destra":
      return RIGHT;
    default:
      return CENTER;
  }
}

function setupStartButtonClick() {
  const startButton = document.getElementById("start");
  if (startButton) {
    startButton.addEventListener("click", () => {
      const introElement = document.getElementById("intro");
      if (introElement) introElement.style.display = "none";

      document.querySelectorAll(".control-button").forEach((button) => {
        if (button) button.style.opacity = "0";
      });

      document
        .querySelectorAll(".control-description-container")
        .forEach((description) => {
          if (description) description.style.display = "none";
        });

      // Request device orientation permission and start audio
      requestDevicePermission();
      audioController.start();
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
window.keyPressed = keyPressed;
window.deviceShaken = deviceShaken;
