'use client';

// src/app/tests/results/[attemptId]/page.tsx — S15 Results + S16 Answer Review

import React, { useState } from 'react';
import Link      from 'next/link';
import AppShell  from '@/components/dashboard/Layout/AppShell';
import { MOCK_TEST_SET, MOCK_ATTEMPT_ANSWERS } from '@/data/testData';

export default function TestResultsPage() {
  const [showReview, setShowReview] = useState(false);

  const testSet = MOCK_TEST_SET;
  const answers = MOCK_ATTEMPT_ANSWERS;
  const total   = answers.length;
  const correct = answers.filter((a) => a.is_correct).length;
  const wrong   = total - correct;
  const score   = Math.round((correct / total) * 100);
  const passed  = score >= testSet.passing_score_percent;
  const xp      = passed ? testSet.xp_reward_pass : testSet.xp_reward_fail;

  const timeSpent = answers.reduce((sum, a) => sum + (a.time_spent_seconds ?? 0), 0);
  const timeStr   = `${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s`;

  return (
    <AppShell
      userName="Keiko Tanaka"
      userInitial="K"
      userLevel="N3"
      topBarSubText={testSet.title}
      notifCount={3}
    >
      <div className="tr-shell">

        {/* ══ S15 RESULTS HERO ══ */}
        <div className="tr-hero" style={{ animation: 'fadeUp 0.35s ease' }}>
          {/* Score ring */}
          <div className={`tr-score-ring ${passed ? 'pass' : 'fail'}`}>
            <div className="tr-score-value">{score}%</div>
            <div className="tr-score-label">Score</div>
          </div>

          {/* Info */}
          <div className="tr-hero-info">
            <div className="tr-hero-title">
              {passed ? '🎉 Passed!' : '📚 Not yet — keep studying'}
            </div>
            <div className="tr-hero-sub">{testSet.title}</div>
            <div className="tr-result-badges">
              <span className={`tr-badge ${passed ? 'pass' : 'fail'}`}>
                {passed ? '✓ Passed' : '✗ Failed'} · {testSet.passing_score_percent}% required
              </span>
              <span className="tr-badge xp">🌟 +{xp} XP earned</span>
              <span className="tr-badge time">⏱ {timeStr}</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="tr-stats-strip">
          {[
            { val: `${correct}/${total}`, lbl: 'Correct' },
            { val: `${wrong}`,            lbl: 'Wrong'   },
            { val: `${score}%`,           lbl: 'Score'   },
            { val: timeStr,               lbl: 'Time'    },
          ].map((s) => (
            <div key={s.lbl} className="tr-stat-cell">
              <div className="tr-stat-val">{s.val}</div>
              <div className="tr-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="tr-body">

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowReview((p) => !p)}
              style={{
                padding: '9px 22px',
                background: showReview ? 'var(--accent-primary)' : 'var(--highlight)',
                border: '1.5px solid var(--accent-primary)',
                borderRadius: 'var(--radius-md)',
                color: showReview ? '#fff' : 'var(--accent-primary)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {showReview ? '▲ Hide Review' : '▼ Review Answers'}
            </button>
            <Link
              href="/tests"
              style={{ padding: '9px 22px', background: 'var(--bg-elevated)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              ← All Tests
            </Link>
            <Link
              href="/dashboard"
              style={{ padding: '9px 22px', background: 'var(--bg-elevated)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              🏠 Dashboard
            </Link>
          </div>

          {/* ══ S16 ANSWER REVIEW ══ */}
          {showReview && (
            <>
              <div className="tr-section-title">
                📋 Answer Review
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
                  {correct} correct · {wrong} incorrect
                </span>
              </div>

              <div className="ar-list">
                {answers.map((ans, i) => {
                  const q = ans.question;
                  return (
                    <div key={ans.id} className="ar-item" style={{ animationDelay: `${i * 45}ms` }}>

                      {/* Header */}
                      <div className="ar-item-header">
                        <span className="ar-correct-icon">{ans.is_correct ? '✅' : '❌'}</span>
                        <span className="ar-q-num">Q{i + 1}</span>
                        <span className={`ar-q-diff diff-${q.difficulty}`}>{q.difficulty}</span>
                        {ans.is_flagged && <span className="ar-flag">⚑ Flagged</span>}
                        {ans.time_spent_seconds && (
                          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                            {ans.time_spent_seconds}s
                          </span>
                        )}
                      </div>

                      {/* Prompt */}
                      <div className="ar-prompt">{q.prompt}</div>

                      {/* Options */}
                      <div className="ar-options">
                        {q.options.map((opt) => {
                          const isCorrect  = opt.id === q.correct_answer;
                          const isSelected = opt.id === ans.selected_answer;
                          const cls =
                            isCorrect  ? 'ar-option correct' :
                            isSelected ? 'ar-option wrong'   : 'ar-option neutral';

                          return (
                            <div key={opt.id} className={cls}>
                              <span className="ar-option-key">{opt.id}</span>
                              {opt.text}
                              {isCorrect && (
                                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700 }}>✓ Correct</span>
                              )}
                              {isSelected && !isCorrect && (
                                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700 }}>✗ Your answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="ar-explanation">
                          <strong>Explanation: </strong>{q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
