const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  return key;
}

async function post(path: string, body: object): Promise<Buffer> {
  const response = await fetch(`${ELEVENLABS_BASE}${path}`, {
    method: "POST",
    headers: {
      "xi-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `ElevenLabs ${path} error: ${response.status} ${await response.text()}`
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

export function generateSoundEffect(prompt: string, durationSeconds: number) {
  return post("/sound-generation", { text: prompt, duration_seconds: durationSeconds });
}

export function generateMusic(prompt: string, durationSeconds: number) {
  return post("/music/generate", { prompt, duration_seconds: durationSeconds });
}

export function generateTTS(text: string, voiceId: string) {
  return post(`/text-to-speech/${voiceId}`, {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
  });
}

export const VOICES = {
  taxiDriver: "pNInz6obpgDQGcFmaJgB",
  vendor: "21m00Tcm4TlvDq8ikWAM",
  historian: "VR6AewLTigWG4xSOukaG",
};
