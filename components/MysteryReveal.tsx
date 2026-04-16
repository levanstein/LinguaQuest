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
      <div className="bg-surface border border-amber/20 rounded-xl p-5 mb-4">
        <p className="text-xs text-amber font-semibold tracking-widest uppercase mb-3">
          Historical Mystery
        </p>
        <p className="text-white text-base leading-relaxed font-display mb-4">
          {mystery}
        </p>

        {!showReveal ? (
          <button
            onClick={() => setShowReveal(true)}
            className="w-full py-3 border border-amber/40 text-amber rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber/10 transition-colors min-h-[48px]"
          >
            Reveal the Answer
          </button>
        ) : (
          <div className="scene-enter">
            <div className="w-full h-px bg-amber/20 mb-4" />
            <p className="text-neutral-300 text-sm leading-relaxed">
              {reveal}
            </p>
          </div>
        )}
      </div>

      {showReveal && (
        <button
          onClick={onContinue}
          className="w-full py-3 bg-amber text-black rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors min-h-[48px] scene-enter"
        >
          Continue Journey
        </button>
      )}
    </div>
  );
}
