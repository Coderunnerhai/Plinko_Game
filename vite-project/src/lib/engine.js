import { sha256 } from "./hash.js";
import { xorshift32, seedFromHex } from "./rng.js";

export function runEngine({
  serverSeed,
  clientSeed,
  nonce,
  dropColumn,
  rows = 12,
}) {
  const combinedSeed = sha256(
    `${serverSeed}:${clientSeed}:${nonce}`
  );

  const seed = seedFromHex(combinedSeed);
  const rand = xorshift32(seed);

  // Peg map
  const pegMap = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let i = 0; i <= r; i++) {
      let bias = 0.5 + (rand() - 0.5) * 0.2;
      row.push(Number(bias.toFixed(6)));
    }
    pegMap.push(row);
  }

  const pegMapHash = sha256(JSON.stringify(pegMap));

  // Path
  let pos = 0;
  const path = [];
  const adj = (dropColumn - Math.floor(rows / 2)) * 0.01;

  for (let r = 0; r < rows; r++) {
    const pegIndex = Math.min(pos, r);
    let bias = pegMap[r][pegIndex];

    let adjusted = Math.min(1, Math.max(0, bias + adj));

    const rnd = rand();

    if (rnd < adjusted) {
      path.push("L");
    } else {
      path.push("R");
      pos++;
    }
  }

  return {
    combinedSeed,
    pegMap,
    pegMapHash,
    path,
    binIndex: pos,
  };
}