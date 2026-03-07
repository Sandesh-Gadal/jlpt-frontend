'use client';

import React from 'react';
import Link  from 'next/link';
import type { CourseDetailData } from '@/types/lesson';

const LEVEL_COLORS: Record<string, string> = {
  N5: '#5DAA48', N4: '#3A9EBA', N3: '#4A6ED4',
  N2: '#7A5ED4', N1: '#C05090',
};

interface CourseHeroProps {
  course: CourseDetailData;
}

export default function CourseHero({ course }: CourseHeroProps) {
  const pct    = Math.round((course.completedLessons / course.totalLessons) * 100);
  const badge  = LEVEL_COLORS[course.level] ?? '#6EAA54';
  const currentLesson = course.lessons.find((l) => l.status === 'current');

  return (
    <div className="cd-hero">
      {/* BG gradient */}
      <div
        className="cd-hero-bg"
        style={{ background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` }}
      />

      {/* Thumbnail */}
      <div
        className="cd-hero-thumb"
        style={{ background: `linear-gradient(145deg, ${course.gradientFrom}, ${course.gradientTo})` }}
      >
        {course.icon}
      </div>

      {/* Info */}
      <div className="cd-hero-info">
        <div className="cd-hero-badges">
          <span className="cd-level-badge" style={{ background: badge }}>{course.level}</span>
          <span className="cd-cat-badge">{course.category}</span>
        </div>
        <div className="cd-hero-title">{course.title}</div>
        <div className="cd-hero-desc">{course.description}</div>
        <div className="cd-hero-meta">
          <span className="cd-meta-item">
            <span className="cd-stars">{'★'.repeat(Math.round(course.rating))}</span>
            <strong>{course.rating}</strong>
            <span>({course.reviewCount} reviews)</span>
          </span>
          <span className="cd-meta-item">📚 <strong>{course.totalLessons}</strong> lessons</span>
          <span className="cd-meta-item">⏱ <strong>{course.totalHours}h</strong> total</span>
          <span className="cd-meta-item">🌟 <strong>{course.xpReward} XP</strong></span>
        </div>
      </div>

      {/* Right CTA */}
      <div className="cd-hero-right">
        <div className="cd-xp-pill">🌟 {course.xpReward} XP reward</div>

        {course.enrolled ? (
          <>
            <div className="cd-progress-wrap">
              <div className="cd-progress-label">{pct}% complete · {course.completedLessons}/{course.totalLessons} lessons</div>
              <div className="cd-progress-track">
                <div className="cd-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
            {currentLesson && (
              <Link
                href={`/courses/${course.id}/lessons/${currentLesson.id}`}
                className="cd-enroll-btn continue"
              >
                Continue → Lesson {currentLesson.number}
              </Link>
            )}
          </>
        ) : (
          <button className="cd-enroll-btn">Enroll Now — Free</button>
        )}
      </div>
    </div>
  );
}