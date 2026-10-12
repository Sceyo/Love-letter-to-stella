"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ALBUM_PAGES, COVER_CONFIG, FINALE_CONFIG, type AlbumPage } from "./albumConfig";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Determine if an image path is a placeholder (not a real file yet) */
const isPlaceholder = (src: string) => src.includes("placeholder");

// ── Sub-components ───────────────────────────────────────────────────────────

/** The hardcover book spine + cover (always visible on the left) */
function AlbumCover({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const showEmoji = isPlaceholder(COVER_CONFIG.coverImage) || imgError;

  return (
    <div
      onClick={!isOpen ? onOpen : undefined}
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        background: "linear-gradient(135deg, #3b1054 0%, #5b2d8e 40%, #7c3aed 100%)",
        borderRadius: "4px 0 0 4px",
        boxShadow: isOpen ? "none" : "-6px 6px 24px rgba(0,0,0,0.5)",
        transition: "box-shadow 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* Decorative border inset */}
      <div
        style={{
          position: "absolute",
          inset: "12px",
          border: "2px solid rgba(196,181,253,0.45)",
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      />

      {/* Cover content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(6px, 1.8vw, 12px)",
          padding: "clamp(12px, 3.5vw, 24px)",
          textAlign: "center",
        }}
      >
        {/* Circle photo */}
        <div
          style={{
            position: "relative",
            width: "clamp(95px, 26vw, 140px)",
            height: "clamp(95px, 26vw, 140px)",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            border: "4px solid rgba(196,181,253,0.5)",
            flexShrink: 0,
            background: "rgba(124,58,237,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showEmoji ? (
            <span style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>💜</span>
          ) : (
            <Image
              src={COVER_CONFIG.coverImage}
              alt="Cover photo"
              fill
              className="object-cover"
              sizes="144px"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <h2
          style={{
            fontFamily: "Dancing Script, cursive",
            fontSize: "clamp(1.15rem, 4vw, 1.65rem)",
            fontWeight: "bold",
            color: "#e9d5ff",
            lineHeight: 1.25,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            maxWidth: "100%",
            padding: "0 4px",
            wordBreak: "break-word",
          }}
        >
          {COVER_CONFIG.title}
        </h2>
        <p
          style={{
            fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
            color: "rgba(233,213,255,0.9)",
            letterSpacing: "0.02em",
          }}
        >
          {COVER_CONFIG.names}
        </p>
        <p
          style={{
            fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
            color: "rgba(233,213,255,0.7)",
            letterSpacing: "0.05em",
          }}
        >
          {COVER_CONFIG.date}
        </p>

        {!isOpen && (
          <p
            style={{
              marginTop: "12px",
              fontSize: "0.8rem",
              color: "rgba(233,213,255,0.75)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            Open me 📖
          </p>
        )}
      </div>
    </div>
  );
}


/** A single photo page (right side of spread) */
function PhotoPage({ page }: { page: AlbumPage }) {
  const [imgError, setImgError] = useState(false);
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-stone-50 select-none">
      {/* Photo or flipped note area */}
      <div className="relative flex-1 bg-stone-100">
        {showNote && page.story ? (
          <div
            className="flex h-full w-full flex-col justify-between p-3.5 sm:p-5 text-center overflow-y-auto"
            style={{
              background: "linear-gradient(135deg, #fdfaf6 0%, #f7f1e6 100%)",
            }}
          >
            <div className="flex items-center justify-between text-xs border-b border-purple-200/50 pb-1.5 sm:pb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-purple-700">✍️ Memory Note</span>
              {page.date && (
                <span className="rounded-full bg-purple-100/70 px-2 py-0.5 text-[10px] sm:text-xs text-purple-800">
                  {page.date}
                </span>
              )}
            </div>
            <p
              className="my-auto text-xs sm:text-lg leading-relaxed py-1"
              style={{
                fontFamily: "Dancing Script, cursive",
                color: "#4a154b",
                lineHeight: "1.6",
              }}
            >
              &ldquo;{page.story}&rdquo;
            </p>
            <span className="text-[10px] sm:text-xs italic text-purple-400 border-t border-purple-200/40 pt-1.5 sm:pt-2">
              Always with you 💕
            </span>
          </div>
        ) : !imgError && !isPlaceholder(page.image) ? (
          <Image
            src={page.image}
            alt={page.caption}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImgError(true)}
          />
        ) : (
          // Placeholder when no real photo yet
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-stone-300">
            <span className="text-7xl">📷</span>
            <span className="text-sm">Add your photo here</span>
            <code className="mt-1 rounded bg-stone-200 px-2 py-0.5 text-xs text-stone-400">
              {page.image}
            </code>
          </div>
        )}

        {/* Vignette overlay */}
        {!showNote && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        )}
      </div>

      {/* Caption strip */}
      <div
        className="flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 sm:gap-1 sm:px-4 sm:py-2.5 text-center flex-shrink-0"
        style={{
          background: "linear-gradient(to bottom, #fdf4ff, #f3e8ff)",
          borderTop: "1px solid rgba(167,139,250,0.25)",
        }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {page.date && (
            <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase truncate max-w-[120px]" style={{ color: "#9b6bbf" }}>
              {page.date}
            </span>
          )}
          {page.story && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNote((s) => !s);
              }}
              className="rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold transition-all hover:scale-105"
              style={{
                background: showNote ? "#7c3aed" : "rgba(168,85,247,0.18)",
                color: showNote ? "#ffffff" : "#6d28d9",
              }}
              title="Flip between photo and handwritten note"
            >
              {showNote ? "🖼️ Photo" : "✍️ Note"}
            </button>
          )}
        </div>
        <p
          className="text-xs sm:text-base italic line-clamp-2"
          style={{ fontFamily: "Dancing Script, cursive", color: "#5b2d8e" }}
        >
          {page.caption}
        </p>
      </div>

      {/* Paper texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23d4a' opacity='0.1'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23888'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/** Handwritten story / love letter on the back of an album leaf */
function StoryPage({
  page,
  pageNumber,
}: {
  page: AlbumPage;
  pageNumber: number;
}) {
  const storyText =
    page.story ||
    "Every moment with you is a memory I hold close to my heart. From the little laughs to the big adventures, thank you for being the most wonderful part of my life... 💕";

  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-3 select-none sm:p-7"
      style={{
        background: "linear-gradient(145deg, #fdfbf7 0%, #f6efe4 100%)",
        borderRadius: "4px 0 0 4px",
        boxShadow: "inset 0 0 40px rgba(124, 58, 237, 0.04)",
      }}
    >
      {/* Decorative vintage washi tape in top right */}
      <div
        className="absolute top-2 right-2 h-2.5 w-10 -rotate-12 rounded-sm shadow-sm pointer-events-none opacity-40 sm:top-3 sm:right-3 sm:h-3.5 sm:w-14 sm:opacity-90"
        style={{
          background: "rgba(192, 132, 252, 0.4)",
          backdropFilter: "blur(2px)",
          border: "1px dashed rgba(168, 85, 247, 0.4)",
        }}
      />

      {/* Crease shadow near spine (right edge of left page) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, rgba(0,0,0,0.14), transparent)",
        }}
      />

      {/* Top Header: Memory note indicator & Date */}
      <div className="relative z-10 flex items-center justify-between gap-1 border-b border-purple-200/60 pb-1.5 sm:pb-2.5">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-xs sm:text-sm">✍️</span>
          <span
            className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase truncate"
            style={{ color: "#7c3aed" }}
          >
            A Little Note
          </span>
        </div>
        {page.date && (
          <span
            className="rounded-full px-2 py-0.5 text-[9px] sm:text-[11px] font-medium truncate max-w-[50%]"
            style={{
              background: "rgba(192, 132, 252, 0.2)",
              color: "#6b21a8",
            }}
          >
            {page.date}
          </span>
        )}
      </div>

      {/* Center handwritten text */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-1 py-1 sm:px-2 sm:py-3 text-center overflow-y-auto max-h-full">
        <p
          className="text-xs sm:text-lg leading-relaxed"
          style={{
            fontFamily: "Dancing Script, cursive",
            color: "#4a154b",
            lineHeight: "1.6",
            textShadow: "0 1px 2px rgba(255,255,255,0.7)",
          }}
        >
          &ldquo;{storyText}&rdquo;
        </p>
        <div
          className="mt-2 sm:mt-3.5 h-px w-16 sm:w-20"
          style={{
            background:
              "linear-gradient(to right, transparent, #c084fc, transparent)",
          }}
        />
        <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs italic text-purple-400">
          {page.caption}
        </span>
      </div>

      {/* Bottom signature & page indicator */}
      <div className="relative z-10 flex items-center justify-between pt-1.5 sm:pt-2.5 text-xs border-t border-purple-200/50">
        <span
          className="text-xs sm:text-sm font-bold text-purple-600 truncate"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          Always with you 💕
        </span>
        <span className="text-[10px] sm:text-[11px] text-purple-400 flex-shrink-0">
          Memory #{pageNumber}
        </span>
      </div>
    </div>
  );
}

/** Particle data for finale heart explosion */
interface ExplosionParticle {
  id: number;
  type: "burst" | "rain";
  isEmoji: boolean;
  emoji?: string;
  color?: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  drift: number;
  fall: number;
  size: number;
  width: number;
  height: number;
  rotMid: string;
  rotEnd: string;
  duration: number;
  delay: number;
}

/** The finale / inside back cover page */
function FinalPage({
  onBackToCover,
  onHeartExplode,
  isHeartExploding,
  showShockwave,
}: {
  onBackToCover: () => void;
  onHeartExplode: (originX: number, originY: number) => void;
  isHeartExploding: boolean;
  showShockwave: boolean;
}) {
  const badge = FINALE_CONFIG.badge || "✨ To Be Continued";
  const date = FINALE_CONFIG.date || COVER_CONFIG.date;
  const title = FINALE_CONFIG.title || "Our Story Continues...";
  const message =
    FINALE_CONFIG.message ||
    "Every page here is a piece of my heart with you. Thank you for 7 beautiful years, Lang. Here's to a lifetime more of memories, laughter, and love.";
  const signature = FINALE_CONFIG.signature || COVER_CONFIG.names;
  const buttonText = FINALE_CONFIG.closeButtonText || "Close Album";

  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-3.5 select-none sm:p-7 text-center"
      style={{
        background: "linear-gradient(135deg, #fdfaf6 0%, #f5eefb 50%, #ede9fe 100%)",
        borderRadius: "0 4px 4px 0",
      }}
    >
      {/* Decorative subtle corner border */}
      <div
        className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded"
        style={{
          border: "1.5px solid rgba(192, 132, 252, 0.35)",
        }}
      />

      {/* Crease shadow near spine (left edge of right page) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.12), transparent)",
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-purple-200/50 pb-1.5 sm:pb-2.5">
        <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-purple-600">
          {badge}
        </span>
        {date && (
          <span
            className="rounded-full px-2 py-0.5 text-[9px] sm:text-[11px] font-medium"
            style={{
              background: "rgba(192, 132, 252, 0.2)",
              color: "#6b21a8",
            }}
          >
            {date}
          </span>
        )}
      </div>

      {/* Center Romantic Message */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-1 py-1.5 sm:px-2 sm:py-3 overflow-y-auto max-h-full">
        <div className="relative mb-1 sm:mb-2 flex flex-col items-center">
          {/* Shockwave ring on explode */}
          {showShockwave && <div className="heart-shockwave" />}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const originX = rect.left + rect.width / 2;
              const originY = rect.top + rect.height / 2;
              onHeartExplode(originX, originY);
            }}
            className={`group relative text-3xl sm:text-4xl select-none transition-transform cursor-pointer focus:outline-none ${
              isHeartExploding
                ? "heart-exploding"
                : "heart-beat-idle hover:scale-125 active:scale-95"
            }`}
            style={{
              filter: "drop-shadow(0 4px 14px rgba(124, 58, 237, 0.45))",
            }}
            title="Tap for magic! 💜✨"
            aria-label="Click to fill pages with hearts and confetti"
          >
            💜
          </button>

          {/* Interactive invitation badge */}
          <span
            className="mt-0.5 sm:mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-medium tracking-wide text-purple-600 transition-opacity"
            style={{
              background: "rgba(192, 132, 252, 0.2)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            tap me ✨
          </span>
        </div>
        <h3
          className="text-lg sm:text-2xl font-bold"
          style={{
            fontFamily: "Dancing Script, cursive",
            color: "#4a154b",
          }}
        >
          {title}
        </h3>
        <p
          className="mt-1.5 sm:mt-3 text-xs sm:text-base leading-relaxed text-purple-900/80 max-w-[280px]"
          style={{
            fontFamily: "Dancing Script, cursive",
            fontSize: "clamp(0.85rem, 2.5vw, 1.2rem)",
            lineHeight: "1.55",
          }}
        >
          {message}
        </p>

        <div
          className="mt-2 sm:mt-3 h-px w-20 sm:w-24"
          style={{
            background: "linear-gradient(to right, transparent, #c084fc, transparent)",
          }}
        />

        {signature && (
          <p
            className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-semibold tracking-wide"
            style={{ color: "#7c3aed" }}
          >
            {signature}
          </p>
        )}
      </div>

      {/* Bottom Action: Close Album Button */}
      <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-2 border-t border-purple-200/50 pt-2 sm:pt-3">
        <button
          onClick={onBackToCover}
          className="group flex items-center gap-1.5 sm:gap-2 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            boxShadow: "0 4px 14px rgba(109, 40, 217, 0.35)",
          }}
        >
          <span>📕</span>
          <span>{buttonText}</span>
        </button>
        <span className="text-[9px] sm:text-[10px] text-purple-400">
          or flip ‹ to re-read our memories
        </span>
      </div>

      {/* Paper texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23d4a' opacity='0.1'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23888'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/** Navigation arrows */
function NavButton({
  direction,
  onClick,
  disabled,
  label,
  title,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label?: string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 text-lg sm:text-xl shadow-lg backdrop-blur transition-all hover:scale-110 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ color: "#6d28d9" }}
      aria-label={title || (direction === "prev" ? "Previous page" : "Next page")}
      title={title}
    >
      {label || (direction === "prev" ? "‹" : "›")}
    </button>
  );
}

// ── Main Album Component ─────────────────────────────────────────────────────

export default function PhotoAlbum() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // which page is shown
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const totalPages = ALBUM_PAGES.length;
  const currentPage = ALBUM_PAGES[pageIndex];

  // ── Finale Heart Explosion & Confetti state ──
  const burstIdRef = useRef(0);
  const [explosionParticles, setExplosionParticles] = useState<ExplosionParticle[]>([]);
  const [isHeartExploding, setIsHeartExploding] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);

  const triggerExplosion = useCallback((originX?: number, originY?: number) => {
    setIsHeartExploding(true);
    setShowShockwave(true);
    setTimeout(() => setShowShockwave(false), 750);
    setTimeout(() => setIsHeartExploding(false), 750);

    const heartEmojis = [
      "💜", "💖", "💕", "💗", "💓", "✨", "🌸", "⭐", "🎉", "🥰", "💌", "💞", "💘"
    ];
    const confettiColors = [
      "#7c3aed", "#9333ea", "#a855f7", "#c084fc",
      "#ec4899", "#f43f5e", "#f472b6", "#fbbf24",
      "#f59e0b", "#e9d5ff", "#ffffff"
    ];

    const cx = originX ?? (typeof window !== "undefined" ? window.innerWidth * 0.65 : 500);
    const cy = originY ?? (typeof window !== "undefined" ? window.innerHeight * 0.45 : 350);

    const newParticles: ExplosionParticle[] = [];

    // 1. Radial Burst from the Heart (55 particles shooting across both pages)
    for (let i = 0; i < 55; i++) {
      const angle = (Math.PI * 2 * i) / 55 + (Math.random() - 0.5) * 0.35;
      const distance = 160 + Math.random() * 440;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - (Math.random() * 110 + 30);
      const isEmoji = Math.random() > 0.45;

      newParticles.push({
        id: burstIdRef.current++,
        type: "burst",
        isEmoji,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        x: cx,
        y: cy,
        dx,
        dy,
        drift: (Math.random() - 0.5) * 140,
        fall: 180 + Math.random() * 260,
        size: isEmoji ? 1.1 + Math.random() * 1.5 : 8 + Math.random() * 10,
        width: 8 + Math.random() * 10,
        height: 12 + Math.random() * 14,
        rotMid: `${(Math.random() - 0.5) * 360}deg`,
        rotEnd: `${(Math.random() - 0.5) * 720}deg`,
        duration: 2.6 + Math.random() * 1.6,
        delay: Math.random() * 0.12,
      });
    }

    // 2. Cascade Rain across the open album & screen (40 particles)
    for (let i = 0; i < 40; i++) {
      const isEmoji = Math.random() > 0.45;
      newParticles.push({
        id: burstIdRef.current++,
        type: "rain",
        isEmoji,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        x: Math.random() * 100,
        y: 0,
        dx: 0,
        dy: 0,
        drift: (Math.random() - 0.5) * 180,
        fall: 0,
        size: isEmoji ? 1.2 + Math.random() * 1.4 : 7 + Math.random() * 9,
        width: 7 + Math.random() * 9,
        height: 12 + Math.random() * 16,
        rotMid: "0deg",
        rotEnd: `${(Math.random() - 0.5) * 720}deg`,
        duration: 2.8 + Math.random() * 1.8,
        delay: Math.random() * 0.5,
      });
    }

    setExplosionParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setExplosionParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 4800);
  }, []);

  const closeAlbum = useCallback(() => {
    if (!isOpen || isFlipping) return;
    setIsFlipping(true);
    setIsOpen(false);
    setTimeout(() => {
      setPageIndex(0);
      setIsFlipping(false);
      setFlipDirection("next");
    }, 700);
  }, [isOpen, isFlipping]);

  const flip = useCallback(
    (direction: "next" | "prev") => {
      if (isFlipping) return;

      // When at the final page, Next closes the book
      if (direction === "next" && pageIndex >= totalPages) {
        closeAlbum();
        return;
      }

      // When at cover or first page, Prev closes the book back to cover
      if (direction === "prev" && pageIndex <= 0 && isOpen) {
        closeAlbum();
        return;
      }

      const nextIdx = direction === "next" ? pageIndex + 1 : pageIndex - 1;
      setTargetIndex(nextIdx);
      setFlipDirection(direction);
      setIsFlipping(true);

      setTimeout(() => {
        setPageIndex(nextIdx);
        setIsFlipping(false);
        setTargetIndex(null);
      }, 850);
    },
    [isFlipping, pageIndex, totalPages, isOpen, closeAlbum]
  );

  const openAlbum = useCallback(() => {
    if (isOpen) return;
    setFlipDirection("next");
    setIsFlipping(true);
    setTimeout(() => {
      setIsOpen(true);
      setPageIndex(0);
      setIsFlipping(false);
    }, 700);
  }, [isOpen]);

  const displayLeftIndex =
    isFlipping && flipDirection === "prev" && targetIndex !== null
      ? targetIndex
      : pageIndex;

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* ── Book container ── */}
      <div
        className="album-book relative"
        style={{
          width: isOpen ? "clamp(330px, 95vw, 760px)" : "clamp(280px, 86vw, 360px)",
          height: "clamp(385px, 115vw, 530px)",
          perspective: "2200px",
          transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Shadow under book */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "80%",
            height: "20px",
            background: "rgba(0,0,0,0.25)",
            filter: "blur(10px)",
          }}
        />

        {/* Book wrapper with 3D */}
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* ── Left side: cover on page 0, previous page's handwritten story on page > 0 ── */}
          <div
            className={`absolute left-0 top-0 h-full overflow-hidden ${
              isOpen && !isFlipping ? "cursor-pointer" : ""
            }`}
            style={{
              width: isOpen ? "50%" : "100%",
              transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: isOpen ? "4px 0 0 4px" : "4px 8px 8px 4px",
              zIndex: 2,
              boxShadow: isOpen
                ? "inset -4px 0 12px rgba(0,0,0,0.2)"
                : "0 8px 32px rgba(0,0,0,0.35)",
            }}
            onClick={
              isOpen && !isFlipping
                ? () => flip("prev")
                : undefined
            }
            title={
              isOpen && !isFlipping
                ? pageIndex <= 0
                  ? "Click to close album"
                  : "Click to flip back"
                : undefined
            }
          >
            {displayLeftIndex === 0 ? (
              <AlbumCover isOpen={isOpen} onOpen={openAlbum} />
            ) : (
              ALBUM_PAGES[displayLeftIndex - 1] && (
                <StoryPage
                  page={ALBUM_PAGES[displayLeftIndex - 1]}
                  pageNumber={displayLeftIndex}
                />
              )
            )}
          </div>

          {/* ── Right side: static base layer (underneath) ── */}
          {isOpen && (
            <div
              className={`absolute right-0 top-0 h-full overflow-hidden ${
                !isFlipping && pageIndex < totalPages ? "cursor-pointer" : ""
              }`}
              style={{
                width: "50%",
                borderRadius: "0 4px 4px 0",
                boxShadow: "4px 0 12px rgba(0,0,0,0.15)",
                zIndex: 1,
              }}
              onClick={
                !isFlipping && pageIndex < totalPages
                  ? () => flip("next")
                  : undefined
              }
              title={
                !isFlipping && pageIndex < totalPages
                  ? "Click to flip page"
                  : undefined
              }
            >
              {/* Show target page during Next flip, current page otherwise */}
              {isFlipping && flipDirection === "next" && targetIndex !== null ? (
                <div className="relative h-full w-full">
                  {targetIndex >= totalPages ? (
                    <FinalPage
                      onBackToCover={closeAlbum}
                      onHeartExplode={triggerExplosion}
                      isHeartExploding={isHeartExploding}
                      showShockwave={showShockwave}
                    />
                  ) : (
                    ALBUM_PAGES[targetIndex] && (
                      <PhotoPage page={ALBUM_PAGES[targetIndex]} />
                    )
                  )}
                  {/* Shadow that melts away as top leaf lifts */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      animation: "pageUnderlayShadow 0.85s ease-out forwards",
                    }}
                  />
                </div>
              ) : pageIndex >= totalPages ? (
                <FinalPage
                  onBackToCover={closeAlbum}
                  onHeartExplode={triggerExplosion}
                  isHeartExploding={isHeartExploding}
                  showShockwave={showShockwave}
                />
              ) : (
                currentPage && <PhotoPage page={currentPage} />
              )}
            </div>
          )}

          {/* ── 3D Turning Leaf: actual 180-degree flip ── */}
          {isOpen && isFlipping && targetIndex !== null && (
            <div
              className="absolute right-0 top-0 h-full pointer-events-none"
              style={{
                width: "50%",
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                zIndex: 25,
                animation:
                  flipDirection === "next"
                    ? "realisticPageFlipNext 0.85s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                    : "realisticPageFlipPrev 0.85s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              }}
            >
              {/* Front Face (visible from 0deg to -90deg) */}
              <div
                className="absolute inset-0 h-full w-full overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                {flipDirection === "next" ? (
                  ALBUM_PAGES[pageIndex] && (
                    <PhotoPage page={ALBUM_PAGES[pageIndex]} />
                  )
                ) : (
                  ALBUM_PAGES[targetIndex] && (
                    <PhotoPage page={ALBUM_PAGES[targetIndex]} />
                  )
                )}
                {/* Dynamic lighting shadow sweep */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.1) 40%, transparent)",
                    animation: "pageTurnShadow 0.85s ease-in-out forwards",
                  }}
                />
              </div>

              {/* Back Face (visible from -90deg to -180deg) */}
              <div
                className="absolute inset-0 h-full w-full overflow-hidden"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  borderRadius: "4px 0 0 4px",
                }}
              >
                {flipDirection === "next" ? (
                  ALBUM_PAGES[pageIndex] && (
                    <StoryPage
                      page={ALBUM_PAGES[pageIndex]}
                      pageNumber={pageIndex + 1}
                    />
                  )
                ) : (
                  ALBUM_PAGES[targetIndex] && (
                    <StoryPage
                      page={ALBUM_PAGES[targetIndex]}
                      pageNumber={targetIndex + 1}
                    />
                  )
                )}
                {/* Dynamic lighting shadow sweep on back */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(0,0,0,0.45), rgba(0,0,0,0.1) 40%, transparent)",
                    animation: "pageTurnShadow 0.85s ease-in-out forwards",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Book spine: sits at left hinge when closed, center crease when open ── */}
          <div
            className="absolute top-0 h-full pointer-events-none"
            style={{
              left: isOpen ? "calc(50% - 8px)" : "0px",
              width: isOpen ? "16px" : "10px",
              borderRadius: isOpen ? "0" : "4px 0 0 4px",
              background: isOpen
                ? "linear-gradient(to right, #3b1054, #5b2d8e, #3b1054)"
                : "linear-gradient(to right, rgba(44,10,70,0.85), rgba(91,45,142,0.4), transparent)",
              boxShadow: isOpen ? "0 0 8px rgba(0,0,0,0.4)" : "inset -2px 0 4px rgba(0,0,0,0.25)",
              transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 35,
            }}
          />
        </div>
      </div>

      {/* ── Navigation ── */}
      {isOpen && (
        <div className="flex items-center gap-3 sm:gap-6">
          <NavButton
            direction="prev"
            onClick={() => flip("prev")}
            disabled={isFlipping}
            title={pageIndex <= 0 ? "Close album" : "Previous page"}
          />
          <span
            className="min-w-[80px] sm:min-w-[90px] text-center text-xs sm:text-sm font-medium"
            style={{ color: "rgba(109,40,217,0.85)" }}
          >
            {pageIndex < totalPages ? `${pageIndex + 1} / ${totalPages}` : "Finale 💕"}
          </span>
          <NavButton
            direction="next"
            onClick={() => flip("next")}
            disabled={isFlipping}
            label={pageIndex >= totalPages ? "📕" : "›"}
            title={pageIndex >= totalPages ? "Close album" : "Next page"}
          />
        </div>
      )}

      {/* ── Page hint dots ── */}
      {isOpen && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center max-w-[94vw] gap-1 sm:gap-1.5 px-2">
          {ALBUM_PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isFlipping && i !== pageIndex) {
                  setFlipDirection(i > pageIndex ? "next" : "prev");
                  setIsFlipping(true);
                  setTimeout(() => {
                    setPageIndex(i);
                    setIsFlipping(false);
                  }, 400);
                }
              }}
              className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all"
              style={{
                background: i === pageIndex ? "#6d28d9" : "#c4b5fd",
                transform: i === pageIndex ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
          {/* Finale page indicator */}
          <button
            onClick={() => {
              if (!isFlipping && pageIndex !== totalPages) {
                setFlipDirection("next");
                setIsFlipping(true);
                setTimeout(() => {
                  setPageIndex(totalPages);
                  setIsFlipping(false);
                }, 400);
              }
            }}
            className="flex items-center justify-center text-[10px] sm:text-xs transition-all hover:scale-125 ml-0.5"
            style={{
              opacity: pageIndex === totalPages ? 1 : 0.45,
              transform: pageIndex === totalPages ? "scale(1.3)" : "scale(1)",
            }}
            title="Finale"
            aria-label="Go to final page"
          >
            💖
          </button>
        </div>
      )}

      {/* ── Finale Heart Explosion & Confetti Overlay ── */}
      {explosionParticles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          {explosionParticles.map((particle) => (
            <div
              key={particle.id}
              className={
                particle.type === "burst"
                  ? "explosion-particle"
                  : "confetti-rain"
              }
              style={{
                left:
                  particle.type === "burst"
                    ? `${particle.x}px`
                    : `${particle.x}vw`,
                top:
                  particle.type === "burst" ? `${particle.y}px` : `-25px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
                ["--dx" as string]: `${particle.dx}px`,
                ["--dy" as string]: `${particle.dy}px`,
                ["--drift" as string]: `${particle.drift}px`,
                ["--fall" as string]: `${particle.fall}px`,
                ["--rot-mid" as string]: particle.rotMid,
                ["--rot-end" as string]: particle.rotEnd,
              }}
            >
              {particle.isEmoji ? (
                <span
                  style={{
                    fontSize: `${particle.size}rem`,
                    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
                  }}
                >
                  {particle.emoji}
                </span>
              ) : (
                <div
                  className="rounded-sm"
                  style={{
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 8px ${particle.color}`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
