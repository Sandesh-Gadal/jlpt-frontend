// src/app/courses/layout.tsx

import '@/styles/dashboard.css';
import '@/styles/courses.css';
import React from 'react';

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}