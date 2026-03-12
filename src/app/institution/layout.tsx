// ─────────────────────────────────────────────────────────────────
// src/app/institution/layout.tsx
// Institution layout using InstitutionLayout with common sidebar and topbar
// Navigation menu content passed as children
// ─────────────────────────────────────────────────────────────────

import InstitutionLayout from '@/components/layout/InstitutionLayout';

export default function InstitutionRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstitutionLayout>
      {children}
    </InstitutionLayout>
  );
}

