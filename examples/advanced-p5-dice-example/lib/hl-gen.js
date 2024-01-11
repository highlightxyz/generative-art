/**
 * Highlight Generative Art Script : V0
 * @version: 0.1.2
 * @description The script exposes certain values and methods that
 * can be used within code based generative art.
 */

const hl = (function () {
  let searchParams = new URLSearchParams(window.location.search);

  const generateRandomHash = () => {
    const alphabet = "0123456789abcdef";
    return (
      "0x" +
      Array(64)
        .fill(0)
        .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
        .join("")
    );
  };

  const generateRandomAddress = () => {
    const alphabet = "0123456789abcdef";
    return (
      "0x" +
      Array(40)
        .fill(0)
        .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
        .join("")
    );
  };

  function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    return function () {
      (h = Math.imul(h ^ (h >>> 16), 2246822507)),
        (h = Math.imul(h ^ (h >>> 13), 3266489909));
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function sfc32(a, b, c, d) {
    return function () {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  const contractAddress = searchParams.get("a") || generateRandomAddress();
  const chainId =
    searchParams.get("c") ||
    [1, 5, 137, 80001][Math.floor(Math.random() * 4)].toString();
  const editionSize =
    searchParams.get("s") || Math.floor(100 * Math.random()).toString();
  const mintSize =
    searchParams.get("ms") ||
    Math.floor(Number(editionSize) * Math.random() + 1).toString();
  const mintIteration =
    searchParams.get("mi") ||
    Math.floor((Number(mintSize) - 1) * Math.random() + 1).toString();
  const hash = searchParams.get("h") || generateRandomHash();
  const blockHash = searchParams.get("bh") || generateRandomHash();
  const blockNumber =
    searchParams.get("bn") || Math.floor(1000000 * Math.random()).toString();
  const tokenId =
    searchParams.get("tid") ||
    Math.floor(Number(editionSize) * Math.random()).toString();
  const walletAddress = searchParams.get("wa") || generateRandomAddress();
  const timestamp =
    searchParams.get("t") || Math.floor(Date.now() / 1000).toString();
  const gasPrice =
    searchParams.get("gp") ||
    Math.floor(Math.random() * (200 - 10 + 1) + 10).toString();
  const gasUsed =
    searchParams.get("gu") ||
    Math.floor(Math.random() * (100 - 10 + 1) + 10).toString();
  const isCurated = searchParams.get("ic") || "0";
  const seed = isCurated === "1" ? xmur3(hash) : xmur3(hash + tokenId);

  const hl = {
    tx: {
      contractAddress,
      chainId,
      hash,
      blockHash,
      blockNumber,
      timestamp,
      walletAddress,
      tokenId,
      mintSize,
      mintIteration,
      editionSize,
      gasPrice,
      gasUsed,
    },
    random: (...args) => {
      let min = 0,
        max = 1;
      if (args.length === 1) max = args[0];
      if (args.length === 2) {
        max = args[1];
        min = args[0];
      }
      const rand = sfc32(seed(), seed(), seed(), seed())();
      return min + (max - min) * rand;
    },
    randomInt: (...args) => {
      if (args.length === 0) args.push(100); //If not upper limit provided then set to [0,100) as safe assumption
      if (args.length === 1) args[0]++;
      if (args.length === 2) args[1]++;
      return Math.floor(hl.random(...args));
    },
    randomBool: (p) => {
      return hl.random() < p;
    },
    randomElement: (array) => {
      return array[hl.randomInt(0, array.length - 1)];
    },
    token: {
      id: tokenId,
      traits: {},
      name: "",
      description: "",
      capturePreview: function () {
        window.dispatchEvent(new Event("CAPTURE_PREVIEW"));
        setTimeout(() => this.capturePreview(), 500);
      },
      setTraits: function (traits) {
        this.traits = traits;
      },
      getTraits: function () {
        return this.traits;
      },
      setName: function (name) {
        this.name = name;
      },
      getName: function () {
        return this.name;
      },
      setDescription: function (description) {
        this.description = description;
      },
      getDescription: function () {
        return this.description;
      },
    },
    context: {
      previewMode: searchParams.get("pr") === "1",
      scriptInfo: () => {
        return {
          name: "Highlight Generative Art Script",
          version: "0.1.2",
          framework: "js",
        };
      },
    },
  };

  return hl;
})();

window.$hl = hl;
