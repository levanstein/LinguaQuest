import { CityData, DialogueData, VocabWord } from "./types";

export const FALLBACK_CITY: CityData = {
  id: "istanbul",
  name: "Istanbul",
  country: "Turkey",
  description:
    "A warm city of spice markets, mosques, and the Bosphorus strait. Ancient bazaars, Turkish tea, and calls to prayer from minarets.",
  themeColor: "#F59E0B",
  difficulty: "beginner",
};

export const FALLBACK_VOCAB: VocabWord[] = [
  { id: "merhaba", word: "merhaba", translation: "hello", difficulty: 1, category: "greeting", city: "istanbul", scene: 2 },
  { id: "sola", word: "sola", translation: "left", difficulty: 1, category: "direction", city: "istanbul", scene: 2 },
  { id: "duz", word: "düz", translation: "straight", difficulty: 1, category: "direction", city: "istanbul", scene: 2 },
  { id: "kolay", word: "kolay", translation: "easy", difficulty: 1, category: "adjective", city: "istanbul", scene: 2 },
  { id: "hos-geldiniz", word: "hoş geldiniz", translation: "welcome", difficulty: 2, category: "greeting", city: "istanbul", scene: 3 },
  { id: "cay", word: "çay", translation: "tea", difficulty: 2, category: "food", city: "istanbul", scene: 3 },
  { id: "bes", word: "beş", translation: "five", difficulty: 2, category: "number", city: "istanbul", scene: 3 },
  { id: "cok-guzel", word: "çok güzel", translation: "very beautiful", difficulty: 2, category: "adjective", city: "istanbul", scene: 3 },
  { id: "bu", word: "bu", translation: "this", difficulty: 3, category: "pronoun", city: "istanbul", scene: 4 },
  { id: "cami", word: "cami", translation: "mosque", difficulty: 3, category: "culture", city: "istanbul", scene: 4 },
  { id: "eski", word: "eski", translation: "old", difficulty: 3, category: "adjective", city: "istanbul", scene: 4 },
  { id: "dort-yuz", word: "dört yüz", translation: "four hundred", difficulty: 3, category: "number", city: "istanbul", scene: 4 },
  { id: "yil", word: "yıl", translation: "year", difficulty: 3, category: "time", city: "istanbul", scene: 4 },
  { id: "kitapci", word: "kitapçı", translation: "bookshop", difficulty: 3, category: "place", city: "istanbul", scene: 4 },
  { id: "ariyorsunuz", word: "arıyorsunuz", translation: "you search", difficulty: 3, category: "verb", city: "istanbul", scene: 4 },
];

export const FALLBACK_DIALOGUES: DialogueData[] = [
  {
    id: "istanbul-taxi",
    city: "istanbul",
    scene: 2,
    difficulty: 1,
    npcName: "Taxi Driver",
    situation: "Asking for directions in a taxi near the airport",
    transcript:
      "Merhaba! Where you go? Ah, Sultanahmet! Go sola — left, then düz — straight. Kolay! Easy!",
    vocabIds: ["merhaba", "sola", "duz", "kolay"],
  },
  {
    id: "istanbul-vendor",
    city: "istanbul",
    scene: 3,
    difficulty: 2,
    npcName: "Market Vendor",
    situation: "Bargaining at the Grand Bazaar over tea and carpets",
    transcript:
      "Hoş geldiniz! Welcome! You want çay? Tea? Beş lira, five lira. Çok güzel — very beautiful this carpet...",
    vocabIds: ["hos-geldiniz", "cay", "bes", "cok-guzel"],
  },
  {
    id: "istanbul-historian",
    city: "istanbul",
    scene: 4,
    difficulty: 3,
    npcName: "Old Historian",
    situation: "Conversation with an elderly historian near a mosque courtyard",
    transcript:
      "Bu cami çok eski — this mosque very old. Dört yüz yıl — four hundred years. Kitapçı mı arıyorsunuz? You search bookshop?",
    vocabIds: ["bu", "cami", "eski", "dort-yuz", "yil", "kitapci", "ariyorsunuz"],
  },
];

export function getVocabForScene(scene: number): VocabWord[] {
  return FALLBACK_VOCAB.filter((v) => v.scene === scene);
}

export function getDialogueForScene(scene: number): DialogueData | undefined {
  return FALLBACK_DIALOGUES.find((d) => d.scene === scene);
}
