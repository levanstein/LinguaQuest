import { Turbopuffer, Row, Filter } from "@turbopuffer/turbopuffer";
import queryVectorsData from "./query-vectors.json";

let client: Turbopuffer | null = null;

export function getClient(): Turbopuffer {
  if (!client) {
    const key = process.env.TURBOPUFFER_API_KEY;
    if (!key) throw new Error("TURBOPUFFER_API_KEY is not set");
    client = new Turbopuffer({ apiKey: key, region: "aws-us-east-1" });
  }
  return client;
}

const nsCache = new Map<string, ReturnType<Turbopuffer["namespace"]>>();
function getNamespace(name: string) {
  if (!nsCache.has(name)) nsCache.set(name, getClient().namespace(name));
  return nsCache.get(name)!;
}

export async function upsertRows(namespace: string, rows: Row[]) {
  await getNamespace(namespace).write({ upsert_rows: rows });
}

async function queryVectors(
  namespace: string,
  vector: number[],
  topK: number = 5,
  filters?: Filter
): Promise<Row[]> {
  const response = await getNamespace(namespace).query({
    rank_by: ["vector", "ANN", vector],
    top_k: topK,
    ...(filters ? { filters } : {}),
    include_attributes: true,
  });
  return response.rows || [];
}

export async function queryWithFallback<T>(
  namespace: string,
  vectorKey: string,
  topK: number,
  filter: Filter | undefined,
  mapRow: (row: Row) => T,
  fallback: T[]
): Promise<T[]> {
  try {
    const vectors = queryVectorsData as Record<string, number[]>;
    const vector = vectors[vectorKey];
    if (!vector || vector.length === 0) return fallback;

    const rows = await queryVectors(namespace, vector, topK, filter);
    if (rows.length === 0) return fallback;
    return rows.map(mapRow);
  } catch (e) {
    console.error(`turbopuffer ${namespace} query failed, using fallback:`, e);
    return fallback;
  }
}
