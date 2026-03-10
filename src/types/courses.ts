export type Level    = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type Category = 'All' | 'Vocabulary' | 'Grammar' | 'Kanji' | 'Reading' | 'Listening';
export type Status   = 'locked' | 'enrolled' | 'completed' | 'available';
export type ViewMode = 'grid' | 'list';

export interface Course {
  id:          string;
  title:       string;
  level:       Exclude<Level, 'ALL'>;
  category:    Exclude<Category, 'All'>;
  lessons:     number;
  hours:       number;
  xp:          number;
  status:      Status;
  progress?:   number;   // lessons completed
  icon:        string;
  description: string;
  // Additional fields from backend API
  thumbnail_url?: string | null;
  is_locked?: boolean;
  preview_lessons?: number | null;
}

export interface LevelMeta {
  from:       string;
  to:         string;
  watermark:  string;
  badge:      string;
}

export interface CategoryOption {
  label: string;
  value: Category;
  emoji: string;
}