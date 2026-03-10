'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/StatStrip/GoalRing.tsx
// Minimalistic SVG circular progress ring
// ─────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';

interface GoalRingProps {
  done:  number;
  total: number;
}

export default function GoalRing({ done, total }: GoalRingProps) {
  const RADIUS      = 32;
  const CENTER      = 36;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~201

  const pct    = total > 0 ? done / total : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${done} of ${total} complete`}>
        {/* Background track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--bg-muted)"
          strokeWidth="5"
        />
        {/* Animated progress arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#34C759"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animated ? offset : CIRCUMFERENCE}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </svg>

      {/* Center label */}
      <div className="ring-center-text">
        <span className="ring-main">{done}/{total}</span>
      </div>
    </div>
  );
}

