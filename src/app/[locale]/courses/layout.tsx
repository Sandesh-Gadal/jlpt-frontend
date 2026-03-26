// src/app/courses/layout.tsx

import '@/styles/dashboard.css';
import '@/styles/courses.css';
import React from 'react';
import IndividualLayout from '@/components/layout/IndividualLayout';

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IndividualLayout>
      {children}
    </IndividualLayout>
  );
}
