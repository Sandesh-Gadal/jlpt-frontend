'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/StatStrip/StatStrip.tsx
// 4-card stats row: streak, XP, daily goal, avg score
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import GoalRing  from './GoalRing';
import Sparkline from './Sparkline';
import { useCountUp } from '@/hooks/useCountUp';
import type { UserStats } from '@/types/dashboard';

interface StatStripProps {
  stats: UserStats;
}

export default function StatStrip({ stats }: StatStripProps) {
  // Animated counters — each starts after a staggered delay
  const streak = useCountUp(stats.streak,          700, 100);
  const xp     = useCountUp(stats.totalXp,         900, 200);
  const score  = useCountUp(stats.avgScore,         800, 300);

  return (
    <div className="stats-strip">

      {/* ── Card 1: Streak ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '0ms' }}
      >
        <div
          className="stat-card-accent-bar"
          style={{ background: 'var(--accent-tertiary)' }}
        />
        <div className="stat-icon-row">
          <div
            className="stat-icon"
            style={{ background: 'rgba(232,160,57,0.12)' }}
          >
            <span className="flame-icon">🔥</span>
          </div>
          <div className="stat-label">Streak</div>
        </div>
        <div
          className="stat-value"
          style={{ color: 'var(--accent-tertiary)' }}
        >
          {streak}{' '}
          <span style={{ fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 400 }}>
            days
          </span>
        </div>
        <div className="stat-sub">
          🏅 Best: {stats.longestStreak} days
        </div>
      </div>

      {/* ── Card 2: Total XP ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '80ms' }}
      >
        <div
          className="stat-card-accent-bar"
          style={{ background: '#C9A227' }}
        />
        <div className="stat-icon-row">
          <div
            className="stat-icon"
            style={{ background: 'rgba(201,162,39,0.12)' }}
          >
            <span className="star-icon">⭐</span>
          </div>
          <div className="stat-label">Total XP</div>
        </div>
        <div
          className="stat-value"
          style={{ color: '#C9A227' }}
        >
          {xp.toLocaleString()}
        </div>
        <div className="stat-sub">
          ✦ {stats.xpToNextRank} XP to next rank
        </div>
      </div>

      {/* ── Card 3: Daily Goal ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '160ms' }}
      >
        <div
          className="stat-card-accent-bar"
          style={{ background: 'var(--accent-primary)' }}
        />
        <div className="stat-label" style={{ marginBottom: 10 }}>
          Daily Goal
        </div>
        <div className="ring-container">
          <GoalRing
            done={stats.dailyGoalDone}
            total={stats.dailyGoalTotal}
          />
          <div>
            <div className="ring-info-label">
              <strong>{stats.dailyGoalDone}</strong>{' '}
              of {stats.dailyGoalTotal} done
            </div>
            <div className="ring-info-sub">
              {stats.dailyGoalTotal - stats.dailyGoalDone} lessons left
            </div>
            <div className="ring-xp-hint">
              +{stats.dailyXpReward} XP waiting
            </div>
          </div>
        </div>
      </div>

      {/* ── Card 4: Avg Score ── */}
      <div
        className="stat-card"
        style={{ animationDelay: '240ms' }}
      >
        <div
          className="stat-card-accent-bar"
          style={{ background: 'var(--accent-sky)' }}
        />
        <div className="stat-icon-row">
          <div
            className="stat-icon"
            style={{ background: 'rgba(91,158,175,0.12)' }}
          >
            📊
          </div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div
          className="stat-value"
          style={{ color: 'var(--accent-sky)' }}
        >
          {score}%
        </div>
        <Sparkline data={stats.sparklineData} />
      </div>

    </div>
  );
}
