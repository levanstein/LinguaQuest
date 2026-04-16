"use client";

import { SCENE_PROGRESS, SceneId } from "@/lib/types";

export default function ProgressBar({ scene }: { scene: SceneId }) {
  const current = SCENE_PROGRESS[scene] || 1;
  const total = 5;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]">
      <span className="text-sm font-semibold tracking-widest uppercase text-white">
        Istanbul
      </span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i < current ? "#F59E0B" : "#2A2A2A",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-[#A3A3A3]">
        {current}/{total}
      </span>
    </div>
  );
}
