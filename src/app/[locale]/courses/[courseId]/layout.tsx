// src/app/courses/[courseId]/layout.tsx

import '@/styles/dashboard.css';
import '@/styles/courses.css';
import '@/styles/course-detail.css';
import React from 'react';

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}