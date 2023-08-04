# How to create a generative art collection on Highlight

To create a generative art collection on Highlight, you’ll just need to upload a .zip file of your code-based generative project (make sure to zip all the files together, not the folder containing them). The .zip should include:

- **index.html**: This file renders your tokens.
- **hl-gen.js**: This file gives you access to data from the blockchain, helps you generate deterministic randomness in your tokens, and provides functions to store attributes and capture preview images
- Any libraries required to render your tokens, like p5.js, three.js, tone.js, etc.
- Any other files required to render your tokens, including images, fonts, video files, etc.

Your .zip should not be larger than 2GB. All project assets are stored on Arweave, a decentralized and permanent storage network. A simple project that uses the p5.js library might look like this:

**Example project structure**

```
index.html
sketch.js
lib/
↳ p5.min.js
↳ hl-gen.js
```

Remember to zip the contents of your project folder, not the folder itself.

## Including hl-gen.js

Every project should include the hl-gen.js script, which gives you access to blockchain data and makes it possible to render individual tokens that have been minted. Download hl-gen.js and include it in your project.

Simply reference the hl-gen.js script in your index.html file before your main drawing script:

```javascript
// index.html

<head>
  <script src="lib/hl-gen.js"></script>
  <script src="lib/p5.min.js"></script>
  <script src="sketch.js"></script>
</head>
```

## Generating deterministic randomness using hl-gen.js

The hl-gen.js script provides a number of methods intended to help you generate deterministic randomness in your artwork. These methods are seeded by a combination of the transaction hash (or a predetermined hash if you choose) and the token ID. It is important to use these methods to generate randomness in place of Math.random or p5’s random function to ensure that, after a token is minted, it renders identically on all subsequent renders.

```javascript
// hl-gen.js (partial)

hl = {
  // ...
  random: () => Number, // Random number between 0 (inclusive) and 1 (exclusive)
  random: (max) => Number, // Random number between 0 (inclusive) and max (exclusive)
  random: (min, max) => Number, // Random number between min (inclusive) and max (exclusive)
  randomInt: () => Number, // Random integer between 0 (inclusive) and 100 (inclusive)
  randomInt: (max) => Number, // Random integer between 0 (inclusive) and max (inclusive)
  randomInt: (min, max) => Number, // Random integer between min (inclusive) and max (inclusive)
  randomBool: (percent) => Boolean, // Random bool with percent chance of being true
  randomElement: (array) => any, // Random element from the provided array
  // ...
};
```

## All inputs provided by hl-gen.js

The hl-gen.js script also gives you direct access to a number of pieces of data from the blockchain, including the transaction hash, block hash, minting wallet address, token ID, edition size, and more.

```javascript
// hl-gen.js (partial)

hl = {
  // ...
  tx: {
    hash: String, // The transaction hash or pre-determined hash
    timestamp: String, // The Unix timestamp of the block hash
    walletAddress: String, // The wallet address of the wallet minting the token
    tokenId: String, // The token ID of the token being minted
    editionSize: String, // The total number of tokens in this collection
    mintSize: String, // The number of tokens currently being minted (1 if not batch mint)
    mintIteration: String, // The iteration of token being rendered within the current mint
    contractAddress: String, // The address of your smart contract
    blockHash: String, // The block hash of the transaction to mint a token
    blockNumber: String, // The block number of the transaction to mint a token
    chainId: String, // The id of the blockchain
    gasPrice: String, // The price per unit of gas (in gwei) at the time of mint
    gasUsed: String, // The amount of gas used in a specific mint transaction
  },
  // ...
};
```

## Setting token metadata using hl-gen.js

Aside from accessing data, hl-gen.js gives you the ability to set metadata for your tokens by calling the provided methods. You can set the name, description, or traits of a token. The setName and setDescription methods take a String as their only argument, while setTraits takes an object with the keys representing the trait names and the values representing the trait values.

```javascript
// hl-gen.js (partial)

hl = {
  // ...
  token: {
    setTraits: (traits) => Void, // Sets the traits for the token
    getTraits: () => Object, // Returns the traits for the token
    setName: (name) => Void, // Sets the name for the token
    getName: () => String, // Returns the name for the token
    setDescription: (description) => Void, // Sets the description for the token
    getDescription: () => String, // Returns the description for the token
  },
  // ...
};
```

For example, setting the name, description, and some traits for a token might look like this:

```javascript
// sketch.js

let color = hl.randomElement(["red", "green", "blue"]);
let size = hl.randomElement(["small", "medium", "large"]);
hl.token.setName(`${size} ${color} token`);
hl.token.setDescription(
  `This is one token from a series of many. This particular token is ${size} and 
  ${color}.`
);
hl.token.setTraits({
  Size: size,
  Color: color,
});
```

In this case, a single token might have the name “small red token” and the description “This is one token from a series of many. This particular token is small and red.” The token’s traits would also reflect these values. Note that token name and token description are independent from collection name and collection description, which are set in the Highlight UI, not your code.

## Capturing preview images programmatically

Whenever one of your tokens is minted, Highlight automatically captures and assigns a preview image (a raster image used when the token live view can’t be shown) for that token. You can trigger this capture programmatically or by specifying a time delay in the Highlight UI. Triggering the capture programmatically allows you to control exactly when the preview image is captured as your code runs. The hl-gen.js script provides the hl.token.capturePreview() method to trigger the capture.

```javascript
// hl-gen.js (partial)

hl = {
  // ...
  token: {
    capturePreview: () => Void, // Triggers capture of preview image for the token
  },
  // ...
};
```

To capture your preview images programmatically, choose this option in the Preview images step of the collection creation process and call the provided hl.token.capturePreview() method in your code when you want to capture the preview image.

When capturing a preview image, we’ll run your code in the background for a few minutes listening for hl.token.capturePreview() to be called. If you’re using this method, ensure it is called within a few minutes of your script starting. For example, to trigger the capture after the 1000th frame of your script, you could do the following:

```javascript
// sketch.js

draw() {
  // Your drawing code...
  if (frameCount === 1000) {
    hl.token.capturePreview();
  }
}
```

## Example usage

All of the data inputs and methods discussed above are available on the global hl object, which you can reference in your main drawing script (as long as you’ve included hl-gen.js in your project). This example illustrates a simple p5.js sketch that draws a randomly sized circle in the middle of the canvas, fills it with either red, green, or blue, displays the minting wallet address in the center of the circle, applies the size and color of the circle as traits of the token, and captures a preview image.

```javascript
// sketch.js

function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  translate(width / 2, height / 2);
  let size = hl.randomInt(400, 600);
  let color = hl.randomElement(["red", "green", "blue"]);
  noStroke();
  fill(color);
  ellipse(0, 0, size);
  fill("white");
  textAlign(CENTER, CENTER);
  text(hl.tx.walletAddress, 0, 0);
  hl.token.setTraits({
    Size: size,
    Color: color,
  });
  hl.token.capturePreview();
}
```

## Notes on token display and rendering

Generative projects created on Highlight are displayed by rendering your project’s index.html file inside an iframe. This means that your tokens may appear at different sizes at different times. In practice, this means using a fixed size canvas may cause rendering issues. You may either scale your token in order to appear the same at all sizes, or you may have it respond and display differently at different sizes—the choice is yours. In either case, your code should respond to the window resize event to ensure your token renders correctly if the browser is resized.

In the preview images step, you’ll have the option to specify a resolution of the preview image. Note that the aspect ratio used here will be used to render your token on Highlight.
