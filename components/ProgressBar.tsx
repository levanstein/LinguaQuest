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
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid oklch(0.24 0.012 75)" }}>
      <span className="game-label" style={{ fontSize: "0.7rem" }}>{cityName}</span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i < current ? "oklch(0.78 0.17 75)" : "oklch(0.22 0.01 75)",
            }}
          />
        ))}
      </div>
      <span style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.65rem", fontWeight: 500 }}>
        {current}/{total}
      </span>
    </div>
  );
}
