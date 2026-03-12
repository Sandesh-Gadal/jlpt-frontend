'use client';

// src/app/courses/page.tsx

import React, { useState, useMemo, useEffect } from 'react';
import AppShell      from '@/components/dashboard/Layout/AppShell';
import FiltersBar    from '@/components/courses/FilterBar';
import ResultsHeader from '@/components/courses/ResultsHeader';
import CourseCard    from '@/components/courses/courseCard';
import SkeletonCard  from '@/components/courses/SkeletonCard';
import EmptyState    from '@/components/courses/EmptyState';
import { coursesApi } from '@/lib/api';
import { useUserData } from '@/hooks/useUserData';
import { COURSES as MOCK_COURSES } from '@/data/courseData';
import type { Course, Level, Category, ViewMode } from '@/types/courses';

export default function CourseCatalogPage() {
  const [activeLevel,    setActiveLevel]    = useState<Level>('ALL');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search,         setSearch]         = useState('');
  const [sort,           setSort]           = useState('Recommended');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [loading,        setLoading]        = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Use the shared hook for user data
  const { fullName, jlptLevel, userInitial, loading: userLoading } = useUserData();

  // Fetch courses from API on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await coursesApi.list();
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          // Fallback to mock data if API returns empty
          console.log('Using mock data - API returned empty');
          setCourses(MOCK_COURSES as Course[]);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        // Fallback to mock data on error
        setCourses(MOCK_COURSES as Course[]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const withLoading = (fn: () => void) => {
    setLoading(true);
    fn();
    setTimeout(() => setLoading(false), 600);
  };

  const handleLevelChange = (l: Level) => {
    withLoading(() => setActiveLevel(l));
  };

  const handleCategoryChange = (c: Category) => {
    withLoading(() => setActiveCategory(c));
  };

  const handleSearchChange = (s: string) => {
    setSearch(s);
  };

  const handleSortChange = (s: string) => {
    setSort(s);
  };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchLevel    = activeLevel    === 'ALL' || c.level    === activeLevel;
      const matchCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchSearch   = !search.trim() ||
        c.title.toLowerCase().includes(search.toLowerCase());
      return matchLevel && matchCategory && matchSearch;
    });
  }, [courses, activeLevel, activeCategory, search]);

  const hasFilters =
    activeLevel !== 'ALL' || activeCategory !== 'All' || search.trim() !== '';

  const resetAll = () => {
    setActiveLevel('ALL');
    setActiveCategory('All');
    setSearch('');
  };

  return (
   
      <>
      {/* Sticky filters */}
      <FiltersBar
        activeLevel={activeLevel}
        activeCategory={activeCategory}
        search={search}
        sort={sort}
        onLevelChange={handleLevelChange}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
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
    </>
  );
}

