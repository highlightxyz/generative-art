/**
 * Highlight Generative Art Highlight Studio Script : V0
 * @version: 0.0.2
 * @description The script that enables all the Highlight Studio features.
 */

const hlStudio = (function (hl) {
  if (hl == null) {
    console.log('HL Studio needs hl-gen.js to be loaded first. Exiting...');
    return;
  } else {
    console.log('HL Studio loaded!');
  }

  // Give the user a flag to know if they are in studio mode
  hl.context.studioMode = new URLSearchParams(window.location.search).get('hls') === '1';
  hl.context.isCurated = new URLSearchParams(window.location.search).get('ic') === '1';

  const originalReferences = {
    ...hl,
    randomSeed: hl.context.isCurated ? xmur3(hl.tx.hash) : xmur3(hl.tx.hash + hl.tx.tokenId),
  };

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

  let hasCapturePreviewBeenCalled = false;

  function postMessageOnTopWindow(eventName, data) {
    if (window.top != null) {
      window.top.postMessage(
        {
          source: 'hl-studio',
          eventName,
          data,
          metadata: {
            url: window.location.href,
            hl: JSON.parse(JSON.stringify(originalReferences)),
            timestamp: Date.now(),
          },
        },
        '*'
      );
    }
  }

  function createScreenshot(element) {
    if (element == null) {
      console.error('The element must be a CANVAS or an IMG element. Exiting...');
      return;
    }

    let data = null;

    if (element.tagName === 'CANVAS') {
      data = element.toDataURL('image/png');
    }
    if (element.tagName === 'IMG') {
      data = element.src;
    }

    postMessageOnTopWindow('SCREENSHOT_CREATED', {
      imageData: data,
    });
  }

  hl.context = new Proxy(hl.context, {
    get(target, prop, receiver) {
      return target[prop];
    },
  });

  hl.token = new Proxy(hl.token, {
    get(target, prop) {
      if (prop !== 'capturePreview' || !hasCapturePreviewBeenCalled) {
        if (prop === 'capturePreview') {
          hasCapturePreviewBeenCalled = true;
        }

        postMessageOnTopWindow('PROPERTY_GET', {
          parent: 'token',
          prop,
        });
      }

      return target[prop];
    },
    set(target, prop, value) {
      postMessageOnTopWindow('PROPERTY_SET', {
        parent: 'token',
        prop,
        value,
      });

      return (target[prop] = value);
    },
  });

  // Override to allow trait harvester to work
  hl.random = function (...args) {
    let min = 0,
      max = 1;
    if (args.length === 1) max = args[0];
    if (args.length === 2) {
      max = args[1];
      min = args[0];
    }
    const rand = sfc32(
      originalReferences.randomSeed(),
      originalReferences.randomSeed(),
      originalReferences.randomSeed(),
      originalReferences.randomSeed()
    )();
    return min + (max - min) * rand;
  };

  postMessageOnTopWindow('HLSTUDIO_INIT', { version: '0.0.2' });

  window.addEventListener('message', (event) => {
    if (event.data.eventName === 'CAPTURE_PREVIEW') {
      const selector = event.data.data.selector;
      createScreenshot(document.querySelector(selector));
    }

    if (event.data.eventName === 'HARVEST_TRAIT') {
      if (window.calculateHLTraits == null) {
        return;
      }

      // // Reset the random seed based on new hash and token id
      const tx = event.data.data.tx;
      originalReferences.randomSeed = originalReferences.context.isCurated
        ? xmur3(tx.hash)
        : xmur3(tx.hash + tx.tokenId);
      const newHl = {
        ...hl,
        tx,
      };

      const newTraits = window.calculateHLTraits(newHl);
      postMessageOnTopWindow('HLSTUDIO_HARVESTED_TRAIT', {
        traits: newTraits,
      });
    }
  });

  return {
    createScreenshot,
  };
})(hl);

window.$hlStudio = hlStudio;
