'use client';

import React from 'react';
import AppShell from '@/components/dashboard/Layout/AppShell';
import { useUserData } from '@/hooks/useUserData';
import type { NavItem } from '@/types/dashboard';

interface IndividualLayoutProps {
  children: React.ReactNode;
  topBarSubText?: string;
  notifCount?: number;
  navItems?: NavItem[];
}

const DEFAULT_INDIVIDUAL_NAV_ITEMS: NavItem[] = [
  { icon: 'home',     label: 'Home',      href: '/dashboard',   badge: null },
  { icon: 'courses',  label: 'Courses',   href: '/courses',     badge: '3'  },
  { icon: 'practice', label: 'Practice',  href: '/practice',    badge: null },
  { icon: 'tests',    label: 'Tests',     href: '/tests',       badge: null },
  { icon: 'cards',    label: 'Cards',     href: '/flashcards',  badge: null },
  { icon: 'progress', label: 'Progress',  href: '/progress',    badge: null },
  { icon: 'ranking',  label: 'Ranking',   href: '/leaderboard', badge: null },
  { icon: 'profile',  label: 'Profile',   href: '/profile',     badge: null },
];

export default function IndividualLayout({
  children,
  topBarSubText,
  notifCount = 0,
  navItems = DEFAULT_INDIVIDUAL_NAV_ITEMS,
}: IndividualLayoutProps) {
  const { fullName, jlptLevel, userInitial, loading, isAuthenticated } = useUserData();
console.log('IndividualLayout - User Data:', { fullName, jlptLevel, userInitial, loading, isAuthenticated });
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-primary)',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <AppShell
      userName={fullName}
      userInitial={userInitial}
      userLevel={jlptLevel}
      topBarSubText={topBarSubText}
      notifCount={notifCount}
      navItems={navItems}
    >
      {children}
    </AppShell>
  );
}