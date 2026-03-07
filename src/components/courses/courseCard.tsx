'use client';

import React from 'react';
import Link  from 'next/link';
import { LEVEL_META } from '@/data/courseData';
import type { Course, ViewMode } from '@/types/courses';

interface CourseCardProps {
  course:   Course;
  viewMode: ViewMode;
  index:    number;
}

export default function CourseCard({ course, viewMode, index }: CourseCardProps) {
  const meta    = LEVEL_META[course.level];
  const isList  = viewMode === 'list';
  const pct     = course.progress && course.lessons
    ? Math.round((course.progress / course.lessons) * 100)
    : 0;

  /* CTA label & class */
  const ctaLabel =
    course.status === 'completed' ? '✓ Completed' :
    course.status === 'enrolled'  ? 'Continue →'  :
    course.status === 'locked'    ? '🔒 Locked'    : 'Start';

  const ctaClass =
    course.status === 'completed' ? 'card-cta cta-completed' :
    course.status === 'enrolled'  ? 'card-cta cta-continue'  :
    course.status === 'locked'    ? 'card-cta cta-locked'     : 'card-cta cta-start';

  /* Status badge */
  const statusLabel =
    course.status === 'completed' ? '✓ Done'         :
    course.status === 'enrolled'  ? '● In Progress'  :
    course.status === 'available' ? '✦ Available'    : '🔒';

  const statusClass =
    course.status === 'completed' ? 'card-status-badge status-completed' :
    course.status === 'enrolled'  ? 'card-status-badge status-enrolled'  :
    course.status === 'available' ? 'card-status-badge status-available' :
    'card-status-badge status-locked';

  return (
    <Link
      href={`/courses/${course.id}`}
      className={`course-card${isList ? ' is-list' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* ── Thumbnail ── */}
      <div
        className="card-thumb"
        style={{
          background: `linear-gradient(145deg, ${meta.from} 0%, ${meta.to} 100%)`,
        }}
      >
        <span className="card-thumb-watermark" style={{ color: meta.watermark }}>
          {course.level}
        </span>
        <span className="card-thumb-icon">{course.icon}</span>
        <span className="card-level-badge" style={{ background: meta.badge }}>
          {course.level}
        </span>
        <span className={statusClass}>{statusLabel}</span>
      </div>

      {/* ── Body ── */}
      <div className="card-body">
        <span className="card-cat-chip">{course.category}</span>
        <div className="card-title">{course.title}</div>
        <div className="card-meta">
          <span>{course.lessons} lessons</span>
          <span className="card-meta-dot" />
          <span>{course.hours}h total</span>
        </div>

        {/* Progress bar — enrolled only */}
        {course.status === 'enrolled' && course.progress !== undefined && (
          <div className="card-progress-wrap">
            <div className="card-progress-track">
              <div className="card-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="card-progress-label">
              {course.progress} / {course.lessons} lessons · {pct}%
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="card-footer">
        <span className="xp-badge">🌟 {course.xp} XP</span>
        <button
          className={ctaClass}
          onClick={(e) => e.preventDefault()}
        >
          {ctaLabel}
        </button>
      </div>
    </Link>
  );
}