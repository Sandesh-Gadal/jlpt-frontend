'use client';

// src/components/course-detail/LessonList.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import type { CourseDetailData } from '@/types/lesson';

export default function LessonList({ course }: { course: CourseDetailData }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? course.lessons : course.lessons.slice(0, 8);

  return (
    <div>
      <div className="cd-section-title">
        📖 Lessons
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
          {course.completedLessons} / {course.totalLessons} completed
        </span>
      </div>

      <div className="cd-lesson-list">
        {visible.map((lesson) => {
          const isDone   = lesson.status === 'completed';
          const isCur    = lesson.status === 'current';
          const isLocked = lesson.status === 'locked';

          return (
            <Link
              key={lesson.id}
              href={isLocked ? '#' : `/courses/${course.id}/lessons/${lesson.id}`}
              className={`cd-lesson-item${isCur ? ' is-current' : ''}${isLocked ? ' is-locked' : ''}`}
              onClick={isLocked ? (e) => e.preventDefault() : undefined}
            >
              {/* Number / status dot */}
              <div className={`cd-lesson-num ${isDone ? 'done' : isCur ? 'cur' : 'lock'}`}>
                {isDone ? '✓' : lesson.number}
              </div>

              {/* Info */}
              <div className="cd-lesson-info">
                <div className="cd-lesson-title">{lesson.title}</div>
                <div className="cd-lesson-meta">{lesson.duration} min</div>
              </div>

              {/* Right */}
              <div className="cd-lesson-right">
                <span className="cd-lesson-xp">🌟 {lesson.xp}</span>
                <span className="cd-lesson-icon">
                  {isDone ? '✓' : isCur ? '▶' : '🔒'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {course.lessons.length > 8 && (
        <button
          onClick={() => setShowAll((p) => !p)}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '9px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
          }}
        >
          {showAll
            ? '▲ Show less'
            : `▼ Show all ${course.lessons.length} lessons`}
        </button>
      )}
    </div>
  );
}