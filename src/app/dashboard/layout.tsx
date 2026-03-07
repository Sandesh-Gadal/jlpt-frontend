// ─────────────────────────────────────────────────────────────────
// src/app/dashboard/layout.tsx
// Imports dashboard.css ONCE for all pages inside /dashboard/
// ─────────────────────────────────────────────────────────────────

import '@/styles/dashboard.css';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
