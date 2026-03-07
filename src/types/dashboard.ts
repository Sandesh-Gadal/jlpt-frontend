// ─────────────────────────────────────────────────────────────────
// src/types/dashboard.ts
// All TypeScript interfaces for the dashboard module
// ─────────────────────────────────────────────────────────────────

export interface UserStats {
  streak:       number;
  longestStreak: number;
  totalXp:      number;
  xpToNextRank: number;
  dailyGoalDone:  number;
  dailyGoalTotal: number;
  dailyXpReward:  number;
  avgScore:     number;
  sparklineData: number[]; // last 7 test scores
}

export interface CourseProgress {
  courseId:      string;
  courseName:    string;
  lessonTitle:   string;
  lessonNumber:  number;
  totalLessons:  number;
  level:         JlptLevel;
  category:      CourseCategory;
  estimatedMinsRemaining: number;
  thumbnailJp:   string;   // Japanese character for thumbnail
}

export interface RecommendedCourse {
  id:          string;
  title:       string;
  level:       JlptLevel;
  levelColor:  string;
  category:    CourseCategory;
  duration:    string;
  xpReward:    number;
  thumbnailJp: string;
  gradientFrom: string;
  gradientTo:   string;
}

export interface UpcomingTest {
  id:      string;
  name:    string;
  date:    string;
  time:    string;
  urgent:  boolean;
}

export interface Achievement {
  id:     string;
  icon:   string;
  name:   string;
  earned: boolean;
}

export interface NavItem {
  icon:   string;
  label:  string;
  href:   string;
  badge?: string | null;
}

export type JlptLevel    = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
export type CourseCategory = 'Grammar' | 'Vocabulary' | 'Kanji' | 'Reading' | 'Listening' | 'Mixed';
