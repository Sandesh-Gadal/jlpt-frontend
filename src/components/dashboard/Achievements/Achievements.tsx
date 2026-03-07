'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/Achievements/Achievements.tsx
// Horizontal scroll of badge circles — earned vs locked
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import type { Achievement } from '@/types/dashboard';

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="achievements-card">
      {/* Header */}
      <div className="panel-header" style={{ marginBottom: 4 }}>
        <span className="panel-title">Achievements</span>
        <span className="achievements-count">
          {earnedCount} / {achievements.length} earned
        </span>
      </div>

      {/* Badges scroll */}
      <div className="achievements-scroll">
        {achievements.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

/* ── Single badge ── */
function BadgeItem({ badge }: { badge: Achievement }) {
  return (
    <div
      className={`badge-item${badge.earned ? ' is-earned' : ''}`}
      title={badge.earned ? badge.name : `Locked: ${badge.name}`}
    >
      <div className={`badge-circle ${badge.earned ? 'earned' : 'locked'}`}>
        <span>{badge.icon}</span>
        {!badge.earned && (
          <div className="badge-lock-overlay">🔒</div>
        )}
      </div>
      <span className="badge-label">{badge.name}</span>
    </div>
  );
}
