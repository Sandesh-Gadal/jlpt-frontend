'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { testsApi, type ApiTestSet } from '@/lib/api/tests';

type TabMode = 'all' | 'practice' | 'mock_exam';
type LevelMode = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const LEVEL_COLORS: Record<string, string> = {
  N5: 'badge-n5',
  N4: 'badge-n4',
  N3: 'badge-n3',
  N2: 'badge-n2',
  N1: 'badge-n1',
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

export default function TestCatalogPage() {
  const [tab, setTab] = useState<TabMode>('all');
  const [level, setLevel] = useState<LevelMode>('ALL');
  const [tests, setTests] = useState<ApiTestSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await testsApi.list(level);
        console.log('Loaded tests:', data);
        if (mounted) {
          setTests(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load tests');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [level]);

  const filtered = useMemo(() => {
    return tests.filter((t) => tab === 'all' || t.test_type === tab);
  }, [tab, tests]);

  const practicing = tests.filter((t) => t.last_attempt).length;
  const passed = tests.filter((t) => t.last_attempt?.passed).length;

  return (
    <div className="dashboard-content" style={{ padding: 0 }}>
      <div className="tc-header">
        <div className="tc-header-row">
          <div>
            <div className="tc-page-title">📝 Mock Tests</div>
            <div className="tc-page-sub">
              {tests.length} tests available · {practicing} attempted · {passed} passed
            </div>
          </div>
        </div>
      </div>

      <div className="tc-tab-bar">
        {[
          { key: 'all', label: `All Tests (${tests.length})` },
          { key: 'practice', label: 'Practice' },
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

      <div className="tc-stats-row">
        <div className="tc-stat-item">
          <div className="tc-stat-dot" style={{ background: 'var(--accent-primary)' }} />
          {filtered.length} tests shown
        </div>
        <div className="tc-stat-item">
          <div className="tc-stat-dot" style={{ background: 'var(--accent-sky)' }} />
          {passed} passed
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: 24 }}>Loading tests...</div>
        ) : error ? (
          <div style={{ padding: 24, color: 'var(--danger)' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
              No tests match this filter
            </div>
          </div>
        ) : (
          <div className="tc-grid">
            {filtered.map((test, i) => (
              <Link
                key={test.id}
                href={`/tests/${test.id}/pre`}
                style={{ textDecoration: 'none' }}
              >
                <div className="tc-card" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="tc-card-top">
                    <div className="tc-badges">
                      <span className={`tc-badge ${LEVEL_COLORS[test.level.code]}`}>
                        {test.level.code}
                      </span>
                      <span className={`tc-badge ${test.test_type === 'mock_exam' ? 'badge-mock' : 'badge-prac'}`}>
                        {test.test_type === 'mock_exam' ? 'Mock Exam' : 'Practice'}
                      </span>
                      <span
                        className="tc-badge"
                        style={{
                          background: 'var(--bg-card)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {test.category}
                      </span>
                    </div>

                    {test.last_attempt && (
                      <span className={`tc-score-badge ${test.last_attempt.passed ? 'pass' : 'fail'}`}>
                        {test.last_attempt.score_percent}%
                      </span>
                    )}
                  </div>

                  <div className="tc-card-title">{test.title}</div>
                  <div className="tc-card-desc">{test.description}</div>

                  <div className="tc-sections">
                    {test.sections.map((s) => (
                      <span key={s.id} className={`tc-section-tag ${s.has_audio ? 'has-audio' : ''}`}>
                        {s.has_audio ? '🔊 ' : ''}
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <div className="tc-card-meta">
                    <span>📝 {test.question_count} questions</span>
                    <span>⏱ {formatTime(test.time_limit_seconds)}</span>
                    <span>✓ {test.passing_score_percent}% to pass</span>
                    {test.sections.some((s) => s.has_audio) && <span>🔊 Audio</span>}
                  </div>

                  <div className="tc-card-footer">
                    <div>
                      <div className="tc-xp-label">🌟 +{test.xp_reward_pass} XP on pass</div>
                    </div>
                    <button className={`tc-start-btn ${test.last_attempt ? 'retake' : ''}`}>
                      {test.last_attempt ? '↺ Retake' : 'Start Test →'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}