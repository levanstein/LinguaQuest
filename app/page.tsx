"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "mission" | "ready">("intro");
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("mission"), 1800);
    const t2 = setTimeout(() => setPhase("ready"), 4500);

    const tryPlay = () => {
      if (musicRef.current && musicRef.current.paused) {
        musicRef.current.volume = 0.15;
        musicRef.current.loop = true;
        musicRef.current.play().catch(() => {});
      }
    };
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("mousemove", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("mousemove", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      <audio ref={musicRef} src="/audio/music/istanbul-ambient.mp3" preload="metadata" />

      {/* Atmospheric background layers */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, oklch(0.12 0.008 75) 0%, oklch(0.15 0.03 75) 45%, oklch(0.18 0.06 60) 65%, oklch(0.14 0.02 75) 85%, oklch(0.10 0.008 75) 100%)",
      }} />

      {/* Skyline — slightly larger, more atmospheric */}
      <div className="absolute bottom-[22%] left-0 right-0 h-[160px]" style={{ opacity: 0.15 }}>
        <svg viewBox="0 0 480 160" className="w-full h-full" style={{ fill: "oklch(0.78 0.17 75)" }}>
          <path d="M180,160 L180,90 Q220,35 260,90 L260,160Z" />
          <rect x="165" y="55" width="6" height="105" />
          <rect x="269" y="55" width="6" height="105" />
          <rect x="20" y="100" width="40" height="60" />
          <rect x="70" y="82" width="35" height="78" />
          <rect x="115" y="92" width="30" height="68" />
          <rect x="300" y="88" width="35" height="72" />
          <rect x="345" y="76" width="40" height="84" />
          <rect x="395" y="92" width="35" height="68" />
          <rect x="440" y="82" width="40" height="78" />
          <path d="M0,135 Q120,118 240,125 Q360,118 480,135" fill="none" stroke="oklch(0.78 0.17 75)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="max-w-[340px] w-full">
          {/* Phase 1: City name — big, confident */}
          <div className="text-center mb-2">
            <p
              className="game-label mb-4"
              style={{ opacity: phase === "intro" ? 0.8 : 0.4, transition: "opacity 0.8s" }}
            >
              LinguaQuest
            </p>

            <h1
              className="scene-enter font-[var(--font-display)] font-bold tracking-wide mb-1"
              style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", color: "oklch(0.78 0.17 75)" }}
            >
              Istanbul
            </h1>
            <p style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.85rem" }}>Turkey</p>
          </div>

          {/* Phase 2: Mission card */}
          <div
            className="mt-6"
            style={{
              opacity: phase !== "intro" ? 1 : 0,
              transform: phase !== "intro" ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="rounded-2xl p-5 mb-5 text-left"
              style={{
                background: "oklch(0.17 0.01 75)",
                border: "1px solid oklch(0.24 0.02 75)",
              }}
            >
              <p className="game-label mb-3">Your Mission</p>
              <p className="font-[var(--font-story)] text-base leading-relaxed mb-3" style={{ color: "oklch(0.95 0.005 75)" }}>
                Find the hidden bookshop in Sultanahmet before sunset.
              </p>
              <p style={{ color: "oklch(0.55 0.01 75)", fontSize: "0.85rem", lineHeight: "1.6" }}>
                Talk to 3 locals who weave Turkish words into their stories. Listen carefully. The answers are in the tales they tell.
              </p>
            </div>

            {/* Game stats row */}
            <div className="flex justify-between px-2 mb-6">
              {[
                { value: "3", label: "Stories" },
                { value: "15", label: "Words" },
                { value: "3", label: "Mysteries" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="game-stat">{stat.value}</p>
                  <p style={{ color: "oklch(0.45 0.01 75)", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginTop: "2px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: CTA */}
          <div
            style={{
              opacity: phase === "ready" ? 1 : 0,
              transform: phase === "ready" ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <button
              onClick={() => router.push("/play/istanbul")}
              className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all min-h-[48px]"
              style={{
                background: "oklch(0.78 0.17 75)",
                color: "oklch(0.15 0.02 75)",
                boxShadow: "0 4px 24px oklch(0.78 0.17 75 / 0.2)",
              }}
            >
              Begin Your Quest
            </button>
            <p className="text-center mt-4" style={{ color: "oklch(0.40 0.01 75)", fontSize: "0.7rem" }}>
              ~5 minutes · headphones recommended
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
