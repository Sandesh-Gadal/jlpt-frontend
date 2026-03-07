// ─────────────────────────────────────────────────────────────────
// src/data/dashboardData.ts
// Static mock data — replace with real API calls from src/lib/api.ts
// ─────────────────────────────────────────────────────────────────

import type {
  UserStats,
  CourseProgress,
  RecommendedCourse,
  UpcomingTest,
  Achievement,
  NavItem,
} from '@/types/dashboard';

export const MOCK_USER_STATS: UserStats = {
  streak:          14,
  longestStreak:   21,
  totalXp:         2840,
  xpToNextRank:    160,
  dailyGoalDone:   3,
  dailyGoalTotal:  5,
  dailyXpReward:   80,
  avgScore:        78,
  sparklineData:   [62, 75, 58, 80, 71, 88, 78],
};

export const MOCK_CONTINUE_COURSE: CourseProgress = {
  courseId:     'course-n3-grammar-001',
  courseName:   'N3 Grammar Essentials',
  lessonTitle:  'Lesson 8: Conditional Forms — ば・たら・なら',
  lessonNumber: 8,
  totalLessons: 15,
  level:        'N3',
  category:     'Grammar',
  estimatedMinsRemaining: 52,
  thumbnailJp:  '文',
};

export const MOCK_RECOMMENDED: RecommendedCourse[] = [
  {
    id:           'course-n3-cond',
    title:        'N3 Grammar: て-form & Conditionals',
    level:        'N3',
    levelColor:   '#5B9EAF',
    category:     'Grammar',
    duration:     '45 min',
    xpReward:     120,
    thumbnailJp:  '文',
    gradientFrom: '#0d2a1a',
    gradientTo:   '#1a4a28',
  },
  {
    id:           'course-n4-vocab',
    title:        'N4 Essential Vocab: Daily Life',
    level:        'N4',
    levelColor:   '#6EAA54',
    category:     'Vocabulary',
    duration:     '30 min',
    xpReward:     80,
    thumbnailJp:  '語',
    gradientFrom: '#1a0d2a',
    gradientTo:   '#2a1a4a',
  },
  {
    id:           'course-n3-read',
    title:        'N3 Reading Comprehension Practice',
    level:        'N3',
    levelColor:   '#5B9EAF',
    category:     'Reading',
    duration:     '60 min',
    xpReward:     150,
    thumbnailJp:  '読',
    gradientFrom: '#2a1a0d',
    gradientTo:   '#4a3a1a',
  },
  {
    id:           'course-n4-listen',
    title:        'N4 Listening: Announcements & Instructions',
    level:        'N4',
    levelColor:   '#6EAA54',
    category:     'Listening',
    duration:     '40 min',
    xpReward:     100,
    thumbnailJp:  '聴',
    gradientFrom: '#0d1a2a',
    gradientTo:   '#1a2a4a',
  },
  {
    id:           'course-n2-kanji',
    title:        'N2 Kanji: Nature & Environment',
    level:        'N2',
    levelColor:   '#D4708A',
    category:     'Kanji',
    duration:     '50 min',
    xpReward:     180,
    thumbnailJp:  '漢',
    gradientFrom: '#2a0d1a',
    gradientTo:   '#4a1a2a',
  },
];

export const MOCK_TESTS: UpcomingTest[] = [
  { id: 't1', name: 'N3 Grammar Practice Test',   date: 'Today',    time: '15 min', urgent: true  },
  { id: 't2', name: 'N3 Vocabulary Mock Exam',     date: 'Tomorrow', time: '30 min', urgent: false },
  { id: 't3', name: 'N4 Full Mock Exam (Timed)',   date: 'Mar 10',   time: '60 min', urgent: false },
  { id: 't4', name: 'N3 Reading Section Quiz',     date: 'Mar 12',   time: '25 min', urgent: false },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1',  icon: '🔥', name: '14-Day Streak',   earned: true  },
  { id: 'a2',  icon: '🌱', name: 'First Lesson',     earned: true  },
  { id: 'a3',  icon: '⭐', name: '1000 XP Club',    earned: true  },
  { id: 'a4',  icon: '🎯', name: 'Perfect Score',    earned: true  },
  { id: 'a5',  icon: '📚', name: 'Course Complete',  earned: true  },
  { id: 'a6',  icon: '🌸', name: 'Sakura Scholar',   earned: false },
  { id: 'a7',  icon: '🏯', name: 'N3 Champion',      earned: false },
  { id: 'a8',  icon: '🗻', name: 'Summit Seeker',    earned: false },
  { id: 'a9',  icon: '🦊', name: 'Fox Spirit',       earned: false },
  { id: 'a10', icon: '⛩️', name: 'Shrine Visit',    earned: false },
];

export const NAV_ITEMS: NavItem[] = [
  { icon: '⊞', label: 'Home',        href: '/dashboard',  badge: null  },
  { icon: '📚', label: 'My Courses',  href: '/courses',    badge: '3'   },
  { icon: '✏️', label: 'Practice',    href: '/practice',   badge: null  },
  { icon: '📝', label: 'Mock Tests',  href: '/tests',      badge: null  },
  { icon: '🃏', label: 'Vocabulary',  href: '/flashcards', badge: null  },
  { icon: '📈', label: 'Progress',    href: '/progress',   badge: null  },
  { icon: '🏆', label: 'Leaderboard', href: '/leaderboard',badge: null  },
  { icon: '⚙️', label: 'Settings',    href: '/settings',   badge: null  },
];
