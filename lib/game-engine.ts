import {
  GameState,
  QuizQuestion,
  SceneId,
  SCENE_ORDER,
  VocabWord,
} from "./types";

export function createInitialState(): GameState {
  return {
    currentScene: "SCENE_1_ARRIVAL",
    learnedWords: [],
    currentQuiz: [],
    quizIndex: 0,
    quizCorrect: 0,
    audioUnlocked: false,
  };
}

export function advanceScene(state: GameState): GameState {
  const currentIndex = SCENE_ORDER.indexOf(state.currentScene);
  if (currentIndex === -1 || currentIndex >= SCENE_ORDER.length - 1) {
    return state;
  }
  return {
    ...state,
    currentScene: SCENE_ORDER[currentIndex + 1],
    quizIndex: 0,
    quizCorrect: 0,
  };
}

export function isQuizScene(scene: SceneId): boolean {
  return scene.startsWith("QUIZ_");
}

export function isDialogueScene(scene: SceneId): boolean {
  return (
    scene === "SCENE_2_TAXI" ||
    scene === "SCENE_3_MARKET" ||
    scene === "SCENE_4_HISTORIAN"
  );
}

export function isFinale(scene: SceneId): boolean {
  return scene === "SCENE_5_FINALE";
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuiz(
  sceneVocab: VocabWord[],
  learnedWords: VocabWord[]
): QuizQuestion[] {
  const allTranslations = [
    ...sceneVocab.map((w) => w.translation),
    ...learnedWords.map((w) => w.translation),
    "goodbye",
    "yes",
    "no",
    "please",
    "thank you",
    "water",
    "bread",
    "house",
    "big",
    "small",
  ];

  // Current scene words + 1-2 random from learned
  const quizWords = [...sceneVocab];
  if (learnedWords.length > 0) {
    const sample = shuffle(learnedWords).slice(0, Math.min(2, learnedWords.length));
    for (const w of sample) {
      if (!quizWords.find((q) => q.id === w.id)) {
        quizWords.push(w);
      }
    }
  }

  return shuffle(quizWords).map((word) => {
    const wrongOptions = shuffle(
      allTranslations.filter((t) => t !== word.translation)
    ).slice(0, 2);

    const options = shuffle([word.translation, ...wrongOptions]);
    return {
      word,
      options,
      correctIndex: options.indexOf(word.translation),
    };
  });
}

export function answerQuiz(
  state: GameState,
  selectedIndex: number
): { correct: boolean; newState: GameState } {
  const question = state.currentQuiz[state.quizIndex];
  const correct = selectedIndex === question.correctIndex;

  const newState: GameState = {
    ...state,
    quizIndex: state.quizIndex + 1,
    quizCorrect: correct ? state.quizCorrect + 1 : state.quizCorrect,
  };

  // If wrong, re-add the word to the end of the quiz
  if (!correct) {
    const reQuestion = generateQuiz([question.word], [])[0];
    newState.currentQuiz = [...state.currentQuiz, reQuestion];
  }

  return { correct, newState };
}

export function isQuizComplete(state: GameState): boolean {
  return state.quizIndex >= state.currentQuiz.length;
}

export function completeQuiz(state: GameState): GameState {
  // Add all quiz words to learnedWords
  const newLearned = state.currentQuiz
    .map((q) => q.word)
    .filter((w) => !state.learnedWords.find((l) => l.id === w.id));

  return {
    ...state,
    learnedWords: [...state.learnedWords, ...newLearned],
  };
}
