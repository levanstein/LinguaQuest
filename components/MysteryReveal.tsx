"use client";

import { useState } from "react";

interface MysteryRevealProps {
  mystery: string;
  reveal: string;
  onContinue: () => void;
}

export default function MysteryReveal({ mystery, reveal, onContinue }: MysteryRevealProps) {
  const [showReveal, setShowReveal] = useState(false);

  return (
    <div className="px-4 py-6 scene-enter">
      <div
        className="rounded-2xl p-5 mb-4"
        style={{
          background: "oklch(0.17 0.01 75)",
          border: "1px solid oklch(0.78 0.17 75 / 0.2)",
        }}
      >
        <p className="game-label mb-3">Historical Mystery</p>
        <p className="font-[var(--font-story)] text-base leading-relaxed mb-5" style={{ color: "oklch(0.92 0.005 75)" }}>
          {mystery}
        </p>

        {!showReveal ? (
          <button
            onClick={() => setShowReveal(true)}
            className="w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all min-h-[48px]"
            style={{
              border: "1px solid oklch(0.78 0.17 75 / 0.3)",
              color: "oklch(0.78 0.17 75)",
              background: "oklch(0.78 0.17 75 / 0.05)",
            }}
          >
            Reveal the Answer
          </button>
        ) : (
          <div className="scene-enter">
            <div className="w-full h-px mb-4" style={{ background: "oklch(0.78 0.17 75 / 0.15)" }} />
            <p className="font-[var(--font-story)] text-sm leading-relaxed" style={{ color: "oklch(0.75 0.01 75)" }}>
              {reveal}
            </p>
          </div>
        )}
      </div>

      {showReveal && (
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all min-h-[48px] scene-enter"
          style={{
            background: "oklch(0.78 0.17 75)",
            color: "oklch(0.15 0.02 75)",
          }}
        >
          Continue Journey
        </button>
      )}
    </div>
  );
}
