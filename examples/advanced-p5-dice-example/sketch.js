/**
 * Highlight p5js advanced dice example: V0
 * @version: 0.0.1
 * @description This example shows a few common functionalities that artists had questions about
 * and is used as a companion guide to the FAQ document hosted on github.
 *
 * In this example project we created a simple dice. Everyone who mints one, will get a random
 * number dice, with its color picked from ['red', 'green', 'blue'] and a 'white' color for the dots.
 *
 * But this dice is special! If the user mints EXACTLY (no more no less) 6 dice, he/she will receive 1 of each dice
 * where one of them will be Rare! How exciting am I right? The rare dice can be recognized by it's
 * golden color and red dots with a black outline.
 *
 * On the artwork itself there is a text telling us how many days have passed since the new year of 2024
 * and how many days it was when the token was minted. Note that this text is not present on the preview
 * images, since it would not look good.
 *
 * The artwork also scales with the screen size, always fitting nicely within it's bounds. We could also
 * change the background of the HTML document itself if we wanted the artwork to blend into it nicely,
 * but in this case we left it as "white" just to better show the position of the canvas.
 *
 * There is also a custom loading indicator, which can be used if your artwork takes some time to draw.
 * It's plain HTML so go wild! (note: in this project the loading is faked by doing a large loop - please
 * don't do this when uploading your project to Highlight <3)
 *
 * Have fun!
 * NPC
 */

let plexMonoFont;
let diceColor;
let dotColor;
let diceValue;
let rarity;
let daysSinceNewYearWhenMinted;
let daysSinceNewYear;

// The desired artwork size in which everything is pixel perfect.
// Let the canvas resize itself to fit the screen in "scaleCanvasToFit()" function.
// Note that if the size is too small it will look blurry on bigger screens, that is why
// we set "pixelDensity(4)" in this example (400x400 is pretty small).
// If you target size is bigger you can reduce that value. e.g. "pixelDensity(2)".
const artworkWidth = 400;
const artworkHeight = 400;

function preload() {
  prepareP5Js(); // Order is important! First setup randomness then prepare the token
  prepareToken(); // Do this as soon as possible in your code (before loading any resources)

  // !!!! Fake loading - DON'T DO THIS IN AN ACTUAL PROJECT !!!!
  for (let i = 0; i < 2000000000; i++) {
    i += 1;
  }
  plexMonoFont = loadFont('fonts/IBMPlexMono-Regular.ttf');
}

function setup() {
  createCanvas(artworkWidth, artworkHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  frameRate(60);
  pixelDensity(4);

  textFont(plexMonoFont);
  textSize(16);
  textAlign(CENTER, CENTER);

  scaleCanvasToFit();
}

function draw() {
  translate(width / 2, height / 2);

  strokeWeight(rarity === 'Rare' ? 10 : 0);
  background(diceColor);
  fill(dotColor);

  const diceNumber = diceValue + 1;

  if (diceNumber === 1) {
    circle(0, 0, 100);
  }
  if (diceNumber === 2) {
    circle(-120, -120, 100);
    circle(120, 120, 100);
  }
  if (diceNumber === 3) {
    circle(-120, -120, 100);
    circle(0, 0, 100);
    circle(120, 120, 100);
  }
  if (diceNumber === 4) {
    circle(-120, -120, 100);
    circle(-120, 120, 100);
    circle(120, -120, 100);
    circle(120, 120, 100);
  }
  if (diceNumber === 5) {
    circle(-120, -120, 100);
    circle(-120, 120, 100);
    circle(0, 0, 100);
    circle(120, -120, 100);
    circle(120, 120, 100);
  }
  if (diceNumber === 6) {
    circle(-120, -120, 100);
    circle(-120, 0, 100);
    circle(-120, 120, 100);
    circle(120, -120, 100);
    circle(120, 0, 100);
    circle(120, 120, 100);
  }

  // Only display text when not creating a preview image
  if (hl.context.previewMode === false) {
    fill(255);
    stroke(0);
    strokeWeight(2);

    text(`Days since 2024 new year:`, 0, -24);
    text(`mint: ${daysSinceNewYearWhenMinted}`, 0, 0);
    text(`now: ${daysSinceNewYear}`, 0, 24);
  }

  hl.token.capturePreview();
}

function windowResized() {
  scaleCanvasToFit();
}

// We are using p5.js which means we can set the seed and use p5.js random methods instead of
// hl-gen.js for simplicity.
function prepareP5Js() {
  const hlRandomSeed = hl.random(1_000_000_000_000);
  randomSeed(hlRandomSeed);
  noiseSeed(hlRandomSeed);
}

function prepareToken() {
  calculateDaysSinceNewYear();

  // Notice we are using "random()" from p5.js and not "hl.random()" because we set it up in "prepareP5Js()"
  // You can use which ever is more comfortable for you.
  diceValue = Math.floor(random(6));
  diceColor = random(['red', 'green', 'blue']);
  dotColor = 'white';
  rarity = 'Common';

  // If the user minted exactly 6 tokens give them one of each and make one "Rare"
  if (hl.tx.mintSize === '6') {
    // What was the first dice value in this batch?
    const initialDiceValue = Math.floor(
      hlUtils.randomNumberFromSeed(hl.tx.hash + 'initialDiceValue') * 6
    );

    // Which dice will be the rare one?
    const luckyDiceValue = Math.floor(
      hlUtils.randomNumberFromSeed(hl.tx.hash + 'luckyDiceValue') * 6
    );

    /*
    // If you prefer to use a random generator to get a sequence of random numbers
    // the above can be rewritten as follows:
    
    const randomGenerator = hlUtils.createRandomNumberGenerator(hl.tx.hash + 'rareDiceGenerator');
    const initialDiceValue = Math.floor(randomGenerator() * 6);
    const luckyDiceValue = Math.floor(randomGenerator() * 6);

    // Read the FAQ if you wonder what's the difference and when you would use one or the other!
    */

    // Which iteration of the batch mint is this?
    const mintIndex = parseInt(hl.tx.mintIteration) - 1;

    // Get the current dice value based on what the initialDiceValue was + how many
    // iterations in we are.
    diceValue = (initialDiceValue + mintIndex) % 6;

    // Is this the lucky dice?
    if (diceValue === luckyDiceValue) {
      diceColor = 'gold';
      dotColor = 'red';
      rarity = 'Rare';
    }
  }

  // Set the token traits, name and description
  const traits = {
    'Dice Value': diceValue + 1,
    'Dice Color': diceColor,
    'Dot Color': dotColor,
    Rarity: rarity,
  };

  hl.token.setTraits(traits);
  hl.token.setName(`Example token #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `This is a dice token generated as part of an example project for using hl-gen.js and hl-utils.js. It is a "${rarity}" number "${
      diceValue + 1
    }" dice of "${diceColor}" color with a dot color of "${dotColor}". The timestamp of the mint was "${
      hl.tx.timestamp
    }". The minting wallet address was "${hl.tx.walletAddress}".`
  );
}

// Lets calculate how many days away from new year 2024 we were when we minted,
// and how far away we are now!
function calculateDaysSinceNewYear() {
  const startDate = new Date(1704067200000); // Monday, January 1, 2024 00:00:00
  const nowDate = new Date();
  const txTimeStamp = new Date(hl.tx.timestamp * 1000); // hl.tx.timestamp is in seconds

  const timeDifferenceFromMint = txTimeStamp.getTime() - startDate.getTime();
  const timeDifference = nowDate.getTime() - startDate.getTime();
  const millisecondsInADay = 1000 * 60 * 60 * 24;

  daysSinceNewYearWhenMinted = Math.floor(timeDifferenceFromMint / millisecondsInADay);
  daysSinceNewYear = Math.floor(timeDifference / millisecondsInADay);
}

function scaleCanvasToFit() {
  const artworkAspectRatio = artworkHeight / artworkWidth;
  const canvasElement = document.querySelector('#defaultCanvas0');

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  // Landscape orientation
  if (innerHeight <= innerWidth * artworkAspectRatio) {
    canvasElement.style.height = '100%';
    canvasElement.style.width = 'auto';
  } else {
    canvasElement.style.width = '100%';
    canvasElement.style.height = 'auto';
  }
}
