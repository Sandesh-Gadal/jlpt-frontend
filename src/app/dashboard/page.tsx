'use client';

// src/app/dashboard/page.tsx

import React from 'react';
import AppShell           from '@/components/dashboard/Layout/AppShell';
import StatStrip          from '@/components/dashboard/StatStrip/StatStrip';
import ContinueCard       from '@/components/dashboard/ContinueCard/ContinueCard';
import RecommendedCourses from '@/components/dashboard/RecommendedCourses/RecommendedCourses';
import UpcomingTests      from '@/components/dashboard/UpcomingTests/UpcomingTests';
import Achievements       from '@/components/dashboard/Achievements/Achievements';
import {
  MOCK_USER_STATS,
  MOCK_CONTINUE_COURSE,
  MOCK_RECOMMENDED,
  MOCK_TESTS,
  MOCK_ACHIEVEMENTS,
} from '@/data/dashboardData';

export default function DashboardPage() {
  return (
    <AppShell
      userName="Keiko Tanaka"
      userInitial="K"
      userLevel="N3"
      topBarSubText="You have 3 lessons due today · Keep your streak alive!"
      notifCount={3}
    >
      <main className="dashboard-content">
        <StatStrip          stats={MOCK_USER_STATS} />
        <ContinueCard       course={MOCK_CONTINUE_COURSE} />
        <div className="two-col-grid">
          <RecommendedCourses courses={MOCK_RECOMMENDED} />
          <UpcomingTests      tests={MOCK_TESTS} />
        </div>
        <Achievements achievements={MOCK_ACHIEVEMENTS} />
      </main>
    </AppShell>
  );
}