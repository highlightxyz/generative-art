/*
 * Globals
 */
let backgroundColor, color1, color2, color3, color4, chosenColors;
let plexMono;

/*
 * Preload
 * Load any assets we need for the sketch
 */
function preload() {
  plexMono = loadFont("fonts/IBMPlexMono-Regular.ttf");
}

/*
 * Setup
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  frameRate(60);
  pixelDensity(2);

  // Choose colors
  backgroundColor = hl.randomElement(["#ffffff", "#000000"]);
  color1 = color(hl.random(0, 360), 20, 100);
  color2 = color(hl.random(0, 360), 20, 100);
  color3 = color(hl.random(0, 360), 20, 100);
  color4 = color(hl.random(0, 360), 20, 100);
  chosenColors = [color1, color2, color3, color4];

  // Set traits
  let traits = {
    "Background Color": backgroundColor,
    "Hue 1": hue(color1).toFixed(2),
    "Hue 2": hue(color2).toFixed(2),
    "Hue 3": hue(color3).toFixed(2),
    "Hue 4": hue(color4).toFixed(2),
  };

  hl.token.setTraits(traits);
}

/*
 * Draw
 */
function draw() {
  noStroke();
  background(backgroundColor);

  let margin = width * 0.1;
  let gap = width * 0.025;
  let rectWidth = (width - margin * 2 - gap * 3) / 4;

  // Draw 4 rectangles, 1 of each chosen color
  for (let n = 0; n < 4; n++) {
    fill(chosenColors[n]);
    rect(
      margin + rectWidth * n + gap * n,
      height * 0.1,
      rectWidth,
      height * 0.8
    );
  }

  // Draw text
  let textColor = backgroundColor === "#000000" ? "#ffffff" : "#000000";
  fill(textColor);
  textFont(plexMono);
  textSize(width * 0.02);
  textAlign(CENTER, CENTER);
  text(`Minted by ${hl.tx.walletAddress}`, 0, 0, width, height * 0.1);
  text(`Token #${hl.tx.tokenId}`, 0, height * 0.9, width, height * 0.1);

  hl.token.capturePreview();
}

/*
 * Window resize
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*
 * Keyboard shortcuts for saving, redrawing, etc.
 */
function keyTyped() {
  switch (key) {
    case "s":
      saveCanvas();
      break;
    case "r":
      redraw();
      break;
  }
}
