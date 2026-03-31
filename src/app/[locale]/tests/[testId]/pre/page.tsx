'use client';

// src/app/tests/[testId]/pre/page.tsx — S13 Pre-Test Screen
// Shows test summary, instructions accordion, audio check,
// past best score, practice mode toggle, then Start Test CTA

import React, { useState } from 'react';
import Link    from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/dashboard/Layout/AppShell';
import { MOCK_TEST_CATALOG, MOCK_PRETEST_INSTRUCTIONS } from '@/data/testData';

const SECTION_ICONS: Record<string, string> = {
  vocabulary: '📖',
  grammar:    '✏️',
  reading:    '📄',
  listening:  '🔊',
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Change the function signature + add React.use() unwrap
export default function PreTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const router = useRouter();
  const { testId } = React.use(params);

  const test = MOCK_TEST_CATALOG.find(t => t.id === testId) ?? MOCK_TEST_CATALOG[3];

  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [practiceMode,     setPracticeMode]     = useState(false);
  const [audioChecked,     setAudioChecked]     = useState(false);

  const hasAudio    = test.sections.some(s => s.has_audio);
  const lastAttempt = test.last_attempt;

  const handleStart = () => {
    // In production: POST /api/v1/tests/{testId}/start → get attemptId
    router.push(`/tests/${test.id}`);
  };

  return (
    // <AppShell
    //   userName="Keiko Tanaka"
    //   userInitial="K"
    //   userLevel="N3"
    //   topBarSubText="Test overview · Review before starting"
    //   notifCount={3}
    // >
    <>
      <div className="dashboard-content" style={{ overflowY: 'auto' }}>
        <div className="">

          {/* Back */}
          <Link href="/tests" className="pt-back-btn">
            ← Back to Tests
          </Link>

          {/* Hero card */}
          <div className="pt-hero">
            <div className="pt-hero-top">
              <div className="pt-hero-badges">
                <span className={`tc-badge badge-${test.level.code.toLowerCase()}`}>{test.level.code}</span>
                <span className={`tc-badge ${test.test_type === 'mock_exam' ? 'badge-mock' : 'badge-prac'}`}>
                  {test.test_type === 'mock_exam' ? 'Mock Exam' : 'Practice'}
                </span>
                <span className="tc-badge" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {test.category}
                </span>
                {test.is_assigned && (
                  <span className="tc-badge badge-mock">📌 Assigned</span>
                )}
              </div>
            </div>

            <div className="pt-hero-title">{test.title}</div>
            <div className="pt-hero-desc">{test.description}</div>

            {/* Stats grid */}
            <div className="pt-stats-grid">
              <div className="pt-stat-cell">
                <div className="pt-stat-val">{test.question_count}</div>
                <div className="pt-stat-lbl">Questions</div>
              </div>
              <div className="pt-stat-cell">
                <div className="pt-stat-val">{formatTime(test.time_limit_seconds)}</div>
                <div className="pt-stat-lbl">Time Limit</div>
              </div>
              <div className="pt-stat-cell">
                <div className="pt-stat-val">{test.passing_score_percent}%</div>
                <div className="pt-stat-lbl">To Pass</div>
              </div>
              <div className="pt-stat-cell">
                <div className="pt-stat-val" style={{ color: 'var(--accent-tertiary)' }}>+{test.xp_reward_pass}</div>
                <div className="pt-stat-lbl">XP on Pass</div>
              </div>
            </div>

            {/* Sections timeline */}
            <div className="pt-sections-title">Sections</div>
            <div className="pt-section-list">
              {test.sections.map((s) => (
                <div key={s.id} className="pt-section-row">
                  <span className="pt-section-icon">{SECTION_ICONS[s.section_type]}</span>
                  <span className="pt-section-name">{s.name}</span>
                  <span className="pt-section-meta">{s.question_count} questions · {s.time_minutes} min</span>
                  {s.has_audio && <span className="pt-section-audio">🔊 Audio</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Best score banner */}
          {lastAttempt && (
            <div className="pt-best-score">
              <div className={`pt-best-score-ring ${lastAttempt.passed ? 'pass' : 'fail'}`}>
                <div className="pt-best-score-val">{lastAttempt.score_percent}%</div>
                <div className="pt-best-score-lbl">Best</div>
              </div>
              <div className="pt-best-info">
                <div className="pt-best-title">
                  {lastAttempt.passed ? '✓ Passed on last attempt' : '✗ Failed last attempt — let\'s try again'}
                </div>
                <div className="pt-best-sub">
                  {formatDate(lastAttempt.submitted_at)} · {Math.floor(lastAttempt.time_taken_seconds / 60)}m {lastAttempt.time_taken_seconds % 60}s
                </div>
              </div>
            </div>
          )}

          {/* Audio check — only shown if test has listening section */}
          {hasAudio && (
            <div className="pt-audio-check">
              <div className="pt-audio-icon">🎧</div>
              <div className="pt-audio-info">
                <div className="pt-audio-title">Audio equipment check</div>
                <div className="pt-audio-sub">
                  {audioChecked
                    ? '✓ Audio confirmed — ready to go'
                    : 'This test has listening questions. Test your headphones before starting.'}
                </div>
              </div>
              <button
                className="pt-audio-btn"
                onClick={() => setAudioChecked(true)}
                style={{ background: audioChecked ? 'var(--accent-primary)' : 'var(--accent-sky)' }}
              >
                {audioChecked ? '✓ Good' : '▶ Test audio'}
              </button>
            </div>
          )}

          {/* Instructions accordion */}
          <div className="pt-instructions">
            <div
              className="pt-instructions-header"
              onClick={() => setInstructionsOpen(p => !p)}
            >
              <div className="pt-instructions-title">
                📋 Test instructions
              </div>
              <div className={`pt-instructions-chevron${instructionsOpen ? ' open' : ''}`}>▾</div>
            </div>

            {instructionsOpen && (
              <div className="pt-instructions-body">
                {MOCK_PRETEST_INSTRUCTIONS.map((item, i) => (
                  <div key={i} className="pt-instruction-item">
                    <div className="pt-instruction-icon">
                      {['⏱', '🗺', '⚑', '📤', '🌟'][i] ?? '•'}
                    </div>
                    <div className="pt-instruction-text">
                      <strong>{item.heading}:</strong> {item.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practice mode toggle */}
          <div className="pt-mode-toggle">
            <div className="pt-mode-info">
              <div className="pt-mode-title">Practice mode</div>
              <div className="pt-mode-sub">
                Shows correct answers after each question. Results won't count toward your official score.
              </div>
            </div>
            <button
              className={`pt-toggle${practiceMode ? ' on' : ''}`}
              onClick={() => setPracticeMode(p => !p)}
              aria-label="Toggle practice mode"
            />
          </div>

          {/* CTA */}
          <div className="pt-cta-row">
            <button className="pt-start-btn" onClick={handleStart}>
              {practiceMode ? '▶ Start Practice Mode' : '▶ Start Test'}
            </button>
            <div className="pt-xp-info">
              Pass: <strong>+{test.xp_reward_pass} XP</strong><br />
              Fail: +{test.xp_reward_fail} XP
            </div>
          </div>

        </div>
      </div>
    {/* </AppShell> */}
    </>
  );
}
