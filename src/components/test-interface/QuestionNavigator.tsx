// src/components/test-interface/QuestionNavigator.tsx

import React from 'react';
import type { TestQuestion } from '@/types/test';

interface QuestionNavigatorProps {
  questions:  TestQuestion[];
  currentIdx: number;
  answers:    Record<string, string>;
  flagged:    Set<string>;
  testTitle:  string;
  onJump:     (idx: number) => void;
}

export default function QuestionNavigator({
  questions, currentIdx, answers, flagged, testTitle, onJump,
}: QuestionNavigatorProps) {
  const answered = Object.keys(answers).length;

  return (
    <div className="ti-nav-panel">
      <div className="ti-nav-header">
        <div className="ti-nav-title">{testTitle}</div>
        <div className="ti-nav-sub">{answered} / {questions.length} answered</div>
      </div>
      <div className="ti-nav-grid">
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.id];
          const isFlagged  = flagged.has(q.id);
          const isCurrent  = i === currentIdx;
          const cls = [
            'ti-nav-dot',
            isCurrent               ? 'current'  : '',
            isAnswered && !isCurrent ? 'answered' : '',
            isFlagged               ? 'flagged'  : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={q.id}
              className={cls}
              onClick={() => onJump(i)}
              title={`Q${i + 1}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
