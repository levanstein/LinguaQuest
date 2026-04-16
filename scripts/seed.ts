import { config } from "dotenv";
config({ path: ".env.local" });
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  FALLBACK_CITY,
  FALLBACK_VOCAB,
  FALLBACK_DIALOGUES,
} from "../lib/fallback-data";
import {
  generateSoundEffect,
  generateMusic,
  generateTTS,
  VOICES,
} from "../lib/elevenlabs";
import { getClient } from "../lib/turbopuffer";

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const tpuf = getClient();

async function embed(text: string): Promise<number[]> {
  const response = await bedrock.send(
    new InvokeModelCommand({
      modelId: "amazon.titan-embed-text-v2:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: text,
        dimensions: 1024,
        normalize: true,
      }),
    })
  );
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.embedding;
}

async function seedTurbopuffer() {
  console.log("--- Seeding turbopuffer ---");

  console.log("Seeding cities...");
  const cityVector = await embed(FALLBACK_CITY.description);
  const citiesNs = tpuf.namespace("cities");
  await citiesNs.write({
    distance_metric: "cosine_distance",
    upsert_rows: [
      {
        id: FALLBACK_CITY.id,
        vector: cityVector,
        name: FALLBACK_CITY.name,
        country: FALLBACK_CITY.country,
        description: FALLBACK_CITY.description,
        theme_color: FALLBACK_CITY.themeColor,
        difficulty: FALLBACK_CITY.difficulty,
      },
    ],
  });
  console.log("  ✓ cities namespace seeded");

  console.log("Seeding vocabulary...");
  const vocabRows = [];
  for (const word of FALLBACK_VOCAB) {
    const vec = await embed(`${word.word} means ${word.translation} in Turkish`);
    vocabRows.push({
      id: word.id,
      vector: vec,
      word: word.word,
      translation: word.translation,
      difficulty: word.difficulty,
      category: word.category,
      city: word.city,
      scene: word.scene,
    });
  }
  const vocabNs = tpuf.namespace("vocabulary");
  await vocabNs.write({ distance_metric: "cosine_distance", upsert_rows: vocabRows });
  console.log("  ✓ vocabulary namespace seeded");

  console.log("Seeding dialogues...");
  const dialogueRows = [];
  for (const d of FALLBACK_DIALOGUES) {
    const vec = await embed(d.situation);
    dialogueRows.push({
      id: d.id,
      vector: vec,
      city: d.city,
      scene: d.scene,
      difficulty: d.difficulty,
      npc_name: d.npcName,
      situation: d.situation,
      transcript: d.transcript,
      vocab_ids: d.vocabIds.join(","),
    });
  }
  const dialoguesNs = tpuf.namespace("dialogues");
  await dialoguesNs.write({ distance_metric: "cosine_distance", upsert_rows: dialogueRows });
  console.log("  ✓ dialogues namespace seeded");

  console.log("Pre-computing query vectors...");
  const queryVectors: Record<string, number[]> = {};
  queryVectors["city-search"] = await embed("warm city with markets and spices");
  queryVectors["dialogue-scene-2"] = await embed("taxi directions airport");
  queryVectors["dialogue-scene-3"] = await embed("bargaining at market");
  queryVectors["dialogue-scene-4"] = await embed("historian at mosque courtyard");
  queryVectors["vocab-difficulty-1"] = await embed("basic Turkish greetings and directions");
  queryVectors["vocab-difficulty-2"] = await embed("Turkish food market shopping words");
  queryVectors["vocab-difficulty-3"] = await embed("Turkish culture history mosque words");

  const queryVectorsPath = join(process.cwd(), "lib", "query-vectors.json");
  writeFileSync(queryVectorsPath, JSON.stringify(queryVectors, null, 2));
  console.log("  ✓ query vectors saved");
}

async function generateAudio() {
  console.log("\n--- Generating audio ---");
  const audioDir = join(process.cwd(), "public", "audio");

  for (const sub of ["sfx", "music", "tts", "words"]) {
    const dir = join(audioDir, sub);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  // SFX (keep existing — same prompts)
  const sfxTasks = [
    { file: "sfx/istanbul-arrival.mp3", prompt: "Istanbul airport arrival, distant call to prayer, seagulls, tram bells, warm Mediterranean breeze", duration: 15 },
    { file: "sfx/istanbul-bazaar.mp3", prompt: "Busy Istanbul Grand Bazaar, crowd chatter, clinking tea glasses, vendor calls, fabric rustling", duration: 15 },
    { file: "sfx/istanbul-courtyard.mp3", prompt: "Quiet mosque courtyard, stone fountain trickling, pigeons cooing, distant city hum", duration: 15 },
    { file: "sfx/istanbul-postcard.mp3", prompt: "Istanbul evening panorama, Bosphorus ferry horn, seagulls, distant music, gentle waves on shore", duration: 20 },
  ];

  console.log("Generating SFX (parallel)...");
  await Promise.all(
    sfxTasks.map(async (task) => {
      const filePath = join(audioDir, task.file);
      if (existsSync(filePath)) { console.log(`  ⏭ ${task.file}`); return; }
      try {
        const buffer = await generateSoundEffect(task.prompt, task.duration);
        writeFileSync(filePath, buffer);
        console.log(`  ✓ ${task.file}`);
      } catch (e) { console.error(`  ✗ ${task.file}: ${e}`); }
    })
  );

  // Music (keep existing)
  const musicFile = join(audioDir, "music/istanbul-ambient.mp3");
  if (existsSync(musicFile)) {
    console.log("  ⏭ music/istanbul-ambient.mp3");
  } else {
    console.log("Generating music...");
    try {
      const buffer = await generateMusic("Ambient Turkish music, soft oud and ney flute, contemplative, warm, cinematic, no drums", 60);
      writeFileSync(musicFile, buffer);
      console.log("  ✓ music/istanbul-ambient.mp3");
    } catch (e) { console.error(`  ✗ music: ${e}`); }
  }

  // TTS — NEW long dialogues (delete old, regenerate)
  const voiceMap: Record<string, { file: string; voiceId: string }> = {
    "istanbul-taxi": { file: "tts/taxi-driver.mp3", voiceId: VOICES.taxiDriver },
    "istanbul-vendor": { file: "tts/vendor.mp3", voiceId: VOICES.vendor },
    "istanbul-historian": { file: "tts/historian.mp3", voiceId: VOICES.historian },
  };

  console.log("Generating TTS (new long dialogues)...");
  for (const d of FALLBACK_DIALOGUES) {
    const mapping = voiceMap[d.id];
    const filePath = join(audioDir, mapping.file);
    // Force regenerate — scripts changed
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`  🔄 ${mapping.file} (deleted old, regenerating)`);
    }
    try {
      const text = d.transcript.replace(/\n\n/g, " ").replace(/\n/g, " ");
      const buffer = await generateTTS(text, mapping.voiceId);
      writeFileSync(filePath, buffer);
      console.log(`  ✓ ${mapping.file}`);
    } catch (e) { console.error(`  ✗ ${mapping.file}: ${e}`); }
  }

  // Per-word audio clips (short TTS for each Turkish word)
  console.log("Generating per-word audio clips...");
  const defaultVoice = VOICES.taxiDriver; // warm male voice for isolated words
  for (const word of FALLBACK_VOCAB) {
    const filePath = join(audioDir, `words/${word.id}.mp3`);
    if (existsSync(filePath)) { console.log(`  ⏭ words/${word.id}.mp3`); continue; }
    try {
      const buffer = await generateTTS(word.word, defaultVoice);
      writeFileSync(filePath, buffer);
      console.log(`  ✓ words/${word.id}.mp3`);
    } catch (e) { console.error(`  ✗ words/${word.id}.mp3: ${e}`); }
  }
}

async function main() {
  console.log("🎮 LinguaQuest Seed Script\n");

  if (!process.env.AWS_ACCESS_KEY_ID) { console.error("Missing AWS_ACCESS_KEY_ID"); process.exit(1); }
  if (!process.env.TURBOPUFFER_API_KEY) { console.error("Missing TURBOPUFFER_API_KEY"); process.exit(1); }
  if (!process.env.ELEVENLABS_API_KEY) { console.error("Missing ELEVENLABS_API_KEY"); process.exit(1); }

  await seedTurbopuffer();
  await generateAudio();

  console.log("\n✅ Seed complete!");
}

main().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
