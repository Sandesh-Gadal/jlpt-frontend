"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import StatStrip          from '@/components/dashboard/StatStrip/StatStrip';
import ContinueCard       from '@/components/dashboard/ContinueCard/ContinueCard';
import RecommendedCourses from '@/components/dashboard/RecommendedCourses/RecommendedCourses';
import UpcomingTests      from '@/components/dashboard/UpcomingTests/UpcomingTests';
import { dashboardApi } from '@/lib/api';
import {
  MOCK_USER_STATS,
  MOCK_CONTINUE_COURSE,
  MOCK_RECOMMENDED,
  MOCK_TESTS,
} from '@/data/dashboardData';
import type { UserStats, CourseProgress, UpcomingTest } from '@/types/dashboard';
import useUserData from '@/hooks/useUserData';

const DASHBOARD_CACHE_KEY     = 'jlpt_dashboard';
const DASHBOARD_CACHE_MAX_AGE = 2 * 60 * 1000; // 2 minutes

interface DashboardCache {
  stats:          UserStats;
  inProgress:     CourseProgress[];
  recentTests:    UpcomingTest[];
  lessonsDueToday: number;
  cachedAt:       number;
}

function readDashboardCache(): DashboardCache | null {
  try {
    const raw = sessionStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!raw) return null;
    const cache: DashboardCache = JSON.parse(raw);
    const isExpired = Date.now() - cache.cachedAt > DASHBOARD_CACHE_MAX_AGE;
    return isExpired ? null : cache;
  } catch {
    return null;
  }
}

function writeDashboardCache(data: Omit<DashboardCache, 'cachedAt'>) {
  try {
    sessionStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({
      ...data,
      cachedAt: Date.now(),
    }));
  } catch {}
}

export default function DashboardPage() {
  const router  = useRouter();
  const hasFetched = useRef(false); // ← prevents double-fetch in StrictMode / re-renders
  const { loading, isAuthenticated } = useUserData();
  const [stats,           setStats]           = useState<UserStats>(MOCK_USER_STATS);
  const [inProgress,      setInProgress]      = useState<CourseProgress[]>([]);
  const [recentTests,     setRecentTests]     = useState<UpcomingTest[]>(MOCK_TESTS);
  const [lessonsDueToday, setLessonsDueToday] = useState(0);

  useEffect(() => {
    // Guard — only run once per mount
    if (hasFetched.current) return;
    hasFetched.current = true;
 console.log('DashboardPage mounted, fetching data...');

    // Redirect to login if not authenticated
    
    if (!isAuthenticated && !loading) {
      console.log('User not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }

    // Serve from cache immediately if fresh
    const cached = readDashboardCache();
    if (cached) {
      setStats(cached.stats);
      setInProgress(cached.inProgress);
      setRecentTests(cached.recentTests);
      setLessonsDueToday(cached.lessonsDueToday);
      return; // ← skip API call entirely when cache is fresh
    }

    // No cache — fetch from API
    const fetchDashboard = async () => {
      try {
        const data = await dashboardApi.get();
        if (!data) return;

        const nextStats       = data.stats;
        const nextInProgress  = (data.inProgress  ?? []) as CourseProgress[];
        const nextTests       = (data.recentTests  ?? []) as UpcomingTest[];
        const nextDueToday    = data.lessonsDueToday ?? 0;

        // Write to cache
        writeDashboardCache({
          stats:           nextStats,
          inProgress:      nextInProgress,
          recentTests:     nextTests,
          lessonsDueToday: nextDueToday,
        });

        setStats(nextStats);
        setInProgress(nextInProgress);
        setRecentTests(nextTests.length > 0 ? nextTests : MOCK_TESTS);
        setLessonsDueToday(nextDueToday);

      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      }
    };

    fetchDashboard();
  }, []); // ← empty array, NOT [router] — router changing must not re-trigger this

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayContinue = inProgress.length > 0 ? inProgress[0] : MOCK_CONTINUE_COURSE;

  return (
    <main className="dashboard-content">
      <StatStrip          stats={stats} />
      <ContinueCard       course={displayContinue} />
      <div className="two-col-grid">
        {/* <RecommendedCourses courses={MOCK_RECOMMENDED} /> */}
        {/* <UpcomingTests      tests={recentTests} /> */}
      </div>
    </main>
  );
}