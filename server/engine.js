import { sha256 } from "./hash.js";
import { createRNG } from "./rng.js";

export function runEngine({ serverSeed, clientSeed, nonce, dropColumn }) {
  const rows = 12;

  // 🔐 combined seed
  const combinedSeed = sha256(`${serverSeed}:${clientSeed}:${nonce}`);

  const rand = createRNG(combinedSeed);

  // 🎯 generate peg map
  const pegMap = [];

  for (let r = 0; r < rows; r++) {
    const row = [];

    for (let i = 0; i <= r; i++) {
      const val = 0.5 + (rand() - 0.5) * 0.2;
      row.push(Number(val.toFixed(6))); // stable rounding
    }

    pegMap.push(row);
  }

  const pegMapHash = sha256(JSON.stringify(pegMap));

  // 🎯 bias from drop column
  const adj = (dropColumn - Math.floor(rows / 2)) * 0.01;

  let pos = 0;
  const path = [];

  for (let r = 0; r < rows; r++) {
    const pegIndex = Math.min(pos, r);
    let bias = pegMap[r][pegIndex];

    bias = Math.max(0, Math.min(1, bias + adj));

    const rnd = rand();

    if (rnd < bias) {
      path.push("L");
    } else {
      path.push("R");
      pos += 1;
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