'use client';

// ─────────────────────────────────────────────────────────────────
// src/hooks/useCountUp.ts
// Animates a number from 0 → target over `duration` ms
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

export function useCountUp(
  target:   number,
  duration: number = 800,
  delay:    number = 0
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
}
