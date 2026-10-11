"use client";

import { useState } from "react";
import FallingElements from "@/components/FallingElements";
import LoveModal from "@/components/LoveModal";
import NoButton from "@/components/NoButton";
import Link from "next/link";

export default function LovePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-100 via-rose-100 to-pink-200">
      <FallingElements />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-6 px-4 text-center">
          <h1 className="text-5xl font-bold text-rose-700 drop-shadow-lg md:text-7xl">
            Do you still love me?
          </h1>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-12 w-40 rounded-full bg-rose-400 text-xl font-semibold text-white transition-all duration-200 hover:scale-110 hover:bg-rose-500 hover:shadow-lg hover:shadow-pink-400"
            >
              Yes 💖
            </button>

            <NoButton />
          </div>

          <Link
            href="/"
            className="mt-4 text-sm text-rose-400 underline underline-offset-4 hover:text-rose-600"
          >
            ← Back to our album
          </Link>
        </div>
      </div>

      <LoveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
