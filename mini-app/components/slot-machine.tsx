"use client";

import { useEffect, useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid: Fruit[][] = [
          [getRandomFruit(), ...prev[0].slice(0, 2)],
          [getRandomFruit(), ...prev[1].slice(0, 2)],
          [getRandomFruit(), ...prev[2].slice(0, 2)],
        ];
        return newGrid;
      });
    }, 200);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // Check win condition directly in render
      setWin(false);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  // Check win condition directly in render
  const hasWin =
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            className="w-16 h-16"
          />
        ))}
      </div>
      <button
        className="px-4 py-2 bg-primary text-white rounded"
        onClick={() => setSpinning(true)}
        disabled={spinning}
      >
        Spin
      </button>
      {hasWin && !spinning && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold text-green-600">You Win!</span>
          <Share text={`I just won at Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
