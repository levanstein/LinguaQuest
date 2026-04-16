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
    if (musicSrc) playAudio(music, 0.25);

    return () => {
      sfx?.pause();
      music?.pause();
    };
  }, [sfxSrc, musicSrc, audioUnlocked]);

  return (
    <div
      className="sticky bottom-0 px-4 py-3 flex items-center gap-3"
      style={{
        background: "oklch(0.14 0.01 75)",
        borderTop: "1px solid oklch(0.22 0.01 75)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      {sfxSrc && <audio ref={sfxRef} src={sfxSrc} preload="metadata" />}
      {musicSrc && <audio ref={musicRef} src={musicSrc} preload="metadata" />}

      <div className="flex items-center gap-1.5">
        {playing &&
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-0.5 rounded-full waveform-bar"
              style={{ background: "oklch(0.78 0.17 75)", animationDelay: `${i * 0.15}s` }}
            />
          ))}
        {!playing && !error && (
          <span style={{ color: "oklch(0.45 0.01 75)", fontSize: "0.7rem" }}>Loading...</span>
        )}
        {error && (
          <span style={{ color: "oklch(0.45 0.01 75)", fontSize: "0.7rem" }}>Audio unavailable</span>
        )}
      </div>

      <span className="flex-1 truncate" style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.7rem", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}
