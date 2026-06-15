// share.js — turn a "gift" object into a shareable link and back.
// All personal data lives in the URL *fragment* (after #), which browsers
// never send to a server, so the love notes physically cannot leak.

const SCHEMA_VERSION = 1;

// Pack the verbose field names down to single letters before compressing, so the
// resulting link stays as short as possible.
function pack(gift) {
  return {
    v: SCHEMA_VERSION,
    t: gift.to || '',
    n: gift.note || '',
    c: gift.catName || '',
    k: gift.color || 'cream',
    p: gift.compliments || [],
    o: (gift.occasions || []).map((o) => [o.label, o.date, o.msg]),
  };
}

function unpack(raw) {
  return {
    version: raw.v || 1,
    to: raw.t || '',
    note: raw.n || '',
    catName: raw.c || '',
    color: raw.k || 'cream',
    compliments: Array.isArray(raw.p) ? raw.p : [],
    occasions: Array.isArray(raw.o)
      ? raw.o.map(([label, date, msg]) => ({ label, date, msg }))
      : [],
  };
}

// Encode a gift object into a URL-safe compressed string.
export function encodeGift(gift) {
  const json = JSON.stringify(pack(gift));
  return window.LZString.compressToEncodedURIComponent(json);
}

// Decode the fragment back into a gift object. Returns null if absent/corrupt.
export function decodeGift(fragment) {
  if (!fragment) return null;
  try {
    const json = window.LZString.decompressFromEncodedURIComponent(fragment);
    if (!json) return null;
    return unpack(JSON.parse(json));
  } catch (err) {
    console.warn('Could not decode gift:', err);
    return null;
  }
}

// Read the encoded gift from the current location (strips leading #).
export function readGiftFromUrl() {
  const frag = window.location.hash.replace(/^#/, '');
  return decodeGift(frag);
}

// Build the full shareable URL for a gift, pointing at this same page.
export function buildShareUrl(gift) {
  const base = window.location.origin + window.location.pathname;
  return base + '#' + encodeGift(gift);
}

// A short stable id for a gift, used to key its saved mood in localStorage so
// each unique cat remembers its own happiness independently.
export function giftKey(gift) {
  const str = encodeGift(gift);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return 'tinycat:' + (hash >>> 0).toString(36);
}
