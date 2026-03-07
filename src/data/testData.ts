import type { TestSet, TestQuestion, AttemptAnswer } from '@/types/test';

export const MOCK_TEST_SET: TestSet = {
  id: 'ts1',
  title: 'N3 Grammar & Vocabulary Practice Test',
  test_type: 'practice',
  time_limit_seconds: 3600,
  passing_score_percent: 60,
  level: { code: 'N3' },
  xp_reward_pass: 150,
  xp_reward_fail: 25,
};

export const MOCK_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '彼女は毎朝6時に起き_____。',
    options: [{ id: 'A', text: 'ます' }, { id: 'B', text: 'る' }, { id: 'C', text: 'た' }, { id: 'D', text: 'て' }],
    correct_answer: 'A',
    explanation: '毎朝 (every morning) with a habitual action uses polite present ます form.',
  },
  {
    id: 'q2', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '日本語の勉強は___難しいですか。',
    options: [{ id: 'A', text: 'そんなに' }, { id: 'B', text: 'そのに' }, { id: 'C', text: 'そので' }, { id: 'D', text: 'そにも' }],
    correct_answer: 'A',
    explanation: 'そんなに + negative/question means "that much; to that extent".',
  },
  {
    id: 'q3', question_type: 'multiple_choice', difficulty: 'hard',
    prompt: '雨が降り___、試合は続けられた。',
    options: [{ id: 'A', text: 'ながら' }, { id: 'B', text: 'にも関わらず' }, { id: 'C', text: 'ために' }, { id: 'D', text: 'ので' }],
    correct_answer: 'B',
    explanation: '〜にも関わらず means "despite / in spite of" — the match continued despite the rain.',
  },
  {
    id: 'q4', question_type: 'multiple_choice', difficulty: 'easy',
    prompt: '「環境」の正しい読み方はどれですか。',
    options: [{ id: 'A', text: 'かんきょ' }, { id: 'B', text: 'かんきょう' }, { id: 'C', text: 'かんけい' }, { id: 'D', text: 'かんきょく' }],
    correct_answer: 'B',
    explanation: '環境 = かんきょう (environment). The long vowel う is critical.',
  },
  {
    id: 'q5', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: 'この問題は私に___解決できません。',
    options: [{ id: 'A', text: 'は' }, { id: 'B', text: 'が' }, { id: 'C', text: 'を' }, { id: 'D', text: 'で' }],
    correct_answer: 'A',
    explanation: '私には (as for me) sets the scope: "As for me, I cannot solve this problem."',
  },
  {
    id: 'q6', question_type: 'multiple_choice', difficulty: 'hard',
    prompt: '彼が成功した___、彼女の助けがあったからだ。',
    options: [{ id: 'A', text: 'のは' }, { id: 'B', text: 'から' }, { id: 'C', text: 'ので' }, { id: 'D', text: 'ほど' }],
    correct_answer: 'A',
    explanation: '〜のは〜からだ structure: "The reason [X] is because of [Y]".',
  },
  {
    id: 'q7', question_type: 'multiple_choice', difficulty: 'easy',
    prompt: '「把握する」の意味はどれですか。',
    options: [
      { id: 'A', text: 'to hold; grasp; understand' },
      { id: 'B', text: 'to release; let go' },
      { id: 'C', text: 'to hesitate; doubt' },
      { id: 'D', text: 'to disagree; oppose' },
    ],
    correct_answer: 'A',
    explanation: '把握 (はあく) means to grasp, hold firmly, or understand/comprehend.',
  },
  {
    id: 'q8', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '彼女は___話すことができる。',
    options: [{ id: 'A', text: '流ちょうに' }, { id: 'B', text: '流ちょうで' }, { id: 'C', text: '流ちょうな' }, { id: 'D', text: '流ちょうを' }],
    correct_answer: 'A',
    explanation: '流ちょうに is the adverbial form (〜に) for the な-adjective 流ちょう (fluent).',
  },
  {
    id: 'q9', question_type: 'multiple_choice', difficulty: 'hard',
    prompt: '来週の会議に___参加できません。',
    options: [{ id: 'A', text: 'あいにく' }, { id: 'B', text: 'おかげで' }, { id: 'C', text: 'せっかく' }, { id: 'D', text: 'たとえば' }],
    correct_answer: 'A',
    explanation: 'あいにく means "unfortunately / regrettably". Perfect for politely declining.',
  },
  {
    id: 'q10', question_type: 'multiple_choice', difficulty: 'medium',
    prompt: '田中さんは昨日から___熱があります。',
    options: [{ id: 'A', text: 'ずっと' }, { id: 'B', text: 'もっと' }, { id: 'C', text: 'やっと' }, { id: 'D', text: 'きっと' }],
    correct_answer: 'A',
    explanation: 'ずっと = continuously, all along. "Tanaka has had a fever continuously since yesterday."',
  },
];

// Mock results with revealed correct answers + simulated user selections
export const MOCK_ATTEMPT_ANSWERS: AttemptAnswer[] = MOCK_QUESTIONS.map((q, i) => ({
  id:               `aa${i}`,
  question_id:      q.id,
  selected_answer:  i % 3 === 0 ? 'B' : q.correct_answer!, // simulate some wrong answers
  is_correct:       i % 3 !== 0,
  is_flagged:       i === 2 || i === 5,
  time_spent_seconds: Math.floor(Math.random() * 60) + 10,
  question:         { ...q },
}));
