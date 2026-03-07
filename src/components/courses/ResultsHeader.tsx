'use client';

import React from 'react';
import type { ViewMode } from '@/types/courses';

interface ResultsHeaderProps {
  count:        number;
  viewMode:     ViewMode;
  hasFilters:   boolean;
  onViewChange: (v: ViewMode) => void;
  onClearAll:   () => void;
}

export default function ResultsHeader({
  count,
  viewMode,
  hasFilters,
  onViewChange,
  onClearAll,
}: ResultsHeaderProps) {
  return (
    <div className="results-header">
      <div className="results-count">
        <strong>{count}</strong> courses
        {hasFilters && (
          <button className="clear-filters-btn" onClick={onClearAll}>
            Clear filters ×
          </button>
        )}
      </div>

      <div className="view-toggle">
        {/* Grid view */}
        <button
          className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
          onClick={() => onViewChange('grid')}
          title="Grid view"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <rect x="0" y="0" width="6" height="6" rx="1" />
            <rect x="10" y="0" width="6" height="6" rx="1" />
            <rect x="0" y="10" width="6" height="6" rx="1" />
            <rect x="10" y="10" width="6" height="6" rx="1" />
          </svg>
        </button>

        {/* List view */}
        <button
          className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
          onClick={() => onViewChange('list')}
          title="List view"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>
      </div>
    </div>
  );
}