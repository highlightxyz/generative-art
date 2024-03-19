/**
 * Highlight Generative Art Script : V1
 * @version: 1.0.0
 * @description The script exposes certain values and methods that
 * can be used within code based generative art.
 */

const hl = (function () {
  function hlCreateRandomEngine() {
    function xmur3(str) {
      for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19));
      return function () {
        (h = Math.imul(h ^ (h >>> 16), 2246822507)), (h = Math.imul(h ^ (h >>> 13), 3266489909));
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

    function shuffleArrayHelper(randomGenerator, array, options) {
      var m = array.length,
        t,
        i;

      while (m) {
        i = Math.floor(randomGenerator.nextRandom(options) * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }

    function generateRandomNumberFromSeedFn(generatorSeedFn) {
      return sfc32(generatorSeedFn(), generatorSeedFn(), generatorSeedFn(), generatorSeedFn())();
    }

    function generateRandomHash() {
      const alphabet = '0123456789abcdef';
      return (
        '0x' +
        Array(64)
          .fill(0)
          .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
          .join('')
      );
    }

    function generateRandomAddress() {
      const alphabet = '0123456789abcdef';
      return (
        '0x' +
        Array(40)
          .fill(0)
          .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
          .join('')
      );
    }

    function createGenerator(options) {
      const { seed } = {
        ...(options || {}),
      };

      if (seed == null) {
        throw new Error('You need to provide a seed for the generator.');
      }

      const generatorSeedFn = xmur3(seed);

      return {
        nextRandom: function (options) {
          const { min, max, rand } = {
            min: 0,
            max: 1,
            rand: generateRandomNumberFromSeedFn(generatorSeedFn),
            ...options,
          };
          return min + (max - min) * rand;
        },
        nextRandomInt: function (options) {
          const defaultOptions = {
            min: 0,
            max: 100,
            ...options,
          };
          return Math.floor(this.nextRandom(defaultOptions));
        },
        nextRandomBool: function (options) {
          const defaultOptions = {
            chance: 0.5,
            ...options,
          };
          return this.nextRandom(defaultOptions) < defaultOptions.chance;
        },
        nextRandomElement: function (array, options) {
          const defaultOptions = {
            max: array.length,
            ...options,
          };
          return array[this.nextRandomInt(defaultOptions)];
        },
        nextShuffleArrayInPlace: function (array, options) {
          shuffleArrayHelper(this, array, options);
          return array;
        },
        // Constant randomness
        constantRandom: function (seed, options = {}) {
          if (typeof seed !== 'string') {
            throw new Error('You must provide a string value for the seed');
          }

          const rand = generateRandomNumberFromSeedFn(xmur3(seed));
          return this.nextRandom({ ...options, rand });
        },
        constantRandomInt: function (seed, options = {}) {
          if (typeof seed !== 'string') {
            throw new Error('You must provide a string value for the seed');
          }

          const rand = generateRandomNumberFromSeedFn(xmur3(seed));
          return this.nextRandomInt({ ...options, rand });
        },
        constantRandomBool: function (seed, options = {}) {
          if (typeof seed !== 'string') {
            throw new Error('You must provide a string value for the seed');
          }

          const rand = generateRandomNumberFromSeedFn(xmur3(seed));
          return this.nextRandomBool({ ...options, rand });
        },
        constantRandomElement: function (seed, array, options = {}) {
          if (typeof seed !== 'string') {
            throw new Error('You must provide a string value for the seed');
          }

          const rand = generateRandomNumberFromSeedFn(xmur3(seed));
          return this.nextRandomElement(array, { ...options, rand });
        },
        constantShuffleArrayInPlace: function (seed, array) {
          if (typeof seed !== 'string') {
            throw new Error('You must provide a string value for the seed');
          }

          // We need to create a new generator as there is a sequence of operations that happen
          const tmpGenerator = createGenerator({ seed: `constantShuffleArrayInPlace-${seed}` });
          return tmpGenerator.nextShuffleArrayInPlace(array);
        },
      };
    }

    return {
      utils: {
        xmur3,
        sfc32,
        shuffleArrayHelper,
        generateRandomNumberFromSeedFn,
        generateRandomHash,
        generateRandomAddress,
      },
      createGenerator,
    };
  }

  function hlCreateTxObject(randomEngine, searchParams) {
    const contractAddress = searchParams.get('a') || randomEngine.utils.generateRandomAddress();
    const chainId =
      searchParams.get('c') || [1, 5, 137, 80001][Math.floor(Math.random() * 4)].toString();
    const editionSize = searchParams.get('s') || Math.floor(100 * Math.random()).toString();
    const mintSize =
      searchParams.get('ms') || Math.floor(Number(editionSize) * Math.random() + 1).toString();
    const mintIteration =
      searchParams.get('mi') || Math.floor((Number(mintSize) - 1) * Math.random() + 1).toString();
    const hash = searchParams.get('h') || randomEngine.utils.generateRandomHash();
    const blockHash = searchParams.get('bh') || randomEngine.utils.generateRandomHash();
    const blockNumber = searchParams.get('bn') || Math.floor(1000000 * Math.random()).toString();
    const tokenId =
      searchParams.get('tid') || Math.floor(Number(editionSize) * Math.random()).toString();
    const walletAddress = searchParams.get('wa') || randomEngine.utils.generateRandomAddress();
    const timestamp = searchParams.get('t') || Math.floor(Date.now() / 1000).toString();
    const gasPrice =
      searchParams.get('gp') || Math.floor(Math.random() * (200 - 10 + 1) + 10).toString();
    const gasUsed =
      searchParams.get('gu') || Math.floor(Math.random() * (100 - 10 + 1) + 10).toString();
    const isCurated = searchParams.get('ic') || '0';

    return {
      isCurated,
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
    };
  }

  function hlCreateTokenObject(tx) {
    return {
      id: tx.tokenId,
      traits: {},
      name: '',
      description: '',
      capturePreview: function () {
        window.dispatchEvent(new Event('CAPTURE_PREVIEW'));
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
    };
  }

  function hlCreateRandomHelpers(randomEngine, tx) {
    let randomGenerator = randomEngine.createGenerator({
      seed: tx.isCurated ? tx.hash : tx.hash + tx.tokenId,
    });

    return {
      randomGenerator,
      setRandomSeed: (seed) => {
        randomGenerator = randomEngine.createGenerator({
          seed,
        });
      },
      createRandomGenerator: (options) => {
        return randomEngine.createGenerator(options);
      },
      random: (...args) => {
        let min = 0;
        let max = 1;

        if (args.length === 1) {
          max = args[0];
        }
        if (args.length === 2) {
          max = args[1];
          min = args[0];
        }
        return randomGenerator.nextRandom({ min, max });
      },
      randomInt: (...args) => {
        let min = 0;
        let max = 100; //If not upper limit provided then set to [0,100) as safe assumption

        if (args.length === 1) {
          max = args[0];
        }
        if (args.length === 2) {
          min = args[0];
          max = args[1];
        }
        return randomGenerator.nextRandomInt({ min, max });
      },
      randomBool: (p) => {
        let chance = p == null ? 0.5 : p;
        return randomGenerator.nextRandomBool({ chance });
      },
      randomElement: (array) => {
        return randomGenerator.nextRandomElement(array);
      },
      shuffleArrayInPlace: (array) => {
        return randomGenerator.nextShuffleArrayInPlace(array);
      },
      // Constant randomness
      constantRandom: (seed, ...args) => {
        let min = 0;
        let max = 1;

        if (args.length === 1) {
          max = args[0];
        }
        if (args.length === 2) {
          max = args[1];
          min = args[0];
        }
        return randomGenerator.constantRandom(seed, { min, max });
      },
      constantRandomInt: (seed, ...args) => {
        let min = 0;
        let max = 100; //If not upper limit provided then set to [0,100) as safe assumption

        if (args.length === 1) {
          max = args[0];
        }
        if (args.length === 2) {
          min = args[0];
          max = args[1];
        }
        return randomGenerator.constantRandomInt(seed, { min, max });
      },
      constantRandomBool: (seed, p) => {
        let chance = p == null ? 0.5 : p;
        return randomGenerator.constantRandomBool(seed, { chance });
      },
      constantRandomElement: (seed, array) => {
        return randomGenerator.constantRandomElement(seed, array);
      },
      constantShuffleArrayInPlace: (seed, array) => {
        return randomGenerator.constantShuffleArrayInPlace(seed, array);
      },
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const randomEngine = hlCreateRandomEngine();

  const tx = hlCreateTxObject(randomEngine, searchParams);
  const randomHelpers = hlCreateRandomHelpers(randomEngine, tx);
  const token = hlCreateTokenObject(tx);

  const hl = {
    internals: {
      searchParams,
      randomEngine,
    },
    tx,
    token,
    context: {
      previewMode: searchParams.get('pr') === '1',
      scriptInfo: () => {
        return {
          name: 'Highlight Generative Art Script',
          version: '1.0.0',
          framework: 'js',
        };
      },
    },
    ...randomHelpers,
  };

  return hl;
})();

window.$hl = hl;
