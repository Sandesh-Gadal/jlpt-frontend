// src/app/flashcards/layout.tsx

import '@/styles/dashboard.css';
import '@/styles/flashcard.css';
import IndividualLayout from '@/components/layout/IndividualLayout';

export default function FlashcardLayout({ children }: { children: React.ReactNode }) {
  return (
    <IndividualLayout>
      {children}
    </IndividualLayout>
  );
}
