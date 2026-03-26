// src/app/courses/[courseId]/lessons/[lessonId]/layout.tsx

import '@/styles/dashboard.css';
import '@/styles/lesson-viewer.css';
import React from 'react';

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}