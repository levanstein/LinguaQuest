"use client";

import { SCENE_PROGRESS, SceneId } from "@/lib/types";

export default function ProgressBar({
  scene,
  cityName = "Istanbul",
}: {
  scene: SceneId;
  cityName?: string;
}) {
  const current = SCENE_PROGRESS[scene] || 1;
  const total = 5;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
      <span className="text-sm font-semibold tracking-widest uppercase text-white">
        {cityName}
      </span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full transition-all duration-500"
            style={{ background: i < current ? "var(--color-amber)" : "var(--color-border)" }}
          />
        ))}
      </div>
      <span className="text-xs text-neutral-400">{current}/{total}</span>
    </div>
  );
}
