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
  const completedLessons = course.completedLessons ?? 0;
  const totalLessons = course.totalLessons ?? 1;
  const pct    = Math.round((completedLessons / totalLessons) * 100);
  const badge  = LEVEL_COLORS[course.level] ?? '#6EAA54';
  const currentLesson = course.lessons?.find((l) => l.status === 'current');
  const rating = course.rating ?? 0;
  const reviewCount = course.reviewCount ?? 0;
  const totalHours = course.totalHours ?? 0;
  const xpReward = course.xpReward ?? 0;
  const gradientFrom = course.gradientFrom ?? '#1a2a50';
  const gradientTo = course.gradientTo ?? '#2a3e7a';

  return (
    <div className="cd-hero">
      {/* BG gradient */}
      <div
        className="cd-hero-bg"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      />

      {/* Thumbnail */}
      <div
        className="cd-hero-thumb"
        style={{ background: `linear-gradient(145deg, ${gradientFrom}, ${gradientTo})` }}
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
            <span className="cd-stars">{'★'.repeat(Math.round(rating))}</span>
            <strong>{rating}</strong>
            <span>({reviewCount} reviews)</span>
          </span>
          <span className="cd-meta-item">📚 <strong>{totalLessons}</strong> lessons</span>
          <span className="cd-meta-item">⏱ <strong>{totalHours}h</strong> total</span>
          <span className="cd-meta-item">🌟 <strong>{xpReward} XP</strong></span>
        </div>
      </div>

      {/* Right CTA */}
      <div className="cd-hero-right">
        <div className="cd-xp-pill">🌟 {xpReward} XP reward</div>

        {/* Handle locked, enrolled, and available states */}
        {course.is_locked ? (
          <>
            <div className="cd-progress-wrap">
              <div className="cd-progress-label">0% complete · 0/{totalLessons} lessons</div>
              <div className="cd-progress-track">
                <div className="cd-progress-fill" style={{ width: '0%' }} />
              </div>
            </div>
            <button className="cd-enroll-btn locked">
              🔒 Upgrade to {course.required_plan || 'Premium'} to Access
            </button>
          </>
        ) : course.enrolled ? (
          <>
            <div className="cd-progress-wrap">
              <div className="cd-progress-label">{pct}% complete · {completedLessons}/{totalLessons} lessons</div>
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
