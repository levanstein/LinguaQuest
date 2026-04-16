"use client";

import { useCallback, useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayer from "@/components/AudioPlayer";
import DialogueBubble from "@/components/DialogueBubble";
import QuizCard from "@/components/QuizCard";
import VocabSummary from "@/components/VocabSummary";
import {
  createInitialState,
  advanceScene,
  isQuizScene,
  isDialogueScene,
  isFinale,
  generateQuiz,
  answerQuiz,
  isQuizComplete,
  completeQuiz,
} from "@/lib/game-engine";
import { SCENE_CONFIGS, type GameState, type VocabWord, type DialogueData } from "@/lib/types";
import { getVocabForScene, getDialogueForScene } from "@/lib/fallback-data";

export default function PlayPage() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [transitioning, setTransitioning] = useState(false);
  const [showWellDone, setShowWellDone] = useState(false);
  const [dialogue, setDialogue] = useState<DialogueData | null>(null);
  const [sceneVocab, setSceneVocab] = useState<VocabWord[]>([]);
  const [confetti, setConfetti] = useState(false);

  const scene = gameState.currentScene;
  const config = SCENE_CONFIGS[scene];

  // Fetch dialogue and vocab for current scene
  useEffect(() => {
    if (isDialogueScene(scene)) {
      const sceneNum = config?.sceneNumber || 2;

      // Try API first, fall back to local data
      fetch(`/api/dialogue?scene=${sceneNum}`)
        .then((r) => r.json())
        .then((d) => setDialogue(d))
        .catch(() => setDialogue(getDialogueForScene(sceneNum) || null));

      fetch(`/api/vocab?scene=${sceneNum}`)
        .then((r) => r.json())
        .then((v) => setSceneVocab(Array.isArray(v) ? v : []))
        .catch(() => setSceneVocab(getVocabForScene(sceneNum)));
    }
  }, [scene, config?.sceneNumber]);

  // When entering a quiz scene, generate quiz questions
  useEffect(() => {
    if (isQuizScene(scene) && gameState.currentQuiz.length === 0) {
      const quiz = generateQuiz(sceneVocab, gameState.learnedWords);
      setGameState((s) => ({ ...s, currentQuiz: quiz }));
    }
  }, [scene, sceneVocab, gameState.learnedWords, gameState.currentQuiz.length]);

  const handleTransition = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setGameState((s) => advanceScene(s));
      setDialogue(null);
      setSceneVocab([]);
      setTransitioning(false);
    }, 500);
  }, []);

  const handleQuizComplete = useCallback(() => {
    setShowWellDone(true);
    const completed = completeQuiz(gameState);
    setGameState(completed);

    setTimeout(() => {
      setShowWellDone(false);
      setTransitioning(true);
      setTimeout(() => {
        setGameState((s) => ({
          ...advanceScene(s),
          learnedWords: completed.learnedWords,
          currentQuiz: [],
        }));
        setTransitioning(false);
      }, 500);
    }, 1500);
  }, [gameState]);

  const handleQuizAnswer = useCallback(
    (selectedIndex: number) => {
      const { newState } = answerQuiz(gameState, selectedIndex);
      setGameState(newState);

      if (isQuizComplete(newState)) {
        setTimeout(() => handleQuizComplete(), 300);
      }
    },
    [gameState, handleQuizComplete]
  );

  const unlockAudio = useCallback(() => {
    setGameState((s) => ({ ...s, audioUnlocked: true }));
  }, []);

  // Trigger confetti for finale
  useEffect(() => {
    if (isFinale(scene)) {
      setTimeout(() => setConfetti(true), 500);
    }
  }, [scene]);

  return (
    <div className={`min-h-dvh flex flex-col ${transitioning ? "scene-fade-out" : "scene-enter"}`}>
      <ProgressBar scene={scene} />

      <div className="flex-1 flex flex-col">
        {/* ARRIVAL */}
        {scene === "SCENE_1_ARRIVAL" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            {/* Skyline gradient */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(180deg, transparent 30%, #2d1d0a 60%, #1a1205 80%, transparent 100%)",
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl font-bold text-amber-500 mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Istanbul
              </h2>
              <p
                className="text-white text-lg leading-relaxed mb-8 max-w-[320px]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                You just landed in Istanbul. Find the hidden bookshop in
                Sultanahmet before sunset.
              </p>
              <button
                onClick={() => {
                  unlockAudio();
                  handleTransition();
                }}
                className="px-8 py-4 bg-amber-500 text-black rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors min-h-[48px]"
              >
                Begin
              </button>
            </div>
          </div>
        )}

        {/* DIALOGUE SCENES */}
        {isDialogueScene(scene) && dialogue && (
          <DialogueBubble
            npcName={dialogue.npcName}
            transcript={dialogue.transcript}
            vocabWords={sceneVocab}
            ttsSrc={config?.tts}
            audioUnlocked={gameState.audioUnlocked}
            onContinue={handleTransition}
          />
        )}

        {isDialogueScene(scene) && !dialogue && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[#A3A3A3] text-sm animate-pulse">Loading encounter...</div>
          </div>
        )}

        {/* QUIZ SCENES */}
        {isQuizScene(scene) && !showWellDone && gameState.currentQuiz.length > 0 && (
          <div className="flex-1 relative">
            {/* Dimmed background overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 py-6">
              <QuizCard
                question={gameState.currentQuiz[gameState.quizIndex]}
                questionNumber={gameState.quizIndex + 1}
                totalQuestions={gameState.currentQuiz.length}
                onAnswer={handleQuizAnswer}
              />
            </div>
          </div>
        )}

        {/* WELL DONE INTERSTITIAL */}
        {showWellDone && (
          <div className="flex-1 flex items-center justify-center">
            <p
              className="text-2xl font-bold text-amber-500 scene-enter"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Well done!
            </p>
          </div>
        )}

        {/* FINALE */}
        {isFinale(scene) && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">
            {/* Confetti */}
            {confetti &&
              Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="confetti-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${-10 + Math.random() * 20}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    background:
                      i % 3 === 0
                        ? "#F59E0B"
                        : i % 3 === 1
                        ? "#FBBF24"
                        : "#FDE68A",
                  }}
                />
              ))}

            <div className="relative z-10">
              <h2
                className="text-3xl font-bold text-amber-500 mb-3 scene-enter"
                style={{ fontFamily: "Georgia, serif" }}
              >
                You found the bookshop!
              </h2>

              <VocabSummary words={gameState.learnedWords} />

              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 border border-amber-500 text-amber-500 rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber-500/10 transition-colors min-h-[48px]"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audio player — always at bottom */}
      {scene !== "SCENE_1_ARRIVAL" && (
        <AudioPlayer
          sfxSrc={config?.sfx}
          musicSrc={config?.music}
          label={
            scene === "SCENE_5_FINALE"
              ? "Istanbul Sound Postcard"
              : config?.npcName
              ? `${config.npcName} · Istanbul`
              : "Istanbul Arrival"
          }
          audioUnlocked={gameState.audioUnlocked}
        />
      )}
    </div>
  );
}
