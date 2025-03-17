// /* Variabili */

let testo = "g";

let dimensione = 0.8;
let interlinea = 0.9;
let allineamento = "centro";

let percorsoFont = "./assets/InputMonoCondensed-BoldItalic.ttf";

let mostraTesto = true;
let densita = 1;
let sensibilita = 1;

/* Funzione */

let img;

function carica() {
  img = loadImage("./assets/download.jpeg");
}

let graphics;

function impostazioni() {
  graphics = createGraphics(50, 50);
  graphics.image(img, -30, -30);
}

let mic;
let micLevel = 0;

function disegnaPunto({ x, y, angolo, indice, unita, volume }) {
  push();
  translate(x, y);

  // if (indice % 2 == 0) {
  //   fill(0);
  // } else {
  //   fill(255);
  // }
  noFill();
  stroke(0);

  rectMode(CENTER);
  fill("deeppink");
  noStroke();
  rotate(frameCount + indice);
  scale(1 + volume * 10);
  rect(0, 0, unita / 2);
  pop();

  // image(graphics, x, y);
}

/* Procedure (cose brutte) */

let font;
let actualFontSize = 1;

function preload() {
  font = loadFont(percorsoFont);
  carica();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();

  textAlign(getTextAlignment());
  getTextBounds(true);
  frameRate(30);
  angleMode(DEGREES);

  impostazioni();
  setupStartButtonClick();
}

function draw() {
  background(220);
  micLevel = mic.getLevel() * sensibilita;

  textFont("arial");
  textSize(50);
  text(accelerationX, 100, 100);

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

let isRecording = false;

function keyPressed() {
  const increase = 0.1;

  if (key == "+") {
    densita += increase;
  }
  if (key == "-" && densita > increase * 2) {
    densita -= increase;
  }
}

function setupStartButtonClick() {
  document.getElementById("start").addEventListener("click", () => {
    document.getElementById("intro").style.display = "none";
    document.querySelectorAll(".control-button").forEach((button) => {
      button.style.opacity = "0";
    });
    document
      .querySelectorAll(".control-description-container")
      .forEach((description) => {
        description.style.display = "none";
      });
    userStartAudio();
  });

  document
    .getElementById("decrease-sensitivity")
    .addEventListener("click", () => {
      sensibilita -= 0.5;
      if (sensibilita < 0.1) sensibilita = 0.1;
    });
  document
    .getElementById("increase-sensitivity")
    .addEventListener("click", () => {
      sensibilita += 0.5;
    });
  document.getElementById("reset-sensitivity").addEventListener("click", () => {
    sensibilita = 1;
  });

  document.getElementById("decrease-density").addEventListener("click", () => {
    densita -= 0.1;
  });
  document.getElementById("increase-density").addEventListener("click", () => {
    densita += 0.1;
  });
  document.getElementById("reset-density").addEventListener("click", () => {
    densita = 1;
  });
}
