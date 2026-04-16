import { NextResponse } from "next/server";
import { queryWithFallback } from "@/lib/turbopuffer";
import { FALLBACK_CITY } from "@/lib/fallback-data";

export async function GET() {
  const results = await queryWithFallback(
    "cities",
    "city-search",
    1,
    undefined,
    (r) => ({
      id: r.id as string,
      name: r["name"] as string,
      country: r["country"] as string,
      description: r["description"] as string,
      themeColor: r["theme_color"] as string,
      difficulty: r["difficulty"] as string,
    }),
    [FALLBACK_CITY]
  );

  return NextResponse.json(results[0]);
}
