"use client";

import { useRef, useState } from "react";

export default function NoButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const flee = () => {
    const btn = buttonRef.current;
    const w = btn?.offsetWidth ?? 160;
    const h = btn?.offsetHeight ?? 48;
    const newX = Math.random() * (window.innerWidth - w);
    const newY = Math.random() * (window.innerHeight - h);
    if (!hasMoved) setHasMoved(true);
    setPosition({ x: newX, y: newY });
  };

  return (
    <button
      ref={buttonRef}
      onClick={flee}
      onMouseEnter={flee}
      style={hasMoved ? { position: "fixed", left: position.x, top: position.y } : {}}
      className="z-50 h-12 w-40 rounded-full bg-gray-200 text-xl font-semibold text-gray-500 transition-all duration-100 hover:bg-gray-300"
    >
      No 💔
    </button>
  );
}
