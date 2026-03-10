'use client';

// src/app/courses/[courseId]/lessons/[lessonId]/page.tsx — S09 Lesson Viewer

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonSidebar from '@/components/lesson-viewer/LessonSidebar';
import LessonContent from '@/components/lesson-viewer/LessonContent';
import LessonQuiz    from '@/components/lesson-viewer/LessonQuiz';
import LessonNav     from '@/components/lesson-viewer/LessonNav';
import { MOCK_LESSON_MAP, LESSON_DATA } from '@/data/lessonData';
import { MOCK_COURSE_DETAIL_MAP, COURSE_DETAIL } from '@/data/courseDetailData';
import { lessonsApi, coursesApi } from '@/lib/api';
import type { LessonDetailData } from '@/lib/api/lessons';
import type { CourseDetailData } from '@/types/lesson';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonDetailData | null>(null);
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lessonId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch course details for the sidebar
        const courseData = await coursesApi.get(courseId);
        if (courseData) {
          setCourse(courseData);
        } else {
          // Fallback to mock data
          const mockCourse = MOCK_COURSE_DETAIL_MAP[courseId] ?? COURSE_DETAIL;
          setCourse(mockCourse);
        }

        // Fetch lesson details
        const totalInCourse = courseData?.lessons.length || 0;
        const lessonData = await lessonsApi.get(lessonId, totalInCourse);
        
        if (lessonData) {
          // Get lesson number from course lessons
          const lessonIndex = courseData?.lessons.findIndex(l => l.id === lessonId) ?? -1;
          const lessonNumber = lessonIndex >= 0 ? lessonIndex + 1 : 1;
          
          setLesson({
            ...lessonData,
            number: lessonNumber,
            totalInCourse: totalInCourse,
          });
        } else {
          // Fallback to mock data
          const mockLesson = MOCK_LESSON_MAP[lessonId] ?? LESSON_DATA;
          setLesson(mockLesson);
        }
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError('Failed to load lesson');
        
        // Fallback to mock data
        const mockLesson = MOCK_LESSON_MAP[lessonId] ?? LESSON_DATA;
        const mockCourse = MOCK_COURSE_DETAIL_MAP[courseId] ?? COURSE_DETAIL;
        setLesson(mockLesson);
        setCourse(mockCourse);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore,     setQuizScore]     = useState<number | null>(null);

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setQuizCompleted(true);
  };

  // Loading state
  if (loading || !lesson || !course) {
    return (
      <div className="lv-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="loading-spinner" style={{ width: 32, height: 32, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading lesson...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="lv-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <p>{error}</p>
          <button onClick={() => router.back()} style={{ marginTop: 16, padding: '8px 16px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    // Lesson viewer has its own shell — no AppShell, no sidebar nav
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

