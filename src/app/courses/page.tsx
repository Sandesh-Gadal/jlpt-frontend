'use client';

// src/app/courses/page.tsx

import React, { useState, useMemo } from 'react';
import AppShell      from '@/components/dashboard/Layout/AppShell';
import FiltersBar    from '@/components/courses/FilterBar';
import ResultsHeader from '@/components/courses/ResultsHeader';
import CourseCard    from '@/components/courses/courseCard';
import SkeletonCard  from '@/components/courses/SkeletonCard';
import EmptyState    from '@/components/courses/EmptyState';
import { COURSES }   from '@/data/courseData';
import type { Level, Category, ViewMode } from '@/types/courses';

export default function CourseCatalogPage() {
  const [activeLevel,    setActiveLevel]    = useState<Level>('ALL');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search,         setSearch]         = useState('');
  const [sort,           setSort]           = useState('Recommended');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [loading,        setLoading]        = useState(false);

  const withLoading = (fn: () => void) => {
    setLoading(true);
    fn();
    setTimeout(() => setLoading(false), 600);
  };

  const filtered = useMemo(() => COURSES.filter((c) => {
    const matchLevel    = activeLevel    === 'ALL' || c.level    === activeLevel;
    const matchCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch   = !search.trim() ||
      c.title.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchCategory && matchSearch;
  }), [activeLevel, activeCategory, search]);

  const hasFilters =
    activeLevel !== 'ALL' || activeCategory !== 'All' || search.trim() !== '';

  const resetAll = () => {
    setActiveLevel('ALL');
    setActiveCategory('All');
    setSearch('');
  };

  return (
    <AppShell
      userName="Keiko Tanaka"
      userInitial="K"
      userLevel="N3"
      topBarSubText="Browse and enroll in JLPT preparation courses"
      notifCount={3}
    >
      {/* Sticky filters */}
      <FiltersBar
        activeLevel={activeLevel}
        activeCategory={activeCategory}
        search={search}
        sort={sort}
        onLevelChange={(l)    => withLoading(() => setActiveLevel(l))}
        onCategoryChange={(c) => withLoading(() => setActiveCategory(c))}
        onSearchChange={(s)   => setSearch(s)}
        onSortChange={(s)     => setSort(s)}
      />

      <div className="dashboard-content" style={{ padding: 0 }}>
        <ResultsHeader
          count={filtered.length}
          viewMode={viewMode}
          hasFilters={hasFilters}
          onViewChange={setViewMode}
          onClearAll={resetAll}
        />
        <div className="catalog-content">
          {loading ? (
            <div className={`course-grid${viewMode === 'list' ? ' list-view' : ''}`}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={resetAll} />
          ) : (
            <div className={`course-grid${viewMode === 'list' ? ' list-view' : ''}`}>
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} viewMode={viewMode} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}