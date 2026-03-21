"use client";
// src/components/dashboard/Layout/AppShell.tsx
// Minimalistic app shell with sidebar and topbar

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types/dashboard';

// SVG Icon Components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const PencilSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const ClipboardDocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const RectangleStackIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
<path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 019.75 19.875V8.625zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172V9.504c0-2.643-1.963-4.257-4.347-4.257a7.454 7.454 0 00-4.218 1.46m0 0a7.454 7.454 0 01.636-2.275c.616-.616 1.474-1.075 2.582-1.075 1.743 0 3.072.932 3.72 2.136m0 0V6.75" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

// Icon mapping component
const NavIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'home': <HomeIcon className={className} />,
    'courses': <BookOpenIcon className={className} />,
    'practice': <PencilSquareIcon className={className} />,
    'tests': <ClipboardDocumentIcon className={className} />,
    'cards': <RectangleStackIcon className={className} />,
    'progress': <ChartBarIcon className={className} />,
    'ranking': <TrophyIcon className={className} />,
    'profile': <UserIcon className={className} />,
  };
  return <>{iconMap[icon] || icon}</>;
};

// Default navigation items for individual users
const DEFAULT_NAV_ITEMS: NavItem[] = [
  { icon: 'home',     label: 'Home',      href: '/dashboard',  badge: null },
  { icon: 'courses',  label: 'Courses',   href: '/courses',    badge: '3'  },
  { icon: 'practice', label: 'Practice',  href: '/practice',  badge: null },
  { icon: 'tests',    label: 'Tests',     href: '/tests',      badge: null },
  { icon: 'cards',    label: 'Cards',     href: '/flashcards', badge: null },
  { icon: 'progress', label: 'Progress',  href: '/progress',   badge: null },
  { icon: 'ranking',  label: 'Ranking',   href: '/leaderboard',badge: null },
  { icon: 'profile',  label: 'Profile',   href: '/profile',    badge: null },
];

// Bottom navigation items for mobile
const BOTTOM_NAV_ITEMS: NavItem[] = [
  { icon: 'home',     label: 'Home',      href: '/dashboard',  badge: null },
  { icon: 'courses',  label: 'Courses',   href: '/courses',    badge: '3'  },
  { icon: 'practice', label: 'Practice',  href: '/practice',  badge: null },
  { icon: 'progress', label: 'Progress',  href: '/progress',   badge: null },
  { icon: 'profile',  label: 'Profile',   href: '/profile',    badge: null },
];

interface AppShellProps {
  children:       React.ReactNode;
  userName:       string;
  userInitial:    string;
  userLevel:      string;
  topBarSubText?: string;
  notifCount?:    number;
  navItems?:      NavItem[]; // Custom navigation items
}

export default function AppShell({
  children,
  userName,
  userInitial,
  userLevel,
  topBarSubText,
  notifCount = 0,
  navItems = DEFAULT_NAV_ITEMS,
}: AppShellProps) {
  const pathname = usePathname();
  
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  // Use passed navItems or default
  const displayNavItems = navItems || DEFAULT_NAV_ITEMS;
  const mainNav    = displayNavItems.slice(0, 4);
  const accountNav = displayNavItems.slice(4);

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar" role="navigation" aria-label="Main navigation">

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">JL</div>
          <div>
            <div className="logo-text">JLPT</div>
            <div className="logo-sub">Learning</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
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
                <span className="nav-icon"><NavIcon icon={item.icon} /></span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: 8 }}>Account</div>
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
                <span className="nav-icon"><NavIcon icon={item.icon} /></span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <Link href="/profile" className="user-card">
            <div className="user-avatar-sm">{userInitial}</div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-level-badge">✦ {userLevel}</div>
            </div>
            <span className="sidebar-profile-arrow">›</span>
          </Link>
        </div>

      </aside>

      {/* MAIN AREA */}
      <div className="main-area">

        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-greeting">
            <div className="greeting-text">{greeting}, {userName}</div>
            {topBarSubText && (
              <div className="greeting-sub">{topBarSubText}</div>
            )}
          </div>

          <div className="topbar-actions">
            {/* Search */}
            <button className="icon-btn" title="Search">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Notifications */}
            <button className="icon-btn" title="Notifications">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifCount > 0 && <span className="notif-dot" />}
            </button>

            {/* Profile avatar */}
            <Link href="/profile" className="topbar-avatar" title="Your profile">
              {userInitial}
            </Link>
          </div>
        </header>

        {/* Page content */}
        {children}

      </div>

      {/* BOTTOM NAV - mobile only */}
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
                <NavIcon icon={item.icon} />
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

