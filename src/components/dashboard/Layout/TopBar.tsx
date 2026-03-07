'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/Layout/TopBar.tsx
// 64px fixed top bar: greeting, search, notifications, avatar
// ─────────────────────────────────────────────────────────────────

import React from 'react';

interface TopBarProps {
  userName:    string;
  userInitial: string;
  subText?:    string;
  notifCount?: number;
}

export default function TopBar({
  userName,
  userInitial,
  subText,
  notifCount = 0,
}: TopBarProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  return (
    <header className="topbar">
      {/* Left — Greeting */}
      <div className="topbar-greeting">
        <div className="greeting-text">
          {greeting}, {userName} 👋
        </div>
        {subText && (
          <div className="greeting-sub">{subText}</div>
        )}
      </div>

      {/* Right — Actions */}
      <div className="topbar-actions">
        {/* Search */}
        <button className="icon-btn" title="Search (⌘K)">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        {/* Notifications */}
        <button className="icon-btn" title="Notifications">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {notifCount > 0 && <span className="notif-dot" />}
        </button>

        {/* Avatar */}
        <div className="topbar-avatar" title={`${userName}'s account`}>
          {userInitial}
        </div>
      </div>
    </header>
  );
}
