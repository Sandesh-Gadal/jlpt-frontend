'use client';

// src/components/dashboard/Layout/AppShell.tsx

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types/dashboard';

const NAV_ITEMS: NavItem[] = [
  { icon: '⊞',  label: 'Home',        href: '/dashboard',   badge: null },
  { icon: '📚', label: 'My Courses',  href: '/courses',     badge: '3'  },
  { icon: '✏️', label: 'Practice',    href: '/practice',    badge: null },
  { icon: '📝', label: 'Mock Tests',  href: '/tests',       badge: null },
  { icon: '🃏', label: 'Vocabulary',  href: '/flashcards',  badge: null },
  { icon: '📈', label: 'Progress',    href: '/progress',    badge: null },
  { icon: '🏆', label: 'Leaderboard', href: '/leaderboard', badge: null },
  // ── Settings removed — lives inside Profile now ──
  { icon: '👤', label: 'Profile',     href: '/profile',     badge: null },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { icon: '⊞',  label: 'Home',      href: '/dashboard', badge: null },
  { icon: '📚', label: 'Courses',   href: '/courses',   badge: '3'  },
  { icon: '✏️', label: 'Practice',  href: '/practice',  badge: null },
  { icon: '📈', label: 'Progress',  href: '/progress',  badge: null },
  // ── Profile replaces Settings in bottom nav ──
  { icon: '👤', label: 'Profile',   href: '/profile',   badge: null },
];

interface AppShellProps {
  children:       React.ReactNode;
  userName:       string;
  userInitial:    string;
  userLevel:      string;
  topBarSubText?: string;
  notifCount?:    number;
}

export default function AppShell({
  children,
  userName,
  userInitial,
  userLevel,
  topBarSubText,
  notifCount = 0,
}: AppShellProps) {
  const pathname = usePathname();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  const mainNav    = NAV_ITEMS.slice(0, 5);
  const accountNav = NAV_ITEMS.slice(5);   // Progress, Leaderboard, Profile

  return (
    <div className="app-shell">

      {/* ══════════════════════════════════════
          SIDEBAR — desktop + tablet
          ══════════════════════════════════════ */}
      <aside className="sidebar" role="navigation" aria-label="Main navigation">

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🍵</div>
          <div>
            <div className="logo-text">JLPT Master</div>
            <div className="logo-sub">Matcha Garden</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {mainNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-item${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: 6 }}>Account</div>
          {accountNav.map((item) => {
            const isActive = pathname === item.href ||
              pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-item${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── User footer → clicks to Profile ── */}
        <div className="sidebar-footer">
          <Link href="/profile" className="user-card" style={{ textDecoration: 'none' }}>
            <div className="user-avatar-sm">{userInitial}</div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-level-badge">✦ {userLevel} Level</div>
            </div>
            {/* Arrow instead of gear icon */}
            <span className="sidebar-profile-arrow">›</span>
          </Link>
        </div>

      </aside>

      {/* ══════════════════════════════════════
          MAIN AREA
          ══════════════════════════════════════ */}
      <div className="main-area">

        {/* ── Top Bar — hidden on mobile via CSS ── */}
        <header className="topbar">
          <div className="topbar-greeting">
            <div className="greeting-text">{greeting}, {userName} 👋</div>
            {topBarSubText && (
              <div className="greeting-sub">{topBarSubText}</div>
            )}
          </div>

          <div className="topbar-actions">
            {/* Search */}
            <button className="icon-btn" title="Search">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Notifications */}
            <button className="icon-btn" title="Notifications">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifCount > 0 && <span className="notif-dot" />}
            </button>

            {/* Profile avatar — goes to /profile */}
            <Link href="/profile" className="topbar-avatar" title="Your profile">
              {userInitial}
            </Link>
          </div>
        </header>

        {/* Page content */}
        {children}

      </div>

      {/* ══════════════════════════════════════
          BOTTOM NAV — mobile only
          ══════════════════════════════════════ */}
      <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`bottom-nav-item${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="bottom-nav-icon">
                {item.icon}
                {item.badge && (
                  <span className="bottom-nav-badge">{item.badge}</span>
                )}
              </span>
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}