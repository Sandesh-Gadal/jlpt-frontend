export interface FuriganaSegment {
  text:     string;
  reading?: string;  // if present → render as ruby
}

export type ContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'furigana'
  | 'vocabulary'
  | 'grammar'
  | 'example'
  | 'tip'
  | 'divider';

export interface VocabItem {
  word:    string;
  reading: string;
  meaning: string;
  example: string;
}

export interface GrammarPoint {
  pattern:     string;
  meaning:     string;
  structure:   string;
  examples:    { jp: string; en: string }[];
}

export interface ContentBlock {
  type:     ContentBlockType;
  // heading / paragraph
  text?:    string;
  level?:   1 | 2 | 3;
  // furigana paragraph
  segments?: FuriganaSegment[];
  // vocabulary table
  vocab?:   VocabItem[];
  // grammar
  grammar?: GrammarPoint;
  // example sentence
  jp?:      string;
  en?:      string;
  // tip box
  tip?:     string;
  label?:   string;
}

export interface QuizOption {
  id:   string;
  text: string;
}

export interface QuizQuestion {
  id:       string;
  question: string;
  options:  QuizOption[];
  correct:  string;   // option id
  explanation: string;
}

export interface LessonData {
  id:          string;
  courseId:    string;
  title:       string;
  subtitle:    string;
  number:      number;
  totalInCourse: number;
  duration:    number;  // minutes
  xpReward:    number;
  level:       string;
  category:    string;
  content:     ContentBlock[];
  quiz:        QuizQuestion[];
}

export interface CourseLesson {
  id:        string;
  number:    number;
  title:     string;
  duration:  number;
  status:    'completed' | 'current' | 'locked';
  xp:        number;
}

export interface CourseDetailData {
  id:          string;
  title:       string;
  description: string;
  longDescription?: string;
  level:       string;
  category:    string;
  totalLessons: number;
  completedLessons?: number;
  totalHours?:  number;
  xpReward?:    number;
  enrolled?:    boolean;
  rating?:      number;
  reviewCount?: number;
  icon?:        string;
  gradientFrom?: string;
  gradientTo?:   string;
  skills?:      string[];
  lessons:     CourseLesson[];
  reviews?:     Review[];
  thumbnail_url?: string | null;
  is_locked?: boolean;
  required_plan?: string | null;
}

export interface Review {
  id:     string;
  name:   string;
  avatar: string;
  rating: number;
  date:   string;
  text:   string;
  level:  string;
}