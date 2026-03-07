'use client';

// src/app/courses/[courseId]/lessons/[lessonId]/page.tsx — S09 Lesson Viewer

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import LessonSidebar from '@/components/lesson-viewer/LessonSidebar';
import LessonContent from '@/components/lesson-viewer/LessonContent';
import LessonQuiz    from '@/components/lesson-viewer/LessonQuiz';
import LessonNav     from '@/components/lesson-viewer/LessonNav';
import { MOCK_LESSON_MAP, LESSON_DATA } from '@/data/lessonData';
import { MOCK_COURSE_DETAIL_MAP, COURSE_DETAIL } from '@/data/courseDetailData';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();

  // Replace with real API calls
  const lesson = MOCK_LESSON_MAP[lessonId]  ?? LESSON_DATA;
  const course = MOCK_COURSE_DETAIL_MAP[courseId] ?? COURSE_DETAIL;

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore,     setQuizScore]     = useState<number | null>(null);

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setQuizCompleted(true);
  };

  return (
    // Lesson viewer has its OWN shell — no AppShell, no sidebar nav
    <div className="lv-shell">

      {/* ── Lesson sidebar (desktop) ── */}
      <LessonSidebar course={course} activeLessonId={lesson.id} />

      {/* ── Main ── */}
      <div className="lv-main">

        {/* Topbar */}
        <div className="lv-topbar">
          <span className="lv-lesson-number">
            Lesson {lesson.number} / {lesson.totalInCourse}
          </span>
          <div className="lv-lesson-title-bar">
            <div className="lv-lesson-title-main">{lesson.title}</div>
            <div className="lv-lesson-subtitle">{lesson.subtitle}</div>
          </div>
          <div className="lv-topbar-right">
            <span className="lv-duration-badge">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              {lesson.duration} min
            </span>
            <span className="lv-xp-badge">🌟 {lesson.xpReward} XP</span>

            {quizScore !== null && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: quizScore >= 75 ? 'var(--accent-primary)' : '#ef4444',
                background: quizScore >= 75 ? 'var(--highlight)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${quizScore >= 75 ? 'var(--border-focus)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 'var(--radius-full)', padding: '3px 10px',
              }}>
                Quiz: {quizScore}%
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="lv-content">
          {/* Lesson body */}
          <LessonContent blocks={lesson.content} />

          {/* Quiz */}
          <LessonQuiz
            questions={lesson.quiz}
            xpReward={lesson.xpReward}
            onComplete={handleQuizComplete}
          />
        </div>

        {/* Prev / Next nav */}
        <LessonNav
          course={course}
          currentLessonId={lesson.id}
          quizCompleted={quizCompleted}
        />
      </div>

    </div>
  );
}