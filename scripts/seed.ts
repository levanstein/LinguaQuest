import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import OpenAI from "openai";
import { Turbopuffer } from "@turbopuffer/turbopuffer";
import { FALLBACK_CITY, FALLBACK_VOCAB, FALLBACK_DIALOGUES } from "../lib/fallback-data";
import { generateSoundEffect, generateMusic, generateTTS, VOICES } from "../lib/elevenlabs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const tpuf = new Turbopuffer({ apiKey: process.env.TURBOPUFFER_API_KEY! });

async function embed(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return resp.data[0].embedding;
}

async function seedTurbopuffer() {
  console.log("--- Seeding turbopuffer ---");

  // 1. Cities namespace
  console.log("Seeding cities...");
  const cityVector = await embed(FALLBACK_CITY.description);
  const citiesNs = tpuf.namespace("cities");
  await citiesNs.write({
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

  // 2. Vocabulary namespace
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
  await vocabNs.write({ upsert_rows: vocabRows });
  console.log("  ✓ vocabulary namespace seeded");

  // 3. Dialogues namespace
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
  await dialoguesNs.write({ upsert_rows: dialogueRows });
  console.log("  ✓ dialogues namespace seeded");

  // 4. Pre-compute query vectors
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
  console.log("  ✓ query vectors saved to lib/query-vectors.json");
}

async function generateAudio() {
  console.log("\n--- Generating audio ---");
  const audioDir = join(process.cwd(), "public", "audio");

  for (const sub of ["sfx", "music", "tts"]) {
    const dir = join(audioDir, sub);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  // SFX — generate in parallel
  const sfxTasks = [
    {
      file: "sfx/istanbul-arrival.mp3",
      prompt: "Istanbul airport arrival, distant call to prayer, seagulls, tram bells, warm Mediterranean breeze",
      duration: 15,
    },
    {
      file: "sfx/istanbul-bazaar.mp3",
      prompt: "Busy Istanbul Grand Bazaar, crowd chatter, clinking tea glasses, vendor calls, fabric rustling",
      duration: 15,
    },
    {
      file: "sfx/istanbul-courtyard.mp3",
      prompt: "Quiet mosque courtyard, stone fountain trickling, pigeons cooing, distant city hum",
      duration: 15,
    },
    {
      file: "sfx/istanbul-postcard.mp3",
      prompt: "Istanbul evening panorama, Bosphorus ferry horn, seagulls, distant music, gentle waves on shore",
      duration: 20,
    },
  ];

  console.log("Generating SFX (parallel)...");
  await Promise.all(
    sfxTasks.map(async (task) => {
      const filePath = join(audioDir, task.file);
      if (existsSync(filePath)) {
        console.log(`  ⏭ ${task.file} (exists, skipping)`);
        return;
      }
      try {
        const buffer = await generateSoundEffect(task.prompt, task.duration);
        writeFileSync(filePath, buffer);
        console.log(`  ✓ ${task.file}`);
      } catch (e) {
        console.error(`  ✗ ${task.file}: ${e}`);
      }
    })
  );

  // Music
  const musicFile = join(audioDir, "music/istanbul-ambient.mp3");
  if (existsSync(musicFile)) {
    console.log("  ⏭ music/istanbul-ambient.mp3 (exists, skipping)");
  } else {
    console.log("Generating music...");
    try {
      const buffer = await generateMusic(
        "Ambient Turkish music, soft oud and ney flute, contemplative, warm, cinematic, no drums",
        60
      );
      writeFileSync(musicFile, buffer);
      console.log("  ✓ music/istanbul-ambient.mp3");
    } catch (e) {
      console.error(`  ✗ music/istanbul-ambient.mp3: ${e}`);
    }
  }

  // TTS
  const ttsTasks = [
    {
      file: "tts/taxi-driver.mp3",
      voiceId: VOICES.taxiDriver,
      text: "Merhaba! Where you go? Ah, Sultanahmet! Go sola, left, then düz, straight. Kolay! Easy!",
    },
    {
      file: "tts/vendor.mp3",
      voiceId: VOICES.vendor,
      text: "Hoş geldiniz! Welcome! You want çay? Tea? Beş lira, five lira. Çok güzel, very beautiful this carpet...",
    },
    {
      file: "tts/historian.mp3",
      voiceId: VOICES.historian,
      text: "Bu cami çok eski, this mosque very old. Dört yüz yıl, four hundred years. Kitapçı mı arıyorsunuz? You search bookshop?",
    },
  ];

  console.log("Generating TTS...");
  for (const task of ttsTasks) {
    const filePath = join(audioDir, task.file);
    if (existsSync(filePath)) {
      console.log(`  ⏭ ${task.file} (exists, skipping)`);
      continue;
    }
    try {
      const buffer = await generateTTS(task.text, task.voiceId);
      writeFileSync(filePath, buffer);
      console.log(`  ✓ ${task.file}`);
    } catch (e) {
      console.error(`  ✗ ${task.file}: ${e}`);
    }
  }
}

async function main() {
  console.log("🎮 LinguaQuest Seed Script\n");

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    process.exit(1);
  }
  if (!process.env.TURBOPUFFER_API_KEY) {
    console.error("Missing TURBOPUFFER_API_KEY");
    process.exit(1);
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("Missing ELEVENLABS_API_KEY");
    process.exit(1);
  }

  await seedTurbopuffer();
  await generateAudio();

  console.log("\n✅ Seed complete!");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
