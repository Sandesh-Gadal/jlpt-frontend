'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/StatStrip/StatStrip.tsx
// Minimalistic 4-card stats row
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import GoalRing  from './GoalRing';
import Sparkline from './Sparkline';
import { useCountUp } from '@/hooks/useCountUp';
import type { UserStats } from '@/types/dashboard';

// SVG Icon Components for Stats
const FireIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const StarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const CheckCircleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartBarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125v6.75C7.5 20.125 1.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

interface StatStripProps {
  stats: UserStats;
}

export default function StatStrip({ stats }: StatStripProps) {
  // Animated counters with staggered delays
  const streak = useCountUp(stats.streak,          700, 100);
  const xp     = useCountUp(stats.totalXp,         900, 200);
  const score  = useCountUp(stats.avgScore,        800, 300);

  return (
    <div className="stats-grid">

      {/* ── Card 1: Streak ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '0ms' }}
      >
        <div className="stat-header">
          <div
            className="stat-icon"
            style={{ background: 'rgba(255,159,10,0.1)' }}
          >
            <FireIcon className="stat-svg-icon" style={{ color: '#FF9F0A' }} />
          </div>
        </div>
        <div className="stat-value" style={{ color: '#FF9F0A' }}>
          {streak}
          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>
            days
          </span>
        </div>
        <div className="stat-sub">
          Best: {stats.longestStreak} days
        </div>
      </div>

      {/* ── Card 2: Total XP ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '80ms' }}
      >
        <div className="stat-header">
          <div
            className="stat-icon"
            style={{ background: 'rgba(45,45,45,0.08)' }}
          >
            <StarIcon className="stat-svg-icon" style={{ color: '#2D2D2D' }} />
          </div>
        </div>
        <div className="stat-value">
          {xp.toLocaleString()}
        </div>
        <div className="stat-sub">
          {stats.xpToNextRank} XP to next rank
        </div>
      </div>

      {/* ── Card 3: Daily Goal ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '160ms' }}
      >
        <div className="stat-header">
          <div
            className="stat-icon"
            style={{ background: 'rgba(52,199,89,0.1)' }}
          >
            <CheckCircleIcon className="stat-svg-icon" style={{ color: '#34C759' }} />
          </div>
          <span className="stat-label">Daily Goal</span>
        </div>
        <div className="ring-container">
          <GoalRing
            done={stats.dailyGoalDone}
            total={stats.dailyGoalTotal}
          />
          <div>
            <div className="ring-info-label">
              <strong>{stats.dailyGoalDone}</strong> of {stats.dailyGoalTotal}
            </div>
            <div className="ring-info-sub">
              {stats.dailyGoalTotal - stats.dailyGoalDone} left
            </div>
          </div>
        </div>
      </div>

      {/* ── Card 4: Avg Score ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '240ms' }}
      >
        <div className="stat-header">
          <div
            className="stat-icon"
            style={{ background: 'rgba(0,122,255,0.1)' }}
          >
            <ChartBarIcon className="stat-svg-icon" style={{ color: '#007AFF' }} />
          </div>
        </div>
        <div className="stat-value" style={{ color: '#007AFF' }}>
          {score}%
        </div>
        <Sparkline data={stats.sparklineData} />
      </div>

    </div>
  );
}

