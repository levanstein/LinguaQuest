"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  sfxSrc?: string;
  musicSrc?: string;
  label: string;
  audioUnlocked: boolean;
}

export default function AudioPlayer({
  sfxSrc,
  musicSrc,
  label,
  audioUnlocked,
}: AudioPlayerProps) {
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!audioUnlocked) return;

    const sfx = sfxRef.current;
    const music = musicRef.current;

    const playAudio = async (el: HTMLAudioElement | null, volume: number) => {
      if (!el) return;
      try {
        el.volume = volume;
        el.loop = true;
        await el.play();
        setPlaying(true);
      } catch {
        setError(true);
      }
    };

    if (sfxSrc) playAudio(sfx, 0.5);
    if (musicSrc) playAudio(music, 0.3);

    return () => {
      sfx?.pause();
      music?.pause();
    };
  }, [sfxSrc, musicSrc, audioUnlocked]);

  return (
    <div
      className="sticky bottom-0 bg-surface border-t border-border px-4 py-3 flex items-center gap-3"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {sfxSrc && <audio ref={sfxRef} src={sfxSrc} preload="metadata" />}
      {musicSrc && <audio ref={musicRef} src={musicSrc} preload="metadata" />}

      <div className="flex items-center gap-1.5">
        {playing &&
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-0.5 bg-amber rounded-full waveform-bar"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        {!playing && !error && (
          <span className="text-xs text-neutral-400">Loading...</span>
        )}
        {error && (
          <span className="text-xs text-neutral-400">Audio unavailable</span>
        )}
      </div>

      <span className="text-xs text-neutral-400 flex-1 truncate">{label}</span>
    </div>
  );
}
