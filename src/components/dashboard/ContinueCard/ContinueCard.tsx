'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/ContinueCard/ContinueCard.tsx
// Minimalistic "Continue Learning" card
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import Link  from 'next/link';
import type { CourseProgress } from '@/types/dashboard';

interface ContinueCardProps {
  course: CourseProgress;
}

export default function ContinueCard({ course }: ContinueCardProps) {
  const progressPct = (course.lessonNumber / course.totalLessons) * 100;

  return (
    <div className="continue-card">

      {/* Thumbnail */}
      <div className="course-thumbnail">
        <span className="thumb-jp">{course.thumbnailJp}</span>
        <span className="thumb-level-badge">{course.level}</span>
      </div>

      {/* Info */}
      <div className="continue-info">
        <span className="continue-tag">Continue Learning</span>
        <div className="continue-title">{course.courseName}</div>
        <div className="continue-lesson">{course.lessonTitle}</div>

        <div className="progress-bar-row">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="progress-label">
            {course.lessonNumber}/{course.totalLessons}
          </span>
        </div>
      </div>

      {/* Right CTA */}
      <div className="continue-right">
        <div className="time-remaining">
          ~{course.estimatedMinsRemaining} min left
        </div>

        <Link
          href={`/courses/${course.courseId}`}
          className="btn-primary"
        >
          Continue
          <svg
            width="12" height="12"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

    </div>
  );
}

