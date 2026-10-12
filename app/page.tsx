"use client";

import Link from "next/link";
import PhotoAlbum from "@/components/album/PhotoAlbum";
import MusicPlayer from "@/components/album/MusicPlayer";
import { COVER_CONFIG } from "@/components/album/albumConfig";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #fdf4ff 0%, #ede0fa 30%, #f5e6ff 60%, #e8d5f5 100%)",
      }}
    >
      {/* Decorative floating petals / sparkles — fixed overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {(["🌸", "✨", "💜", "💫", "🦋", "⭐", "🌸", "💕"] as const).map(
          (emoji, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: `${10 + i * 11}%`,
                left: `${5 + i * 12}%`,
                fontSize: "1.5rem",
                opacity: 0.18,
                animation: `pulse ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.7}s`,
                userSelect: "none",
              }}
            >
              {emoji}
            </span>
          )
        )}
      </div>

      {/* Header */}
      <header
        className="relative flex flex-col items-center pt-4 pb-1 sm:pt-10 sm:pb-2"
        style={{ zIndex: 10 }}
      >
        <h1
          className="text-2xl font-bold drop-shadow sm:text-3xl md:text-4xl"
          style={{ fontFamily: "Dancing Script, cursive", color: "#5b2d8e" }}
        >
          {COVER_CONFIG.names}
        </h1>
        <p
          className="mt-0.5 text-xs tracking-widest uppercase sm:mt-1 sm:text-sm"
          style={{ color: "#9b6bbf" }}
        >
          {COVER_CONFIG.date}
        </p>
        <div
          className="mt-1.5 h-px w-24 sm:mt-2 sm:w-32"
          style={{
            background:
              "linear-gradient(to right, transparent, #c084fc, transparent)",
          }}
        />
      </header>

      {/* Main album */}
      <section
        className="relative flex flex-col items-center justify-center px-1.5 py-2 sm:px-4 sm:py-8"
        style={{ zIndex: 10 }}
      >
        <PhotoAlbum />
      </section>

      {/* Footer */}
      <footer
        className="relative flex flex-col items-center gap-1.5 pb-20 sm:pb-28 text-center"
        style={{ zIndex: 10 }}
      >
        <p
          className="text-lg italic"
          style={{ fontFamily: "Dancing Script, cursive", color: "#7e3aad" }}
        >
          Every picture tells our story 💜
        </p>
        <Link
          href="/love"
          className="mt-1 text-xs underline underline-offset-4 transition-colors"
          style={{ color: "#b07fd4" }}
        >
          💌 A special surprise for you
        </Link>
      </footer>

      {/* Spotify-style music player */}
      <MusicPlayer />
    </main>
  );
}
