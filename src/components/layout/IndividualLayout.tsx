'use client';

import { useEffect } from 'react';
import AppShell from '@/components/dashboard/Layout/AppShell';
import ContentLoader from '@/components/ui/ContentLoader';
import { useUserData } from '@/hooks/useUserData';
import type { NavItem } from '@/types/dashboard';
import { useRouter } from 'next/navigation';

interface IndividualLayoutProps {
  children: React.ReactNode;
  topBarSubText?: string;
  notifCount?: number;
  navItems?: NavItem[];
}

const DEFAULT_INDIVIDUAL_NAV_ITEMS: NavItem[] = [
  { icon: 'home',     label: 'Home',      href: '/dashboard',   badge: null },
  { icon: 'courses',  label: 'Courses',   href: '/courses',     badge: '3'  },
  // { icon: 'practice', label: 'Practice',  href: '/practice',    badge: null },
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
  const router = useRouter();

    useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <ContentLoader />;
  }

  if (!isAuthenticated && !loading) return null;

  return (
    <AppShell
      userName={fullName ?? ''}
      userInitial={userInitial ?? ''}
      userLevel={jlptLevel ?? ''}
      topBarSubText={topBarSubText}
      notifCount={notifCount}
      navItems={navItems}
    >
      {loading ? <ContentLoader /> : children}
    </AppShell>
  );
}