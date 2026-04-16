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

    return transcript.split(/(\s+)/).map((token) => {
      const clean = stripDiacritics(stripPunctuation(token));
      const match = wordMap.get(clean);
      return { text: token, match };
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

      <div className="text-xs font-semibold text-amber mb-2 tracking-wide uppercase">
        {npcName}
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 mb-4">
        <p className="text-lg leading-relaxed font-display">
          {segments.map((seg, i) =>
            seg.match ? (
              <span key={i} className="turkish-word glow-pulse">
                {seg.text}
                <span className="tooltip">{seg.match.translation}</span>
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
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
            className="px-4 py-3 border border-amber text-amber rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber/10 transition-colors min-h-[48px]"
          >
            {audioPlaying ? "Playing..." : audioError ? "Audio N/A" : "Replay"}
          </button>
        )}

        <button
          onClick={onContinue}
          className="flex-1 px-4 py-3 bg-amber text-black rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber-400 transition-colors min-h-[48px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
