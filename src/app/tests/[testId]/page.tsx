'use client';

// src/app/tests/[testId]/page.tsx — S14 Test Interface

import React, { useState, useCallback } from 'react';
import { useRouter }         from 'next/navigation';
import TestTimer             from '@/components/test-interface/TestTimer';
import QuestionNavigator     from '@/components/test-interface/QuestionNavigator';
import { MOCK_TEST_SET, MOCK_QUESTIONS } from '@/data/testData';

export default function TestInterfacePage() {
  const router = useRouter();

  const testSet   = MOCK_TEST_SET;
  const questions = MOCK_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers,    setAnswers]    = useState<Record<string, string>>({});
  const [flagged,    setFlagged]    = useState<Set<string>>(new Set());
  const [showSubmit, setShowSubmit] = useState(false);

  const current  = questions[currentIdx];
  const answered = Object.keys(answers).length;

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((p) => ({ ...p, [questionId]: optionId }));
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIdx < questions.length - 1) setCurrentIdx((p) => p + 1);
    }, 300);
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(current.id) ? next.delete(current.id) : next.add(current.id);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    // In production: POST /api/v1/tests/attempts/{attemptId}/submit
    router.push('/tests/results/mock');
  }, [router]);

  const handleTimeUp = useCallback(() => handleSubmit(), [handleSubmit]);

  return (
    <div className="ti-shell">
      {/* Question Navigator */}
      <QuestionNavigator
        questions={questions}
        currentIdx={currentIdx}
        answers={answers}
        flagged={flagged}
        testTitle={testSet.title}
        onJump={setCurrentIdx}
      />

      {/* Main */}
      <div className="ti-main">

        {/* Topbar */}
        <div className="ti-topbar">
          <div className="ti-test-name">{testSet.title}</div>
          <TestTimer totalSeconds={testSet.time_limit_seconds} onTimeUp={handleTimeUp} />
          <button className="ti-submit-btn" onClick={() => setShowSubmit(true)}>
            Submit Test
          </button>
        </div>

        {/* Question area */}
        <div className="ti-question-area">
          <div className="ti-q-badge">
            <span className="ti-q-number">Question {currentIdx + 1} of {questions.length}</span>
            <span className={`ti-q-difficulty diff-${current.difficulty}`}>
              {current.difficulty}
            </span>
            <button
              className={`ti-flag-btn${flagged.has(current.id) ? ' flagged' : ''}`}
              onClick={toggleFlag}
            >
              ⚑ {flagged.has(current.id) ? 'Flagged' : 'Flag'}
            </button>
          </div>

          <div className="ti-q-prompt">{current.prompt}</div>

          <div className="ti-options">
            {current.options.map((opt, i) => (
              <button
                key={opt.id}
                className={`ti-option${answers[current.id] === opt.id ? ' selected' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => selectAnswer(current.id, opt.id)}
              >
                <span className="ti-option-key">{opt.id}</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="ti-bottom-nav">
          <button
            className="ti-nav-btn"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
          >
            ← Prev
          </button>
          <div className="ti-nav-center">
            {answered} / {questions.length} answered
            {flagged.size > 0 && ` · ${flagged.size} flagged`}
          </div>
          <button
            className={`ti-nav-btn${currentIdx < questions.length - 1 ? ' primary' : ''}`}
            disabled={currentIdx >= questions.length - 1}
            onClick={() => setCurrentIdx((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmit && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 32, maxWidth: 400, width: '90%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Submit test?
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              {answered} of {questions.length} answered.
              {questions.length - answered > 0 && ` ${questions.length - answered} unanswered questions will be marked wrong.`}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setShowSubmit(false)}
                style={{ padding: '9px 22px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'none', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}
              >
                Continue
              </button>
              <button
                onClick={handleSubmit}
                style={{ padding: '9px 22px', background: 'var(--accent-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px var(--glow-green)' }}
              >
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
