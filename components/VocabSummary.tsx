"use client";

import { VocabWord } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

interface VocabSummaryProps {
  words: VocabWord[];
  cityName?: string;
  languageName?: string;
}

export default function VocabSummary({
  words,
  cityName = "Istanbul",
  languageName = "Turkish",
}: VocabSummaryProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= words.length) { clearInterval(timer); return c; }
        return c + 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [words.length]);

  const playWord = (wordId: string) => {
    const audio = new Audio(`/audio/words/${wordId}.mp3`);
    audio.play().catch(() => {});
  };

  // Deduplicate words (same word may appear in multiple quiz questions)
  const uniqueWords = words.filter((w, i, arr) => arr.findIndex((x) => x.id === w.id) === i);

  return (
    <div className="py-4">
      <p className="text-center mb-4" style={{ color: "oklch(0.55 0.01 75)", fontSize: "0.85rem" }}>
        {uniqueWords.length} {languageName} words collected in {cityName}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {uniqueWords.map((word, i) => (
          <button
            key={word.id}
            onClick={() => playWord(word.id)}
            className="vocab-word-enter rounded-xl p-3 text-left transition-all active:scale-[0.97]"
            style={{
              background: "oklch(0.17 0.01 75)",
              border: "1px solid oklch(0.24 0.012 75)",
              animationDelay: `${i * 100}ms`,
              opacity: i < visibleCount ? 1 : 0,
            }}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm font-[var(--font-story)]" style={{ color: "oklch(0.78 0.17 75)" }}>
                {word.word}
              </p>
              <span style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.6rem" }}>▶</span>
            </div>
            <p className="italic" style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.75rem" }}>
              {word.translation}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
