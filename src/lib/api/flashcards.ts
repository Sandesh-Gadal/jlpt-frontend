/**
 * Flashcards API
 * Handles flashcard-related API calls
 */

import { request} from './request';

// Backend response types
export interface FlashcardReview {
  next_review_at: string;
  interval: number;
  easiness: number;
  repetitions: number;
  last_rating: number;
  is_due: boolean;
}

export interface BackendFlashcard {
  id: string;
  front_text: string;
  back_text: string;
  reading: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  category: string;
  level: {
    code: string;
  };
  user_review: FlashcardReview | null;
}

export interface FlashcardsResponse {
  cards: BackendFlashcard[];
  stats: {
    total: number;
    due: number;
    new: number;
    mastered: number;
  };
}

export interface FlashcardsDueResponse {
  cards: BackendFlashcard[];
  due_count: number;
  new_count: number;
}

export interface FlashcardRateResponse {
  review: {
    next_review_at: string;
    interval: number;
    easiness: number;
    repetitions: number;
  };
  next_label: string;
}

// Frontend-compatible types
export interface Flashcard {
  id: string;
  frontText: string;
  backText: string;
  reading?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  category: string;
  level: string;
  isDue?: boolean;
  repetitions?: number;
}

export interface FlashcardStats {
  total: number;
  due: number;
  new: number;
  mastered: number;
}

// Get auth headers
// function getAuthHeaders(): HeadersInit {
//   const token = getAuthToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// Transform backend flashcard to frontend format
function transformFlashcard(backend: BackendFlashcard): Flashcard {
  return {
    id: backend.id,
    frontText: backend.front_text,
    backText: backend.back_text,
    reading: backend.reading ?? undefined,
    exampleSentence: backend.example_sentence ?? undefined,
    exampleTranslation: backend.example_translation ?? undefined,
    category: backend.category,
    level: backend.level.code,
    isDue: backend.user_review?.is_due ?? false,
    repetitions: backend.user_review?.repetitions,
  };
}

export const flashcardsApi = {
  /**
   * GET /flashcards
   * List all flashcards with user's SRS state
   */
  list: async (level?: string, category?: string): Promise<{ cards: Flashcard[]; stats: FlashcardStats }> => {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (category) params.append('category', category);
    
    const url = `/flashcards${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await request<FlashcardsResponse>(url, {
      method: 'GET',
      // headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch flashcards:', response.error);
      return { cards: [], stats: { total: 0, due: 0, new: 0, mastered: 0 } };
    }

    return {
      cards: response.data.cards.map(transformFlashcard),
      stats: response.data.stats,
    };
  },

  /**
   * GET /flashcards/due
   * Get flashcards due for review
   */
  due: async (limit: number = 20, level?: string): Promise<Flashcard[]> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (level) params.append('level', level);
    
    const url = `/flashcards/due?${params.toString()}`;
    const response = await request<FlashcardsDueResponse>(url, {
      method: 'GET',
      // headers: getAuthHeaders(),
    });

    if (response.error || !response.data) {
      console.error('Failed to fetch due flashcards:', response.error);
      return [];
    }

    return response.data.cards.map(transformFlashcard);
  },

  /**
   * POST /flashcards/{id}/rate
   * Rate a flashcard after review
   */
  rate: async (id: string, rating: 'again' | 'hard' | 'good' | 'easy'): Promise<FlashcardRateResponse | null> => {
    const response = await request<FlashcardRateResponse>(`/flashcards/${id}/rate`, {
      method: 'POST',
      headers: {
        // ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });

    if (response.error || !response.data) {
      console.error('Failed to rate flashcard:', response.error);
      return null;
    }

    return response.data;
  },
};

