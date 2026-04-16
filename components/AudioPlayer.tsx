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

    const playAudio = async (ref: React.RefObject<HTMLAudioElement | null>) => {
      if (ref.current) {
        try {
          ref.current.volume = ref.current === musicRef.current ? 0.3 : 0.5;
          ref.current.loop = true;
          await ref.current.play();
          setPlaying(true);
        } catch {
          setError(true);
        }
      }
    };

    if (sfxSrc) playAudio(sfxRef);
    if (musicSrc) playAudio(musicRef);

    return () => {
      sfxRef.current?.pause();
      musicRef.current?.pause();
    };
  }, [sfxSrc, musicSrc, audioUnlocked]);

  return (
    <div className="sticky bottom-0 bg-[#1A1A1A] border-t border-[#2A2A2A] px-4 py-3 flex items-center gap-3"
         style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      {sfxSrc && <audio ref={sfxRef} src={sfxSrc} preload="auto" />}
      {musicSrc && <audio ref={musicRef} src={musicSrc} preload="auto" />}

      <div className="flex items-center gap-1.5">
        {playing &&
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-0.5 bg-amber-500 rounded-full waveform-bar"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        {!playing && !error && (
          <span className="text-xs text-[#A3A3A3]">Loading...</span>
        )}
        {error && (
          <span className="text-xs text-[#A3A3A3]">🔇 Audio unavailable</span>
        )}
      </div>

      <span className="text-xs text-[#A3A3A3] flex-1 truncate">{label}</span>
    </div>
  );
}
