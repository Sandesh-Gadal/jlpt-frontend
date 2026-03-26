// src/app/tests/layout.tsx
// Imports dashboard.css first (design system tokens), then test-section.css

import '@/styles/dashboard.css';
import '@/styles/test-section.css';
import IndividualLayout from '@/components/layout/IndividualLayout';

export const metadata = {
  title: 'Tests — JLPT Master',
};

export default function TestsLayout({ children }: { children: React.ReactNode }) {
    return (
        <IndividualLayout>
          {children}
        </IndividualLayout>
      );
  
}
