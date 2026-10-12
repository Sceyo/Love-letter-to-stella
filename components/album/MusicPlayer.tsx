"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { PLAYLIST, type Song } from "./albumConfig";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface FlurryHeart {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

const HEART_ROULETTE = [
  {
    name: "Purple",
    fill: "#c084fc",
    stroke: "#a855f7",
    strokeWidth: "1.5",
    glow: "rgba(192, 132, 252, 0.8)",
    emojis: ["💜", "💖", "🟣", "💕", "✨", "💜"],
  },
  {
    name: "White",
    fill: "#ffffff",
    stroke: "#e9d5ff",
    strokeWidth: "1.5",
    glow: "rgba(255, 255, 255, 0.9)",
    emojis: ["🤍", "✨", "🤍", "⭐", "💫", "🤍"],
  },
  {
    name: "Yellow",
    fill: "#facc15",
    stroke: "#ca8a04",
    strokeWidth: "1.5",
    glow: "rgba(250, 204, 21, 0.8)",
    emojis: ["💛", "✨", "⭐", "💛", "🌟", "💛"],
  },
  {
    name: "Blue",
    fill: "#38bdf8",
    stroke: "#0284c7",
    strokeWidth: "1.5",
    glow: "rgba(56, 189, 248, 0.8)",
    emojis: ["💙", "✨", "🩵", "💎", "💙", "💫"],
  },
  {
    name: "Black",
    fill: "#18181b",
    stroke: "#ffffff",
    strokeWidth: "1.8",
    glow: "rgba(255, 255, 255, 0.6)",
    emojis: ["🖤", "✨", "🖤", "⭐", "🖤", "🩶"],
  },
];

// ── Main Component ───────────────────────────────────────────────────────────

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const flurryIdRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [heartColorIndex, setHeartColorIndex] = useState(1); // Starts at White (like in screenshot)
  const [isHeartPopping, setIsHeartPopping] = useState(false);
  const [flurryHearts, setFlurryHearts] = useState<FlurryHeart[]>([]);

  const currentSong: Song | undefined = PLAYLIST[currentIndex];

  // ── Track loading ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.src = currentSong.src;
    audio.volume = isMuted ? 0 : volume;
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ── Play / pause sync ──────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying]);

  // ── Volume sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const playNext = useCallback(() => {
    if (isShuffled) {
      let next: number;
      do { next = Math.floor(Math.random() * PLAYLIST.length); }
      while (PLAYLIST.length > 1 && next === currentIndex);
      setCurrentIndex(next);
    } else {
      setCurrentIndex((i) => (i + 1) % Math.max(PLAYLIST.length, 1));
    }
  }, [isShuffled, currentIndex]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    // If more than 3 seconds in, restart current track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  }, []);

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      audioRef.current?.play();
    } else if (repeatMode === "all" || currentIndex < PLAYLIST.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, currentIndex, playNext]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  };

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      setIsMuted(false);
      if (volume === 0) setVolume(0.8);
    } else {
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const cycleRepeat = () => {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  };

  const effectiveVolume = isMuted ? 0 : volume;

  const renderVolumeIcon = () => {
    if (effectiveVolume === 0) {
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      );
    }
    if (effectiveVolume < 0.5) {
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 9v6h4l5 5V4L11 9H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
      );
    }
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    );
  };

  const currentHeart = HEART_ROULETTE[heartColorIndex];

  const handleHeartClick = () => {
    setHasInteracted(true);
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 350);

    // Roulette order: Purple -> White -> Yellow -> Blue -> Black -> ...
    const nextIndex = (heartColorIndex + 1) % HEART_ROULETTE.length;
    setHeartColorIndex(nextIndex);

    const theme = HEART_ROULETTE[nextIndex];

    // Spawn 36 flurry hearts across the screen
    const newHearts: FlurryHeart[] = Array.from({ length: 36 }, (_, i) => ({
      id: flurryIdRef.current++,
      emoji: theme.emojis[i % theme.emojis.length],
      left: 3 + Math.random() * 94,
      size: 1.3 + Math.random() * 1.5,
      duration: 1.8 + Math.random() * 1.4,
      delay: Math.random() * 0.45,
      rotation: (Math.random() - 0.5) * 60,
      drift: (Math.random() - 0.5) * 100,
    }));

    setFlurryHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFlurryHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      );
    }, 3800);
  };

  if (!currentSong) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* ── Spotify-style bottom bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-3 md:px-6 h-[66px] md:h-[88px] pb-[env(safe-area-inset-bottom,0px)]"
        style={{
          background: "linear-gradient(to bottom, rgba(44,10,70,0.97), rgba(30,5,50,0.99))",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(167,139,250,0.2)",
        }}
      >
        {/* Mobile top-edge progress scrubber (visible on < md) */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-white/15 cursor-pointer">
          <div
            className="h-full rounded-r-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #a855f7, #c084fc)",
              boxShadow: "0 0 6px rgba(192,132,252,0.8)",
            }}
          />
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              const audio = audioRef.current;
              if (audio && duration) {
                audio.currentTime = val;
                setCurrentTime(val);
                setProgress((val / duration) * 100);
              }
            }}
            className="absolute -top-2 left-0 h-5 w-full cursor-pointer opacity-0 z-30"
            aria-label="Seek track"
          />
        </div>

        {/* ── LEFT: Song info ── */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:basis-1/3 mr-2 md:mr-0">
          {/* Album art */}
          <div
            className="relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0 items-center justify-center rounded-lg shadow-lg"
            style={{
              background: "linear-gradient(135deg, #5b2d8e, #7c3aed)",
              boxShadow: isPlaying ? "0 0 16px rgba(124,58,237,0.6)" : "0 4px 10px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <span
              className={`text-lg sm:text-xl md:text-2xl ${isPlaying ? "animate-pulse" : ""}`}
              style={{ animationDuration: "1.5s" }}
            >
              🎵
            </span>
            {/* Vinyl spin ring */}
            {isPlaying && (
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  border: "2px solid rgba(196,181,253,0.4)",
                  animation: "spin 4s linear infinite",
                }}
              />
            )}
          </div>

          {/* Title + Artist */}
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-xs sm:text-sm font-semibold"
              style={{ color: "#e9d5ff" }}
            >
              {currentSong.title}
            </p>
            <p className="truncate text-[11px] sm:text-xs" style={{ color: "#a78bfa" }}>
              {currentSong.artist}
              <span className="md:hidden text-purple-200/60 font-mono text-[10px]">
                {" "}• {formatTime(currentTime)}
              </span>
            </p>
          </div>

          {/* Heart / like button with roulette colors and pop */}
          <button
            className={`flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full transition-transform hover:scale-125 active:scale-95 ${
              isHeartPopping ? "heart-pop" : ""
            }`}
            style={{
              filter: `drop-shadow(0 0 7px ${currentHeart.glow})`,
            }}
            aria-label={`Heart color: ${currentHeart.name}`}
            title={`Heart color: ${currentHeart.name} (Click for heart flurry & color roulette)`}
            onClick={handleHeartClick}
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200"
              viewBox="0 0 24 24"
              fill={currentHeart.fill}
              stroke={currentHeart.stroke}
              strokeWidth={currentHeart.strokeWidth}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* ── CENTER: Controls + progress (desktop: center column; mobile: right aligned controls) ── */}
        <div className="flex flex-shrink-0 md:flex-1 md:flex-col items-center gap-1 sm:gap-2 md:gap-1.5 md:basis-1/3">
          {/* Control buttons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffled((s) => !s)}
              className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                color: isShuffled ? "#c084fc" : "#7c6a9e",
                background: isShuffled ? "rgba(192, 132, 252, 0.18)" : "transparent",
                filter: isShuffled ? "drop-shadow(0 0 8px rgba(192, 132, 252, 0.75))" : "none",
              }}
              aria-label={isShuffled ? "Shuffle active" : "Shuffle inactive"}
              title={isShuffled ? "Shuffle: On (Active)" : "Shuffle: Off"}
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              {isShuffled && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]" />
              )}
            </button>

            {/* Prev */}
            <button
              onClick={playPrev}
              className="p-1 text-base sm:text-lg md:text-xl transition-all hover:scale-110 active:scale-95"
              style={{ color: "#c4b5fd" }}
              aria-label="Previous"
            >
              ⏮
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => { setHasInteracted(true); setIsPlaying((p) => !p); }}
              className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full font-bold text-white shadow-lg transition-all hover:scale-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                boxShadow: "0 4px 14px rgba(124,58,237,0.5)",
                fontSize: "0.95rem",
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="p-1 text-base sm:text-lg md:text-xl transition-all hover:scale-110 active:scale-95"
              style={{ color: "#c4b5fd" }}
              aria-label="Next"
            >
              ⏭
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                color: repeatMode !== "off" ? "#c084fc" : "#7c6a9e",
                background: repeatMode !== "off" ? "rgba(192, 132, 252, 0.18)" : "transparent",
                filter: repeatMode !== "off" ? "drop-shadow(0 0 8px rgba(192, 132, 252, 0.75))" : "none",
              }}
              aria-label="Repeat mode"
              title={repeatMode === "off" ? "Repeat: Off" : repeatMode === "all" ? "Repeat: All (Active)" : "Repeat: One (Active)"}
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              {repeatMode === "one" && (
                <span
                  className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#a855f7] text-[8px] font-black text-white shadow-sm"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  1
                </span>
              )}
              {repeatMode !== "off" && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]" />
              )}
            </button>
          </div>

          {/* Desktop Progress bar (hidden on mobile, mobile uses top-edge scrubber) */}
          <div className="hidden md:flex w-full max-w-sm items-center gap-2">
            <span
              className="w-9 text-right text-xs tabular-nums select-none"
              style={{
                color: "#9ca3af",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {formatTime(currentTime)}
            </span>
            <div className="group relative flex h-7 flex-1 items-center cursor-pointer">
              {/* Base track */}
              <div className="h-1 w-full rounded-full bg-white/20 relative overflow-hidden">
                {/* Filled portion */}
                <div
                  className="h-full rounded-full transition-all group-hover:bg-[#c084fc]"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(to right, #a855f7, #c084fc)",
                  }}
                />
              </div>
              {/* Thumb dot */}
              <div
                className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  left: `calc(${progress}% - 6px)`,
                }}
              />
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const audio = audioRef.current;
                  if (audio && duration) {
                    audio.currentTime = val;
                    setCurrentTime(val);
                    setProgress((val / duration) * 100);
                  }
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                aria-label="Seek track"
              />
            </div>
            <span
              className="w-9 text-xs tabular-nums select-none"
              style={{
                color: "#9ca3af",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Volume (Desktop only) ── */}
        <div className="hidden flex-1 items-center justify-end gap-2.5 md:flex md:basis-1/3">
          {/* Playlist track indicator */}
          {PLAYLIST.length > 1 && (
            <span
              className="text-xs tabular-nums select-none"
              style={{
                color: "#7c6a9e",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                marginRight: "4px",
              }}
            >
              {currentIndex + 1} / {PLAYLIST.length}
            </span>
          )}

          {/* Volume icon (click to mute) */}
          <button
            onClick={toggleMute}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:text-white"
            style={{ color: "#c4b5fd" }}
            aria-label={isMuted || effectiveVolume === 0 ? "Unmute" : "Mute"}
          >
            {renderVolumeIcon()}
          </button>

          {/* Volume slider container */}
          <div className="group relative flex h-7 w-24 items-center cursor-pointer">
            {/* Base track */}
            <div className="h-1 w-full rounded-full bg-white/20 relative overflow-hidden">
              {/* Filled portion — tracks volume exactly */}
              <div
                className="h-full rounded-full transition-colors group-hover:bg-[#c084fc]"
                style={{
                  width: `${effectiveVolume * 100}%`,
                  background: "linear-gradient(to right, #a855f7, #c084fc)",
                }}
              />
            </div>

            {/* Thumb dot — centered on track and aligned with fill */}
            <div
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md transition-all group-hover:scale-110"
              style={{
                left: `calc(${effectiveVolume * 100}% - 6px)`,
              }}
            />

            {/* Native range input on top for smooth dragging */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effectiveVolume}
              onChange={handleVolumeChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* ── Flurry of Hearts Overlay ── */}
      {flurryHearts.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {flurryHearts.map((heart) => (
            <span
              key={heart.id}
              className="flurry-heart"
              style={{
                left: `${heart.left}%`,
                fontSize: `${heart.size}rem`,
                animationDuration: `${heart.duration}s`,
                animationDelay: `${heart.delay}s`,
                ["--drift" as string]: `${heart.drift}px`,
                ["--rot" as string]: `${heart.rotation}deg`,
              }}
            >
              {heart.emoji}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
