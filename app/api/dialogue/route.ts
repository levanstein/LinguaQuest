import { NextResponse } from "next/server";
import { queryVectors } from "@/lib/turbopuffer";
import { getDialogueForScene } from "@/lib/fallback-data";
import queryVectorsData from "@/lib/query-vectors.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scene = parseInt(searchParams.get("scene") || "2");

  try {
    const vectorKey = `dialogue-scene-${scene}`;
    const vector = (queryVectorsData as Record<string, number[]>)[vectorKey];

    if (vector && vector.length > 0) {
      const results = await queryVectors("dialogues", vector, 1, ["scene", "Eq", scene]);

      if (results.length > 0) {
        const r = results[0];
        return NextResponse.json({
          id: r.id,
          city: r["city"],
          scene: r["scene"],
          difficulty: r["difficulty"],
          npcName: r["npc_name"],
          situation: r["situation"],
          transcript: r["transcript"],
          vocabIds: ((r["vocab_ids"] as string) || "").split(","),
        });
      }
    }
  } catch (e) {
    console.error("turbopuffer dialogue query failed, using fallback:", e);
  }

  const fallback = getDialogueForScene(scene);
  return NextResponse.json(fallback || { error: "No dialogue found" });
}
