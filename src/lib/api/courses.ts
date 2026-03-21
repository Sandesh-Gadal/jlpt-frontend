/**
 * Courses API
 * Handles course-related API calls
 */

import { request } from './request';

// Backend response types
export interface BackendJlptLevel {
  code: string;
  name_en: string;
}

export interface BackendCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  estimated_minutes: number;
  lesson_count: number;
  completed_lessons: number;
  progress_percent: number;
  jlpt_level: BackendJlptLevel;
  is_locked: boolean;
  preview_lessons: number | null;
  required_plan: string | null;
  upgrade_prompt: string | null;
}

export interface BackendCourseDetail {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail_url: string | null;
    estimated_minutes: number;
    jlpt_level: BackendJlptLevel;
    is_locked: boolean;
    required_plan: string | null;
  };
  lessons: BackendLesson[];
  total_lessons: number;
  free_lessons: number;
  locked_lessons: number;
  your_plan: string;
}

export interface BackendLesson {
  id: string;
  title: string;
  lesson_type: string;
  estimated_minutes: number;
  xp_reward: number;
  sort_order: number;
  is_locked: boolean;
  is_completed: boolean;
  required_plan: string | null;
  upgrade_prompt: string | null;
}

export interface CoursesListResponse {
  courses: BackendCourse[];
  total: number;
  your_plan: string;
}

export interface CourseDetailResponse extends BackendCourseDetail {}

// Frontend-compatible types (matching existing types/courses.ts)
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  category: 'Grammar' | 'Vocabulary' | 'Kanji' | 'Reading' | 'Listening';
  lessons: number;
  hours: number;
  xp: number;
  status: 'completed' | 'enrolled' | 'available' | 'locked';
  progress?: number;
  icon: string;
  thumbnail_url?: string | null;
  is_locked?: boolean;
  preview_lessons?: number | null;
}

export interface CourseDetailData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  level: string;
  category: string;
  totalLessons: number;
  completedLessons?: number;
  totalHours?: number;
  xpReward?: number;
  enrolled?: boolean;
  rating?: number;
  reviewCount?: number;
  icon?: string;
  gradientFrom?: string;
  gradientTo?: string;
  skills?: string[];
  lessons: CourseLesson[];
  reviews?: Review[];
  thumbnail_url?: string | null;
  is_locked?: boolean;
  required_plan?: string | null;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  level: string;
}

export interface CourseLesson {
  id: string;
  number: number;
  title: string;
  duration: number;
  status: 'completed' | 'current' | 'locked';
  xp: number;
  is_completed?: boolean;
  is_locked?: boolean;
  required_plan?: string | null;
}

// Transform backend course to frontend course
function transformCourse(backend: BackendCourse): Course {
  const levelMeta: Record<string, { icon: string; from: string; to: string }> = {
    N1: { icon: '🏆', from: '#30102a', to: '#501840' },
    N2: { icon: '⚙️', from: '#2a1a50', to: '#3e2a7a' },
    N3: { icon: '📐', from: '#1a2a50', to: '#2a3e7a' },
    N4: { icon: '📝', from: '#0d3040', to: '#1a5060' },
    N5: { icon: '🌱', from: '#1a3a1e', to: '#2d5c32' },
  };

  const level = backend.jlpt_level.code as Course['level'];
  
  // Normalize category to match frontend expected values
  const categoryMap: Record<string, Course['category']> = {
    'vocabulary': 'Vocabulary',
    'grammar': 'Grammar',
    'kanji': 'Kanji',
    'reading': 'Reading',
    'listening': 'Listening',
  };
  const category = categoryMap[backend.category?.toLowerCase()] || backend.category as Course['category'];
  
  const meta = levelMeta[level] || levelMeta.N3;

  let status: Course['status'] = 'available';
  if (backend.is_locked) {
    status = 'locked';
  } else if (backend.completed_lessons > 0) {
    if (backend.completed_lessons === backend.lesson_count) {
      status = 'completed';
    } else {
      status = 'enrolled';
    }
  }

  return {
    id: backend.id,
    title: backend.title,
    description: backend.description,
    level,
    category,
    lessons: backend.lesson_count,
    hours: Math.round(backend.estimated_minutes / 60),
    xp: 0, // Backend doesn't provide this directly
    status,
    progress: backend.progress_percent,
    icon: meta.icon,
    thumbnail_url: backend.thumbnail_url,
    is_locked: backend.is_locked,
    preview_lessons: backend.preview_lessons,
  };
}

// Transform backend lesson to frontend lesson
function transformLesson(backend: BackendLesson, index: number): CourseLesson {
  let status: CourseLesson['status'] = 'locked';
  if (!backend.is_locked) {
    status = backend.is_completed ? 'completed' : 'current';
  }

  return {
    id: backend.id,
    number: index + 1,
    title: backend.title,
    duration: backend.estimated_minutes,
    xp: backend.xp_reward,
    status,
    is_completed: backend.is_completed,
    is_locked: backend.is_locked,
    required_plan: backend.required_plan ?? undefined,
  };
}

// Transform backend course detail to frontend course detail
function transformCourseDetail(backend: BackendCourseDetail): CourseDetailData {
  const levelMeta: Record<string, { icon: string; from: string; to: string }> = {
    N1: { icon: '🏆', from: '#30102a', to: '#501840' },
    N2: { icon: '⚙️', from: '#2a1a50', to: '#3e2a7a' },
    N3: { icon: '📐', from: '#1a2a50', to: '#2a3e7a' },
    N4: { icon: '📝', from: '#0d3040', to: '#1a5060' },
    N5: { icon: '🌱', from: '#1a3a1e', to: '#2d5c32' },
  };

  const meta = levelMeta[backend.course.jlpt_level.code] || levelMeta.N3;

  // Determine lessons order by sort_order
  const sortedLessons = [...backend.lessons].sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: backend.course.id,
    title: backend.course.title,
    description: backend.course.description,
    longDescription: backend.course.description,
    level: backend.course.jlpt_level.code,
    category: backend.course.category,
    totalLessons: backend.total_lessons,
    completedLessons: backend.lessons.filter(l => l.is_completed).length,
    totalHours: Math.round(backend.course.estimated_minutes / 60),
    xpReward: 0, // Not provided by backend
    enrolled: backend.free_lessons > 0 || backend.your_plan !== 'free',
    rating: 0, // Not provided yet
    reviewCount: 0, // Not provided yet
    icon: meta.icon,
    gradientFrom: meta.from,
    gradientTo: meta.to,
    skills: [], // Not provided yet
    lessons: sortedLessons.map((l, i) => transformLesson(l, i)),
    reviews: [], // Not provided by backend
    thumbnail_url: backend.course.thumbnail_url,
    is_locked: backend.course.is_locked,
    required_plan: backend.course.required_plan ?? undefined,
  };
}

// Get auth headers
// function getAuthHeaders(): HeadersInit {
//   const token = getAuthToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

export const coursesApi = {
  /**
   * GET /courses
   * List all available courses (public, no auth required)
   */
  list: async (): Promise<Course[]> => {
    const response = await request<CoursesListResponse>('/courses', {
      method: 'GET',
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch courses:', response.error);
      return [];
    }

    return response.data.courses.map(transformCourse);
  },

  /**
   * GET /courses/{id}
   * Get course details with lessons (public, no auth required)
   */
  get: async (id: string): Promise<CourseDetailData | null> => {
    const response = await request<CourseDetailResponse>(`/courses/${id}`, {
      method: 'GET',
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch course:', response.error);
      return null;
    }

    return transformCourseDetail(response.data);
  },
};

