"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VocabWord } from "@/lib/types";
import { stripDiacritics, stripPunctuation } from "@/lib/text-utils";

const NPC_STYLES: Record<string, { icon: string; color: string }> = {
  "Taxi Driver": { icon: "🚕", color: "oklch(0.78 0.17 75)" },
  "Market Vendor": { icon: "🧶", color: "oklch(0.72 0.18 40)" },
  "Old Historian": { icon: "📜", color: "oklch(0.68 0.12 280)" },
};

interface DialogueBubbleProps {
  npcName: string;
  transcript: string;
  vocabWords: VocabWord[];
  ttsSrc?: string;
  audioUnlocked: boolean;
  onContinue: () => void;
}

export default function DialogueBubble({
  npcName,
  transcript,
  vocabWords,
  ttsSrc,
  audioUnlocked,
  onContinue,
}: DialogueBubbleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const npcStyle = NPC_STYLES[npcName] || { icon: "💬", color: "oklch(0.78 0.17 75)" };

  useEffect(() => {
    const el = audioRef.current;
    if (audioUnlocked && ttsSrc && el) {
      el.play().then(() => setAudioPlaying(true)).catch(() => setAudioError(true));
    }
    return () => { el?.pause(); };
  }, [audioUnlocked, ttsSrc]);

  const segments = useMemo(() => {
    const wordMap = new Map<string, VocabWord>();
    for (const v of vocabWords) {
      wordMap.set(stripDiacritics(v.word), v);
    }

    return transcript.split(/(\n\n|\n|\s+)/).map((token) => {
      if (token === "\n\n") return { text: token, match: undefined, isParagraphBreak: true, isBreak: false };
      if (token === "\n") return { text: token, match: undefined, isBreak: true, isParagraphBreak: false };
      const clean = stripDiacritics(stripPunctuation(token));
      const match = wordMap.get(clean);
      return { text: token, match, isBreak: false, isParagraphBreak: false };
    });
  }, [transcript, vocabWords]);

  return (
    <div className="npc-enter px-4 py-4">
      {ttsSrc && (
        <audio
          ref={audioRef}
          src={ttsSrc}
          preload="auto"
          onEnded={() => setAudioPlaying(false)}
        />
      )}

      {/* NPC name badge with distinct icon */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: `color-mix(in oklch, ${npcStyle.color} 15%, transparent)` }}
        >
          {npcStyle.icon}
        </div>
        <span className="game-label" style={{ color: npcStyle.color }}>{npcName}</span>
      </div>

      {/* Story text with visible paragraph breaks */}
      <div
        className="rounded-2xl p-4 mb-4 max-h-[45vh] overflow-y-auto"
        style={{
          background: "oklch(0.17 0.01 75)",
          border: "1px solid oklch(0.24 0.012 75)",
        }}
      >
        <div className="story-text">
          {segments.map((seg, i) =>
            seg.isParagraphBreak ? (
              <span key={i} className="block h-5" />
            ) : seg.isBreak ? (
              <span key={i} className="block h-2" />
            ) : seg.match ? (
              <span key={i} className="turkish-word glow-pulse">
                {seg.text}
                <span className="tooltip">{seg.match.translation}</span>
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {ttsSrc && (
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
              }
            }}
            className="px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px]"
            style={{
              border: `1px solid color-mix(in oklch, ${npcStyle.color} 30%, transparent)`,
              color: npcStyle.color,
              background: `color-mix(in oklch, ${npcStyle.color} 5%, transparent)`,
            }}
          >
            {audioPlaying ? "Listening..." : audioError ? "N/A" : "Replay"}
          </button>
        )}

        <button
          onClick={onContinue}
          className="flex-1 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all min-h-[48px]"
          style={{
            background: "oklch(0.78 0.17 75)",
            color: "oklch(0.15 0.02 75)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
