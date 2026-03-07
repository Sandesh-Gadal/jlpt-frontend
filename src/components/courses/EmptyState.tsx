// src/components/courses/EmptyState.tsx

import React from 'react';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-tanuki">🦝</div>
      <div className="empty-title">No courses found</div>
      <div className="empty-sub">
        The tanuki couldn&apos;t find anything here.<br />
        Try a different level or category.
      </div>
      <button className="empty-reset-btn" onClick={onReset}>
        ↺ Clear filters
      </button>
    </div>
  );
}