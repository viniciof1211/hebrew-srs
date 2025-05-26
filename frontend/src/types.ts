export interface FlashCard {
  id: string;
  hebrew_word: string;
  translation: string;
  context_sentence?: string;
  svg_data?: string;   // raw SVG markup
  image_url?: string;  // multimedia URL
  next_review: string;
  interval_days: number;
  ease_factor: number;
  repetitions: number;
}

export interface LookupResult {
  translation: string;
  context_sentence?: string;
  svg_data?: string;
  image_url?: string;
  audio_url?: string;
}