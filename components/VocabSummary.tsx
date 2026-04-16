"use client";

import { VocabWord } from "@/lib/types";
import { useEffect, useState } from "react";

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
        if (c >= words.length) {
          clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="px-4 py-6">
      <p className="text-sm text-neutral-400 mb-4 text-center">
        You learned {words.length} {languageName} words in {cityName}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {words.map((word, i) => (
          <div
            key={word.id}
            className="vocab-word-enter bg-surface border border-border rounded-lg p-3"
            style={{
              animationDelay: `${i * 100}ms`,
              opacity: i < visibleCount ? 1 : 0,
            }}
          >
            <p className="text-amber font-bold text-sm font-display">{word.word}</p>
            <p className="text-neutral-400 text-xs italic">{word.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
