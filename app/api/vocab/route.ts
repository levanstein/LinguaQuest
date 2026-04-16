import { NextResponse } from "next/server";
import { queryVectors } from "@/lib/turbopuffer";
import { getVocabForScene } from "@/lib/fallback-data";
import queryVectorsData from "@/lib/query-vectors.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scene = parseInt(searchParams.get("scene") || "2");

  try {
    const difficultyMap: Record<number, string> = {
      2: "vocab-difficulty-1",
      3: "vocab-difficulty-2",
      4: "vocab-difficulty-3",
    };
    const vectorKey = difficultyMap[scene] || "vocab-difficulty-1";
    const vector = (queryVectorsData as Record<string, number[]>)[vectorKey];

    if (vector && vector.length > 0) {
      const results = await queryVectors("vocabulary", vector, 10, ["scene", "Eq", scene]);

      if (results.length > 0) {
        const vocab = results.map((r) => ({
          id: r.id,
          word: r["word"],
          translation: r["translation"],
          difficulty: r["difficulty"],
          category: r["category"],
          city: r["city"],
          scene: r["scene"],
        }));
        return NextResponse.json(vocab);
      }
    }
  } catch (e) {
    console.error("turbopuffer vocab query failed, using fallback:", e);
  }

  return NextResponse.json(getVocabForScene(scene));
}
