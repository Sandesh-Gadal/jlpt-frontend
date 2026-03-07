import type { Flashcard, DeckStats } from '@/types/flashcard';

export const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1', front_text: '食べる', front_reading: 'たべる',
    back_text: 'to eat',
    example_jp: '私は毎朝ご飯を食べる。', example_en: 'I eat rice every morning.',
    category: 'vocabulary', level: { code: 'N5' },
    user_review: null,
  },
  {
    id: 'fc2', front_text: '勉強', front_reading: 'べんきょう',
    back_text: 'study; to study',
    example_jp: '毎日日本語を勉強しています。', example_en: 'I study Japanese every day.',
    category: 'vocabulary', level: { code: 'N5' },
    user_review: {
      next_review_at: new Date(Date.now() - 1000).toISOString(),
      interval: 1, easiness: 2.5, repetitions: 2, last_rating: 4, is_due: true,
    },
  },
  {
    id: 'fc3', front_text: '大学', front_reading: 'だいがく',
    back_text: 'university; college',
    example_jp: '彼女は大学で数学を勉強しています。', example_en: 'She studies mathematics at university.',
    category: 'vocabulary', level: { code: 'N4' },
    user_review: {
      next_review_at: new Date(Date.now() - 3600000).toISOString(),
      interval: 3, easiness: 2.8, repetitions: 3, last_rating: 4, is_due: true,
    },
  },
  {
    id: 'fc4', front_text: '〜ても', front_reading: undefined,
    back_text: 'even if; even though',
    example_jp: '雨が降っても、行きます。', example_en: 'Even if it rains, I will go.',
    category: 'grammar', level: { code: 'N4' },
    user_review: null,
  },
  {
    id: 'fc5', front_text: '環境', front_reading: 'かんきょう',
    back_text: 'environment; surroundings',
    example_jp: '環境問題は世界中で重要です。', example_en: 'Environmental issues are important worldwide.',
    category: 'vocabulary', level: { code: 'N3' },
    user_review: {
      next_review_at: new Date(Date.now() + 86400000).toISOString(),
      interval: 7, easiness: 3.1, repetitions: 5, last_rating: 5, is_due: false,
    },
  },
  {
    id: 'fc6', front_text: '〜ば〜ほど', front_reading: undefined,
    back_text: 'the more…the more',
    example_jp: '練習すればするほど上手になる。', example_en: 'The more you practice, the better you become.',
    category: 'grammar', level: { code: 'N3' },
    user_review: null,
  },
  {
    id: 'fc7', front_text: '諦める', front_reading: 'あきらめる',
    back_text: 'to give up; to abandon',
    example_jp: '夢を諦めないでください。', example_en: "Please don't give up on your dreams.",
    category: 'vocabulary', level: { code: 'N3' },
    user_review: {
      next_review_at: new Date(Date.now() - 7200000).toISOString(),
      interval: 1, easiness: 1.8, repetitions: 1, last_rating: 2, is_due: true,
    },
  },
  {
    id: 'fc8', front_text: '把握', front_reading: 'はあく',
    back_text: 'grasp; understanding; comprehension',
    example_jp: '状況を把握してください。', example_en: 'Please grasp the situation.',
    category: 'vocabulary', level: { code: 'N2' },
    user_review: null,
  },
];

export const MOCK_DECK_STATS: DeckStats = {
  total:    24,
  due:      7,
  new:      12,
  mastered: 5,
};
