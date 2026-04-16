"use client";

import { VocabWord } from "@/lib/types";
import { useEffect, useState } from "react";

interface VocabSummaryProps {
  words: VocabWord[];
}

export default function VocabSummary({ words }: VocabSummaryProps) {
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
      <p className="text-sm text-[#A3A3A3] mb-4 text-center">
        You learned {words.length} Turkish words in Istanbul
      </p>

      <div className="grid grid-cols-2 gap-2">
        {words.map((word, i) => (
          <div
            key={word.id}
            className="vocab-word-enter bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3"
            style={{
              animationDelay: `${i * 100}ms`,
              opacity: i < visibleCount ? 1 : 0,
            }}
          >
            <p className="text-amber-500 font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>
              {word.word}
            </p>
            <p className="text-[#A3A3A3] text-xs italic">{word.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
