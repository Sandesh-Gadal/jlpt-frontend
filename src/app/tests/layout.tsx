// src/app/tests/layout.tsx

import '@/styles/dashboard.css';
import '@/styles/test-interface.css';
import IndividualLayout from '@/components/layout/IndividualLayout';

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <IndividualLayout>
      {children}
    </IndividualLayout>
  );
}
