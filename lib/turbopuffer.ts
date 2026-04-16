import { Turbopuffer, Row, Filter } from "@turbopuffer/turbopuffer";

let client: Turbopuffer | null = null;

function getClient(): Turbopuffer {
  if (!client) {
    client = new Turbopuffer({
      apiKey: process.env.TURBOPUFFER_API_KEY!,
      region: "aws-us-east-1",
    });
  }
  return client;
}

export async function upsertRows(namespace: string, rows: Row[]) {
  const ns = getClient().namespace(namespace);
  await ns.write({ upsert_rows: rows });
}

export async function queryVectors(
  namespace: string,
  vector: number[],
  topK: number = 5,
  filters?: Filter
): Promise<Row[]> {
  const ns = getClient().namespace(namespace);
  const response = await ns.query({
    rank_by: ["vector", "ANN", vector],
    top_k: topK,
    ...(filters ? { filters } : {}),
    include_attributes: true,
  });
  return response.rows || [];
}
