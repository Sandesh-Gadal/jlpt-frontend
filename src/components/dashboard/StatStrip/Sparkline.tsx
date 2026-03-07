'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/StatStrip/Sparkline.tsx
// Mini bar chart showing last 7 test scores
// ─────────────────────────────────────────────────────────────────

import React from 'react';

interface SparklineProps {
  data: number[];  // array of score values (0–100)
}

export default function Sparkline({ data }: SparklineProps) {
  const max = Math.max(...data, 1);

  return (
    <div className="sparkline-wrap" aria-hidden="true">
      {data.map((value, i) => {
        const isLast = i === data.length - 1;
        const heightPct = Math.max((value / max) * 100, 8);
        return (
          <div
            key={i}
            className={`spark-bar${isLast ? ' highlight' : ''}`}
            style={{ height: `${heightPct}%` }}
            title={`${value}%`}
          />
        );
      })}
    </div>
  );
}
