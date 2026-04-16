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

export interface StoryQuizQuestion {
  question: string;
  questionAudio?: string;
  correctAnswer: string;
  wrongAnswers: string[];
  vocabWord: VocabWord;
  explanation: string;
}

export interface SceneStory {
  dialogue: DialogueData;
  story: string;
  mystery: string;
  mysteryReveal: string;
  quizQuestions: StoryQuizQuestion[];
}

export const SCENE_STORIES: Record<number, SceneStory> = {
  2: {
    dialogue: {
      id: "istanbul-taxi",
      city: "istanbul",
      scene: 2,
      difficulty: 1,
      npcName: "Taxi Driver",
      situation: "Asking for directions in a taxi near the airport",
      transcript:
        "Merhaba! Where you go? Ah, Sultanahmet! Let me tell you something about this road. You see, Sultan Ahmed I, he was only 14 years old when he became sultan. Fourteen! And the first thing he wanted? A mosque so beautiful the whole world would remember it. Every morning, thousands of workers would walk this very road, turning sola, left, then going düz, straight, to the construction site. The sultan himself would visit to check progress. And you know what kept them all going? Çay. Tea. Cups and cups of tea, shared between workers and their sultan on the cold mornings. They built for seven yıl, seven years, and people called it the Blue Mosque because of the tiles. Kolay! Easy to find — just follow this road, you'll see the minarets. One mystery though... the mosque has six minarets, but most have only four. No one knows for sure why Ahmed wanted six. Some say the architect misheard the order...",
      vocabIds: ["merhaba", "sola", "duz", "kolay"],
    },
    story:
      "Sultan Ahmed I became sultan at age 14 and immediately ordered the construction of what would become the Blue Mosque. Workers walked this road every day, turning left toward the site, drinking tea together with the sultan himself on cold mornings. After seven years, it was complete — and unlike any mosque before it, it had six minarets.",
    mystery: "Why does the Blue Mosque have six minarets when most mosques have only four?",
    mysteryReveal:
      "Legend says Sultan Ahmed ordered an 'altın' (golden) minaret, but the architect heard 'altı' (six). Instead of admitting the mistake, he built six — making it the only mosque in Istanbul with that many. A single misheard word changed architecture forever.",
    quizQuestions: [
      {
        question: "How did Sultan Ahmed greet the workers each morning?",
        correctAnswer: "merhaba — hello",
        wrongAnswers: ["güle güle — goodbye", "hayır — no"],
        vocabWord: FALLBACK_VOCAB[0],
        explanation: "Merhaba means hello. The sultan greeted his workers every morning at the construction site.",
      },
      {
        question: "Which direction did workers turn to reach the mosque?",
        correctAnswer: "sola — left",
        wrongAnswers: ["sağa — right", "geri — back"],
        vocabWord: FALLBACK_VOCAB[1],
        explanation: "Sola means left. Workers turned left on this road to reach the Blue Mosque construction site.",
      },
      {
        question: "What did the sultan and workers share on cold mornings?",
        correctAnswer: "çay — tea",
        wrongAnswers: ["su — water", "süt — milk"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "cay")!,
        explanation: "Çay means tea. Turkish tea culture is central to daily life — even a sultan drank it with his workers.",
      },
      {
        question: "How long did it take to build the Blue Mosque?",
        correctAnswer: "yedi yıl — seven years",
        wrongAnswers: ["üç yıl — three years", "on yıl — ten years"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "yil")!,
        explanation: "Yıl means year. The Blue Mosque took seven years to complete, from 1609 to 1616.",
      },
    ],
  },

  3: {
    dialogue: {
      id: "istanbul-vendor",
      city: "istanbul",
      scene: 3,
      difficulty: 2,
      npcName: "Market Vendor",
      situation: "Bargaining at the Grand Bazaar over tea and carpets",
      transcript:
        "Hoş geldiniz! Welcome to the Grand Bazaar! You know, bu, this place, it's one of the oldest covered markets in the world. Beş yüz yıl, five hundred years old! In 1461, Sultan Mehmed the Conqueror built it right after taking Constantinople. He wanted a place where the whole world could trade. Silk from China, spices from India, carpets from Persia — all here! See these carpets? Çok güzel, very beautiful. Each one takes a family beş, five months to weave by hand. The colors come from natural dyes — pomegranate for red, indigo for blue. And after all that work, we sit and drink çay, tea, together before any price is discussed. That's the rule — çay first, business second. Bu, this tradition, nobody breaks it. Even Mehmed himself would share çay with merchants before collecting taxes...",
      vocabIds: ["hos-geldiniz", "cay", "bes", "cok-guzel"],
    },
    story:
      "The Grand Bazaar was built in 1461 by Sultan Mehmed the Conqueror, making it one of the oldest covered markets in the world. It was designed as a meeting point for traders from across the known world. Each handwoven carpet takes five months of work, and the tradition of sharing tea before any business negotiation has survived over five centuries.",
    mystery: "The Grand Bazaar has 61 streets and over 4,000 shops. But there's a secret room that almost no one visits. What is it?",
    mysteryReveal:
      "Deep inside the bazaar, there's a tiny cami, a mosque, hidden between shops — Sandal Bedesteni. It was Mehmed's personal prayer room. He'd slip away from the traders, pray quietly, then return to bargaining. The world's busiest market hides the world's most peaceful room.",
    quizQuestions: [
      {
        question: "How does the vendor welcome you to the bazaar?",
        correctAnswer: "hoş geldiniz — welcome",
        wrongAnswers: ["merhaba — hello", "nasılsınız — how are you"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "hos-geldiniz")!,
        explanation: "Hoş geldiniz means welcome. It's the traditional greeting when someone enters your shop or home.",
      },
      {
        question: "What must happen before any business is discussed?",
        correctAnswer: "çay — tea",
        wrongAnswers: ["para — money", "selam — greeting"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "cay")!,
        explanation: "Çay (tea) first, business second — this tradition is sacred in Turkish bazaar culture.",
      },
      {
        question: "How many months does it take to weave one carpet?",
        correctAnswer: "beş — five",
        wrongAnswers: ["üç — three", "on — ten"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "bes")!,
        explanation: "Beş means five. A family spends five months weaving a single carpet by hand.",
      },
      {
        question: "How does the vendor describe the carpets?",
        correctAnswer: "çok güzel — very beautiful",
        wrongAnswers: ["çok pahalı — very expensive", "çok büyük — very big"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "cok-guzel")!,
        explanation: "Çok güzel means very beautiful — the phrase you'll hear most in any Turkish bazaar.",
      },
    ],
  },

  4: {
    dialogue: {
      id: "istanbul-historian",
      city: "istanbul",
      scene: 4,
      difficulty: 3,
      npcName: "Old Historian",
      situation: "Conversation with an elderly historian near a mosque courtyard",
      transcript:
        "Bu cami, this mosque, çok eski, very old. Dört yüz yıl, four hundred years. But I want to tell you something most tourists never learn. There was a man named Matrakçı Nasuh. He was the greatest artist of the Ottoman Empire, and he painted bu, this very skyline you see now, in the year 1530. Every cami, every minaret, every street — he drew them all from memory after walking through the city. He was also a mathematician, a swordsman, and an inventor. They called him a 'Renaissance man' before the Europeans invented the word. His maps are still in the Topkapı Palace, and if you look carefully, he marked a small kitapçı, a bookshop, right here in Sultanahmet. Some say it still exists. Arıyorsunuz? You search for it? Maybe you're closer than you think...",
      vocabIds: ["bu", "cami", "eski", "dort-yuz", "yil", "kitapci", "ariyorsunuz"],
    },
    story:
      "Matrakçı Nasuh was the Ottoman Empire's greatest polymath — painter, mathematician, swordsman, inventor. In 1530, he painted the Istanbul skyline from memory, marking every mosque, minaret, and street with astonishing accuracy. His maps, still preserved in Topkapı Palace, contain details that surprise historians even today.",
    mystery: "Matrakçı marked a small bookshop on his 1530 map of Sultanahmet. Does it still exist?",
    mysteryReveal:
      "No one knows for certain. But in 1997, during restoration work on an eski (old) building in Sultanahmet, workers found a hidden basement room filled with shelves carved into stone walls — exactly where Matrakçı's map showed a kitapçı. The room had been sealed for centuries. Some books were still inside, preserved by the cool, dry stone. You might be standing on top of it right now.",
    quizQuestions: [
      {
        question: "What did Matrakçı Nasuh paint from memory in 1530?",
        correctAnswer: "bu cami — this mosque (and the whole skyline)",
        wrongAnswers: ["bu kitap — this book", "bu deniz — this sea"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "cami")!,
        explanation: "Cami means mosque. Matrakçı painted every cami in Istanbul's skyline from memory alone.",
      },
      {
        question: "How old is the mosque the historian describes?",
        correctAnswer: "dört yüz yıl — four hundred years",
        wrongAnswers: ["yüz yıl — one hundred years", "bin yıl — one thousand years"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "dort-yuz")!,
        explanation: "Dört yüz means four hundred. Many Ottoman mosques in Istanbul are over 400 years old.",
      },
      {
        question: "What did Matrakçı mark on his map of Sultanahmet?",
        correctAnswer: "kitapçı — bookshop",
        wrongAnswers: ["hastane — hospital", "saray — palace"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "kitapci")!,
        explanation: "Kitapçı means bookshop — and this is the one you've been searching for all along.",
      },
      {
        question: "What is the historian asking you at the end?",
        correctAnswer: "arıyorsunuz — you search",
        wrongAnswers: ["biliyorsunuz — you know", "seviyorsunuz — you love"],
        vocabWord: FALLBACK_VOCAB.find((v) => v.id === "ariyorsunuz")!,
        explanation: "Arıyorsunuz means 'you search.' The historian knows what you're looking for.",
      },
    ],
  },
};

export const FALLBACK_DIALOGUES: DialogueData[] = Object.values(SCENE_STORIES).map(
  (s) => s.dialogue
);

export function getVocabForScene(scene: number): VocabWord[] {
  return FALLBACK_VOCAB.filter((v) => v.scene === scene);
}

export function getDialogueForScene(scene: number): DialogueData | undefined {
  return FALLBACK_DIALOGUES.find((d) => d.scene === scene);
}

export function getStoryForScene(scene: number): SceneStory | undefined {
  return SCENE_STORIES[scene];
}
