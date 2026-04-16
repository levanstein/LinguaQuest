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
      setTimeout(() => onAnswer(index), 2500);
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

  const isStoryQuestion = !!question.storyQuestion;

  return (
    <div className="scene-enter px-4">
      <audio ref={wordAudioRef} src={wordAudioSrc} preload="metadata" />

      {/* Question header */}
      <div className="text-center mb-4">
        <p className="text-xs text-neutral-500 mb-1">
          Question {questionNumber} of {totalQuestions}
        </p>
      </div>

      {/* Story-based question */}
      {isStoryQuestion ? (
        <div className="bg-surface border border-border rounded-xl p-4 mb-5">
          <p className="text-base leading-relaxed text-white font-display">
            {question.storyQuestion}
          </p>
        </div>
      ) : (
        <div
          className="mx-auto mb-6 p-5 rounded-xl border-2 border-amber bg-surface text-center max-w-[280px]"
          style={{ boxShadow: "0 0 20px var(--color-amber-glow)" }}
        >
          <p className="text-2xl font-bold text-amber glow-pulse font-display">
            {question.word.word}
          </p>
        </div>
      )}

      {/* Answer options */}
      <div className="space-y-2">
        {question.options.map((option, i) => {
          let className =
            "w-full text-left px-4 py-3 rounded-lg border transition-all min-h-[48px] text-sm font-medium ";

          if (selected === i) {
            className += feedback === "correct"
              ? "border-green-500 bg-green-500/20 text-green-400 quiz-correct"
              : "border-red-500 bg-red-500/20 text-red-400 quiz-wrong";
          } else if (feedback === "correct" && i === question.correctIndex) {
            className += "border-green-500 bg-green-500/10 text-green-400";
          } else {
            className += "border-border bg-surface text-white hover:border-neutral-600 hover:bg-neutral-800";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={className}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation + audio replay on correct answer */}
      {showExplanation && question.explanation && (
        <div className="mt-4 scene-enter">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-sm text-green-400 leading-relaxed mb-3">
              {question.explanation}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-amber font-bold font-display text-lg">
                {question.word.word}
              </span>
              <span className="text-neutral-400 text-sm">= {question.word.translation}</span>
              <button
                  onClick={playWordAudio}
                  className="ml-auto px-3 py-1.5 bg-amber/10 border border-amber/30 rounded-lg text-amber text-xs font-semibold hover:bg-amber/20 transition-colors"
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
