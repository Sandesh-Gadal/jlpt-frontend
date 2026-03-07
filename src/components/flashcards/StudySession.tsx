'use client';

// src/components/flashcards/StudySession.tsx
// Full-screen flip card study mode with SRS rating buttons
// Keyboard shortcuts: Space = flip, 1=again, 2=hard, 3=good, 4=easy

import React, { useState, useEffect, useCallback } from 'react';
import type { Flashcard, SrsRating } from '@/types/flashcard';

interface RatingSummary { again: number; hard: number; good: number; easy: number; }

interface StudySessionProps {
  cards:   Flashcard[];
  onExit:  () => void;
  onRate:  (cardId: string, rating: SrsRating) => void;
}

const INTERVAL_PREVIEW: Record<SrsRating, string> = {
  again: '< 1 min',
  hard:  '~10 min',
  good:  'tomorrow',
  easy:  '4 days',
};

export default function StudySession({ cards, onExit, onRate }: StudySessionProps) {
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [summary, setSummary] = useState<RatingSummary>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [done,    setDone]    = useState(false);

  const current = cards[index];
  const pct     = Math.round((index / cards.length) * 100);

  const flip = useCallback(() => setFlipped((p) => !p), []);

  const rate = useCallback((rating: SrsRating) => {
    if (!flipped) return;
    onRate(current.id, rating);
    setSummary((p) => ({ ...p, [rating]: p[rating] + 1 }));

    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex((p) => p + 1);
      setFlipped(false);
    }
  }, [flipped, current, index, cards.length, onRate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.code === 'Space') { e.preventDefault(); flip(); }
      if (!flipped) return;
      if (e.key === '1') rate('again');
      if (e.key === '2') rate('hard');
      if (e.key === '3') rate('good');
      if (e.key === '4') rate('easy');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flip, rate, flipped, done]);

  if (done) {
    const total  = cards.length;
    const passed = summary.good + summary.easy;
    return (
      <div className="fc-study-overlay">
        <div className="fc-study-topbar">
          <button className="fc-study-exit" onClick={onExit}>← Back to deck</button>
          <div />
        </div>
        <div className="fc-session-complete">
          <div className="fc-complete-emoji">
            {passed / total >= 0.8 ? '🏆' : passed / total >= 0.5 ? '🎉' : '📚'}
          </div>
          <div className="fc-complete-title">Session complete!</div>
          <div className="fc-complete-sub">{total} cards reviewed</div>
          <div className="fc-complete-stats">
            {(['again', 'hard', 'good', 'easy'] as SrsRating[]).map((r) => (
              <div key={r} className="fc-complete-stat">
                <div className={`fc-complete-stat-val ${r}`}>{summary[r]}</div>
                <div className="fc-complete-stat-label">{r}</div>
              </div>
            ))}
          </div>
          <button className="fc-study-btn" onClick={onExit} style={{ marginTop: 8 }}>
            ✓ Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-study-overlay">
      {/* Topbar */}
      <div className="fc-study-topbar">
        <button className="fc-study-exit" onClick={onExit}>← Exit</button>
        <div className="fc-study-progress-wrap">
          <div className="fc-study-progress-bar">
            <div className="fc-study-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="fc-study-counter">{index} / {cards.length}</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          🔥 {summary.good + summary.easy} correct
        </div>
      </div>

      {/* Flip card */}
      <div className="fc-flip-arena">
        <div className="fc-flip-container" onClick={flip}>
          <div className={`fc-flip-card${flipped ? ' is-flipped' : ''}`}>

            {/* FRONT */}
            <div className="fc-flip-face fc-flip-front">
              <span className="fc-flip-cat-chip">{current.category}</span>
              {current.level && (
                <span className="fc-flip-level-chip">{current.level.code}</span>
              )}
              <div className="fc-flip-front-word">{current.front_text}</div>
              {current.front_reading && (
                <div className="fc-flip-front-reading">{current.front_reading}</div>
              )}
              <div className="fc-flip-front-hint">Tap to reveal</div>
            </div>

            {/* BACK */}
            <div className="fc-flip-face fc-flip-back">
              <div className="fc-flip-back-meaning">{current.back_text}</div>
              {current.example_jp && (
                <div className="fc-flip-back-example-jp">{current.example_jp}</div>
              )}
              {current.example_en && (
                <div className="fc-flip-back-example-en">{current.example_en}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flip hint / rating bar */}
      {!flipped ? (
        <div className="fc-rating-bar">
          <button className="fc-flip-hint" onClick={flip}>
            <span>Flip card</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Space</span>
          </button>
        </div>
      ) : (
        <>
          <div className="fc-kbd-hints">
            {(['again', 'hard', 'good', 'easy'] as SrsRating[]).map((r, i) => (
              <div key={r} className="fc-kbd-item">
                <span className="fc-kbd">{i + 1}</span>
                <span style={{ textTransform: 'capitalize' }}>{r}</span>
              </div>
            ))}
          </div>
          <div className="fc-rating-bar">
            {(['again', 'hard', 'good', 'easy'] as SrsRating[]).map((r) => (
              <button key={r} className={`fc-rate-btn ${r}`} onClick={() => rate(r)}>
                <span className="fc-rate-label" style={{ textTransform: 'capitalize' }}>{r}</span>
                <span className="fc-rate-interval">{INTERVAL_PREVIEW[r]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
