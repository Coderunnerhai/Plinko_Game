import { useState } from "react";
import Controls from "../components/Controls";
import PlinkoBoard from "../components/PlinkoBoard";
import axios from "axios";

export default function Game() {

    const [column, setColumn] = useState(6);
    const BASE_URL = 'https://plinko-game-3.onrender.com/'
    
  const [round, setRound] = useState(null);
  console.log("Game rendering", round);

  const startGame = async (clientSeed, dropColumn) => {
  console.log("START GAME RUNNING 🚀", clientSeed, dropColumn); // 👈 ADD

  try {
    const commit = await axios.post(`${BASE_URL}/api/rounds/commit`);
    console.log("Commit:", commit.data);

    await axios.post(
  `${BASE_URL}/api/rounds/${commit.data.roundId}/start`,
  {
    clientSeed,
    dropColumn,
    betCents: 100,
  }
);

    await axios.post(
  `${BASE_URL}/api/rounds/${commit.data.roundId}/reveal`
);

    const full = await axios.get(
  `${BASE_URL}/api/rounds/${commit.data.roundId}`
);

    console.log("FULL DATA:", full.data); // 👈

    setRound(full.data);
  } catch (err) {
    console.error("ERROR ❌", err);
  }
};

  return (
    <div>
      <h1>Plinko Game</h1>

      <Controls onDrop={(seed, col) => startGame(seed, col)} />

      <PlinkoBoard
  path={round?.pathJson || []}
  binIndex={round?.binIndex}   // 👈 ADD
  onSelectColumn={setColumn}
  selectedColumn={column}
/>
    </div>
  );
}