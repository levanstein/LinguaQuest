import {
  GameAction,
  GameState,
  QuizQuestion,
  SceneId,
  SCENE_ORDER,
  VocabWord,
} from "./types";

const MAX_RETRIES_PER_WORD = 2;

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

function advanceScene(state: GameState): GameState {
  const currentIndex = SCENE_ORDER.indexOf(state.currentScene);
  if (currentIndex === -1 || currentIndex >= SCENE_ORDER.length - 1) {
    return state;
  }
  return {
    ...state,
    currentScene: SCENE_ORDER[currentIndex + 1],
    currentQuiz: [],
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

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const FILLER_TRANSLATIONS = [
  "goodbye", "yes", "no", "please", "thank you",
  "water", "bread", "house", "big", "small",
];

export function generateQuiz(
  sceneVocab: VocabWord[],
  learnedWords: VocabWord[]
): QuizQuestion[] {
  const allTranslations = new Set([
    ...sceneVocab.map((w) => w.translation),
    ...learnedWords.map((w) => w.translation),
    ...FILLER_TRANSLATIONS,
  ]);

  const quizWords = [...sceneVocab];
  const seenIds = new Set(quizWords.map((w) => w.id));

  if (learnedWords.length > 0) {
    for (const w of shuffle(learnedWords)) {
      if (seenIds.has(w.id)) continue;
      quizWords.push(w);
      seenIds.add(w.id);
      if (quizWords.length - sceneVocab.length >= 2) break;
    }
  }

  const translationArray = [...allTranslations];

  return shuffle(quizWords).map((word) => {
    const wrongOptions = shuffle(
      translationArray.filter((t) => t !== word.translation)
    ).slice(0, 2);

    const options = shuffle([word.translation, ...wrongOptions]);
    return {
      word,
      options,
      correctIndex: options.indexOf(word.translation),
    };
  });
}

export function isQuizComplete(state: GameState): boolean {
  return state.quizIndex >= state.currentQuiz.length;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "UNLOCK_AUDIO":
      return { ...state, audioUnlocked: true };

    case "ADVANCE_SCENE":
      return advanceScene(state);

    case "SET_QUIZ":
      return { ...state, currentQuiz: action.quiz, quizIndex: 0, quizCorrect: 0 };

    case "ANSWER_QUIZ": {
      if (state.quizIndex >= state.currentQuiz.length) return state;

      const question = state.currentQuiz[state.quizIndex];
      const correct = action.selectedIndex === question.correctIndex;
      const nextQuiz = [...state.currentQuiz];

      if (!correct) {
        const retryCount = nextQuiz.filter((q) => q.word.id === question.word.id).length;
        if (retryCount <= MAX_RETRIES_PER_WORD) {
          const reQuestion = generateQuiz([question.word], [])[0];
          nextQuiz.push(reQuestion);
        }
      }

      return {
        ...state,
        currentQuiz: nextQuiz,
        quizIndex: state.quizIndex + 1,
        quizCorrect: correct ? state.quizCorrect + 1 : state.quizCorrect,
      };
    }

    case "COMPLETE_QUIZ": {
      const newLearned = state.currentQuiz
        .map((q) => q.word)
        .filter((w) => !state.learnedWords.find((l) => l.id === w.id));

      return advanceScene({
        ...state,
        learnedWords: [...state.learnedWords, ...newLearned],
      });
    }

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}
