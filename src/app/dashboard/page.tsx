'use client';

// src/app/dashboard/page.tsx
// Minimalistic dashboard page

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell           from '@/components/dashboard/Layout/AppShell';
import StatStrip          from '@/components/dashboard/StatStrip/StatStrip';
import ContinueCard       from '@/components/dashboard/ContinueCard/ContinueCard';
import RecommendedCourses from '@/components/dashboard/RecommendedCourses/RecommendedCourses';
import UpcomingTests      from '@/components/dashboard/UpcomingTests/UpcomingTests';
import Achievements       from '@/components/dashboard/Achievements/Achievements';
import { dashboardApi, getAuthToken, getUserInitials, formatJlptLevel } from '@/lib/api';
import {
  MOCK_USER_STATS,
  MOCK_CONTINUE_COURSE,
  MOCK_RECOMMENDED,
  MOCK_TESTS,
  MOCK_ACHIEVEMENTS,
} from '@/data/dashboardData';
import type { UserStats, CourseProgress, UpcomingTest } from '@/types/dashboard';

// Default values for when API is not available
const DEFAULT_USER = {
  fullName: 'Student',
  jlptLevel: 'N5',
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(DEFAULT_USER);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [inProgress, setInProgress] = useState<CourseProgress[]>([]);
  const [recentTests, setRecentTests] = useState<UpcomingTest[]>([]);
  const [lessonsDueToday, setLessonsDueToday] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (!token) {
        router.push('/auth/login');
        return false;
      }
      return true;
    };

    if (!checkAuth()) return;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await dashboardApi.get();
        if (data) {
          // Set user data from API
          if (data.user) {
            setUserData({
              fullName: data.user.fullName || DEFAULT_USER.fullName,
              jlptLevel: data.user.jlptLevel || DEFAULT_USER.jlptLevel,
            });
          }
          
          // Set stats
          if (data.stats) {
            setStats({
              ...MOCK_USER_STATS,
              ...data.stats,
            } as UserStats);
          }
          
          // Set in-progress courses
          if (data.inProgress && data.inProgress.length > 0) {
            setInProgress(data.inProgress as unknown as CourseProgress[]);
          }
          
          // Set recent tests
          if (data.recentTests && data.recentTests.length > 0) {
            setRecentTests(data.recentTests as unknown as UpcomingTest[]);
          }
          
          // Set lessons due today
          if (data.lessonsDueToday !== undefined) {
            setLessonsDueToday(data.lessonsDueToday);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        // If unauthorized, redirect to login
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // Compute initials from full name
  const userInitial = getUserInitials(userData.fullName);
  const userLevel = formatJlptLevel(userData.jlptLevel);
  
  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Format subtext for lessons due
  const getLessonsDueText = () => {
    if (lessonsDueToday === 0) return 'No lessons due today';
    if (lessonsDueToday === 1) return 'You have 1 lesson due today';
    return `You have ${lessonsDueToday} lessons due today`;
  };

  // Use mock data while loading or if API returns null
  const displayStats = stats || MOCK_USER_STATS;
  const displayContinue = inProgress.length > 0 ? inProgress[0] : MOCK_CONTINUE_COURSE;
  const displayTests = recentTests.length > 0 ? recentTests : MOCK_TESTS;

  return (
    <AppShell
      userName={userData.fullName}
      userInitial={userInitial}
      userLevel={userLevel}
      topBarSubText={getLessonsDueText()}
      notifCount={lessonsDueToday > 0 ? lessonsDueToday : 0}
    >
      <main className="dashboard-content">
        <StatStrip          stats={displayStats} />
        <ContinueCard       course={displayContinue} />
        <div className="two-col-grid">
          <RecommendedCourses courses={MOCK_RECOMMENDED} />
          <UpcomingTests      tests={displayTests} />
        </div>
        {/* <Achievements achievements={MOCK_ACHIEVEMENTS} /> */}
      </main>
    </AppShell>
  );
}

