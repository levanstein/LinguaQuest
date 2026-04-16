import { NextResponse } from "next/server";
import { queryVectors } from "@/lib/turbopuffer";
import { FALLBACK_CITY } from "@/lib/fallback-data";
import queryVectorsData from "@/lib/query-vectors.json";

export async function GET() {
  try {
    const vector = (queryVectorsData as Record<string, number[]>)["city-search"];

    if (vector && vector.length > 0) {
      const results = await queryVectors("cities", vector, 1);

      if (results.length > 0) {
        const r = results[0];
        return NextResponse.json({
          id: r.id,
          name: r["name"],
          country: r["country"],
          description: r["description"],
          themeColor: r["theme_color"],
          difficulty: r["difficulty"],
        });
      }
    }
  } catch (e) {
    console.error("turbopuffer city query failed, using fallback:", e);
  }

  return NextResponse.json(FALLBACK_CITY);
}
