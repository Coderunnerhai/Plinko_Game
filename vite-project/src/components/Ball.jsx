import { useEffect, useState } from "react";

export default function Ball({ path }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    let posX = 0;
    let posY = 0;

    path.forEach((dir, index) => {
      setTimeout(() => {
        posY += 30;

        if (dir === "L") posX -= 20;
        else posX += 20;

        setX(posX);
        setY(posY);
      }, index * 300);
    });
  }, [path]);

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: y,
        width: 15,
        height: 15,
        borderRadius: "50%",
        background: "red",
        transition: "all 0.3s linear",
      }}
    />
  );
}