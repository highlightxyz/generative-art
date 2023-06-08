## Highlight Generative Art
### Getting started
To create a generative art collection on Highlight, you’ll just need to upload a .zip file of your code-based generative project (make sure to zip all the files together, not the folder containing them). The .zip should include:

- **index.html**: This file renders your tokens.
- **hl-gen.js**: This file gives you access to data from the blockchain, helps you generate deterministic randomness in your tokens, and provides functions to store attributes and capture preview images
- Any libraries required to render your tokens, like p5.js, three.js, tone.js, etc.
- Any other files required to render your tokens, including images, fonts, video files, etc.

Your .zip should not be larger than 2GB. All project assets are stored on Arweave, a decentralized and permanent storage network. A simple project that uses the p5.js library might look like this:

#### Example project structure
```
index.html
sketch.js
lib/
    p5.min.js
    hl-gen.js
    hl-gen.js
```

### hl-gen.js
Every project should include the hl-gen.js script, which gives you access to blockchain data and makes it possible to render individual tokens that have been minted. Download hl-gen.js and include it in your project.

[Download hl-gen.js]

### index.html
```html
<head>
    <script src="lib/hl-gen.js"></script>
    <script src="lib/p5.min.js"></script>
    <script src="sketch.js"></script>
</head>
```

The hl-gen.js script gives you access to a number of pieces of data from the blockchain, including the transaction hash, block hash, minting wallet address, token ID, edition size, and more. It also provides helper functions to generate deterministic randomness within your project. These helper functions are seeded by a combination of the transaction hash (or a predetermined hash if you choose) and the token ID.

Additionally, two functions are provided on the hl.token object: setAttributes and capturePreview. Call hl.token.setAttributes() and pass in an object containing your attributes to save attributes for a token. Optionally call hl.token.capturePreview() to trigger the capture of a preview image for a token. Please note that these functions should only be called once.

#### Data provided by Highlight
```javascript
hl = {

    tx: {
        hash: String, // The transaction hash or pre-determined hash
        blockHash: String, // The block hash of the transaction to mint a token
        timestamp: String, // The timestamp of the block hash
        walletAddress: String, // The wallet address of the wallet minting the token
        tokenId: String, // The token ID of the token being minted
        editionSize: String, // The total number of tokens in this collection
        contractAddress: String, // The address of the contract
        chainId: String, // The id of the blockchain
    },

    random: () => Number, // Random number between 0 (inclusive) and 1 (exclusive)
    randomNum: (min, max) => Number, // Random number between min (inclusive) and max (exclusive)
    randomInt: (min, max) => Number, // Random integer between min (inclusive) and max (inclusive)
    randomBool: (percent) => Boolean, // Random bool with percent chance of being true
    randomElement: (array) => any, // Random element from the provided array

    token: {
        setAttributes: () => Void, // Sets the attributes for the token
        capturePreview: () => Void, // Triggers capture of preview image for the token
    },

};
```

Using this data is as simple as referencing the hl object in your main drawing script. You can either access data directly or use the helper functions to easily generate deterministic randomness.

```javascript
// Pick a random color
let possibleColors = ["red", "green", "blue"];
let color = hl.randomElement(possibleColors);

// Pick a random integer from 20 through 40
let numberOfCircles = hl.randomInt(20, 40);

// Draw the token ID
let tokenID = hl.tx.tokenId;
text(tokenID, 0, 0, width, height);
```

### Display and rendering
Generative projects created on Highlight are displayed by rendering your project’s index.html file inside an iframe. This means that your tokens may appear at different sizes at different times. You may either have your token scale in order to appear the same at all sizes, or you may have it respond and display differently at different sizes—the choice is yours.

In the preview images step, you’ll have the option to specify a resolution of the preview image. This preview image is used when the live view of a token can’t be shown, for example in a large grid of tokens. Note that the aspect ratio used here will be used to render your token on Highlight.

### Example project
Please see `examples` directory for relevant examples.

#### Basic sketch.js file
```javascript
/*
* Globals
*/
let colorChoices = [
    "aliceblue",
    "azure",
    "blueviolet",
    "cadetblue",
    "coral",
    "darkslateblue",
    "darkslategrey",
    "deepskyblue",
    "floralwhite",
    "seashell",
    "thistle",
];
let backgroundColor, color1, color2, color3, color4;
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
    backgroundColor = hl.randomElement(colorChoices);
    color1 = hl.randomElement(colorChoices);
    color2 = hl.randomElement(colorChoices);
    color3 = hl.randomElement(colorChoices);
    color4 = hl.randomElement(colorChoices);

    // Set attributes
    hl.token.setAttributes({
        "Background Color": backgroundColor,
        "Color 1": color1,
        "Color 2": color2,
        "Color 3": color3,
        "Color 4": color4,
    });
}

/*
* Draw
*/
function draw() {
    noStroke();
    background(backgroundColor);
    translate(width / 2, height / 2);
    fill(color1);
    ellipse(0, 0, width * 0.8, width * 0.8);
    fill(color2);
    ellipse(0, 0, width * 0.6, width * 0.6);
    fill(color3);
    ellipse(0, 0, width * 0.4, width * 0.4);
    fill(color4);
    ellipse(0, 0, width * 0.2, width * 0.2);
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
```
