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
  { id: "cami", word: "cami", translation: "mosque", difficulty: 1, category: "culture", city: "istanbul", scene: 2 },
  { id: "sola", word: "sola", translation: "left", difficulty: 1, category: "direction", city: "istanbul", scene: 2 },
  { id: "duz", word: "düz", translation: "straight", difficulty: 1, category: "direction", city: "istanbul", scene: 2 },
  { id: "cay", word: "çay", translation: "tea", difficulty: 1, category: "food", city: "istanbul", scene: 2 },
  { id: "yil", word: "yıl", translation: "year", difficulty: 1, category: "time", city: "istanbul", scene: 2 },
  { id: "kolay", word: "kolay", translation: "easy", difficulty: 1, category: "adjective", city: "istanbul", scene: 2 },
  { id: "hos-geldiniz", word: "hoş geldiniz", translation: "welcome", difficulty: 2, category: "greeting", city: "istanbul", scene: 3 },
  { id: "bu", word: "bu", translation: "this", difficulty: 2, category: "pronoun", city: "istanbul", scene: 3 },
  { id: "bes", word: "beş", translation: "five", difficulty: 2, category: "number", city: "istanbul", scene: 3 },
  { id: "cok-guzel", word: "çok güzel", translation: "very beautiful", difficulty: 2, category: "adjective", city: "istanbul", scene: 3 },
  { id: "eski", word: "eski", translation: "old", difficulty: 3, category: "adjective", city: "istanbul", scene: 4 },
  { id: "dort-yuz", word: "dört yüz", translation: "four hundred", difficulty: 3, category: "number", city: "istanbul", scene: 4 },
  { id: "kitapci", word: "kitapçı", translation: "bookshop", difficulty: 3, category: "place", city: "istanbul", scene: 4 },
  { id: "ariyorsunuz", word: "arıyorsunuz", translation: "you search", difficulty: 3, category: "verb", city: "istanbul", scene: 4 },
];

export interface StoryQuizQuestion {
  question: string;
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

const V = (id: string) => FALLBACK_VOCAB.find((v) => v.id === id)!;

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
        "Merhaba, friend! Welcome to Istanbul. You going to Sultanahmet? Good, good. Let me tell you something about this road.\n\nYou see, Sultan Ahmed the First... he was only fourteen years old when he became sultan. Fourteen! And the first thing he wanted? A cami so beautiful the whole world would remember it. A mosque like no other.\n\nEvery morning, thousands of workers would walk this very road. They would turn sola, to the left, right here where we are turning now. Then go düz, straight ahead, all the way to the construction site.\n\nAnd you know what kept them all going through those cold Istanbul mornings? Çay. Tea. The sultan himself would sit with the workers and share çay with them. Can you imagine? A sultan, drinking tea with builders.\n\nThey worked for seven yıl. Seven years. And when it was finished, people called it the Blue Mosque because of twenty thousand blue tiles inside. Kolay to find, easy! Just follow this road, you will see six minarets touching the sky.\n\nBut here is something strange... most mosques have four minarets. This one has six. Nobody knows exactly why Ahmed wanted six. Some say the architect misheard the sultan's order...",
      vocabIds: ["merhaba", "cami", "sola", "duz", "cay", "yil", "kolay"],
    },
    story: "Sultan Ahmed I became sultan at age 14 and ordered the construction of what would become the Blue Mosque. Workers walked this road every day, turning left toward the site, drinking tea with the sultan on cold mornings. After seven years, it was complete with twenty thousand blue tiles and six minarets.",
    mystery: "Why does the Blue Mosque have six minarets when most mosques have only four?",
    mysteryReveal:
      "Legend says Sultan Ahmed ordered an 'altın' (golden) minaret, but the architect heard 'altı' (six). Instead of admitting the mistake, he built all six. A single misheard Turkish word changed architecture forever.",
    quizQuestions: [
      {
        question: "How did Sultan Ahmed greet the workers each morning at the construction site?",
        correctAnswer: "merhaba — hello",
        wrongAnswers: ["güle güle — goodbye", "hayır — no"],
        vocabWord: V("merhaba"),
        explanation: "Merhaba means hello. The young sultan greeted his workers personally every morning.",
      },
      {
        question: "Which direction did the workers turn on this road to reach the mosque?",
        correctAnswer: "sola — left",
        wrongAnswers: ["sağa — right", "geri — back"],
        vocabWord: V("sola"),
        explanation: "Sola means left. Workers turned left on this very road to reach the Blue Mosque site.",
      },
      {
        question: "What did the sultan share with his builders on cold mornings?",
        correctAnswer: "çay — tea",
        wrongAnswers: ["su — water", "süt — milk"],
        vocabWord: V("cay"),
        explanation: "Çay means tea. A sultan drinking tea with his builders — that's Turkish tea culture.",
      },
      {
        question: "How many years did it take to build the Blue Mosque?",
        correctAnswer: "yedi yıl — seven years",
        wrongAnswers: ["üç yıl — three years", "on yıl — ten years"],
        vocabWord: V("yil"),
        explanation: "Yıl means year. The Blue Mosque took seven years: 1609 to 1616.",
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
        "Hoş geldiniz! Welcome, welcome to the Grand Bazaar!\n\nYou know what this place is? Bu... this is one of the oldest covered markets in the whole world. Beş yüz yıl. Five hundred years old! In 1461, Sultan Mehmed the Conqueror built it. He had just taken Constantinople, and he wanted one thing: a place where the whole world could come and trade. Silk from China, spices from India, carpets from Persia, all under one roof.\n\nLook at these carpets. Çok güzel, very beautiful, yes? But beauty takes time. Each carpet takes a whole family beş ay, five months, to weave by hand. The red comes from pomegranate, the blue from indigo, the yellow from saffron. No chemicals, no machines. Just hands and time.\n\nAnd here is the rule of the bazaar. Before any price, before any business... first we drink çay. Tea. Always. Çay first, money second. Bu gelenek, this tradition, nobody breaks. Even Mehmed himself, the Conqueror of Constantinople, would sit with his merchants and share çay before collecting a single coin.\n\nFive hundred years, and we still do the same thing. Would you like some çay?",
      vocabIds: ["hos-geldiniz", "bu", "bes", "cok-guzel", "cay"],
    },
    story: "The Grand Bazaar was built in 1461 by Sultan Mehmed the Conqueror as a place where the whole world could trade. Each handwoven carpet takes five months. The tradition of tea before business has survived over five centuries.",
    mystery: "The Grand Bazaar has 61 streets and over 4,000 shops. But there's a secret room almost no one visits. What is it?",
    mysteryReveal:
      "Deep inside the bazaar, hidden between shops, there's a tiny cami, a mosque called Sandal Bedesteni. It was Mehmed's personal prayer room. He'd slip away from the traders, pray quietly, then return to bargaining. The world's busiest market hides the world's most peaceful room.",
    quizQuestions: [
      {
        question: "How does the vendor welcome you into the bazaar?",
        correctAnswer: "hoş geldiniz — welcome",
        wrongAnswers: ["merhaba — hello", "nasılsınız — how are you"],
        vocabWord: V("hos-geldiniz"),
        explanation: "Hoş geldiniz means welcome. The traditional greeting when someone enters your shop or home.",
      },
      {
        question: "What must happen before any business in the bazaar?",
        correctAnswer: "çay — tea first",
        wrongAnswers: ["para — money first", "selam — greeting first"],
        vocabWord: V("cay"),
        explanation: "Çay first, business second. This 500-year-old tradition is sacred in Turkish bazaar culture.",
      },
      {
        question: "How long does one family spend weaving a single carpet?",
        correctAnswer: "beş ay — five months",
        wrongAnswers: ["üç ay — three months", "on ay — ten months"],
        vocabWord: V("bes"),
        explanation: "Beş means five. One family, five months, one carpet. Dyes from pomegranate, indigo, saffron.",
      },
      {
        question: "How does the vendor describe her carpets?",
        correctAnswer: "çok güzel — very beautiful",
        wrongAnswers: ["çok pahalı — very expensive", "çok büyük — very big"],
        vocabWord: V("cok-guzel"),
        explanation: "Çok güzel means very beautiful. The phrase you'll hear most in any Turkish bazaar.",
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
        "Ah... you came. Good. Sit with me here, in the shadow of bu cami. This mosque. It is çok eski, very old. Dört yüz yıl. Four hundred years.\n\nBut I did not ask you here to talk about mosques. I want to tell you about a man. His name was Matrakçı Nasuh. You have never heard of him. Almost nobody has. And that is a crime.\n\nMatrakçı was the greatest artist of the Ottoman Empire. In the year 1530, he painted bu, this very skyline you see right now. Every cami, every minaret, every narrow street, he drew them all. From memory. He walked through Istanbul for weeks, memorized everything, then painted it all on a single scroll.\n\nBut here is what makes him eski in the best sense, old but timeless. He was not only a painter. He was a mathematician who invented new ways to calculate. A swordsman who created his own fighting style. An inventor. They called him a Renaissance man before Europe even had the word.\n\nHis maps are still in Topkapı Palace today. And if you look very carefully at his map of Sultanahmet... he marked a small kitapçı. A bookshop. Right here. In this neighborhood.\n\nArıyorsunuz, yes? You search for it? Maybe... maybe you are closer than you think.",
      vocabIds: ["bu", "cami", "eski", "dort-yuz", "yil", "kitapci", "ariyorsunuz"],
    },
    story: "Matrakçı Nasuh was the Ottoman Empire's greatest polymath. In 1530, he painted the Istanbul skyline from memory, marking every mosque, minaret, and street. His maps in Topkapı Palace contain details that surprise historians today.",
    mystery: "Matrakçı marked a small bookshop on his 1530 map of Sultanahmet. Could it still exist, nearly 500 years later?",
    mysteryReveal:
      "In 1997, during restoration of an eski building in Sultanahmet, workers found a hidden basement room. Stone walls with shelves carved into them, exactly where Matrakçı's map showed a kitapçı. The room had been sealed for centuries. Some books were still inside, preserved by the cool stone. You might be standing on top of it right now.",
    quizQuestions: [
      {
        question: "What did Matrakçı Nasuh paint from memory in 1530?",
        correctAnswer: "bu cami — this mosque and the skyline",
        wrongAnswers: ["bu kitap — this book", "bu deniz — this sea"],
        vocabWord: V("cami"),
        explanation: "Cami means mosque. Matrakçı painted every cami in Istanbul's skyline from memory alone.",
      },
      {
        question: "How old is the mosque the historian describes?",
        correctAnswer: "dört yüz yıl — four hundred years",
        wrongAnswers: ["yüz yıl — one hundred years", "bin yıl — one thousand years"],
        vocabWord: V("dort-yuz"),
        explanation: "Dört yüz means four hundred. Many Ottoman mosques in Istanbul are over 400 years old.",
      },
      {
        question: "What did Matrakçı mark on his map of Sultanahmet?",
        correctAnswer: "kitapçı — bookshop",
        wrongAnswers: ["hastane — hospital", "saray — palace"],
        vocabWord: V("kitapci"),
        explanation: "Kitapçı means bookshop. This is the one you've been searching for all along.",
      },
      {
        question: "What is the historian asking you at the end?",
        correctAnswer: "arıyorsunuz — you search",
        wrongAnswers: ["biliyorsunuz — you know", "seviyorsunuz — you love"],
        vocabWord: V("ariyorsunuz"),
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
