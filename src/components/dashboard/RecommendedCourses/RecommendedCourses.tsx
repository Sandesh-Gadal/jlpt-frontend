'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/RecommendedCourses/RecommendedCourses.tsx
// Horizontal-scroll row of course mini-cards
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import Link  from 'next/link';
import type { RecommendedCourse } from '@/types/dashboard';

interface RecommendedCoursesProps {
  courses: RecommendedCourse[];
}

export default function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  return (
    <div className="panel-card">
      {/* Header */}
      <div className="panel-header">
        <span className="panel-title">Recommended for You</span>
        <Link href="/courses" className="see-all-btn">See all →</Link>
      </div>

      {/* Horizontal scroll */}
      <div className="course-scroll">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

/* ── Single mini card ── */
function CourseCard({ course }: { course: RecommendedCourse }) {
  return (
    <Link href={`/courses/${course.id}`} className="course-mini-card">
      {/* Thumbnail */}
      <div
        className="mini-thumb"
        style={{
          background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`,
        }}
      >
        <span className="mini-thumb-jp">{course.thumbnailJp}</span>
        <span
          className="mini-level-badge"
          style={{ background: course.levelColor }}
        >
          {course.level}
        </span>
        <span className="mini-cat-badge">{course.category}</span>
      </div>

      {/* Body */}
      <div className="mini-body">
        <div className="mini-title">{course.title}</div>
        <div className="mini-meta">
          <span className="mini-duration">
            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {course.duration}
          </span>
          <span className="mini-xp">⭐ {course.xpReward} XP</span>
        </div>
      </div>
    </Link>
  );
}
