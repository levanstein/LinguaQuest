"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayer from "@/components/AudioPlayer";
import DialogueBubble from "@/components/DialogueBubble";
import QuizCard from "@/components/QuizCard";
import VocabSummary from "@/components/VocabSummary";
import SceneIllustration from "@/components/SceneIllustration";
import MysteryReveal from "@/components/MysteryReveal";
import {
  createInitialState,
  gameReducer,
  isQuizScene,
  isDialogueScene,
  isFinale,
  isQuizComplete,
  generateQuizFromStory,
  generateQuiz,
} from "@/lib/game-engine";
import { SCENE_CONFIGS, type VocabWord, type DialogueData } from "@/lib/types";
import { getVocabForScene, getDialogueForScene, getStoryForScene, type SceneStory } from "@/lib/fallback-data";

type Phase = "dialogue" | "quiz" | "mystery" | "transition";

export default function PlayPage() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [transitioning, setTransitioning] = useState(false);
  const [overlay, setOverlay] = useState<"well-done" | null>(null);
  const [dialogue, setDialogue] = useState<DialogueData | null>(null);
  const [sceneVocab, setSceneVocab] = useState<VocabWord[]>([]);
  const [currentStory, setCurrentStory] = useState<SceneStory | null>(null);
  const [phase, setPhase] = useState<Phase>("dialogue");
  const quizGenerated = useRef(false);
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scene = state.currentScene;
  const config = SCENE_CONFIGS[scene];

  useEffect(() => {
    return () => { transitionTimers.current.forEach(clearTimeout); };
  }, []);

  // Fetch dialogue, vocab, and story for dialogue scenes
  useEffect(() => {
    if (!isDialogueScene(scene)) return;

    const controller = new AbortController();
    const sceneNum = config?.sceneNumber || 2;

    // Load story data
    const story = getStoryForScene(sceneNum);
    setCurrentStory(story || null);

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

    setPhase("dialogue");
    return () => controller.abort();
  }, [scene, config?.sceneNumber]);

  // Generate quiz when entering quiz scene
  useEffect(() => {
    if (isQuizScene(scene) && !quizGenerated.current) {
      quizGenerated.current = true;
      setPhase("quiz");

      // Use story-based quiz if available, otherwise fallback
      if (currentStory?.quizQuestions) {
        const quiz = generateQuizFromStory(currentStory.quizQuestions);
        dispatch({ type: "SET_QUIZ", quiz });
      } else if (sceneVocab.length > 0) {
        const quiz = generateQuiz(sceneVocab, state.learnedWords);
        dispatch({ type: "SET_QUIZ", quiz });
      }
    }
    if (!isQuizScene(scene)) {
      quizGenerated.current = false;
    }
  }, [scene, sceneVocab, state.learnedWords, currentStory]);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    transitionTimers.current.push(id);
    return id;
  }, []);

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

  // Check if quiz is complete, show mystery before advancing
  useEffect(() => {
    if (!isQuizScene(scene) || state.currentQuiz.length === 0) return;
    if (!isQuizComplete(state)) return;

    // Show well-done, then mystery reveal
    setOverlay("well-done");
    scheduleTimer(() => {
      setOverlay(null);
      if (currentStory?.mystery) {
        setPhase("mystery");
      } else {
        advanceAfterQuiz();
      }
    }, 1500);
  }, [scene, state.quizIndex, state.currentQuiz.length]);

  const advanceAfterQuiz = useCallback(() => {
    setTransitioning(true);
    scheduleTimer(() => {
      dispatch({ type: "COMPLETE_QUIZ" });
      setSceneVocab([]);
      setCurrentStory(null);
      setTransitioning(false);
    }, 500);
  }, [scheduleTimer]);

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
    phase === "quiz" &&
    state.currentQuiz.length > 0 &&
    state.quizIndex < state.currentQuiz.length;

  const showMystery =
    isQuizScene(scene) &&
    !overlay &&
    phase === "mystery" &&
    currentStory?.mystery;

  const illustrationScene = isQuizScene(scene)
    ? scene === "QUIZ_1" ? "SCENE_2_TAXI"
      : scene === "QUIZ_2" ? "SCENE_3_MARKET"
      : "SCENE_4_HISTORIAN"
    : scene;

  return (
    <div className={`min-h-dvh flex flex-col ${transitioning ? "scene-fade-out" : "scene-enter"}`}>
      <ProgressBar scene={scene} />

      <div className="flex-1 flex flex-col overflow-y-auto">
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
                className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all min-h-[48px]"
                style={{ background: "oklch(0.78 0.17 75)", color: "oklch(0.15 0.02 75)" }}
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

        {/* Quiz scenes */}
        {(showQuiz || (isQuizScene(scene) && !overlay && phase === "quiz")) && (
          <div className="flex-1 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="px-4 pt-3">
                <SceneIllustration scene={illustrationScene} />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative z-10 py-4">
              {showQuiz ? (
                <QuizCard
                  question={state.currentQuiz[state.quizIndex]}
                  questionNumber={state.quizIndex + 1}
                  totalQuestions={state.currentQuiz.length}
                  onAnswer={handleQuizAnswer}
                />
              ) : (
                <div className="flex items-center justify-center pt-20">
                  <div className="text-neutral-400 text-sm animate-pulse">Preparing quiz...</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mystery reveal */}
        {showMystery && currentStory && (
          <div className="flex-1 relative">
            <div className="absolute inset-0 opacity-15">
              <div className="px-4 pt-3">
                <SceneIllustration scene={illustrationScene} />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10">
              <MysteryReveal
                mystery={currentStory.mystery}
                reveal={currentStory.mysteryReveal}
                onContinue={advanceAfterQuiz}
              />
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
          <div className="flex-1 flex flex-col items-center px-4 pt-4 text-center relative">
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

            <div className="relative z-10 w-full">
              <SceneIllustration scene="SCENE_5_FINALE" />

              <h2 className="text-3xl font-bold text-amber mb-2 scene-enter font-display">
                You found the bookshop!
              </h2>

              {/* Achievement card */}
              <div
                className="rounded-2xl p-5 my-4 text-left"
                style={{ background: "oklch(0.17 0.01 75)", border: "1px solid oklch(0.78 0.17 75 / 0.2)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                    style={{ background: "oklch(0.78 0.17 75 / 0.15)" }}
                  >
                    📖
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "oklch(0.78 0.17 75)" }}>Istanbul Explorer</p>
                    <p style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.7rem" }}>Level Complete</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { value: state.learnedWords.filter((w, i, a) => a.findIndex(x => x.id === w.id) === i).length, label: "Words" },
                    { value: 3, label: "Stories" },
                    { value: 3, label: "Mysteries" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-2" style={{ background: "oklch(0.12 0.008 75)" }}>
                      <p className="game-stat">{s.value}</p>
                      <p style={{ color: "oklch(0.45 0.01 75)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginTop: "2px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <VocabSummary words={state.learnedWords} />

              <button
                onClick={() => {
                  dispatch({ type: "RESET" });
                  setSceneVocab([]);
                  setDialogue(null);
                  setCurrentStory(null);
                  setShowConfetti(false);
                  setPhase("dialogue");
                }}
                className="mt-4 mb-8 px-6 py-3 border border-amber text-amber rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-amber/10 transition-colors min-h-[48px]"
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
