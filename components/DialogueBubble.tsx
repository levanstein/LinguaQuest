"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VocabWord } from "@/lib/types";
import { stripDiacritics, stripPunctuation } from "@/lib/text-utils";

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

    return transcript.split(/(\s+|\n)/).map((token) => {
      if (token === "\n") return { text: "\n", match: undefined, isBreak: true };
      const clean = stripDiacritics(stripPunctuation(token));
      const match = wordMap.get(clean);
      return { text: token, match, isBreak: false };
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

      {/* NPC name badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "oklch(0.78 0.17 75 / 0.15)", color: "oklch(0.78 0.17 75)" }}
        >
          {npcName.charAt(0)}
        </div>
        <span className="game-label">{npcName}</span>
      </div>

      {/* Story text — literary, scrollable */}
      <div
        className="rounded-2xl p-4 mb-4 max-h-[45vh] overflow-y-auto"
        style={{
          background: "oklch(0.17 0.01 75)",
          border: "1px solid oklch(0.24 0.012 75)",
        }}
      >
        <div className="story-text">
          {segments.map((seg, i) =>
            seg.isBreak ? (
              <span key={i} className="block h-3" />
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
              border: "1px solid oklch(0.78 0.17 75 / 0.3)",
              color: "oklch(0.78 0.17 75)",
              background: "oklch(0.78 0.17 75 / 0.05)",
            }}
          >
            {audioPlaying ? "Playing..." : audioError ? "N/A" : "Replay"}
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
