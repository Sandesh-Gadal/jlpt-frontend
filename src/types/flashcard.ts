export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id:            string;
  front_text:    string;
  front_reading?: string;
  back_text:     string;
  example_jp?:   string;
  example_en?:   string;
  audio_url?:    string;
  category:      string;
  level?:        { code: string };
  user_review?: {
    next_review_at: string;
    interval:       number;
    easiness:       number;
    repetitions:    number;
    last_rating:    number | null;
    is_due:         boolean;
  } | null;
}

export interface DeckStats {
  total:    number;
  due:      number;
  new:      number;
  mastered: number;
}
