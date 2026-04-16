import { NextResponse } from "next/server";
import { queryWithFallback } from "@/lib/turbopuffer";
import { getVocabForScene } from "@/lib/fallback-data";

const VECTOR_KEY_BY_SCENE: Record<number, string> = {
  2: "vocab-difficulty-1",
  3: "vocab-difficulty-2",
  4: "vocab-difficulty-3",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scene = parseInt(searchParams.get("scene") || "2");

  const results = await queryWithFallback(
    "vocabulary",
    VECTOR_KEY_BY_SCENE[scene] || "vocab-difficulty-1",
    10,
    ["scene", "Eq", scene],
    (r) => ({
      id: r.id as string,
      word: r["word"] as string,
      translation: r["translation"] as string,
      difficulty: r["difficulty"] as number,
      category: r["category"] as string,
      city: r["city"] as string,
      scene: r["scene"] as number,
    }),
    getVocabForScene(scene)
  );

  return NextResponse.json(results);
}
