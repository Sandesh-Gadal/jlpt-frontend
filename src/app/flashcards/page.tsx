'use client';

// src/app/flashcards/page.tsx — S11 Flashcard Deck

import React, { useState, useMemo } from 'react';
import AppShell      from '@/components/dashboard/Layout/AppShell';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import StudySession  from '@/components/flashcards/StudySession';
import { MOCK_FLASHCARDS, MOCK_DECK_STATS } from '@/data/flashcardData';
import type { Flashcard, SrsRating } from '@/types/flashcard';

type FilterMode  = 'all' | 'due' | 'new' | 'mastered';
type LevelFilter = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export default function FlashcardPage() {
  const [filter,     setFilter]     = useState<FilterMode>('all');
  const [level,      setLevel]      = useState<LevelFilter>('ALL');
  const [studying,   setStudying]   = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [cards,      setCards]      = useState(MOCK_FLASHCARDS);
  const stats = MOCK_DECK_STATS;

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const matchLevel =
        level === 'ALL' || c.level?.code === level;
      const matchFilter =
        filter === 'all'      ? true :
        filter === 'due'      ? (c.user_review?.is_due ?? false) :
        filter === 'new'      ? !c.user_review :
        filter === 'mastered' ? (c.user_review?.repetitions ?? 0) >= 5 :
        true;
      return matchLevel && matchFilter;
    });
  }, [cards, filter, level]);

  const dueCards = cards.filter((c) => c.user_review?.is_due || !c.user_review);

  const startStudy = (subset?: Flashcard[]) => {
    const toStudy = subset ?? dueCards;
    if (toStudy.length === 0) return;
    setStudyCards(toStudy);
    setStudying(true);
  };

  const handleRate = (cardId: string, rating: SrsRating) => {
    // Optimistically update local state
    // In production: POST /api/v1/flashcards/{id}/rate
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const newRep = rating === 'again' ? 0 : (c.user_review?.repetitions ?? 0) + 1;
        return {
          ...c,
          user_review: {
            next_review_at: new Date(Date.now() + 86400000).toISOString(),
            interval:       rating === 'again' ? 1 : rating === 'hard' ? 1 : rating === 'good' ? 3 : 7,
            easiness:       c.user_review?.easiness ?? 2.5,
            repetitions:    newRep,
            last_rating:    ({ again: 0, hard: 3, good: 4, easy: 5 } as const)[rating],
            is_due:         false,
          },
        };
      })
    );
  };

  return (
    <>
      {studying && (
        <StudySession
          cards={studyCards}
          onExit={() => setStudying(false)}
          onRate={handleRate}
        />
      )}

      <AppShell
        userName="Keiko Tanaka"
        userInitial="K"
        userLevel="N3"
        topBarSubText="Spaced repetition flashcard practice"
        notifCount={3}
      >
        <div className="dashboard-content" style={{ padding: 0 }}>

          {/* Header */}
          <div className="fc-header">
            <div>
              <div className="fc-header-title">🃏 Vocabulary Deck</div>
              <div className="fc-header-sub">
                SM-2 spaced repetition · {stats.due} cards due today
              </div>
            </div>
            <button
              className="fc-study-btn"
              onClick={() => startStudy()}
              disabled={dueCards.length === 0}
            >
              ▶ Study Now ({dueCards.length})
            </button>
          </div>

          {/* Stats pills */}
          <div className="fc-stats-bar">
            <div className="fc-stat-pill due">🔥 {stats.due} Due</div>
            <div className="fc-stat-pill new-c">✦ {stats.new} New</div>
            <div className="fc-stat-pill mastered">⭐ {stats.mastered} Mastered</div>
            <div className="fc-stat-pill" style={{ marginLeft: 'auto' }}>📚 {stats.total} Total</div>
          </div>

          {/* Filters */}
          <div className="fc-filter-bar">
            {(['all', 'due', 'new', 'mastered'] as FilterMode[]).map((f) => (
              <button
                key={f}
                className={`fc-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '📖 All' : f === 'due' ? '🔥 Due' : f === 'new' ? '✦ New' : '⭐ Mastered'}
              </button>
            ))}

            <div style={{ width: 1, background: 'var(--border)', margin: '0 4px', alignSelf: 'stretch' }} />

            {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as LevelFilter[]).map((l) => (
              <button
                key={l}
                className={`fc-filter-btn${level === l ? ' active' : ''}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🦝</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>
                No cards match this filter
              </div>
            </div>
          ) : (
            <FlashcardGrid cards={filtered} onStudy={(c) => startStudy([c])} />
          )}

        </div>
      </AppShell>
    </>
  );
}
