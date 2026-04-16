"use client";

import { useEffect, useRef, useState } from "react";
import { QuizQuestion } from "@/lib/types";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizCardProps) {
  const wordAudioSrc = `/audio/words/${question.word.id}.mp3`;
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    setShowExplanation(false);
  }, [question.word.id, questionNumber]);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const isCorrect = index === question.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setShowExplanation(true);
      setTimeout(() => onAnswer(index), 2800);
    } else {
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        onAnswer(index);
      }, 1000);
    }
  };

  const playWordAudio = () => {
    if (wordAudioRef.current) {
      wordAudioRef.current.currentTime = 0;
      wordAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="scene-enter px-4 flex flex-col justify-center min-h-[70vh]">
      <audio ref={wordAudioRef} src={wordAudioSrc} preload="metadata" />

      {/* Progress dots — larger, more visible */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === questionNumber - 1 ? "12px" : "8px",
              height: i === questionNumber - 1 ? "12px" : "8px",
              background: i < questionNumber
                ? "oklch(0.78 0.17 75)"
                : i === questionNumber - 1
                ? "oklch(0.78 0.17 75)"
                : "oklch(0.30 0.01 75)",
              boxShadow: i === questionNumber - 1 ? "0 0 8px oklch(0.78 0.17 75 / 0.4)" : "none",
            }}
          />
        ))}
      </div>

      {/* Question — visually distinct from options */}
      {question.storyQuestion ? (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "oklch(0.20 0.015 75)",
            border: "1px solid oklch(0.30 0.02 75)",
          }}
        >
          <p className="game-label mb-2" style={{ fontSize: "0.6rem" }}>Question</p>
          <p className="font-[var(--font-story)] text-lg leading-relaxed" style={{ color: "oklch(0.95 0.005 75)" }}>
            {question.storyQuestion}
          </p>
        </div>
      ) : (
        <div
          className="mx-auto mb-6 p-5 rounded-2xl text-center max-w-[260px]"
          style={{
            background: "oklch(0.20 0.015 75)",
            border: "2px solid oklch(0.78 0.17 75 / 0.4)",
            boxShadow: "0 0 24px oklch(0.78 0.17 75 / 0.1)",
          }}
        >
          <p className="text-2xl font-bold glow-pulse font-[var(--font-story)]" style={{ color: "oklch(0.78 0.17 75)" }}>
            {question.word.word}
          </p>
        </div>
      )}

      {/* Options — taller touch targets, more spacing */}
      <div className="space-y-3">
        {question.options.map((option, i) => {
          let style: React.CSSProperties;
          let extraClass = "";

          if (selected === i && feedback === "correct") {
            style = { background: "oklch(0.72 0.19 145 / 0.15)", border: "1px solid oklch(0.72 0.19 145 / 0.4)", color: "oklch(0.80 0.15 145)" };
            extraClass = "quiz-correct";
          } else if (selected === i && feedback === "wrong") {
            style = { background: "oklch(0.65 0.22 25 / 0.15)", border: "1px solid oklch(0.65 0.22 25 / 0.4)", color: "oklch(0.75 0.18 25)" };
            extraClass = "quiz-wrong";
          } else if (feedback === "correct" && i === question.correctIndex) {
            style = { background: "oklch(0.72 0.19 145 / 0.1)", border: "1px solid oklch(0.72 0.19 145 / 0.3)", color: "oklch(0.80 0.15 145)" };
          } else {
            style = { background: "oklch(0.15 0.008 75)", border: "1px solid oklch(0.24 0.012 75)", color: "oklch(0.90 0.005 75)" };
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left px-5 py-4 rounded-xl transition-all min-h-[52px] text-sm font-medium ${extraClass}`}
              style={style}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation + word audio on correct */}
      {showExplanation && question.explanation && (
        <div className="mt-5 scene-enter">
          <div
            className="rounded-2xl p-4"
            style={{ background: "oklch(0.72 0.19 145 / 0.08)", border: "1px solid oklch(0.72 0.19 145 / 0.2)" }}
          >
            <p className="text-sm leading-relaxed mb-3" style={{ color: "oklch(0.75 0.12 145)" }}>
              {question.explanation}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-bold font-[var(--font-story)] text-lg" style={{ color: "oklch(0.78 0.17 75)" }}>
                {question.word.word}
              </span>
              <span style={{ color: "oklch(0.50 0.01 75)", fontSize: "0.85rem" }}>
                = {question.word.translation}
              </span>
              <button
                onClick={playWordAudio}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: "oklch(0.78 0.17 75 / 0.1)",
                  border: "1px solid oklch(0.78 0.17 75 / 0.25)",
                  color: "oklch(0.78 0.17 75)",
                }}
              >
                Listen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
