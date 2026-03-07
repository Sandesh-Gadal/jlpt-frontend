export type QuestionType = 'multiple_choice' | 'fill_blank' | 'listening' | 'reading_comp';

export interface TestQuestion {
  id:             string;
  question_type:  QuestionType;
  prompt:         string;
  audio_url?:     string;
  options:        { id: string; text: string }[];
  difficulty:     'easy' | 'medium' | 'hard';
  correct_answer?: string;  // omitted during active test, revealed on results
  explanation?:   string;
}

export interface TestSet {
  id:                    string;
  title:                 string;
  test_type:             'practice' | 'mock_exam' | 'assigned';
  time_limit_seconds:    number;
  passing_score_percent: number;
  level?:                { code: string };
  xp_reward_pass:        number;
  xp_reward_fail:        number;
}

export interface TestAttempt {
  id:            string;
  test_set_id:   string;
  status:        'in_progress' | 'submitted' | 'graded';
  score_percent: number | null;
  passed:        boolean | null;
  xp_awarded:    number;
  started_at:    string;
  submitted_at?: string;
}

export interface AttemptAnswer {
  id:               string;
  question_id:      string;
  selected_answer:  string | null;
  is_correct:       boolean | null;
  is_flagged:       boolean;
  time_spent_seconds?: number;
  question:         TestQuestion;
}
