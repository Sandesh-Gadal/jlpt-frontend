import { request } from './request';

export interface ApiLevel {
  code: string;
  name_en?: string;
}

export interface ApiSection {
  id: string;
  name: string;
  section_type: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  question_count: number;
  time_minutes: number;
  has_audio: boolean;
}

export interface ApiTestSet {
  id: string;
  title: string;
  description: string;
  test_type: 'practice' | 'mock_exam' | 'assigned';
  time_limit_seconds: number;
  passing_score_percent: number;
  xp_reward_pass: number;
  xp_reward_fail: number;
  is_published?: boolean;
  level: ApiLevel;
  category: string;
  question_count: number;
  sections: ApiSection[];
  last_attempt?: {
    id: string;
    score_percent: number;
    passed: boolean;
    submitted_at: string;
    time_taken_seconds: number;
  } | null;
}

export interface ApiQuestionOption {
  id: string;
  text: string;
}

export interface ApiQuestion {
  id: string;
  section_id: string;
  question_type: 'multiple_choice' | 'fill_blank' | 'reading_comp' | 'listening';
  prompt: string;
  audio_url?: string | null;
  options: ApiQuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ApiAttempt {
  id: string;
  test_set_id: string;
  user_id: string;
  status: 'in_progress' | 'graded' | 'submitted';
  score_percent: number | null;
  passed: boolean | null;
  xp_awarded: number;
  started_at: string;
  submitted_at: string | null;
}

export interface StartTestResponse {
  attempt: ApiAttempt;
  test_set: ApiTestSet;
  questions: ApiQuestion[];
  saved_answers: {
    question_id: string;
    selected_answer: string | null;
    is_flagged: boolean;
    time_spent_seconds: number;
  }[];
  resumed: boolean;
}

export interface SubmitOrResultsResponse {
  attempt: ApiAttempt;
  test_set: ApiTestSet;
  score_percent: number;
  passed: boolean;
  correct: number;
  total: number;
  xp_awarded: number;
  time_taken_seconds: number;
  section_scores: {
    section_name: string;
    correct: number;
    total: number;
    percent: number;
  }[];
  difficulty_scores: {
    difficulty: 'easy' | 'medium' | 'hard';
    correct: number;
    total: number;
    percent: number;
  }[];
  review_answers: {
    question: ApiQuestion & {
      correct_answer: string;
      explanation: string | null;
    };
    selected_option: string | null;
    is_correct: boolean;
    is_flagged: boolean;
    time_spent_seconds: number;
  }[];
}

export const testsApi = {
  async list(level?: string): Promise<ApiTestSet[]> {
    const url = level && level !== 'ALL' ? `/tests?level=${level}` : '/tests';
    const response = await request<{ tests: ApiTestSet[] }>(url, { method: 'GET' });

    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to fetch tests');
    }

    return response.data.tests;
  },

  async start(testSetId: string): Promise<StartTestResponse> {
    const response = await request<StartTestResponse>(`/tests/${testSetId}/start`, {
      method: 'POST',
    });

    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to start test');
    }

    return response.data;
  },

  async answer(
    attemptId: string,
    payload: {
      question_id: string;
      selected_answer: string | null;
      time_spent_seconds: number;
      is_flagged: boolean;
    }
  ): Promise<boolean> {
    const response = await request<{ saved: boolean }>(`/tests/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to save answer');
    }

    return response.data.saved;
  },

  async submit(attemptId: string): Promise<SubmitOrResultsResponse> {
    const response = await request<SubmitOrResultsResponse>(`/tests/attempts/${attemptId}/submit`, {
      method: 'POST',
    });

    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to submit test');
    }

    return response.data;
  },

  async results(attemptId: string): Promise<SubmitOrResultsResponse> {
    const response = await request<SubmitOrResultsResponse>(`/tests/attempts/${attemptId}/results`, {
      method: 'GET',
    });

    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to load results');
    }

    return response.data;
  },
};