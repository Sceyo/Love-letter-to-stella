"use client";

import Image from "next/image";
import { useState } from "react";

interface LoveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoveModal({ isOpen, onClose }: LoveModalProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Gradient fallback always shown underneath */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-400 via-pink-500 to-rose-600" />

      {/* 👇 Replace modal-bg.jpg in /public with your own photo */}
      {!imgError && (
        <Image
          src="/modal-bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          onError={() => setImgError(true)}
        />
      )}

      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 px-6 text-center">
        <p className="text-5xl font-bold text-white drop-shadow-xl md:text-7xl">
          I love you too 🥰
        </p>
      </div>

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 text-3xl font-bold text-white transition-transform hover:scale-110"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
