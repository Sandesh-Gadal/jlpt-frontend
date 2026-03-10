/**
 * Lessons API
 * Handles lesson-related API calls
 */

import { request, getAuthToken } from './request';
import type { LessonData, ContentBlock, QuizQuestion } from '@/types/lesson';

// Backend response types
export interface BackendLessonContent {
  id: string;
  title: string;
  lesson_type: string;
  content: ContentBlock[] | null;
  estimated_minutes: number;
  xp_reward: number;
  video_url: string | null;
  audio_url: string | null;
  course: {
    id: string;
    title: string;
    level: string;
  };
  already_completed: boolean;
}

export interface LessonResponse {
  lesson: BackendLessonContent;
}

export interface LessonCompleteResponse {
  message: string;
  xp_awarded: number;
  xp_total: number;
}

// Frontend-compatible lesson data type
export interface LessonDetailData {
  id: string;
  courseId: string;
  title: string;
  subtitle?: string;
  number: number;
  totalInCourse: number;
  duration: number;
  xpReward: number;
  level: string;
  category: string;
  content: ContentBlock[];
  quiz: QuizQuestion[];
  already_completed?: boolean;
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Transform backend lesson to frontend lesson format
function transformLesson(backend: BackendLessonContent, totalInCourse: number = 0): LessonDetailData {
  // The content_json from backend contains both lesson content and quiz
  // We need to separate them
  const allContent = backend.content || [];
  
  // Find quiz section in content (if exists)
  const quizContent = allContent.find((block: any) => block.type === 'quiz');
  const lessonContent = allContent.filter((block: any) => block.type !== 'quiz') as ContentBlock[];

  return {
    id: backend.id,
    courseId: backend.course.id,
    title: backend.title,
    subtitle: '', // Not provided by backend
    number: 0, // Not provided, needs to be passed separately
    totalInCourse,
    duration: backend.estimated_minutes,
    xpReward: backend.xp_reward,
    level: backend.course.level,
    category: backend.lesson_type,
    content: lessonContent,
    quiz: (quizContent as any)?.questions || [],
    already_completed: backend.already_completed,
  };
}

export const lessonsApi = {
  /**
   * GET /lessons/{id}
   * Get lesson details
   */
  get: async (id: string, totalInCourse: number = 0): Promise<LessonDetailData | null> => {
    const response = await request<LessonResponse>(`/lessons/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch lesson:', response.error);
      return null;
    }

    return transformLesson(response.data.lesson, totalInCourse);
  },

  /**
   * POST /lessons/{id}/complete
   * Mark lesson as completed
   */
  complete: async (id: string): Promise<LessonCompleteResponse | null> => {
    const response = await request<LessonCompleteResponse>(`/lessons/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to complete lesson:', response.error);
      return null;
    }

    return response.data;
  },
};

