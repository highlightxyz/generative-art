/**
 * Highlight Generative Art Script : V1
 * @version: v1
 * @description The script exposes certain values and methods that
 * can be used within code based generative art.
 */

(function() {

let searchParams = new URLSearchParams(window.location.search)

const generateRandomHash = () => {
    const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    return "0x" + Array(40).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('');
}

function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507),
            h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function sfc32New(a, b, c, d) {
    return function() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = c << 21 | c >>> 11;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

const seed = xmur3(searchParams.get("h") || generateRandomHash());

const hl = {
    _version: "0.0.2",
    tx: {
        hash: searchParams.get("h") || generateRandomHash(),
        blockHash: searchParams.get("bh"),
        timestamp: searchParams.get("t"),
        walletAddress: searchParams.get("wa"),
        tokenId: searchParams.get("tid"),
    },
    rand: {
        num: sfc32New(seed(), seed(), seed(), seed()),
    },
    token: {
        id: searchParams.get("tid"),
        attributes: {},
        capturePreview: function () {
            window.dispatchEvent(new Event("CAPTURE_PREVIEW"));
            setTimeout(() => this.capturePreview(), 500)
        },
        setAttributes: function (attributes) {
            this.attributes = attributes;
        },
        getAttributes: function () {
            return this.attributes;
        }
    },
    context: {
        previewMode: searchParams.get("pr") === "1"
    }
};

window.$hl = hl;


window.addEventListener("message", (event) => {
if (event.data === "$hl_getInfo") {
  parent.postMessage({
    id: "$hl_getInfo",
    data: { 
      version: hl._version,
      tx: hl.tx,
      token: {
        id: hl.token.id,
        attributes: hl.token.getAttributes(),
      }
    },
  }, "*")
}
});

})()