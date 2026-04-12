import { useState } from "react";

export default function Controls({ onDrop }) {
  const [clientSeed, setClientSeed] = useState("test");
  const [column, setColumn] = useState(6);

  return (
    <div>
      <input value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} />
      <input
        type="number"
        min={0}
        max={12}
        value={column}
        onChange={(e) => setColumn(Number(e.target.value))}
      />
      <button
  onClick={() => {
    console.log("Drop clicked");   // 👈 ADD THIS
    onDrop(clientSeed, column);
  }}
>
  Drop
</button>
    </div>
  );
}