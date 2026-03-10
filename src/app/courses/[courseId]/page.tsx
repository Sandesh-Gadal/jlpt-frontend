'use client';

// src/app/courses/[courseId]/page.tsx  — S08 Course Detail

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppShell      from '@/components/dashboard/Layout/AppShell';
import CourseHero    from '@/components/course-detail/CourseHero';
import CourseStats   from '@/components/course-detail/CourseStats';
import LessonList    from '@/components/course-detail/LessonList';
import CourseReviews from '@/components/course-detail/CourseReviews';
import { coursesApi } from '@/lib/api';
import { useUserData } from '@/hooks/useUserData';
import { MOCK_COURSE_DETAIL_MAP, COURSE_DETAIL } from '@/data/courseDetailData';
import type { CourseDetailData } from '@/types/lesson';

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  
  // Use the shared hook for user data
  const { fullName, jlptLevel, userInitial } = useUserData();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const data = await coursesApi.get(courseId);
        if (data) {
          setCourse(data);
        } else {
          // Fallback to mock data
          console.log('Using mock data - API returned null');
          const mockData = MOCK_COURSE_DETAIL_MAP[courseId] ?? COURSE_DETAIL;
          setCourse(mockData);
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        // Fallback to mock data
        const mockData = MOCK_COURSE_DETAIL_MAP[courseId] ?? COURSE_DETAIL;
        setCourse(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Show loading or use fallback while loading
  const displayCourse = course || COURSE_DETAIL;

  return (
    <AppShell
      userName={fullName}
      userInitial={userInitial}
      userLevel={jlptLevel}
      topBarSubText={displayCourse.title}
      notifCount={0}
    >
      {/* Full-height flex layout within main-area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        {/* Hero banner */}
        <CourseHero course={displayCourse} />

        {/* Two-col body */}
        <div className="cd-body">

          {/* Left: main content */}
          <div className="cd-main">
            <CourseStats  course={displayCourse} />
            <LessonList   course={displayCourse} />
            <CourseReviews course={displayCourse} />
          </div>

          {/* Right: aside */}
          <div className="cd-aside">
            <div className="cd-aside-card">
              <div className="cd-aside-title">Course Info</div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Level</span>
                <span className="cd-aside-row-value">{displayCourse.level}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Category</span>
                <span className="cd-aside-row-value">{displayCourse.category}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Lessons</span>
                <span className="cd-aside-row-value">{displayCourse.totalLessons}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Duration</span>
                <span className="cd-aside-row-value">{displayCourse.totalHours} hours</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">XP Reward</span>
                <span className="cd-aside-row-value">🌟 {displayCourse.xpReward}</span>
              </div>
              <div className="cd-aside-row">
                <span className="cd-aside-row-label">Rating</span>
                <span className="cd-aside-row-value">★ {displayCourse.rating} ({displayCourse.reviewCount})</span>
              </div>
            </div>

            {/* Long description */}
            <div className="cd-aside-card">
              <div className="cd-aside-title">About this Course</div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {displayCourse.longDescription}
              </p>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

