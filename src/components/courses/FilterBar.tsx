'use client';

import React from 'react';
import { LEVELS, CATEGORIES, SORT_OPTIONS } from '@/data/courseData';
import type { Level, Category } from '@/types/courses';

interface FiltersBarProps {
  activeLevel:    Level;
  activeCategory: Category;
  search:         string;
  sort:           string;
  onLevelChange:    (l: Level)    => void;
  onCategoryChange: (c: Category) => void;
  onSearchChange:   (s: string)   => void;
  onSortChange:     (s: string)   => void;
}

export default function FiltersBar({
  activeLevel,
  activeCategory,
  search,
  sort,
  onLevelChange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: FiltersBarProps) {
  return (
    <div className="filters-bar">

      {/* Row 1: Level tabs + search + sort */}
      <div className="filters-row">
        <div className="level-tabs">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              className={`level-tab${activeLevel === lvl ? ' active' : ''}`}
              onClick={() => onLevelChange(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div className="filter-search">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Search courses…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => onSearchChange('')}>
              ×
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o} value={o}>Sort: {o}</option>
          ))}
        </select>
      </div>

      {/* Row 2: Category chips */}
      <div className="filters-row">
        <div className="cat-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`cat-chip${activeCategory === cat.value ? ' active' : ''}`}
              onClick={() => onCategoryChange(cat.value)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}