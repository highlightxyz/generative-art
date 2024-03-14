// Use the hl.randomInt() method to select a random number of rectanlges to draw
// from 3–10
let numberOfRectangles;

// Choose a random number to represent the color saturation from 0–100
let randomSaturation;

// Choose a random number to represent the color brightness from 0–100
let randomBrightness;

// Initialize variables we'll need later
let randomColors = [];

// Select a random background color (white or black) using the
// hl.randomElement() method
let backgroundColor;

let plexMono;

/*
 * Preload
 * Load any assets we need for the sketch
 */

function calculateHLTraits(hl) {
  numberOfRectangles = hl.randomInt(3, 10);
  randomSaturation = hl.randomInt(100);
  randomBrightness = hl.randomInt(100);
  backgroundColor = hl.randomElement(['white', 'black']);

  const traits = {
    'Number of Rectangles': numberOfRectangles,
    'Background Color': backgroundColor,
    'Color Saturation': randomSaturation,
    'Color Brightness': randomBrightness,
  };

  return traits;
}

function preload() {
  const traits = calculateHLTraits(hl);
  // Set these traits so Highlight can read them
  hl.token.setTraits(traits);
  // Also set a name and description for this token
  hl.token.setName(`Example token #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `This is an token generated as part of an example project for using hl-gen.js. It has ${numberOfRectangles} rectangles with random colors. The colors have a saturation of ${randomSaturation} and a brightness of ${randomBrightness}. The timestamp of the mint was ${hl.tx.timestamp}. The minting wallet address was ${hl.tx.walletAddress}`
  );

  plexMono = loadFont('fonts/IBMPlexMono-Regular.ttf');
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

  for (let i = 0; i < numberOfRectangles; i++) {
    randomColors.push(color(hl.randomInt(0, 360), randomSaturation, randomBrightness));
  }
}

/*
 * Draw
 */
function draw() {
  let textColor = backgroundColor === 'white' ? 'black' : 'white';

  if (hl.context.previewMode) {
    noStroke();
    background(backgroundColor);
    fill(textColor);
    textFont(plexMono);
    textSize(width * 0.02);
    textAlign(CENTER, CENTER);
    text(`Preview mode ${width}x${height}`, 0, 0, width, height * 0.1);
    hl.token.capturePreview();
    return;
  }

  noStroke();
  background(backgroundColor);

  let margin = width * 0.1;
  let gap = width * 0.01;
  let rectWidth = (width - margin * 2 - gap * (numberOfRectangles - 1)) / numberOfRectangles;

  // Draw the rectangles, using the numberOfRectangles we generated earlier
  for (let n = 0; n < numberOfRectangles; n++) {
    fill(randomColors[n]);
    rect(margin + rectWidth * n + gap * n, height * 0.1, rectWidth, height * 0.8);
  }

  // Draw text
  fill(textColor);
  textFont(plexMono);
  textSize(width * 0.02);
  textAlign(CENTER, CENTER);

  // Reference the minting wallet address with hl.tx.mintingWalletAddress
  text(`Minted by ${hl.tx.walletAddress}`, 0, 0, width, height * 0.1);

  // Reference the token ID with hl.tx.tokenId
  text(`Token #${hl.tx.tokenId}`, 0, height * 0.9, width, height * 0.1);

  // Now that we're done drawing all the rectangles, trigger the preview image
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
    case 's':
      saveCanvas();
      break;
    case 'r':
      redraw();
      break;
  }
}
