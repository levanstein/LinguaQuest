const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

function getApiKey(): string {
  return process.env.ELEVENLABS_API_KEY!;
}

export async function generateSoundEffect(
  prompt: string,
  durationSeconds: number
): Promise<Buffer> {
  const response = await fetch(`${ELEVENLABS_BASE}/sound-generation`, {
    method: "POST",
    headers: {
      "xi-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: prompt,
      duration_seconds: durationSeconds,
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs SFX error: ${response.status} ${await response.text()}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function generateMusic(
  prompt: string,
  durationSeconds: number
): Promise<Buffer> {
  // Start generation
  const createResponse = await fetch(`${ELEVENLABS_BASE}/music/generate`, {
    method: "POST",
    headers: {
      "xi-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      duration_seconds: durationSeconds,
    }),
  });

  if (!createResponse.ok) {
    throw new Error(`ElevenLabs Music error: ${createResponse.status} ${await createResponse.text()}`);
  }

  return Buffer.from(await createResponse.arrayBuffer());
}

export async function generateTTS(
  text: string,
  voiceId: string
): Promise<Buffer> {
  const response = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS error: ${response.status} ${await response.text()}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// Pre-made voice IDs from ElevenLabs
export const VOICES = {
  taxiDriver: "pNInz6obpgDQGcFmaJgB",   // Adam - warm male
  vendor: "21m00Tcm4TlvDq8ikWAM",         // Rachel - female
  historian: "VR6AewLTigWG4xSOukaG",      // Arnold - deep male
};
