// src/components/course-detail/CourseStats.tsx

import React from 'react';
import type { CourseDetailData } from '@/types/lesson';

export default function CourseStats({ course }: { course: CourseDetailData }) {
  const pct = Math.round((course.completedLessons / course.totalLessons) * 100);

  return (
    <>
      {/* Stats grid */}
      <div>
        <div className="cd-section-title">📊 At a Glance</div>
        <div className="cd-stats-grid">
          <div className="cd-stat-card">
            <div className="cd-stat-value">{course.totalLessons}</div>
            <div className="cd-stat-label">Lessons</div>
          </div>
          <div className="cd-stat-card">
            <div className="cd-stat-value">{course.totalHours}h</div>
            <div className="cd-stat-label">Content</div>
          </div>
          <div className="cd-stat-card">
            <div className="cd-stat-value">{course.xpReward}</div>
            <div className="cd-stat-label">XP Reward</div>
          </div>
          <div className="cd-stat-card">
            <div className="cd-stat-value">{pct}%</div>
            <div className="cd-stat-label">Complete</div>
          </div>
        </div>
      </div>

      {/* What you'll learn */}
      <div>
        <div className="cd-section-title">✦ What You&apos;ll Learn</div>
        <div className="cd-skills-grid">
          {course.skills.map((skill, i) => (
            <div key={i} className="cd-skill-item">
              <span className="cd-skill-check">✓</span>
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}