'use client';

// src/components/lesson-viewer/LessonSidebar.tsx

import React from 'react';
import Link from 'next/link';
import type { CourseDetailData } from '@/types/lesson';

interface LessonSidebarProps {
  course:          CourseDetailData;
  activeLessonId:  string;
}

export default function LessonSidebar({ course, activeLessonId }: LessonSidebarProps) {
  const completedLessons = course.completedLessons ?? 0;
  const totalLessons = course.totalLessons ?? 1;
  const pct = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="lv-sidebar">
      {/* Header */}
      <div className="lv-sidebar-header">
        <Link href={`/courses/${course.id}`} className="lv-back-btn">
          ← Back to course
        </Link>
        <div className="lv-course-title">{course.title}</div>
        <div className="lv-course-progress">
          {completedLessons} / {totalLessons} lessons · {pct}%
        </div>
        <div className="lv-progress-track">
          <div className="lv-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Lesson list */}
      <div className="lv-lesson-list">
        {course.lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          const isDone   = lesson.status === 'completed';
          const isLocked = lesson.status === 'locked';

          return (
            <Link
              key={lesson.id}
              href={isLocked ? '#' : `/courses/${course.id}/lessons/${lesson.id}`}
              className={`lv-lesson-item${isActive ? ' is-active' : ''}${isLocked ? ' is-locked' : ''}`}
              onClick={isLocked ? (e) => e.preventDefault() : undefined}
            >
              <div className={`lv-lesson-dot ${isDone ? 'done' : isActive ? 'active' : 'locked'}`}>
                {isDone ? '✓' : lesson.number}
              </div>
              <span className="lv-lesson-name">{lesson.title}</span>
              <span className="lv-lesson-dur">{lesson.duration}m</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
