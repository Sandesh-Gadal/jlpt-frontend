'use client';

// InstitutionLayout.tsx
// Layout wrapper for institutional users - different navigation for admins/managers
// Accepts custom navItems to allow different menu content

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types/dashboard';

// SVG Icon Components
const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125v6.75C7.5 20.496 6.254 21.75 4.5 21.75h-2.25A1.125 1.125 0 011 20.625v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

interface InstitutionLayoutProps {
  children: React.ReactNode;
  topBarSubText?: string;
  navItems?: NavItem[]; // Custom navigation items
}

// Default institution navigation items
const DEFAULT_INSTITUTION_NAV_ITEMS: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/institution/dashboard' },
  { icon: 'institution', label: 'Organization', href: '/institution' },
  { icon: 'users', label: 'Students', href: '/institution/students' },
  { icon: 'courses', label: 'Courses', href: '/institution/courses' },
  { icon: 'analytics', label: 'Analytics', href: '/institution/analytics' },
  { icon: 'reports', label: 'Reports', href: '/institution/reports' },
  { icon: 'settings', label: 'Settings', href: '/institution/settings' },
];

// Icon mapping
const NavIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <ChartIcon className={className} />,
    institution: <BuildingIcon className={className} />,
    users: <UsersIcon className={className} />,
    courses: <BookIcon className={className} />,
    analytics: <ChartIcon className={className} />,
    reports: <ClipboardIcon className={className} />,
    settings: <CogIcon className={className} />,
    profile: <UserIcon className={className} />,
  };
  return <>{iconMap[icon] || icon}</>;
};

export default function InstitutionLayout({
  children,
  topBarSubText,
  navItems = DEFAULT_INSTITUTION_NAV_ITEMS,
}: InstitutionLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar" role="navigation" aria-label="Institution navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">JL</div>
          <div>
            <div className="logo-text">JLPT</div>
            <div className="logo-sub">Institution</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Management</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
            <div className="user-avatar-sm">A</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-level-badge">✦ Institution</div>
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
            <div className="greeting-text">Institution Admin</div>
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
            </button>

            {/* Profile avatar */}
            <Link href="/profile" className="topbar-avatar" title="Your profile">
              A
            </Link>
          </div>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}

