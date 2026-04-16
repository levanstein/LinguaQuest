"use client";

import { useEffect, useState } from "react";
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
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
  }, [question.word.id]);

  const handleSelect = (index: number) => {
    if (selected !== null) return;

    setSelected(index);
    const isCorrect = index === question.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      onAnswer(index);
    }, isCorrect ? 600 : 800);
  };

  return (
    <div className="scene-enter">
      <div className="text-center mb-6">
        <p className="text-sm text-neutral-400 mb-2">
          Match the word · {questionNumber}/{totalQuestions}
        </p>
      </div>

      <div
        className="mx-auto mb-8 p-6 rounded-xl border-2 border-amber bg-surface text-center max-w-[280px]"
        style={{ boxShadow: "0 0 20px var(--color-amber-glow)" }}
      >
        <p className="text-2xl font-bold text-amber glow-pulse font-display">
          {question.word.word}
        </p>
      </div>

      <div className="space-y-2 px-4">
        {question.options.map((option, i) => {
          let className =
            "w-full text-left px-4 py-3 rounded-lg border transition-all min-h-[48px] text-base font-medium ";

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
    </div>
  );
}
