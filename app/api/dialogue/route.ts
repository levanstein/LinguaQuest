import { NextResponse } from "next/server";
import { queryWithFallback } from "@/lib/turbopuffer";
import { getDialogueForScene, FALLBACK_DIALOGUES } from "@/lib/fallback-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scene = parseInt(searchParams.get("scene") || "2");

  const fallback = getDialogueForScene(scene) || FALLBACK_DIALOGUES[0];

  const results = await queryWithFallback(
    "dialogues",
    `dialogue-scene-${scene}`,
    1,
    ["scene", "Eq", scene],
    (r) => ({
      id: r.id as string,
      city: r["city"] as string,
      scene: r["scene"] as number,
      difficulty: r["difficulty"] as number,
      npcName: r["npc_name"] as string,
      situation: r["situation"] as string,
      transcript: r["transcript"] as string,
      vocabIds: ((r["vocab_ids"] as string) || "").split(","),
    }),
    [fallback]
  );

  return NextResponse.json(results[0]);
}
