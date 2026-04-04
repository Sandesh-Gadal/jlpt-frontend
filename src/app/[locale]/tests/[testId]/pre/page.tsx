'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { testsApi, type ApiTestSet } from '@/lib/api/tests';

const SECTION_ICONS: Record<string, string> = {
  vocabulary: '📖',
  grammar: '✏️',
  reading: '📄',
  listening: '🔊',
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const DEFAULT_INSTRUCTIONS = [
  { heading: 'Time limit', body: 'Complete the test within the given time. The timer continues even after refresh.' },
  { heading: 'Sections', body: 'Questions are grouped by section and scored dynamically from your saved answers.' },
  { heading: 'Flagging', body: 'You can flag questions and revisit them before final submission.' },
  { heading: 'Submission', body: 'Unanswered questions will be marked wrong when you submit.' },
  { heading: 'Scoring', body: 'Your final score, pass/fail status, section breakdown, and XP are calculated automatically.' },
];

export default function PreTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const router = useRouter();
  const { testId } = React.use(params);

  const [test, setTest] = useState<ApiTestSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [audioChecked, setAudioChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const tests = await testsApi.list();
        const found = tests.find((t) => t.id === testId) || null;
        if (mounted) setTest(found);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [testId]);

  const hasAudio = useMemo(() => {
    return !!test?.sections.some((s) => s.has_audio);
  }, [test]);

  const handleStart = async () => {
    if (!test) return;
    if (hasAudio && !audioChecked) return;

    try {
      setStarting(true);
      const res = await testsApi.start(test.id);
      router.push(`/tests/${test.id}?attemptId=${res.attempt.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="dashboard-content" style={{ padding: 24 }}>Loading test..</div>;
  }

  if (!test) {
    return <div className="dashboard-content" style={{ padding: 24 }}>Test not found.</div>;
  }

  return (
    <div className="dashboard-content" style={{ overflowY: 'auto' }}>
      <Link href="/tests" className="pt-back-btn">
        ← Back to Tests
      </Link>

      <div className="pt-hero">
        <div className="pt-hero-top">
          <div className="pt-hero-badges">
            <span className={`tc-badge badge-${test.level.code.toLowerCase()}`}>{test.level.code}</span>
            <span className={`tc-badge ${test.test_type === 'mock_exam' ? 'badge-mock' : 'badge-prac'}`}>
              {test.test_type === 'mock_exam' ? 'Mock Exam' : 'Practice'}
            </span>
            <span
              className="tc-badge"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {test.category}
            </span>
          </div>
        </div>

        <div className="pt-hero-title">{test.title}</div>
        <div className="pt-hero-desc">{test.description}</div>

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

        <div className="pt-sections-title">Sections</div>
        <div className="pt-section-list">
          {test.sections.map((s) => (
            <div key={s.id} className="pt-section-row">
              <span className="pt-section-icon">{SECTION_ICONS[s.section_type]}</span>
              <span className="pt-section-name">{s.name}</span>
              <span className="pt-section-meta">
                {s.question_count} questions · {s.time_minutes} min
              </span>
              {s.has_audio && <span className="pt-section-audio">🔊 Audio</span>}
            </div>
          ))}
        </div>
      </div>

      {test.last_attempt && (
        <div className="pt-best-score">
          <div className={`pt-best-score-ring ${test.last_attempt.passed ? 'pass' : 'fail'}`}>
            <div className="pt-best-score-val">{test.last_attempt.score_percent}%</div>
            <div className="pt-best-score-lbl">Best</div>
          </div>
          <div className="pt-best-info">
            <div className="pt-best-title">
              {test.last_attempt.passed ? '✓ Passed on last attempt' : '✗ Failed last attempt — let\'s try again'}
            </div>
            <div className="pt-best-sub">
              {formatDate(test.last_attempt.submitted_at)} · {Math.floor(test.last_attempt.time_taken_seconds / 60)}m {test.last_attempt.time_taken_seconds % 60}s
            </div>
          </div>
        </div>
      )}

      {hasAudio && (
        <div className="pt-audio-check">
          <div className="pt-audio-icon">🎧</div>
          <div className="pt-audio-info">
            <div className="pt-audio-title">Audio equipment check</div>
            <div className="pt-audio-sub">
              {audioChecked
                ? '✓ Audio confirmed — ready to go'
                : 'This test has listening questions. Confirm your headphones before starting.'}
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

      <div className="pt-instructions">
        <div className="pt-instructions-header" onClick={() => setInstructionsOpen((p) => !p)}>
          <div className="pt-instructions-title">📋 Test instructions</div>
          <div className={`pt-instructions-chevron${instructionsOpen ? ' open' : ''}`}>▾</div>
        </div>

        {instructionsOpen && (
          <div className="pt-instructions-body">
            {DEFAULT_INSTRUCTIONS.map((item, i) => (
              <div key={i} className="pt-instruction-item">
                <div className="pt-instruction-icon">{['⏱', '🗺', '⚑', '📤', '🌟'][i] ?? '•'}</div>
                <div className="pt-instruction-text">
                  <strong>{item.heading}:</strong> {item.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-cta-row">
        <button className="pt-start-btn" onClick={handleStart} disabled={starting || (hasAudio && !audioChecked)}>
          {starting ? 'Starting...' : '▶ Start Test'}
        </button>
        <div className="pt-xp-info">
          Pass: <strong>+{test.xp_reward_pass} XP</strong>
          <br />
          Fail: +{test.xp_reward_fail} XP
        </div>
      </div>
    </div>
  );
}