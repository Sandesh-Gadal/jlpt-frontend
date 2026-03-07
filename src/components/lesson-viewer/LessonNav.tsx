'use client';

// src/components/lesson-viewer/LessonNav.tsx
// Prev / Next navigation bar at bottom of lesson viewer

import React from 'react';
import Link from 'next/link';
import type { CourseDetailData } from '@/types/lesson';

interface LessonNavProps {
  course:         CourseDetailData;
  currentLessonId: string;
  quizCompleted:  boolean;
}

export default function LessonNav({ course, currentLessonId, quizCompleted }: LessonNavProps) {
  const idx  = course.lessons.findIndex((l) => l.id === currentLessonId);
  const prev = idx > 0 ? course.lessons[idx - 1] : null;
  const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null;
  const isNextLocked = next?.status === 'locked' && !quizCompleted;

  return (
    <div className="lv-bottom-nav">
      {/* Previous */}
      {prev ? (
        <Link href={`/courses/${course.id}/lessons/${prev.id}`} className="lv-nav-btn">
          ← Prev
        </Link>
      ) : (
        <button className="lv-nav-btn" disabled>← Prev</button>
      )}

      {/* Progress indicator */}
      <div className="lv-nav-progress">
        Lesson {idx + 1} of {course.lessons.length}
      </div>

      {/* Next */}
      {next ? (
        isNextLocked ? (
          <button className="lv-nav-btn primary" disabled title="Complete the quiz to unlock">
            Complete quiz to unlock →
          </button>
        ) : (
          <Link href={`/courses/${course.id}/lessons/${next.id}`} className="lv-nav-btn primary">
            Next lesson →
          </Link>
        )
      ) : (
        <Link href={`/courses/${course.id}`} className="lv-nav-btn primary">
          ✓ Finish course
        </Link>
      )}
    </div>
  );
}