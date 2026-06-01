"use client";

import { useEffect, useRef, useState } from "react";

interface FallingElement {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  rotation: number;
}

const EMOJIS = ["🌸", "🌺", "🌹", "🌼", "🤍", "🩷", "❤️", "💕"];

export default function FallingElements() {
  const [elements, setElements] = useState<FallingElement[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const el: FallingElement = {
        id: idRef.current++,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 100,
        size: 1 + Math.random() * 1.5,
        duration: 4 + Math.random() * 5,
        rotation: Math.random() * 360,
      };
      setElements((prev) => [...prev, el]);
    }, 350);

    return () => clearInterval(interval);
  }, []);

  const remove = (id: number) =>
    setElements((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <span
          key={el.id}
          className="falling-element"
          style={{
            left: `${el.x}%`,
            fontSize: `${el.size}rem`,
            animationDuration: `${el.duration}s`,
            transform: `rotate(${el.rotation}deg)`,
          }}
          onAnimationEnd={() => remove(el.id)}
        >
          {el.emoji}
        </span>
      ))}
    </div>
  );
}
