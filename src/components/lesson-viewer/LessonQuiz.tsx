'use client';

// src/components/lesson-viewer/LessonQuiz.tsx
// Interactive quiz with per-question checking and final score

import React, { useState } from 'react';
import type { QuizQuestion } from '@/types/lesson';

interface LessonQuizProps {
  questions:  QuizQuestion[];
  xpReward:   number;
  onComplete: (score: number) => void;
}

export default function LessonQuiz({ questions, xpReward, onComplete }: LessonQuizProps) {
  const [answers,   setAnswers]   = useState<Record<string, string>>({});
  const [checked,   setChecked]   = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score,     setScore]     = useState(0);

  const allAnswered = questions.every((q) => answers[q.id]);
  const allChecked  = questions.every((q) => checked[q.id]);

  const handleSelect = (qId: string, optId: string) => {
    if (checked[qId]) return;
    setAnswers((p) => ({ ...p, [qId]: optId }));
  };

  const handleCheck = (q: QuizQuestion) => {
    setChecked((p) => ({ ...p, [q.id]: true }));
  };

  const handleSubmit = () => {
    const correct = questions.filter((q) => answers[q.id] === q.correct).length;
    const pct     = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    onComplete(pct);
  };

  if (submitted) {
    const emoji =
      score === 100 ? '🏆' :
      score >= 75   ? '🎉' :
      score >= 50   ? '📚' : '💪';
    const earned = Math.round((score / 100) * xpReward);

    return (
      <div className="lv-quiz-section">
        <div className="lv-quiz-score">
          <div className="lv-score-emoji">{emoji}</div>
          <div className="lv-score-value">{score}%</div>
          <div className="lv-score-label">
            {score === 100 ? 'Perfect score! Incredible!' :
             score >= 75   ? 'Great work! Keep it up.' :
             score >= 50   ? 'Good effort. Review and try again!' :
             'Keep studying — you\'ve got this!'}
          </div>
          <div className="lv-score-xp">🌟 +{earned} XP earned</div>

          {score < 100 && (
            <button
              className="lv-quiz-check-btn"
              onClick={() => {
                setAnswers({});
                setChecked({});
                setSubmitted(false);
                setScore(0);
              }}
            >
              ↺ Retry Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="lv-quiz-section">
      <div className="lv-quiz-title">📝 Lesson Quiz</div>
      <div className="lv-quiz-sub">Answer all questions, check each one, then submit.</div>

      {questions.map((q, qi) => {
        const selected  = answers[q.id];
        const isChecked = checked[q.id];

        return (
          <div key={q.id} className="lv-quiz-question" style={{ animationDelay: `${qi * 50}ms` }}>
            <div className="lv-q-number">Question {qi + 1} of {questions.length}</div>
            <div className="lv-q-text">{q.question}</div>

            <div className="lv-q-options">
              {q.options.map((opt) => {
                let cls = 'lv-q-option';
                if (isChecked) {
                  if (opt.id === q.correct)  cls += ' correct';
                  else if (opt.id === selected) cls += ' wrong';
                } else if (opt.id === selected) {
                  cls += ' selected';
                }

                return (
                  <button
                    key={opt.id}
                    className={cls}
                    onClick={() => handleSelect(q.id, opt.id)}
                    disabled={isChecked}
                  >
                    <span className="lv-q-option-key">{opt.id.toUpperCase()}</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {/* Explanation after checking */}
            {isChecked && (
              <div className="lv-q-explanation">
                {answers[q.id] === q.correct ? '✓ Correct! ' : '✗ Not quite. '}
                {q.explanation}
              </div>
            )}

            {/* Per-question check button */}
            {!isChecked && selected && (
              <button
                className="lv-quiz-check-btn"
                style={{ marginTop: 12, padding: '7px 20px', fontSize: 12 }}
                onClick={() => handleCheck(q)}
              >
                Check answer
              </button>
            )}
          </div>
        );
      })}

      {/* Final submit */}
      <button
        className="lv-quiz-check-btn"
        disabled={!allAnswered || !allChecked}
        onClick={handleSubmit}
      >
        Submit Quiz →
      </button>
    </div>
  );
}