'use client';

// src/app/courses/[courseId]/page.tsx  — S08 Course Detail

import React from 'react';
import { useParams } from 'next/navigation';
import AppShell      from '@/components/dashboard/Layout/AppShell';
import CourseHero    from '@/components/course-detail/CourseHero';
import CourseStats   from '@/components/course-detail/CourseStats';
import LessonList    from '@/components/course-detail/LessonList';
import CourseReviews from '@/components/course-detail/CourseReviews';
import { MOCK_COURSE_DETAIL_MAP, COURSE_DETAIL } from '@/data/courseDetailData';

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  // Replace with: const { data: course } = useSWR(`/api/v1/courses/${courseId}`)
  const course = MOCK_COURSE_DETAIL_MAP[courseId] ?? COURSE_DETAIL;

  return (
    <AppShell
      userName="Keiko Tanaka"
      userInitial="K"
      userLevel="N3"
      topBarSubText={course.title}
      notifCount={3}
    >
      {/* Full-height flex layout within main-area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        {/* Hero banner */}
        <CourseHero course={course} />

        {/* Two-col body */}
        <div className="cd-body">

          {/* Left: main content */}
          <div className="cd-main">
            <CourseStats  course={course} />
            <LessonList   course={course} />
            <CourseReviews course={course} />
          </div>

          {/* Right: aside */}
          <div className="cd-aside">
            <div className="cd-aside-card">
              <div className="cd-aside-title">Course Info</div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Level</span>
                <span className="cd-aside-row-value">{course.level}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Category</span>
                <span className="cd-aside-row-value">{course.category}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Lessons</span>
                <span className="cd-aside-row-value">{course.totalLessons}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Duration</span>
                <span className="cd-aside-row-value">{course.totalHours} hours</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">XP Reward</span>
                <span className="cd-aside-row-value">🌟 {course.xpReward}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Rating</span>
                <span className="cd-aside-row-value">★ {course.rating} ({course.reviewCount})</span>
              </div>
            </div>

            {/* Long description */}
            <div className="cd-aside-card">
              <div className="cd-aside-title">About this Course</div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {course.longDescription}
              </p>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}