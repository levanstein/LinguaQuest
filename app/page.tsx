"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "mission" | "ready">("intro");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("mission"), 2000);
    const t2 = setTimeout(() => setPhase("ready"), 5000);

    // Try to play music on any user interaction (autoplay policy)
    const tryPlay = () => {
      if (musicRef.current && musicRef.current.paused) {
        musicRef.current.volume = 0.2;
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

  const handleBegin = () => {
    // Unlock audio context on user gesture
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    router.push("/play/istanbul");
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <audio ref={audioRef} src="/audio/sfx/istanbul-arrival.mp3" preload="metadata" />
      <audio ref={musicRef} src="/audio/music/istanbul-ambient.mp3" preload="metadata" />

      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0F0F0F 0%, #1a1205 40%, #2d1d0a 60%, #1a1205 80%, #0F0F0F 100%)",
        }}
      />

      {/* Skyline silhouette */}
      <div className="absolute bottom-[25%] left-0 right-0 h-[140px] opacity-20">
        <svg viewBox="0 0 480 140" fill="var(--color-amber)" className="w-full h-full">
          {/* Mosque dome */}
          <path d="M180,140 L180,80 Q220,30 260,80 L260,140Z" />
          {/* Minarets */}
          <rect x="165" y="50" width="6" height="90" />
          <rect x="269" y="50" width="6" height="90" />
          {/* Buildings */}
          <rect x="20" y="90" width="40" height="50" />
          <rect x="70" y="75" width="35" height="65" />
          <rect x="115" y="85" width="30" height="55" />
          <rect x="300" y="80" width="35" height="60" />
          <rect x="345" y="70" width="40" height="70" />
          <rect x="395" y="85" width="35" height="55" />
          <rect x="440" y="75" width="40" height="65" />
          {/* Bridge */}
          <path d="M0,120 Q120,105 240,110 Q360,105 480,120" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content — cinematic sequence */}
      <div className="relative z-10 max-w-[340px]">
        {/* Phase 1: City reveal */}
        <div className={`transition-all duration-1000 ${phase === "intro" ? "opacity-100" : "opacity-100"}`}>
          <p className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-4 transition-opacity duration-1000"
             style={{ opacity: phase === "intro" ? 1 : 0.4 }}>
            Language Quest
          </p>

          <h1 className="text-5xl font-bold text-amber mb-1 tracking-wide font-display scene-enter">
            ISTANBUL
          </h1>
          <p className="text-neutral-400 text-sm mb-6">Turkey</p>
        </div>

        {/* Phase 2: Mission briefing */}
        <div className={`transition-all duration-700 ${phase !== "intro" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-12 h-px bg-amber/30 mx-auto mb-6" />

          <div className="bg-surface/50 border border-border/50 rounded-xl p-5 mb-6 backdrop-blur-sm text-left">
            <p className="text-xs text-amber font-semibold tracking-widest uppercase mb-3">
              Your Mission
            </p>
            <p className="text-white text-base leading-relaxed font-display mb-3">
              Find the hidden bookshop in Sultanahmet before sunset.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Talk to 3 locals who mix Turkish into their English. Learn their words. Pass their quizzes. Each encounter gets harder, the Turkish deeper.
            </p>
          </div>

          {/* Mission details */}
          <div className="flex justify-center gap-6 mb-6 text-xs text-neutral-500">
            <div className="flex flex-col items-center gap-1">
              <span className="text-amber text-lg">3</span>
              <span>encounters</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-amber text-lg">15</span>
              <span>words</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-amber text-lg">5</span>
              <span>minutes</span>
            </div>
          </div>
        </div>

        {/* Phase 3: CTA */}
        <div className={`transition-all duration-500 ${phase === "ready" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={handleBegin}
            className="w-full px-8 py-4 bg-amber text-black rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-amber-400 transition-all min-h-[48px] shadow-lg shadow-amber/20 hover:shadow-amber/40 hover:scale-[1.02]"
          >
            Begin Your Quest
          </button>
        </div>
      </div>
    </div>
  );
}
