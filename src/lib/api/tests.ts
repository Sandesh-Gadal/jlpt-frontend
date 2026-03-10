/**
 * Tests API
 * Handles test-related API calls
 */

import { request, getAuthToken } from './request';

// Backend response types
export interface BackendTestSet {
  id: string;
  title: string;
  description: string;
  test_type: string;
  time_limit_seconds: number;
  passing_score_percent: number;
  xp_reward_pass: number;
  xp_reward_fail: number;
  level: {
    code: string;
  };
  last_attempt?: {
    id: string;
    score_percent: number;
    passed: boolean;
    submitted_at: string;
  } | null;
}

export interface BackendQuestion {
  id: string;
  question_type: string;
  prompt: string;
  audio_url: string | null;
  options: Record<string, string>;
  difficulty: string;
  // correct_answer intentionally omitted until results
}

export interface BackendTestAttempt {
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

export interface BackendAttemptAnswer {
  id: string;
  question_id: string;
  selected_answer: string | null;
  is_correct: boolean | null;
  is_flagged: boolean;
  time_spent_seconds: number;
  question: BackendQuestion;
}

// Response types
export interface TestsListResponse {
  tests: BackendTestSet[];
}

export interface TestStartResponse {
  attempt: BackendTestAttempt;
  test_set: {
    id: string;
    title: string;
    test_type: string;
    time_limit_seconds: number;
    passing_score_percent: number;
  };
  questions: BackendQuestion[];
  resumed: boolean;
}

export interface TestAnswerResponse {
  saved: boolean;
  answer: BackendAttemptAnswer;
}

export interface TestSubmitResponse {
  attempt: BackendTestAttempt;
  score_percent: number;
  passed: boolean;
  correct: number;
  total: number;
  xp_awarded: number;
}

export interface TestResultsResponse {
  attempt: {
    id: string;
    test_set_id: string;
    status: string;
    score_percent: number;
    passed: boolean;
    xp_awarded: number;
    started_at: string;
    submitted_at: string;
    test_set: {
      id: string;
      title: string;
      test_type: string;
    };
    answers: {
      id: string;
      selected_answer: string | null;
      is_correct: boolean;
      is_flagged: boolean;
      question: {
        id: string;
        question_type: string;
        prompt: string;
        options: Record<string, string>;
        correct_answer: string;
        explanation: string | null;
      };
    }[];
  };
}

// Frontend-compatible types
export interface TestSet {
  id: string;
  title: string;
  description: string;
  testType: string;
  timeLimit: number;
  passingScore: number;
  xpRewardPass: number;
  xpRewardFail: number;
  level: string;
  lastAttempt?: {
    id: string;
    score: number;
    passed: boolean;
    date: string;
  } | null;
}

export interface TestQuestion {
  id: string;
  questionType: string;
  prompt: string;
  audioUrl?: string;
  options: Record<string, string>;
  difficulty: string;
}

export interface TestAttempt {
  id: string;
  testSetId: string;
  status: 'in_progress' | 'graded' | 'submitted';
  scorePercent?: number;
  passed?: boolean;
  xpAwarded?: number;
  startedAt: string;
  submittedAt?: string;
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Transform backend test set to frontend format
function transformTestSet(backend: BackendTestSet): TestSet {
  return {
    id: backend.id,
    title: backend.title,
    description: backend.description,
    testType: backend.test_type,
    timeLimit: backend.time_limit_seconds,
    passingScore: backend.passing_score_percent,
    xpRewardPass: backend.xp_reward_pass,
    xpRewardFail: backend.xp_reward_fail,
    level: backend.level.code,
    lastAttempt: backend.last_attempt ? {
      id: backend.last_attempt.id,
      score: backend.last_attempt.score_percent ?? 0,
      passed: backend.last_attempt.passed ?? false,
      date: backend.last_attempt.submitted_at,
    } : null,
  };
}

// Transform backend question to frontend format
function transformQuestion(backend: BackendQuestion): TestQuestion {
  return {
    id: backend.id,
    questionType: backend.question_type,
    prompt: backend.prompt,
    audioUrl: backend.audio_url ?? undefined,
    options: backend.options,
    difficulty: backend.difficulty,
  };
}

export const testsApi = {
  /**
   * GET /tests
   * List available test sets
   */
  list: async (level?: string): Promise<TestSet[]> => {
    const url = level ? `/tests?level=${level}` : '/tests';
    const response = await request<TestsListResponse>(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch tests:', response.error);
      return [];
    }

    return response.data.tests.map(transformTestSet);
  },

  /**
   * POST /tests/{testSetId}/start
   * Start a new test or resume existing
   */
  start: async (testSetId: string): Promise<{
    attempt: TestAttempt;
    testSet: { id: string; title: string; testType: string; timeLimit: number; passingScore: number };
    questions: TestQuestion[];
    resumed: boolean;
  } | null> => {
    const response = await request<TestStartResponse>(`/tests/${testSetId}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to start test:', response.error);
      return null;
    }

    return {
      attempt: {
        id: response.data.attempt.id,
        testSetId: response.data.attempt.test_set_id,
        status: response.data.attempt.status,
        startedAt: response.data.attempt.started_at,
      },
      testSet: {
        id: response.data.test_set.id,
        title: response.data.test_set.title,
        testType: response.data.test_set.test_type,
        timeLimit: response.data.test_set.time_limit_seconds,
        passingScore: response.data.test_set.passing_score_percent,
      },
      questions: response.data.questions.map(transformQuestion),
      resumed: response.data.resumed,
    };
  },

  /**
   * POST /tests/attempts/{attemptId}/answer
   * Submit an answer for a question
   */
  answer: async (
    attemptId: string,
    questionId: string,
    selectedAnswer: string | null,
    timeSpentSeconds: number = 0,
    isFlagged: boolean = false
  ): Promise<boolean> => {
    const response = await request<TestAnswerResponse>(`/tests/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questionId,
        selected_answer: selectedAnswer,
        time_spent_seconds: timeSpentSeconds,
        is_flagged: isFlagged,
      }),
    });

    if (response.error || !response.data) {
      console.error('Failed to submit answer:', response.error);
      return false;
    }

    return response.data.saved;
  },

  /**
   * POST /tests/attempts/{attemptId}/submit
   * Submit the test for grading
   */
  submit: async (attemptId: string): Promise<{
    attempt: TestAttempt;
    scorePercent: number;
    passed: boolean;
    correct: number;
    total: number;
    xpAwarded: number;
  } | null> => {
    const response = await request<TestSubmitResponse>(`/tests/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to submit test:', response.error);
      return null;
    }

    return {
      attempt: {
        id: response.data.attempt.id,
        testSetId: response.data.attempt.test_set_id,
        status: response.data.attempt.status,
        scorePercent: response.data.attempt.score_percent ?? undefined,
        passed: response.data.attempt.passed ?? undefined,
        xpAwarded: response.data.attempt.xp_awarded,
        startedAt: response.data.attempt.started_at,
        submittedAt: response.data.attempt.submitted_at ?? undefined,
      },
      scorePercent: response.data.score_percent,
      passed: response.data.passed,
      correct: response.data.correct,
      total: response.data.total,
      xpAwarded: response.data.xp_awarded,
    };
  },

  /**
   * GET /tests/attempts/{attemptId}/results
   * Get test results with correct answers
   */
  results: async (attemptId: string): Promise<TestResultsResponse['attempt'] | null> => {
    const response = await request<TestResultsResponse>(`/tests/attempts/${attemptId}/results`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch results:', response.error);
      return null;
    }

    return response.data.attempt;
  },
};

