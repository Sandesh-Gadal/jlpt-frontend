'use client';

// src/app/tests/page.tsx — S12 Test Catalog
// Shows all test sets grouped by type (Practice / Mock Exam)
// Filters by level chip, shows past scores, assigned flags

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/dashboard/Layout/AppShell';
import { MOCK_TEST_CATALOG } from '@/data/testData';
import type { TestSet } from '@/types/test';

type TabMode    = 'all' | 'practice' | 'mock_exam';
type LevelMode  = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const LEVEL_COLORS: Record<string, string> = {
  N5: 'badge-n5', N4: 'badge-n4', N3: 'badge-n3', N2: 'badge-n2', N1: 'badge-n1',
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function formatDue(dueDateStr: string): string {
  const due  = new Date(dueDateStr);
  const diff = Math.ceil((due.getTime() - Date.now()) / 86400000);
  if (diff < 0)  return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

export default function TestCatalogPage() {
  const [tab,   setTab]   = useState<TabMode>('all');
  const [level, setLevel] = useState<LevelMode>('ALL');

  const filtered = useMemo(() => {
    return MOCK_TEST_CATALOG.filter((t) => {
      const matchTab   = tab === 'all' || t.test_type === tab;
      const matchLevel = level === 'ALL' || t.level.code === level;
      return matchTab && matchLevel;
    });
  }, [tab, level]);

  const practicing  = MOCK_TEST_CATALOG.filter(t => t.last_attempt).length;
  const passed      = MOCK_TEST_CATALOG.filter(t => t.last_attempt?.passed).length;
  const due         = MOCK_TEST_CATALOG.filter(t => t.is_assigned).length;

  return (
 
      // <div className="dashboard-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="dashboard-content" style={{ padding: 0 }}>

        {/* Header */}
        <div className="tc-header">
          <div className="tc-header-row">
            <div>
              <div className="tc-page-title">📝 Mock Tests</div>
              <div className="tc-page-sub">
                {MOCK_TEST_CATALOG.length} tests available · {practicing} attempted · {passed} passed
              </div>
            </div>
          </div>
        </div>

        {/* Type tabs */}
        <div className="tc-tab-bar">
          {[
            { key: 'all',       label: `All Tests (${MOCK_TEST_CATALOG.length})` },
            { key: 'practice',  label: 'Practice' },
            { key: 'mock_exam', label: 'Mock Exams' },
          ].map((t) => (
            <button
              key={t.key}
              className={`tc-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key as TabMode)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Level chips */}
        <div className="tc-level-chips">
          {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as LevelMode[]).map((l) => (
            <button
              key={l}
              className={`tc-level-chip${level === l ? ' active' : ''}`}
              onClick={() => setLevel(l)}
            >
              {l === 'ALL' ? 'All Levels' : l}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="tc-stats-row">
          <div className="tc-stat-item">
            <div className="tc-stat-dot" style={{ background: 'var(--accent-primary)' }} />
            {filtered.length} tests shown
          </div>
          {due > 0 && (
            <div className="tc-stat-item">
              <div className="tc-stat-dot" style={{ background: 'var(--accent-tertiary)' }} />
              {due} assigned
            </div>
          )}
          <div className="tc-stat-item">
            <div className="tc-stat-dot" style={{ background: 'var(--accent-sky)' }} />
            {passed} passed
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>No tests match this filter</div>
            </div>
          ) : (
            <div className="tc-grid">
              {filtered.map((test, i) => (
                <TestCard key={test.id} test={test} index={i} />
              ))}
            </div>
          )}
        </div>

      </div>
  );
}

function TestCard({ test, index }: { test: TestSet; index: number }) {
  const hasScore   = test.last_attempt !== null;
  const isPassed   = test.last_attempt?.passed;
  const hasAudio   = test.sections.some(s => s.has_audio);

  return (
    <Link href={`/tests/${test.id}/pre`} style={{ textDecoration: 'none' }}>
      <div className="tc-card" style={{ animationDelay: `${index * 40}ms` }}>

        {/* Assigned flag */}
        {test.is_assigned && (
          <div className="tc-assigned-flag">📌 Assigned</div>
        )}

        {/* Top row */}
        <div className="tc-card-top">
          <div className="tc-badges">
            <span className={`tc-badge ${LEVEL_COLORS[test.level.code]}`}>{test.level.code}</span>
            <span className={`tc-badge ${test.test_type === 'mock_exam' ? 'badge-mock' : 'badge-prac'}`}>
              {test.test_type === 'mock_exam' ? 'Mock Exam' : 'Practice'}
            </span>
            <span className="tc-badge" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {test.category}
            </span>
          </div>
          {hasScore && (
            <span className={`tc-score-badge ${isPassed ? 'pass' : 'fail'}`}>
              {test.last_attempt!.score_percent}%
            </span>
          )}
        </div>

        <div className="tc-card-title">{test.title}</div>
        <div className="tc-card-desc">{test.description}</div>

        {/* Section tags */}
        <div className="tc-sections">
          {test.sections.map((s) => (
            <span key={s.id} className={`tc-section-tag ${s.has_audio ? 'has-audio' : ''}`}>
              {s.has_audio ? '🔊 ' : ''}{s.name}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="tc-card-meta">
          <span>📝 {test.question_count} questions</span>
          <span>⏱ {formatTime(test.time_limit_seconds)}</span>
          <span>✓ {test.passing_score_percent}% to pass</span>
          {hasAudio && <span>🔊 Audio</span>}
        </div>

        {/* Footer */}
        <div className="tc-card-footer">
          <div>
            <div className="tc-xp-label">🌟 +{test.xp_reward_pass} XP on pass</div>
            {test.due_at && (
              <div className="tc-due-label">⚑ {formatDue(test.due_at)}</div>
            )}
          </div>
          <button className={`tc-start-btn ${hasScore ? 'retake' : ''}`}>
            {hasScore ? '↺ Retake' : 'Start Test →'}
          </button>
        </div>

      </div>
    </Link>
  );
}
