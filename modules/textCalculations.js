/**
 * Calculates the optimal font size and position for text display
 * @param {string} testo - The text to display
 * @param {number} dimensione - Scaling factor for the font size
 * @param {number} interlinea - Line spacing factor
 * @param {object} font - The p5.js font object
 * @param {string} allineamento - Text alignment: "centro", "sinistra", or "destra"
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
export function calculateTextProperties(
  testo,
  dimensione,
  interlinea,
  font,
  allineamento,
  width,
  height
) {
  // Calculate the optimal font size
  const fontSize = calculateFontSize(
    testo,
    dimensione,
    interlinea,
    font,
    width,
    height
  );

  // Calculate the text bounds at the calculated font size
  const bounds = getTextBounds(
    testo,
    fontSize,
    interlinea,
    font,
    getTextAlignment(allineamento)
  );

  // Calculate position based on alignment
  const position = calculatePosition(bounds, allineamento, width, height);

  return {
    fontSize,
    position,
  };
}

/**
 * Calculates the optimal font size to fit the text within the canvas
 * @param {string} testo - The text to display
 * @param {number} dimensione - Scaling factor for the font size
 * @param {number} interlinea - Line spacing factor
 * @param {object} font - The p5.js font object
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {number} The calculated optimal font size
 */
function calculateFontSize(testo, dimensione, interlinea, font, width, height) {
  const testFontSize = 10;

  // Calculate scaling with test font size
  push();
  textSize(testFontSize);
  textLeading(testFontSize * interlinea);
  textAlign(getTextAlignment("centro"));
  const bounds = font.textBounds(testo, 0, 0);
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
  return baseFontSize * dimensione;
}

/**
 * Gets the text bounds at a specific font size
 */
function getTextBounds(testo, fontSize, interlinea, font, alignment) {
  push();
  textSize(fontSize);
  textLeading(fontSize * interlinea);
  textAlign(alignment);
  const bounds = font.textBounds(testo, 0, 0);
  pop();

  return bounds;
}

/**
 * Calculates the position for drawing text based on alignment
 * @param {object} bounds - The text bounds object containing x, y, w, h properties
 * @param {string} allineamento - The text alignment ('centro', 'sinistra', or 'destra')
 * @param {number} width - The canvas width
 * @param {number} height - The canvas height
 * @returns {object} An object containing x and y coordinates for text positioning
 */
function calculatePosition(bounds, allineamento, width, height) {
  let xPos, yPos;

  if (allineamento === "centro") {
    xPos = width / 2;
    // Adjust y position to account for the actual center of the text bounds
    yPos = height / 2 - bounds.y - bounds.h / 2;
  } else if (allineamento === "sinistra") {
    xPos = width * 0.1; // 10% margin from left
    yPos = height / 2 - bounds.y - bounds.h / 2;
  } else if (allineamento === "destra") {
    xPos = width * 0.9; // 10% margin from right
    yPos = height / 2 - bounds.y - bounds.h / 2;
  }

  return { x: xPos, y: yPos };
}

/**
 * Gets p5.js text alignment constant from string
 * @param {string} allineamento - The text alignment string ('centro', 'sinistra', or 'destra')
 */
export function getTextAlignment(allineamento) {
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
