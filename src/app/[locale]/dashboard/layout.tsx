// ─────────────────────────────────────────────────────────────────
// src/app/dashboard/layout.tsx
// Dashboard layout using IndividualLayout with common sidebar and topbar
// Navigation menu content passed as children
// ─────────────────────────────────────────────────────────────────

import IndividualLayout from '@/components/layout/IndividualLayout';
import '@/styles/dashboard.css';
import React from 'react';

export default function DashboardLayout({
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
