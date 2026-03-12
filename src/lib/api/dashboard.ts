/**
 * Dashboard API
 * Handles dashboard-related API calls
 */

import { request, getAuthToken } from './request';

// Backend response types
export interface BackendXpStats {
  current_xp: number;
  level: number;
  rank: string;
  xp_to_next_rank: number;
  daily_goal_xp: number;
  daily_goal_done: boolean;
  streak: number;
  longest_streak: number;
}

export interface BackendCourseProgress {
  id: string;
  title: string;
  description: string;
  category: string;
  estimated_minutes: number;
  progress_pct: number;
  completed_lessons: number;
  total_lessons: number;
  level: {
    code: string;
  };
  thumbnail_url: string | null;
}

export interface BackendRecentTest {
  id: string;
  test_set_id: string;
  score_percent: number;
  passed: boolean;
  xp_awarded: number;
  submitted_at: string;
  test_set: {
    id: string;
    title: string;
    test_type: string;
  };
}

export interface SparklineEntry {
  date: string;
  count: number;
}

export interface DashboardUser {
  full_name: string;
  jlpt_target_level: string | null;
}

// Helper function to generate initials from full name
export function getUserInitials(fullName: string): string {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Helper function to format JLPT level
export function formatJlptLevel(level: string | null): string {
  if (!level) return 'N5';
  return level.toUpperCase();
}

export interface DashboardResponse {
  user: DashboardUser;
  xp: BackendXpStats;
  sparkline: SparklineEntry[];
  in_progress: BackendCourseProgress[];
  flashcards_due: number;
  recent_tests: BackendRecentTest[];
  lessons_due_today: number;
}

// Frontend-compatible types
export interface UserStats {
  streak: number;
  longestStreak: number;
  totalXp: number;
  xpToNextRank: number;
  dailyGoalDone: number;
  dailyGoalTotal: number;
  dailyXpReward: number;
  avgScore: number;
  sparklineData: number[];
  level: number;
  rank: string;
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  lessonTitle: string;
  lessonNumber: number;
  totalLessons: number;
  level: string;
  category: string;
  estimatedMinsRemaining: number;
  thumbnailJp: string;
}

export interface UpcomingTest {
  id: string;
  name: string;
  date: string;
  time: string;
  urgent: boolean;
  score?: number;
  passed?: boolean;
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Transform backend XP stats to frontend format
function transformXpStats(backend: BackendXpStats, sparkline: number[]): UserStats {
  return {
    streak: backend.streak,
    longestStreak: backend.longest_streak,
    totalXp: backend.current_xp,
    xpToNextRank: backend.xp_to_next_rank,
    dailyGoalDone: backend.daily_goal_done ? backend.daily_goal_xp : 0,
    dailyGoalTotal: backend.daily_goal_xp,
    dailyXpReward: 0, // Not provided by backend
    avgScore: 0, // Not provided by backend
    sparklineData: sparkline,
    level: backend.level,
    rank: backend.rank,
  };
}

// Transform backend course progress to frontend format
function transformCourseProgress(backend: BackendCourseProgress, index: number): CourseProgress {
  const levelIcons: Record<string, string> = {
    N1: '🏆',
    N2: '⚙️',
    N3: '📐',
    N4: '📝',
    N5: '🌱',
  };

  const level = backend.level.code as CourseProgress['level'];
  const category = backend.category as CourseProgress['category'];

  return {
    courseId: backend.id,
    courseName: backend.title,
    lessonTitle: '', // Not provided - use course name
    lessonNumber: backend.completed_lessons,
    totalLessons: backend.total_lessons,
    level,
    category,
    estimatedMinsRemaining: (backend.total_lessons - backend.completed_lessons) * 30, // Approximate
    thumbnailJp: levelIcons[level] || '📚',
  };
}

// Transform backend recent test to frontend format
function transformRecentTest(backend: BackendRecentTest): UpcomingTest {
  const submittedDate = new Date(backend.submitted_at);
  const now = new Date();
  const diffMs = now.getTime() - submittedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  let date: string;
  let urgent = false;
  
  if (diffDays === 0) {
    date = 'Today';
  } else if (diffDays === 1) {
    date = 'Yesterday';
  } else if (diffDays < 7) {
    date = `${diffDays} days ago`;
  } else {
    date = submittedDate.toLocaleDateString();
  }
  
  // Mark as urgent if failed and recent
  urgent = !backend.passed && diffDays <= 3;

  return {
    id: backend.id,
    name: backend.test_set.title,
    date,
    time: '', // Not provided
    urgent,
    score: backend.score_percent,
    passed: backend.passed,
  };
}

export const dashboardApi = {
  /**
   * GET /dashboard
   * Get dashboard data
   */
  get: async (): Promise<{
    user: {
      fullName: string;
      jlptLevel: string;
    };
    stats: UserStats;
    inProgress: CourseProgress[];
    flashcardsDue: number;
    lessonsDueToday: number;
    recentTests: UpcomingTest[];
  } | null> => {
    const response = await request<DashboardResponse>('/dashboard', {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch dashboard:', response.error);
      return null;
    }

    const data = response.data;
    // console.log('Dashboard data received:', data);
    // Transform sparkline data
    const sparklineData = data.sparkline.map((entry) => entry.count);

    // Get user data from response
    const fullName = data.user.full_name || 'Student';
    const jlptLevel = data.user.jlpt_target_level || 'N5';

    return {
      user: {
        fullName,
        jlptLevel,
      },
      stats: transformXpStats(data.xp, sparklineData),
      inProgress: data.in_progress.map((course, index) => transformCourseProgress(course, index)),
      flashcardsDue: data.flashcards_due,
      lessonsDueToday: data.lessons_due_today || 0,
      recentTests: data.recent_tests.map(transformRecentTest),
    };
  },
};

