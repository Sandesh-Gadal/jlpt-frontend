// src/components/course-detail/CourseReviews.tsx

import React from 'react';
import type { CourseDetailData } from '@/types/lesson';

export default function CourseReviews({ course }: { course: CourseDetailData }) {
  return (
    <div>
      <div className="cd-section-title">
        💬 Reviews
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
          {course.rating} ★ · {course.reviewCount} ratings
        </span>
      </div>

      <div className="cd-reviews-list">
        {course.reviews.map((r, i) => (
          <div
            key={r.id}
            className="cd-review-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="cd-review-header">
              <div className="cd-review-avatar">{r.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cd-review-name">{r.name}</div>
                <div className="cd-review-meta">
                  <span>{r.level} Student</span>
                  <span>·</span>
                  <span>{r.date}</span>
                </div>
              </div>
              <div className="cd-review-stars">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            </div>
            <div className="cd-review-text">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}