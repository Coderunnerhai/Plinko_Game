import { useEffect, useState } from "react";

export default function PlinkoBoard({
  path, binIndex,
  onSelectColumn,
  selectedColumn = 6,
}) {
  const rows = 12;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const STEP_X = 34; // 30 width + ~2 margin
const STEP_Y = 30;

  // Count L/R (for debugging bias)
  const leftCount = path.filter((p) => p === "L").length;
  const rightCount = path.filter((p) => p === "R").length;

  // Animate ball
  useEffect(() => {
    console.log("Final bin:", binIndex);
  if (!path.length) return;

  let posY = 0;

  path.forEach((dir, index) => {
    setTimeout(() => {
      posY += 30;

      // compute position from path up to this point
      const rightMoves = path.slice(0, index + 1).filter(p => p === "R").length;
      const currentX = (rightMoves - index / 2) * STEP_X;

      // FINAL step → exact bin alignment
      if (index === path.length - 1) {
        const finalX = (binIndex - Math.floor(rows / 2)) * STEP_X;
        setX(finalX);
      } else {
        setX(currentX);
      }

      setY(posY);
    }, index * 250);
  });
}, [path, binIndex]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      
      {/* BOARD */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ROWS */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            {Array.from({ length: r + 1 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  margin: "0 6px",
                  borderRadius: "50%",
                  backgroundColor: "#333",
                }}
              />
            ))}
          </div>
        ))}

        {/* BALL */}
        {path.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
transform: `translateX(${x}px)`,
              top: y,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "red",
              transition: "all 0.3s linear",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* BINS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            onClick={() => onSelectColumn && onSelectColumn(i)}
            style={{
              width: 30,
              height: 40,
              border: "1px solid black",
              margin: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: selectedColumn === i ? "#ddd" : "white",
              fontWeight: selectedColumn === i ? "bold" : "normal",
            }}
          >
            {i}
          </div>
        ))}
      </div>

      {/* DEBUG INFO */}
      {path.length > 0 && (
        <>
          <h3 style={{ marginTop: 10 }}>
            Path:{" "}
            {path.map((p, i) => (
              <span
                key={i}
                style={{ color: p === "L" ? "blue" : "green" }}
              >
                {p}
              </span>
            ))}
          </h3>

          <h4>
            Left: {leftCount} | Right: {rightCount}
          </h4>
        </>
      )}
    </div>
  );
}