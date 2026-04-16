"use client";

import { useState } from "react";
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

  const handleSelect = (index: number) => {
    if (selected !== null) return; // Prevent double-tap

    setSelected(index);
    const isCorrect = index === question.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      onAnswer(index);
    }, isCorrect ? 600 : 800);
  };

  return (
    <div className="scene-enter">
      <div className="text-center mb-6">
        <p className="text-sm text-[#A3A3A3] mb-2">
          Match the word · {questionNumber}/{totalQuestions}
        </p>
      </div>

      {/* Turkish word card */}
      <div className="mx-auto mb-8 p-6 rounded-xl border-2 border-amber-500 bg-[#1A1A1A] text-center max-w-[280px]"
           style={{ boxShadow: "0 0 20px rgba(245, 158, 11, 0.15)" }}>
        <p
          className="text-2xl font-bold text-amber-500 glow-pulse"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {question.word.word}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 px-4">
        {question.options.map((option, i) => {
          let className =
            "w-full text-left px-4 py-3 rounded-lg border transition-all min-h-[48px] text-base font-medium ";

          if (selected === i) {
            if (feedback === "correct") {
              className += "border-green-500 bg-green-500/20 text-green-400 quiz-correct";
            } else {
              className += "border-red-500 bg-red-500/20 text-red-400 quiz-wrong";
            }
          } else if (feedback === "correct" && i === question.correctIndex) {
            className += "border-green-500 bg-green-500/10 text-green-400";
          } else {
            className +=
              "border-[#2A2A2A] bg-[#1A1A1A] text-white hover:border-[#3A3A3A] hover:bg-[#222]";
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
