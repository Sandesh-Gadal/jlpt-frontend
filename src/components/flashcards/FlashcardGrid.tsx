// src/components/flashcards/FlashcardGrid.tsx

import React from 'react';
import type { Flashcard } from '@/types/flashcard';

function getStatus(card: Flashcard): { label: string; cls: string } {
  if (!card.user_review)                         return { label: 'New',      cls: 'fcs-new' };
  if ((card.user_review.repetitions ?? 0) >= 5)  return { label: 'Mastered', cls: 'fcs-mastered' };
  if (card.user_review.is_due)                   return { label: 'Due',      cls: 'fcs-due' };
  return { label: 'Learning', cls: 'fcs-learning' };
}

export default function FlashcardGrid({
  cards,
  onStudy,
}: {
  cards:   Flashcard[];
  onStudy: (card: Flashcard) => void;
}) {
  return (
    <div className="fc-grid">
      {cards.map((card, i) => {
        const status = getStatus(card);
        return (
          <div
            key={card.id}
            className="fc-card-thumb"
            style={{ animationDelay: `${i * 35}ms` }}
            onClick={() => onStudy(card)}
          >
            <span className={`fc-card-status ${status.cls}`}>{status.label}</span>
            <div className="fc-card-front">{card.front_text}</div>
            {card.front_reading && (
              <div className="fc-card-reading">{card.front_reading}</div>
            )}
            <div className="fc-card-meaning">{card.back_text}</div>
          </div>
        );
      })}
    </div>
  );
}
