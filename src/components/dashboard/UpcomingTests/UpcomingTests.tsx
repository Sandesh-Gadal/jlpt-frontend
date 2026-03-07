'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/UpcomingTests/UpcomingTests.tsx
// List of upcoming practice tests with date, duration, start button
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import Link  from 'next/link';
import type { UpcomingTest } from '@/types/dashboard';

interface UpcomingTestsProps {
  tests: UpcomingTest[];
}

export default function UpcomingTests({ tests }: UpcomingTestsProps) {
  return (
    <div className="panel-card">
      {/* Header */}
      <div className="panel-header">
        <span className="panel-title">Upcoming Tests</span>
        <Link href="/tests" className="see-all-btn">View all →</Link>
      </div>

      {/* List */}
      <div className="tests-list">
        {tests.map((test) => (
          <TestItem key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}

/* ── Single test row ── */
function TestItem({ test }: { test: UpcomingTest }) {
  return (
    <div
      className="test-item"
      style={{
        borderLeftColor: test.urgent
          ? 'var(--accent-primary)'
          : 'var(--accent-tertiary)',
      }}
    >
      <div className="test-info">
        <div className="test-name">{test.name}</div>
        <div className="test-meta">
          <span>{test.date}</span>
          <span className="test-meta-dot" />
          <span>{test.time}</span>
          {test.urgent && (
            <>
              <span className="test-meta-dot" />
              <span className="test-ready-tag">Ready!</span>
            </>
          )}
        </div>
      </div>

      <Link href={`/tests/${test.id}`} className="btn-ghost-sm">
        Start
      </Link>
    </div>
  );
}
