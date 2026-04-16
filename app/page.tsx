"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0F0F0F 0%, #1a1205 40%, #2d1d0a 60%, #1a1205 80%, #0F0F0F 100%)",
        }}
      />

      <div className="absolute bottom-[30%] left-0 right-0 h-[120px] opacity-20">
        <svg viewBox="0 0 480 120" fill="var(--color-amber)" className="w-full h-full">
          <path d="M0,120 L0,80 Q20,75 40,80 L60,70 Q80,60 100,65 L120,55 Q140,50 150,40 Q155,30 160,40 Q165,50 170,45 L200,60 Q220,55 240,50 Q260,45 270,35 Q275,25 280,35 Q285,45 290,40 L320,55 Q340,50 360,60 L380,65 Q400,60 420,70 L440,75 Q460,80 480,78 L480,120 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        <p className="text-xs text-neutral-400 tracking-[0.3em] uppercase mb-3">
          Language Quest
        </p>

        <h1 className="text-5xl font-bold text-amber mb-2 tracking-wide font-display">
          ISTANBUL
        </h1>

        <p className="text-neutral-400 text-sm mb-1">Turkey</p>

        <div className="w-12 h-px bg-amber/30 mx-auto my-6" />

        <p className="text-white text-base leading-relaxed max-w-[300px] mb-8 font-display">
          Find the hidden bookshop in Sultanahmet before sunset.
        </p>

        <button
          onClick={() => router.push("/play/istanbul")}
          className="px-8 py-4 bg-amber text-black rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors min-h-[48px] shadow-lg shadow-amber/20"
        >
          Begin Your Quest
        </button>

        <p className="text-xs text-neutral-400 mt-6 opacity-60">
          3 encounters · 15 Turkish words · ~5 minutes
        </p>
      </div>
    </div>
  );
}
