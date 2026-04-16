export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  difficulty: 1 | 2 | 3;
  category: string;
  city: string;
  scene: number;
}

export interface DialogueData {
  id: string;
  city: string;
  scene: number;
  difficulty: 1 | 2 | 3;
  npcName: string;
  situation: string;
  transcript: string;
  vocabIds: string[];
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  description: string;
  themeColor: string;
  difficulty: string;
}

export type SceneId =
  | "SCENE_1_ARRIVAL"
  | "SCENE_2_TAXI"
  | "QUIZ_1"
  | "SCENE_3_MARKET"
  | "QUIZ_2"
  | "SCENE_4_HISTORIAN"
  | "QUIZ_3"
  | "SCENE_5_FINALE";

export interface QuizQuestion {
  word: VocabWord;
  options: string[];
  correctIndex: number;
}

export interface GameState {
  currentScene: SceneId;
  learnedWords: VocabWord[];
  currentQuiz: QuizQuestion[];
  quizIndex: number;
  quizCorrect: number;
  audioUnlocked: boolean;
}

export const SCENE_ORDER: SceneId[] = [
  "SCENE_1_ARRIVAL",
  "SCENE_2_TAXI",
  "QUIZ_1",
  "SCENE_3_MARKET",
  "QUIZ_2",
  "SCENE_4_HISTORIAN",
  "QUIZ_3",
  "SCENE_5_FINALE",
];

export const SCENE_PROGRESS: Record<SceneId, number> = {
  SCENE_1_ARRIVAL: 1,
  SCENE_2_TAXI: 2,
  QUIZ_1: 2,
  SCENE_3_MARKET: 3,
  QUIZ_2: 3,
  SCENE_4_HISTORIAN: 4,
  QUIZ_3: 4,
  SCENE_5_FINALE: 5,
};

export interface SceneConfig {
  id: SceneId;
  sfx?: string;
  music?: string;
  tts?: string;
  npcName?: string;
  sceneNumber: number;
}

export const SCENE_CONFIGS: Record<string, SceneConfig> = {
  SCENE_1_ARRIVAL: {
    id: "SCENE_1_ARRIVAL",
    sfx: "/audio/sfx/istanbul-arrival.mp3",
    music: "/audio/music/istanbul-ambient.mp3",
    sceneNumber: 1,
  },
  SCENE_2_TAXI: {
    id: "SCENE_2_TAXI",
    sfx: "/audio/sfx/istanbul-arrival.mp3",
    music: "/audio/music/istanbul-ambient.mp3",
    tts: "/audio/tts/taxi-driver.mp3",
    npcName: "Taxi Driver",
    sceneNumber: 2,
  },
  SCENE_3_MARKET: {
    id: "SCENE_3_MARKET",
    sfx: "/audio/sfx/istanbul-bazaar.mp3",
    music: "/audio/music/istanbul-ambient.mp3",
    tts: "/audio/tts/vendor.mp3",
    npcName: "Market Vendor",
    sceneNumber: 3,
  },
  SCENE_4_HISTORIAN: {
    id: "SCENE_4_HISTORIAN",
    sfx: "/audio/sfx/istanbul-courtyard.mp3",
    music: "/audio/music/istanbul-ambient.mp3",
    tts: "/audio/tts/historian.mp3",
    npcName: "Old Historian",
    sceneNumber: 4,
  },
  SCENE_5_FINALE: {
    id: "SCENE_5_FINALE",
    sfx: "/audio/sfx/istanbul-postcard.mp3",
    music: "/audio/music/istanbul-ambient.mp3",
    sceneNumber: 5,
  },
};
