// src/types/test.ts
// All TypeScript types for S12–S16 Test Section

export type TestType     = 'practice' | 'mock_exam' | 'assigned';
export type QuestionType = 'multiple_choice' | 'fill_blank' | 'reading_comp' | 'listening';
export type Difficulty   = 'easy' | 'medium' | 'hard';
export type AttemptStatus= 'in_progress' | 'submitted' | 'graded';
export type ReviewFilter = 'all' | 'correct' | 'wrong' | 'flagged';

// ── S12 Test Catalog ──────────────────────────────────────────
export interface TestSet {
  id:                    string;
  title:                 string;
  description:           string;
  test_type:             TestType;
  level:                 { code: string; name_en: string };
  category:              string;          // 'Grammar' | 'Vocabulary' | 'Reading' | 'Listening' | 'Mixed'
  sections:              TestSection[];
  question_count:        number;
  time_limit_seconds:    number;
  passing_score_percent: number;
  xp_reward_pass:        number;
  xp_reward_fail:        number;
  is_published:          boolean;
  is_assigned?:          boolean;
  due_at?:               string | null;
  last_attempt?:         TestAttemptSummary | null;
}

export interface TestSection {
  id:             string;
  name:           string;
  section_type:   'vocabulary' | 'grammar' | 'reading' | 'listening';
  question_count: number;
  time_minutes:   number;
  has_audio:      boolean;
}

export interface TestAttemptSummary {
  id:            string;
  score_percent: number;
  passed:        boolean;
  submitted_at:  string;
  time_taken_seconds: number;
}

// ── S13 Pre-Test ──────────────────────────────────────────────
export interface PreTestInfo {
  test_set:     TestSet;
  instructions: InstructionBlock[];
  has_audio:    boolean;
  section_order: TestSection[];
}

export interface InstructionBlock {
  heading: string;
  body:    string;
}

// ── S14 Test Interface ────────────────────────────────────────
export interface TestQuestion {
  id:            string;
  section_id:    string;
  question_type: QuestionType;
  prompt:        string;
  passage?:      string;          // reading comprehension passage
  audio_url?:    string;          // listening question audio
  options:       QuestionOption[];
  difficulty:    Difficulty;
  // correct_answer intentionally OMITTED until results
}

export interface QuestionOption {
  id:   string;   // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface TestAttempt {
  id:            string;
  test_set_id:   string;
  user_id:       string;
  status:        AttemptStatus;
  started_at:    string;
  submitted_at?: string;
  score_percent: number | null;
  passed:        boolean | null;
  xp_awarded:    number;
}

export interface AnswerState {
  questionId:       string;
  selectedOption:   string | null;
  isFlagged:        boolean;
  timeSpentSeconds: number;
}

// ── S15 Results ───────────────────────────────────────────────
export interface TestResultSummary {
  attempt:       TestAttempt;
  test_set:      TestSet;
  score_percent: number;
  passed:        boolean;
  correct:       number;
  total:         number;
  xp_awarded:    number;
  time_taken_seconds: number;
  section_scores: SectionScore[];
  difficulty_scores: DifficultyScore[];
}

export interface SectionScore {
  section_name: string;
  correct:      number;
  total:        number;
  percent:      number;
}

export interface DifficultyScore {
  difficulty: Difficulty;
  correct:    number;
  total:      number;
  percent:    number;
}

// ── S16 Answer Review ─────────────────────────────────────────
export interface ReviewAnswer {
  question:        TestQuestion & { correct_answer: string; explanation: string };
  selected_option: string | null;
  is_correct:      boolean;
  is_flagged:      boolean;
  time_spent_seconds: number;
}
