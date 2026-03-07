'use client';

// src/components/test-interface/TestTimer.tsx

import React, { useEffect, useState } from 'react';

interface TestTimerProps {
  totalSeconds: number;
  onTimeUp:     () => void;
}

export default function TestTimer({ totalSeconds, onTimeUp }: TestTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) { onTimeUp(); return; }
    const id = setInterval(() => setRemaining((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, onTimeUp]);

  const mm  = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss  = String(remaining % 60).padStart(2, '0');
  const cls =
    remaining < 60  ? 'ti-timer danger'  :
    remaining < 300 ? 'ti-timer warning' :
    'ti-timer';

  return (
    <div className={cls}>
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      {mm}:{ss}
    </div>
  );
}
