'use client';

// src/app/tests/results/[attemptId]/page.tsx — S15 Results + S16 Answer Review
// S15: Animated score ring, pass/fail, section breakdown chart, XP earned
// S16: Per-question review with filter (All/Correct/Wrong/Flagged), explanations, bookmark

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppShell from '@/components/dashboard/Layout/AppShell';
import { MOCK_RESULT, MOCK_REVIEW_ANSWERS } from '@/data/testData';
import type { ReviewFilter } from '@/types/test';

const OPT_LABELS = ['A', 'B', 'C', 'D'];

const DIFF_COLORS: Record<string, string> = {
  easy:   'var(--accent-primary)',
  medium: 'var(--accent-tertiary)',
  hard:   'var(--danger)',
};

const SECTION_FILL_COLORS = [
  'var(--accent-primary)',
  'var(--accent-sky)',
  'var(--accent-tertiary)',
  'var(--danger)',
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function TestResultsPage() {
  const result  = MOCK_RESULT;
  const answers = MOCK_REVIEW_ANSWERS;

  const [reviewFilter,  setReviewFilter]  = useState<ReviewFilter>('all');
  const [showReview,    setShowReview]    = useState(false);
  const [bookmarked,    setBookmarked]    = useState<Set<string>>(new Set());
  const [barsAnimated,  setBarsAnimated]  = useState(false);

  const barsRef = useRef<HTMLDivElement>(null);

  // Animate bars when they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarsAnimated(true); },
      { threshold: 0.3 }
    );
    if (barsRef.current) observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredAnswers = useMemo(() => {
    return answers.filter(a => {
      if (reviewFilter === 'correct')  return a.is_correct;
      if (reviewFilter === 'wrong')    return !a.is_correct;
      if (reviewFilter === 'flagged')  return a.is_flagged;
      return true;
    });
  }, [answers, reviewFilter]);

  const toggleBookmark = (qId: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  };

  const { score_percent, passed, correct, total, xp_awarded, time_taken_seconds } = result;
  const wrong = total - correct;

  return (
   
      <div className="dashboard-content" style={{ padding: 0, overflowY: 'auto' }}>
        <div className="tr-shell">

          {/* ══ S15 HERO ══════════════════════════════════════════ */}
          <div className="tr-hero">
            {/* Score ring */}
            <div className={`tr-score-ring ${passed ? 'pass' : 'fail'}`}>
              <div className="tr-ring-pct">{score_percent}%</div>
              <div className="tr-ring-label">Score</div>
            </div>

            {/* Info */}
            <div className="tr-hero-info">
              <div className="tr-hero-title">
                {passed ? '🎉 Passed!' : '📚 Keep studying!'}
              </div>
              <div className="tr-hero-sub">{result.test_set.title}</div>

              <div className="tr-result-chips">
                <span className={`tr-chip ${passed ? 'pass-c' : 'fail-c'}`}>
                  {passed ? '✓ Passed' : '✗ Failed'} · {result.test_set.passing_score_percent}% needed
                </span>
                <span className="tr-chip xp-c">🌟 +{xp_awarded} XP earned</span>
                <span className="tr-chip">
                  {result.test_set.level.code} · {result.test_set.category}
                </span>
              </div>
            </div>
          </div>

          {/* XP banner */}
          <div className="tr-xp-banner">
            <div className="tr-xp-icon">🌟</div>
            <div className="tr-xp-text">+{xp_awarded} XP has been added to your account</div>
            <div className="tr-xp-sub">
              {passed ? `Well done! You passed with ${score_percent}%.` : `Keep practicing — you need ${result.test_set.passing_score_percent}% to pass.`}
            </div>
          </div>

          {/* Stats strip */}
          <div className="tr-stats-strip">
            {[
              { val: `${correct}/${total}`, lbl: 'Correct',  color: 'var(--accent-primary)' },
              { val: `${wrong}`,            lbl: 'Wrong',    color: 'var(--danger)' },
              { val: `${score_percent}%`,   lbl: 'Score',    color: 'inherit' },
              { val: formatTime(time_taken_seconds), lbl: 'Time', color: 'inherit' },
            ].map((s) => (
              <div key={s.lbl} className="tr-stat-cell">
                <div className="tr-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="tr-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="tr-body">

            {/* Action row */}
            <div className="tr-action-row">
              <button
                className="tr-action-btn prim"
                onClick={() => setShowReview(p => !p)}
              >
                {showReview ? '▲ Hide Review' : '▼ Review Answers'}
              </button>
              <Link href="/tests" className="tr-action-btn sec" style={{ textDecoration: 'none' }}>
                ← All Tests
              </Link>
              <Link href={`/tests/${result.test_set.id}/pre`} className="tr-action-btn sec" style={{ textDecoration: 'none' }}>
                ↺ Retake
              </Link>
              <button className="tr-action-btn sec">
                ↗ Share result
              </button>
            </div>

            {/* Section breakdown chart */}
            <div className="tr-section-title" ref={barsRef}>
              📊 Section Breakdown
              <span className="tr-section-sub">{result.section_scores.length} sections</span>
            </div>
            <div className="tr-section-chart" style={{ marginBottom: 20 }}>
              {result.section_scores.map((s, i) => (
                <div key={s.section_name} className="tr-chart-row">
                  <div className="tr-chart-label">{s.section_name}</div>
                  <div className="tr-chart-track">
                    <div
                      className="tr-chart-fill"
                      style={{
                        width: barsAnimated ? `${s.percent}%` : '0%',
                        background: SECTION_FILL_COLORS[i % SECTION_FILL_COLORS.length],
                        transitionDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>
                  <div className="tr-chart-pct" style={{ color: SECTION_FILL_COLORS[i % SECTION_FILL_COLORS.length] }}>
                    {s.percent}%
                  </div>
                  <div className="tr-chart-count">{s.correct}/{s.total}</div>
                </div>
              ))}
            </div>

            {/* Difficulty breakdown */}
            <div className="tr-section-title">
              🎯 By Difficulty
            </div>
            <div className="tr-diff-grid" style={{ marginBottom: 24 }}>
              {result.difficulty_scores.map((d) => (
                <div key={d.difficulty} className="tr-diff-cell">
                  <div className="tr-diff-name">{d.difficulty}</div>
                  <div className="tr-diff-val" style={{ color: DIFF_COLORS[d.difficulty] }}>
                    {d.percent}%
                  </div>
                  <div className="tr-diff-count">{d.correct}/{d.total} correct</div>
                </div>
              ))}
            </div>

            {/* ══ S16 ANSWER REVIEW ══════════════════════════════ */}
            {showReview && (
              <div style={{ marginTop: 4 }}>
                <div className="tr-section-title">
                  📋 Answer Review
                  <span className="tr-section-sub">
                    {correct} correct · {wrong} incorrect · {answers.filter(a => a.is_flagged).length} flagged
                  </span>
                </div>

                {/* Filter bar */}
                <div className="ar-filter-bar">
                  {([
                    { key: 'all',     label: `All (${answers.length})`,               cls: '' },
                    { key: 'correct', label: `Correct (${correct})`,                  cls: 'correct-f' },
                    { key: 'wrong',   label: `Wrong (${wrong})`,                      cls: 'wrong-f' },
                    { key: 'flagged', label: `Flagged (${answers.filter(a => a.is_flagged).length})`, cls: 'flagged-f' },
                  ] as const).map((f) => (
                    <button
                      key={f.key}
                      className={`ar-filter-btn ${f.cls}${reviewFilter === f.key ? ' active' : ''}`}
                      onClick={() => setReviewFilter(f.key as ReviewFilter)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Answer list */}
                <div className="ar-list">
                  {filteredAnswers.map((ans, i) => {
                    const q          = ans.question;
                    const isBookmarked = bookmarked.has(q.id);
                    const qIndex     = answers.findIndex(a => a.question.id === q.id);

                    return (
                      <div
                        key={q.id}
                        className={`ar-item ${ans.is_correct ? 'is-correct' : 'is-wrong'}`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        {/* Header */}
                        <div className="ar-item-head">
                          <span className="ar-result-icon">{ans.is_correct ? '✅' : '❌'}</span>
                          <span className="ar-q-num">Q{qIndex + 1}</span>
                          <span className={`ti-q-diff diff-${q.difficulty}`} style={{ fontSize: 9.5 }}>{q.difficulty}</span>
                          {ans.is_flagged && <span className="ar-flag-tag">⚑ Flagged</span>}
                          <span className="ar-time-tag">{ans.time_spent_seconds}s</span>
                          <button
                            className="ar-bookmark-btn"
                            onClick={() => toggleBookmark(q.id)}
                            style={{ color: isBookmarked ? 'var(--accent-tertiary)' : undefined, borderColor: isBookmarked ? 'var(--accent-tertiary)' : undefined }}
                          >
                            {isBookmarked ? '★ Saved' : '☆ Save'}
                          </button>
                        </div>

                        {/* Passage if reading comp */}
                        {q.passage && (
                          <div className="ar-passage">{q.passage}</div>
                        )}

                        {/* Prompt */}
                        <div className="ar-prompt">{q.prompt}</div>

                        {/* Options */}
                        <div className="ar-options">
                          {q.options.map((opt) => {
                            const isCorrect  = opt.id === q.correct_answer;
                            const isSelected = opt.id === ans.selected_option;
                            const cls =
                              isCorrect  ? 'ar-opt correct' :
                              isSelected ? 'ar-opt wrong'   :
                              'ar-opt neutral';
                            return (
                              <div key={opt.id} className={cls}>
                                <div className="ar-opt-key">{opt.id}</div>
                                {opt.text}
                                {isCorrect  && <span className="ar-opt-label">✓ Correct</span>}
                                {isSelected && !isCorrect && <span className="ar-opt-label">✗ Yours</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="ar-explanation">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    );
                  })}

                  {filteredAnswers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: 13 }}>
                      No questions match this filter.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
  );
}
