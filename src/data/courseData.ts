import type { Course, LevelMeta, CategoryOption } from '@/types/courses';
import type { Level } from '@/types/courses';

export const COURSES: Course[] = [
  {
    id: 'c1', title: 'N5 Foundations: Hiragana & Katakana Mastery',
    level: 'N5', category: 'Vocabulary', lessons: 12, hours: 4,
    xp: 200, status: 'completed', progress: 12, icon: '🌱',
    description: 'Build your Japanese reading foundation from scratch.',
  },
  {
    id: 'c2', title: 'N5 Basic Grammar Patterns',
    level: 'N5', category: 'Grammar', lessons: 10, hours: 3,
    xp: 180, status: 'completed', progress: 10, icon: '📝',
    description: 'Core sentence structures every beginner needs.',
  },
  {
    id: 'c3', title: 'N5 Essential Vocabulary: 800 Words',
    level: 'N5', category: 'Vocabulary', lessons: 16, hours: 5,
    xp: 220, status: 'enrolled', progress: 16, icon: '📖',
    description: 'The 800 most important words for JLPT N5.',
  },
  {
    id: 'c4', title: 'N5 Kanji: First 100 Characters',
    level: 'N5', category: 'Kanji', lessons: 10, hours: 4,
    xp: 190, status: 'enrolled', progress: 7, icon: '字',
    description: 'Learn the fundamental 100 kanji with mnemonics.',
  },
  {
    id: 'c5', title: 'N4 Grammar: て-form & Conditionals',
    level: 'N4', category: 'Grammar', lessons: 15, hours: 5,
    xp: 240, status: 'enrolled', progress: 8, icon: '文',
    description: 'Master conditional forms and te-form conjugations.',
  },
  {
    id: 'c6', title: 'N4 Vocabulary: Everyday Life',
    level: 'N4', category: 'Vocabulary', lessons: 14, hours: 4,
    xp: 210, status: 'enrolled', progress: 3, icon: '🏠',
    description: 'Essential vocabulary for daily conversations.',
  },
  {
    id: 'c7', title: 'N4 Kanji: Radicals & Compounds',
    level: 'N4', category: 'Kanji', lessons: 18, hours: 6,
    xp: 280, status: 'available', icon: '漢',
    description: 'Understand kanji structure through radicals.',
  },
  {
    id: 'c8', title: 'N4 Reading: Short Passages',
    level: 'N4', category: 'Reading', lessons: 12, hours: 4,
    xp: 230, status: 'locked', icon: '📰',
    description: 'Build confidence reading everyday Japanese text.',
  },
  {
    id: 'c9', title: 'N3 Grammar Essentials',
    level: 'N3', category: 'Grammar', lessons: 15, hours: 6,
    xp: 300, status: 'enrolled', progress: 8, icon: '📐',
    description: 'Intermediate grammar structures for N3 proficiency.',
  },
  {
    id: 'c10', title: 'N3 Vocabulary: 1500 Core Words',
    level: 'N3', category: 'Vocabulary', lessons: 20, hours: 7,
    xp: 320, status: 'available', icon: '📚',
    description: 'Expand your vocabulary to 1500 essential words.',
  },
  {
    id: 'c11', title: 'N3 Kanji: Nature & Environment',
    level: 'N3', category: 'Kanji', lessons: 16, hours: 5,
    xp: 270, status: 'locked', icon: '🌿',
    description: 'Kanji related to nature, seasons, and environment.',
  },
  {
    id: 'c12', title: 'N3 Reading Comprehension Practice',
    level: 'N3', category: 'Reading', lessons: 14, hours: 5,
    xp: 290, status: 'locked', icon: '🔍',
    description: 'Improve your reading speed and comprehension.',
  },
  {
    id: 'c13', title: 'N3 Listening: Conversations & Announcements',
    level: 'N3', category: 'Listening', lessons: 12, hours: 4,
    xp: 260, status: 'locked', icon: '🎧',
    description: 'Practice listening to natural Japanese speech.',
  },
  {
    id: 'c14', title: 'N2 Advanced Grammar Structures',
    level: 'N2', category: 'Grammar', lessons: 22, hours: 9,
    xp: 420, status: 'locked', icon: '⚙️',
    description: 'Complex grammar patterns required for N2.',
  },
  {
    id: 'c15', title: 'N2 Kanji: 1000 Characters Deep Dive',
    level: 'N2', category: 'Kanji', lessons: 25, hours: 10,
    xp: 450, status: 'locked', icon: '墨',
    description: 'Master the 1000 kanji needed for N2 certification.',
  },
  {
    id: 'c16', title: 'N2 Reading: Academic & Formal Texts',
    level: 'N2', category: 'Reading', lessons: 18, hours: 7,
    xp: 380, status: 'locked', icon: '🎓',
    description: 'Tackle formal writing styles used in N2 passages.',
  },
  {
    id: 'c17', title: 'N1 Master Grammar: All Patterns',
    level: 'N1', category: 'Grammar', lessons: 30, hours: 14,
    xp: 600, status: 'locked', icon: '🏆',
    description: 'Complete N1 grammar — the ultimate challenge.',
  },
  {
    id: 'c18', title: 'N1 Vocabulary: Rare & Literary Words',
    level: 'N1', category: 'Vocabulary', lessons: 28, hours: 12,
    xp: 560, status: 'locked', icon: '📜',
    description: 'Advanced vocabulary including literary expressions.',
  },
];

export const LEVEL_META: Record<Exclude<Level, 'ALL'>, LevelMeta> = {
  N5: { from: '#1a3a1e', to: '#2d5c32', watermark: 'rgba(110,200,80,0.18)',  badge: '#5DAA48' },
  N4: { from: '#0d3040', to: '#1a5060', watermark: 'rgba(80,180,200,0.18)',  badge: '#3A9EBA' },
  N3: { from: '#1a2a50', to: '#2a3e7a', watermark: 'rgba(80,120,220,0.18)',  badge: '#4A6ED4' },
  N2: { from: '#2a1a50', to: '#3e2a7a', watermark: 'rgba(130,90,220,0.18)', badge: '#7A5ED4' },
  N1: { from: '#30102a', to: '#501840', watermark: 'rgba(180,80,150,0.18)',  badge: '#C05090' },
};

export const LEVELS: Level[] = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

export const CATEGORIES: CategoryOption[] = [
  { label: 'All',          value: 'All',        emoji: '📖' },
  { label: '語彙 Vocab',    value: 'Vocabulary', emoji: '🗣️' },
  { label: '文法 Grammar',  value: 'Grammar',    emoji: '✏️' },
  { label: '漢字 Kanji',    value: 'Kanji',      emoji: '字' },
  { label: '読解 Reading',  value: 'Reading',    emoji: '📰' },
  { label: '聴解 Listen',   value: 'Listening',  emoji: '🎧' },
];

export const SORT_OPTIONS = [
  'Recommended',
  'Newest',
  'Most Popular',
  'Level: Low → High',
  'Level: High → Low',
  'XP Reward',
];