export function createRNG(seedHex) {
  // take first 4 bytes (8 hex chars)
  let seed = parseInt(seedHex.slice(0, 8), 16);

  return function rand() {
    // xorshift32
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;

    // convert to [0,1)
    return ((seed >>> 0) / 4294967296);
  };
}