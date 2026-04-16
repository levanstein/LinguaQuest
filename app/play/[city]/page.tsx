"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayer from "@/components/AudioPlayer";
import DialogueBubble from "@/components/DialogueBubble";
import QuizCard from "@/components/QuizCard";
import VocabSummary from "@/components/VocabSummary";
import SceneIllustration from "@/components/SceneIllustration";
import {
  createInitialState,
  gameReducer,
  isQuizScene,
  isDialogueScene,
  isFinale,
  isQuizComplete,
  generateQuiz,
} from "@/lib/game-engine";
import { SCENE_CONFIGS, type VocabWord, type DialogueData } from "@/lib/types";
import { getVocabForScene, getDialogueForScene } from "@/lib/fallback-data";

export default function PlayPage() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [transitioning, setTransitioning] = useState(false);
  const [overlay, setOverlay] = useState<"well-done" | null>(null);
  const [dialogue, setDialogue] = useState<DialogueData | null>(null);
  const [sceneVocab, setSceneVocab] = useState<VocabWord[]>([]);
  const quizGenerated = useRef(false);
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scene = state.currentScene;
  const config = SCENE_CONFIGS[scene];

  useEffect(() => {
    return () => { transitionTimers.current.forEach(clearTimeout); };
  }, []);

  // Fetch dialogue and vocab for dialogue scenes
  useEffect(() => {
    if (!isDialogueScene(scene)) return;

    const controller = new AbortController();
    const sceneNum = config?.sceneNumber || 2;

    Promise.all([
      fetch(`/api/dialogue?scene=${sceneNum}`, { signal: controller.signal })
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
      fetch(`/api/vocab?scene=${sceneNum}`, { signal: controller.signal })
        .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    ])
      .then(([d, v]) => {
        setDialogue(d);
        setSceneVocab(Array.isArray(v) ? v : []);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setDialogue(getDialogueForScene(sceneNum) || null);
        setSceneVocab(getVocabForScene(sceneNum));
      });

    return () => controller.abort();
  }, [scene, config?.sceneNumber]);

  // Generate quiz when entering quiz scene — uses vocab from previous dialogue
  useEffect(() => {
    if (isQuizScene(scene) && !quizGenerated.current && sceneVocab.length > 0) {
      quizGenerated.current = true;
      const quiz = generateQuiz(sceneVocab, state.learnedWords);
      dispatch({ type: "SET_QUIZ", quiz });
    }
    if (!isQuizScene(scene)) {
      quizGenerated.current = false;
    }
  }, [scene, sceneVocab, state.learnedWords]);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    transitionTimers.current.push(id);
    return id;
  }, []);

  // BUG FIX: Don't clear sceneVocab on transition. Quiz needs it.
  // Only clear dialogue (new dialogue scenes will fetch fresh data anyway).
  const handleTransition = useCallback(() => {
    setTransitioning(true);
    scheduleTimer(() => {
      dispatch({ type: "ADVANCE_SCENE" });
      setDialogue(null);
      setTransitioning(false);
    }, 500);
  }, [scheduleTimer]);

  const handleQuizAnswer = useCallback((selectedIndex: number) => {
    dispatch({ type: "ANSWER_QUIZ", selectedIndex });
  }, []);

  // Check if quiz is complete
  useEffect(() => {
    if (!isQuizScene(scene) || state.currentQuiz.length === 0) return;
    if (!isQuizComplete(state)) return;

    setOverlay("well-done");
    scheduleTimer(() => {
      setOverlay(null);
      setTransitioning(true);
      scheduleTimer(() => {
        dispatch({ type: "COMPLETE_QUIZ" });
        // Clear vocab after quiz completes — next dialogue scene will fetch fresh
        setSceneVocab([]);
        setTransitioning(false);
      }, 500);
    }, 1500);
  }, [scene, state.quizIndex, state.currentQuiz.length, scheduleTimer]);

  const confettiParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${-10 + Math.random() * 20}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 2}s`,
        color: ["#F59E0B", "#FBBF24", "#FDE68A"][i % 3],
      })),
    []
  );

  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (!isFinale(scene)) return;
    const id = scheduleTimer(() => setShowConfetti(true), 500);
    return () => clearTimeout(id);
  }, [scene, scheduleTimer]);

  const audioLabel = config?.npcName
    ? `${config.npcName} · Istanbul`
    : isFinale(scene)
    ? "Istanbul Sound Postcard"
    : "Istanbul Arrival";

  const showQuiz =
    isQuizScene(scene) &&
    !overlay &&
    state.currentQuiz.length > 0 &&
    state.quizIndex < state.currentQuiz.length;

  // Determine illustration scene (quiz shows parent dialogue scene's illustration)
  const illustrationScene = isQuizScene(scene)
    ? scene === "QUIZ_1" ? "SCENE_2_TAXI"
      : scene === "QUIZ_2" ? "SCENE_3_MARKET"
      : "SCENE_4_HISTORIAN"
    : scene;

  return (
    <div className={`min-h-dvh flex flex-col ${transitioning ? "scene-fade-out" : "scene-enter"}`}>
      <ProgressBar scene={scene} />

      <div className="flex-1 flex flex-col">
        {/* Arrival */}
        {scene === "SCENE_1_ARRIVAL" && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <SceneIllustration scene="SCENE_1_ARRIVAL" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-amber mb-2 font-display">Istanbul</h2>
              <p className="text-neutral-400 text-sm mb-4">The sun is low. You have until sunset.</p>
              <p className="text-white text-base leading-relaxed mb-6 max-w-[320px] font-display">
                Find the hidden bookshop in Sultanahmet. Talk to the locals, learn their language, follow the clues.
              </p>
              <button
                onClick={() => {
                  dispatch({ type: "UNLOCK_AUDIO" });
                  handleTransition();
                }}
                className="px-8 py-4 bg-amber text-black rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors min-h-[48px]"
              >
                Begin
              </button>
            </div>
          </div>
        )}

        {/* Dialogue scenes */}
        {isDialogueScene(scene) && dialogue && (
          <div className="flex flex-col">
            <div className="px-4 pt-3">
              <SceneIllustration scene={scene} />
            </div>
            <DialogueBubble
              npcName={dialogue.npcName}
              transcript={dialogue.transcript}
              vocabWords={sceneVocab}
              ttsSrc={config?.tts}
              audioUnlocked={state.audioUnlocked}
              onContinue={handleTransition}
            />
          </div>
        )}

        {isDialogueScene(scene) && !dialogue && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-neutral-400 text-sm animate-pulse">Loading encounter...</div>
          </div>
        )}

        {/* Quiz scenes — overlay on scene illustration */}
        {(showQuiz || (isQuizScene(scene) && !overlay)) && (
          <div className="flex-1 relative">
            {/* Scene illustration dimmed behind */}
            <div className="absolute inset-0 opacity-20">
              <div className="px-4 pt-3">
                <SceneIllustration scene={illustrationScene} />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative z-10 py-6">
              {showQuiz ? (
                <QuizCard
                  question={state.currentQuiz[state.quizIndex]}
                  questionNumber={state.quizIndex + 1}
                  totalQuestions={state.currentQuiz.length}
                  onAnswer={handleQuizAnswer}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center pt-20">
                  <div className="text-neutral-400 text-sm animate-pulse">Preparing quiz...</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Well done interstitial */}
        {overlay === "well-done" && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl font-bold text-amber scene-enter font-display">Well done!</p>
          </div>
        )}

        {/* Finale */}
        {isFinale(scene) && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center relative">
            {showConfetti &&
              confettiParticles.map((p, i) => (
                <div
                  key={i}
                  className="confetti-particle"
                  style={{
                    left: p.left,
                    top: p.top,
                    animationDelay: p.delay,
                    animationDuration: p.duration,
                    background: p.color,
                  }}
                />
              ))}

            <div className="relative z-10">
              <SceneIllustration scene="SCENE_5_FINALE" />
              <h2 className="text-3xl font-bold text-amber mb-3 scene-enter font-display">
                You found the bookshop!
              </h2>
              <VocabSummary words={state.learnedWords} />
              <button
                onClick={() => {
                  dispatch({ type: "RESET" });
                  setSceneVocab([]);
                  setDialogue(null);
                  setShowConfetti(false);
                }}
                className="mt-6 px-6 py-3 border border-amber text-amber rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber/10 transition-colors min-h-[48px]"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {scene !== "SCENE_1_ARRIVAL" && (
        <AudioPlayer
          sfxSrc={config?.sfx}
          musicSrc={config?.music}
          label={audioLabel}
          audioUnlocked={state.audioUnlocked}
        />
      )}
    </div>
  );
}
