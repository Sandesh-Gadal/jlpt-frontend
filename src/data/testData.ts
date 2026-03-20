// src/data/testData.ts
// Mock data for S12–S16 — replace with useSWR('/api/v1/...') calls

import type {
  TestSet, TestQuestion, TestResultSummary, ReviewAnswer,
  SectionScore, DifficultyScore,
} from '@/types/test';

// ── S12: Catalog data ─────────────────────────────────────────────────────────
export const MOCK_TEST_CATALOG: TestSet[] = [
  {
    id: 'ts-n5-vocab-01',
    title: 'N5 Basic Vocabulary',
    description: 'Essential N5 vocabulary covering everyday objects, actions, and adjectives.',
    test_type: 'practice',
    level: { code: 'N5', name_en: 'Beginner' },
    category: 'Vocabulary',
    sections: [{ id: 's1', name: 'Vocabulary', section_type: 'vocabulary', question_count: 10, time_minutes: 20, has_audio: false }],
    question_count: 10,
    time_limit_seconds: 1800,
    passing_score_percent: 60,
    xp_reward_pass: 80,
    xp_reward_fail: 15,
    is_published: true,
    last_attempt: { id: 'a1', score_percent: 88, passed: true, submitted_at: '2026-03-15T10:30:00Z', time_taken_seconds: 720 },
  },
  {
    id: 'ts-n4-grammar-01',
    title: 'N4 Grammar Foundation',
    description: 'Core N4 grammar patterns including て-form connections, conditionals, and politeness levels.',
    test_type: 'practice',
    level: { code: 'N4', name_en: 'Elementary' },
    category: 'Grammar',
    sections: [{ id: 's1', name: 'Grammar', section_type: 'grammar', question_count: 15, time_minutes: 30, has_audio: false }],
    question_count: 15,
    time_limit_seconds: 2400,
    passing_score_percent: 60,
    xp_reward_pass: 100,
    xp_reward_fail: 20,
    is_published: true,
    last_attempt: null,
  },
  {
    id: 'ts-n3-full-01',
    title: 'N3 Full Mock Exam',
    description: 'Full JLPT N3 simulation — vocabulary, grammar, reading comprehension, and listening.',
    test_type: 'mock_exam',
    level: { code: 'N3', name_en: 'Intermediate' },
    category: 'Mixed',
    sections: [
      { id: 's1', name: 'Vocabulary', section_type: 'vocabulary', question_count: 25, time_minutes: 30, has_audio: false },
      { id: 's2', name: 'Grammar', section_type: 'grammar', question_count: 25, time_minutes: 30, has_audio: false },
      { id: 's3', name: 'Reading', section_type: 'reading', question_count: 25, time_minutes: 60, has_audio: false },
      { id: 's4', name: 'Listening', section_type: 'listening', question_count: 25, time_minutes: 40, has_audio: true },
    ],
    question_count: 100,
    time_limit_seconds: 9600,
    passing_score_percent: 60,
    xp_reward_pass: 500,
    xp_reward_fail: 50,
    is_published: true,
    last_attempt: { id: 'a2', score_percent: 54, passed: false, submitted_at: '2026-03-10T14:00:00Z', time_taken_seconds: 8200 },
  },
  {
    id: 'ts-n3-grammar-01',
    title: 'N3 Grammar & Vocabulary',
    description: 'Focused N3 practice on conditional forms, causative-passive, and advanced particles.',
    test_type: 'practice',
    level: { code: 'N3', name_en: 'Intermediate' },
    category: 'Grammar',
    sections: [
      { id: 's1', name: 'Grammar', section_type: 'grammar', question_count: 5, time_minutes: 20, has_audio: false },
      { id: 's2', name: 'Vocabulary', section_type: 'vocabulary', question_count: 5, time_minutes: 15, has_audio: false },
    ],
    question_count: 10,
    time_limit_seconds: 3600,
    passing_score_percent: 60,
    xp_reward_pass: 150,
    xp_reward_fail: 25,
    is_published: true,
    is_assigned: true,
    due_at: '2026-03-25T23:59:00Z',
    last_attempt: { id: 'a3', score_percent: 75, passed: true, submitted_at: '2026-03-14T09:15:00Z', time_taken_seconds: 1840 },
  },
  {
    id: 'ts-n3-reading-01',
    title: 'N3 Reading Comprehension',
    description: 'Multi-paragraph passages with comprehension questions. Builds reading speed and accuracy.',
    test_type: 'practice',
    level: { code: 'N3', name_en: 'Intermediate' },
    category: 'Reading',
    sections: [{ id: 's1', name: 'Reading', section_type: 'reading', question_count: 8, time_minutes: 40, has_audio: false }],
    question_count: 8,
    time_limit_seconds: 2400,
    passing_score_percent: 60,
    xp_reward_pass: 120,
    xp_reward_fail: 20,
    is_published: true,
    last_attempt: null,
  },
  {
    id: 'ts-n2-advanced-01',
    title: 'N2 Advanced Grammar',
    description: 'Complex N2 grammar including formal expressions, written language patterns, and nuanced particles.',
    test_type: 'mock_exam',
    level: { code: 'N2', name_en: 'Upper Intermediate' },
    category: 'Grammar',
    sections: [
      { id: 's1', name: 'Vocabulary', section_type: 'vocabulary', question_count: 10, time_minutes: 15, has_audio: false },
      { id: 's2', name: 'Grammar', section_type: 'grammar', question_count: 10, time_minutes: 20, has_audio: false },
    ],
    question_count: 20,
    time_limit_seconds: 4200,
    passing_score_percent: 65,
    xp_reward_pass: 200,
    xp_reward_fail: 30,
    is_published: true,
    last_attempt: null,
  },
  {
    id: 'ts-n1-comp-01',
    title: 'N1 Comprehensive Mock Exam',
    description: 'Full JLPT N1 simulation. All sections. Strict time limits. The ultimate challenge.',
    test_type: 'mock_exam',
    level: { code: 'N1', name_en: 'Advanced' },
    category: 'Mixed',
    sections: [
      { id: 's1', name: 'Vocabulary', section_type: 'vocabulary', question_count: 30, time_minutes: 35, has_audio: false },
      { id: 's2', name: 'Grammar', section_type: 'grammar', question_count: 30, time_minutes: 40, has_audio: false },
      { id: 's3', name: 'Reading', section_type: 'reading', question_count: 30, time_minutes: 70, has_audio: false },
      { id: 's4', name: 'Listening', section_type: 'listening', question_count: 35, time_minutes: 55, has_audio: true },
    ],
    question_count: 125,
    time_limit_seconds: 12000,
    passing_score_percent: 70,
    xp_reward_pass: 800,
    xp_reward_fail: 80,
    is_published: true,
    last_attempt: null,
  },
];

// ── S13: Pre-test instructions ────────────────────────────────────────────────
export const MOCK_PRETEST_INSTRUCTIONS = [
  {
    heading: 'Time limit',
    body: 'This test has a strict time limit. The timer starts when you click Start Test. You cannot pause once started.',
  },
  {
    heading: 'Question navigation',
    body: 'Use the question grid on the left to jump between questions. You can answer them in any order.',
  },
  {
    heading: 'Flagging questions',
    body: 'Flag any question for review. Flagged questions are highlighted in the navigator so you can return to them.',
  },
  {
    heading: 'Submitting',
    body: 'Click Submit Test when done, or the test auto-submits when time runs out. Unanswered questions count as wrong.',
  },
  {
    heading: 'Scoring',
    body: 'You need to score 60% or above to pass. Your XP reward depends on whether you pass.',
  },
];

// ── S14: 10 test questions ────────────────────────────────────────────────────
export const MOCK_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1', section_id: 's1', question_type: 'multiple_choice', difficulty: 'easy',
    prompt: '彼女は毎朝6時に起き______。',
    options: [{ id: 'A', text: 'ます' }, { id: 'B', text: 'る' }, { id: 'C', text: 'た' }, { id: 'D', text: 'て' }],
  },
  {
    id: 'q2', section_id: 's1', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '日本語の勉強は______難しいですか。',
    options: [{ id: 'A', text: 'そんなに' }, { id: 'B', text: 'そのに' }, { id: 'C', text: 'そので' }, { id: 'D', text: 'そにも' }],
  },
  {
    id: 'q3', section_id: 's1', question_type: 'multiple_choice', difficulty: 'hard',
    prompt: '雨が降り______、試合は続けられた。',
    options: [{ id: 'A', text: 'ながら' }, { id: 'B', text: 'にも関わらず' }, { id: 'C', text: 'ために' }, { id: 'D', text: 'ので' }],
  },
  {
    id: 'q4', section_id: 's1', question_type: 'multiple_choice', difficulty: 'easy',
    prompt: '「環境」の正しい読み方はどれですか。',
    options: [{ id: 'A', text: 'かんきょ' }, { id: 'B', text: 'かんきょう' }, { id: 'C', text: 'かんけい' }, { id: 'D', text: 'かんきょく' }],
  },
  {
    id: 'q5', section_id: 's2', question_type: 'reading_comp', difficulty: 'medium',
    passage: '田中さんは毎日図書館で勉強しています。彼は将来、日本語の先生になりたいと思っています。そのために、毎日3時間以上勉強を続けています。友達からは「努力家だね」とよく言われます。',
    prompt: '田中さんは毎日何時間以上勉強していますか。',
    options: [{ id: 'A', text: '1時間以上' }, { id: 'B', text: '2時間以上' }, { id: 'C', text: '3時間以上' }, { id: 'D', text: '4時間以上' }],
  },
  {
    id: 'q6', section_id: 's2', question_type: 'reading_comp', difficulty: 'hard',
    passage: '田中さんは毎日図書館で勉強しています。彼は将来、日本語の先生になりたいと思っています。そのために、毎日3時間以上勉強を続けています。友達からは「努力家だね」とよく言われます。',
    prompt: '田中さんの友達はどのように思っていますか。',
    options: [{ id: 'A', text: '田中さんは疲れている' }, { id: 'B', text: '田中さんはよく努力する' }, { id: 'C', text: '田中さんは先生になれない' }, { id: 'D', text: '田中さんは図書館が好き' }],
  },
  {
    id: 'q7', section_id: 's1', question_type: 'multiple_choice', difficulty: 'easy',
    prompt: '「把握する」の意味はどれですか。',
    options: [
      { id: 'A', text: 'to grasp; understand' },
      { id: 'B', text: 'to release; let go' },
      { id: 'C', text: 'to hesitate; doubt' },
      { id: 'D', text: 'to disagree; oppose' },
    ],
  },
  {
    id: 'q8', section_id: 's1', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '彼女は______話すことができる。',
    options: [{ id: 'A', text: '流ちょうに' }, { id: 'B', text: '流ちょうで' }, { id: 'C', text: '流ちょうな' }, { id: 'D', text: '流ちょうを' }],
  },
  {
    id: 'q9', section_id: 's1', question_type: 'multiple_choice', difficulty: 'hard',
    prompt: '来週の会議に______参加できません。',
    options: [{ id: 'A', text: 'あいにく' }, { id: 'B', text: 'おかげで' }, { id: 'C', text: 'せっかく' }, { id: 'D', text: 'たとえば' }],
  },
  {
    id: 'q10', section_id: 's1', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '田中さんは昨日から______熱があります。',
    options: [{ id: 'A', text: 'ずっと' }, { id: 'B', text: 'もっと' }, { id: 'C', text: 'やっと' }, { id: 'D', text: 'きっと' }],
  },
];

// ── S15/S16: Results + correct answers + explanations ─────────────────────────
const CORRECT_ANSWERS: Record<string, string> = {
  q1: 'A', q2: 'A', q3: 'B', q4: 'B', q5: 'C',
  q6: 'B', q7: 'A', q8: 'A', q9: 'A', q10: 'A',
};

const EXPLANATIONS: Record<string, string> = {
  q1:  '毎朝 (every morning) with habitual action uses the polite present ます form.',
  q2:  'そんなに + negative/question = "that much / to that extent".',
  q3:  '〜にも関わらず = "despite / in spite of" — the match continued despite the rain.',
  q4:  '環境 = かんきょう (environment). The long vowel う is essential.',
  q5:  '毎日3時間以上 is directly stated in the passage.',
  q6:  '「努力家だね」means "you really work hard" — the friend thinks Tanaka makes great effort.',
  q7:  '把握 (はあく) = to grasp, hold firmly, or comprehend.',
  q8:  '流ちょうに is the adverbial form (〜に) of the な-adjective 流ちょう (fluent).',
  q9:  'あいにく = "unfortunately / regrettably" — polite way to decline.',
  q10: 'ずっと = continuously, all along. "Has had a fever continuously since yesterday."',
};

// Build mock review answers (simulate some wrong)
export const MOCK_REVIEW_ANSWERS: ReviewAnswer[] = MOCK_QUESTIONS.map((q, i) => {
  const correct = CORRECT_ANSWERS[q.id];
  const userAnswer = i % 3 === 0 ? 'B' : correct; // every 3rd is wrong
  return {
    question:         { ...q, correct_answer: correct, explanation: EXPLANATIONS[q.id] },
    selected_option:  userAnswer,
    is_correct:       userAnswer === correct,
    is_flagged:       i === 2 || i === 5,
    time_spent_seconds: Math.floor(Math.random() * 55) + 10,
  };
});

const correctCount = MOCK_REVIEW_ANSWERS.filter(a => a.is_correct).length;

export const MOCK_RESULT: TestResultSummary = {
  attempt: {
    id: 'attempt-mock-001',
    test_set_id: 'ts-n3-grammar-01',
    user_id: 'user-keiko',
    status: 'graded',
    started_at: '2026-03-20T10:00:00Z',
    submitted_at: '2026-03-20T10:34:00Z',
    score_percent: Math.round((correctCount / MOCK_QUESTIONS.length) * 100),
    passed: Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 60,
    xp_awarded: Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 60 ? 150 : 25,
  },
  test_set: MOCK_TEST_CATALOG[3],
  score_percent: Math.round((correctCount / MOCK_QUESTIONS.length) * 100),
  passed: Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 60,
  correct: correctCount,
  total: MOCK_QUESTIONS.length,
  xp_awarded: Math.round((correctCount / MOCK_QUESTIONS.length) * 100) >= 60 ? 150 : 25,
  time_taken_seconds: 2040,
  section_scores: [
    { section_name: 'Grammar',    correct: 5, total: 7, percent: 71 },
    { section_name: 'Vocabulary', correct: correctCount - 5, total: 3, percent: Math.round(((correctCount - 5) / 3) * 100) },
  ],
  difficulty_scores: [
    { difficulty: 'easy',   correct: 3, total: 4,  percent: 75 },
    { difficulty: 'medium', correct: 3, total: 4,  percent: 75 },
    { difficulty: 'hard',   correct: correctCount - 6, total: 2, percent: Math.round(((correctCount - 6) / 2) * 100) },
  ],
};
