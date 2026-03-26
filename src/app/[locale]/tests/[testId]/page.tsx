'use client';

// src/app/tests/[testId]/page.tsx — S14 Test Interface
// Full-screen distraction-free test environment
// Timer · Question navigator · Flag for review · Submit modal

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_TEST_CATALOG, MOCK_QUESTIONS } from '@/data/testData';
import type { AnswerState } from '@/types/test';

const OPT_LABELS = ['A', 'B', 'C', 'D'];

const SECTION_ICONS: Record<string, string> = {
  vocabulary: '📖', grammar: '✏️', reading: '📄', listening: '🔊',
};

export default function TestInterfacePage({ params }: { params: Promise<{ testId: string }> }) {
  const router = useRouter();
  const { testId } = React.use(params);

  const test      = MOCK_TEST_CATALOG.find(t => t.id === testId) ?? MOCK_TEST_CATALOG[3];
  const questions = MOCK_QUESTIONS;

  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [answers,     setAnswers]     = useState<Record<string, AnswerState>>({});
  const [flagged,     setFlagged]     = useState<Set<string>>(new Set());
  const [showModal,   setShowModal]   = useState(false);
  const [timerSecs,   setTimerSecs]   = useState(test.time_limit_seconds);
  const [audioPlaying,setAudioPlaying]= useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Record<string, number>>({});

  const current  = questions[currentIdx];
  const answered = Object.keys(answers).length;

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimerSecs(p => {
        if (p <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // Track time per question
  useEffect(() => {
    startTimeRef.current[current.id] = Date.now();
  }, [currentIdx, current.id]);

  const timerMM = String(Math.floor(timerSecs / 60)).padStart(2, '0');
  const timerSS = String(timerSecs % 60).padStart(2, '0');
  const timerCls = timerSecs < 60 ? 'danger' : timerSecs < 300 ? 'warn' : '';

  const selectAnswer = (questionId: string, optionId: string) => {
    const elapsed = startTimeRef.current[questionId]
      ? Math.floor((Date.now() - startTimeRef.current[questionId]) / 1000)
      : 0;

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOption:   optionId,
        isFlagged:        flagged.has(questionId),
        timeSpentSeconds: elapsed,
      },
    }));

    // Auto-advance after 350ms
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(p => p + 1);
      }
    }, 350);
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(current.id) ? next.delete(current.id) : next.add(current.id);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current!);
    // In production: POST /api/v1/tests/attempts/{attemptId}/submit
    router.push(`/tests/results/${test.id}`);
  }, [router, test.id]);

  // Group questions by section
  const sectionGroups = test.sections.map(section => ({
    section,
    indices: questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.section_id === section.id)
      .map(({ i }) => i),
  }));

  return (
    <div className="ti-shell">

      {/* ── Question Navigator ── */}
      <div className="ti-nav">
        <div className="ti-nav-head">
          <button className="ti-nav-back" onClick={() => router.back()}>← Tests</button>
          <div className="ti-nav-test-title">{test.title}</div>
          <div className="ti-nav-progress">
            {answered} / {questions.length} answered
            {flagged.size > 0 && ` · ${flagged.size} flagged`}
          </div>
        </div>

        {/* Section groups with dot grids */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sectionGroups.map(({ section, indices }) => (
            <div key={section.id} className="ti-nav-sections">
              <div className="ti-nav-section-label">
                {SECTION_ICONS[section.section_type]} {section.name}
              </div>
              <div className="ti-nav-dot-grid">
                {indices.map((qi) => {
                  const q         = questions[qi];
                  const isAnswered = !!answers[q.id];
                  const isFlagged  = flagged.has(q.id);
                  const isCurrent  = qi === currentIdx;
                  const cls = [
                    'ti-nav-dot',
                    isCurrent                   ? 'current'  : '',
                    isAnswered && !isCurrent    ? 'answered' : '',
                    isFlagged                   ? 'flagged'  : '',
                  ].filter(Boolean).join(' ');

                  return (
                    <div key={q.id} className={cls} onClick={() => setCurrentIdx(qi)} title={`Q${qi + 1}`}>
                      {qi + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="ti-nav-legend">
          <div className="ti-legend-row">
            <div className="ti-legend-dot" style={{ background: 'var(--accent-primary)' }} />
            Current
          </div>
          <div className="ti-legend-row">
            <div className="ti-legend-dot" style={{ background: 'var(--highlight)', border: '1px solid var(--accent-primary)' }} />
            Answered
          </div>
          <div className="ti-legend-row">
            <div className="ti-legend-dot" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
            Unanswered
          </div>
          <div className="ti-legend-row">
            <div className="ti-legend-dot" style={{ background: 'var(--accent-tertiary)', borderRadius: '50%' }} />
            Flagged
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="ti-main">

        {/* Topbar */}
        <div className="ti-topbar">
          <div className="ti-topbar-label">{test.title}</div>
          <div className={`ti-timer${timerCls ? ` ${timerCls}` : ''}`}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {timerMM}:{timerSS}
          </div>
          <button className="ti-submit-btn" onClick={() => setShowModal(true)}>
            Submit Test
          </button>
        </div>

        {/* Question scroll */}
        <div className="ti-q-scroll">
          <div className="ti-q-area">

            {/* Question header */}
            <div className="ti-q-head">
              <span className="ti-q-num">Question {currentIdx + 1} of {questions.length}</span>
              <span className={`ti-q-diff diff-${current.difficulty}`}>{current.difficulty}</span>
              <span className="ti-q-type">{current.question_type.replace('_', ' ')}</span>
              <button
                className={`ti-flag-btn${flagged.has(current.id) ? ' flagged' : ''}`}
                onClick={toggleFlag}
              >
                ⚑ {flagged.has(current.id) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {/* Passage (reading comp) */}
            {current.passage && (
              <div className="ti-passage">{current.passage}</div>
            )}

            {/* Audio player (listening) */}
            {current.audio_url && (
              <div className="ti-audio-player">
                <button
                  className="ti-audio-play"
                  onClick={() => setAudioPlaying(p => !p)}
                >
                  {audioPlaying ? '⏸' : '▶'}
                </button>
                <div className="ti-audio-track">
                  <div className="ti-audio-fill" style={{ width: audioPlaying ? '35%' : '0%', transition: 'width 10s linear' }} />
                </div>
                <div className="ti-audio-time">0:12 / 0:35</div>
              </div>
            )}

            {/* Prompt */}
            <div className="ti-q-prompt">
              {current.prompt.includes('______')
                ? current.prompt.split('______').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="ti-blank">______</span>}
                    </React.Fragment>
                  ))
                : current.prompt
              }
            </div>

            {/* Options */}
            <div className="ti-options">
              {current.options.map((opt, i) => {
                const isSelected = answers[current.id]?.selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`ti-option${isSelected ? ' selected' : ''}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => selectAnswer(current.id, opt.id)}
                  >
                    <span className="ti-option-key">{opt.id}</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Bottom nav */}
        <div className="ti-bottom-nav">
          <button
            className="ti-nav-btn"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(p => p - 1)}
          >
            ← Prev
          </button>
          <div className="ti-bottom-center">
            {answered} / {questions.length} answered
            {flagged.size > 0 && ` · ${flagged.size} flagged`}
          </div>
          <button
            className={`ti-nav-btn${currentIdx < questions.length - 1 ? ' primary' : ''}`}
            disabled={currentIdx >= questions.length - 1}
            onClick={() => setCurrentIdx(p => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Submit modal */}
      {showModal && (
        <div className="ti-modal-overlay">
          <div className="ti-modal">
            <div className="ti-modal-icon">📝</div>
            <div className="ti-modal-title">Submit test?</div>
            <div className="ti-modal-sub">
              You have answered {answered} of {questions.length} questions.
            </div>
            {questions.length - answered > 0 && (
              <div className="ti-modal-warn">
                ⚠️ {questions.length - answered} unanswered questions will be marked wrong.
              </div>
            )}
            <div className="ti-modal-btns">
              <button className="ti-modal-cancel" onClick={() => setShowModal(false)}>
                Continue test
              </button>
              <button className="ti-modal-confirm" onClick={handleSubmit}>
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
