"use client";

import { useEffect, useRef, useState } from "react";
import { VocabWord } from "@/lib/types";

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
    if (audioUnlocked && ttsSrc && audioRef.current) {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => setAudioError(true));
    }
  }, [audioUnlocked, ttsSrc]);

  // Highlight Turkish words in the transcript
  function renderTranscript() {
    let result = transcript;
    const segments: { text: string; isHighlighted: boolean; word?: VocabWord }[] = [];

    // Build a map of words to find
    const wordMap = new Map<string, VocabWord>();
    for (const v of vocabWords) {
      // Match both the raw form and the accented form
      wordMap.set(v.word.toLowerCase(), v);
      // Also try without accents for matching in transcript
      const clean = v.word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      wordMap.set(clean, v);
    }

    // Simple word-by-word highlighting
    const words = result.split(/(\s+)/);
    for (const w of words) {
      const clean = w
        .toLowerCase()
        .replace(/[.,!?;:'"]/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const match = wordMap.get(clean);
      if (match) {
        segments.push({ text: w, isHighlighted: true, word: match });
      } else {
        segments.push({ text: w, isHighlighted: false });
      }
    }

    return segments.map((seg, i) =>
      seg.isHighlighted ? (
        <span key={i} className="turkish-word glow-pulse">
          {seg.text}
          <span className="tooltip">{seg.word!.translation}</span>
        </span>
      ) : (
        <span key={i}>{seg.text}</span>
      )
    );
  }

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

      <div className="text-xs font-semibold text-amber-500 mb-2 tracking-wide uppercase">
        {npcName}
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 mb-4">
        <p className="text-lg leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
          {renderTranscript()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {ttsSrc && (
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
              }
            }}
            className="px-4 py-3 border border-amber-500 text-amber-500 rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber-500/10 transition-colors min-h-[48px]"
          >
            {audioPlaying ? "▶ Playing..." : audioError ? "Audio N/A" : "▶ Replay"}
          </button>
        )}

        <button
          onClick={onContinue}
          className="flex-1 px-4 py-3 bg-amber-500 text-black rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber-400 transition-colors min-h-[48px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
