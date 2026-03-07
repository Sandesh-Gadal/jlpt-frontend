'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/StatStrip/GoalRing.tsx
// Animated SVG circular progress ring for daily goal stat
// ─────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';

interface GoalRingProps {
  done:  number;
  total: number;
}

export default function GoalRing({ done, total }: GoalRingProps) {
  const RADIUS      = 36;
  const CENTER      = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~226.2

  const pct    = total > 0 ? done / total : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Delay so the ring "draws in" after mount
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ring-wrap">
      <svg width="80" height="80" viewBox="0 0 80 80" aria-label={`${done} of ${total} lessons complete`}>
        {/* Background track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth="6"
        />
        {/* Animated progress arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animated ? offset : CIRCUMFERENCE}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)',
            filter: 'drop-shadow(0 0 4px var(--glow-green))',
          }}
        />
      </svg>

      {/* Center label */}
      <div className="ring-center-text">
        <span className="ring-main">{done}/{total}</span>
        <span className="ring-sub">lessons</span>
      </div>
    </div>
  );
}
