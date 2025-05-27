import axios from 'axios';
import { FlashCard, LookupResult, TokenResponse, User } from '../types';

// Configure base URL to match Nginx proxy
const client = axios.create({ baseURL: '/api' });

// ----------------------
// AUTHENTICATION
// ----------------------

export async function login(
  username: string,
  password: string
): Promise<TokenResponse> {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await client.post<TokenResponse>('/auth/token', params);
  return response.data;
}

export async function fetchMe(): Promise<User> {
  const response = await client.get<User>('/auth/users/me');
  return response.data;
}

// ----------------------
// FLASHCARD OPERATIONS
// ----------------------

export async function fetchDueCards(
  limit = 20
): Promise<FlashCard[]> {
  const response = await client.get<FlashCard[]>('/cards/next', {
    params: { limit },
  });
  return response.data;
}

export async function createCard(
  card: Omit<FlashCard, 'id' | 'next_review'>
): Promise<FlashCard> {
  const response = await client.post<FlashCard>('/cards/create', card);
  return response.data;
}

export async function updateCard(
  cardId: string,
  correct: boolean
): Promise<{ next_review: string }> {
  const response = await client.post<{ next_review: string }>(
    '/cards/update',
    null,
    { params: { card_id: cardId, correct } }
  );
  return response.data;
}

// ----------------------
// LOOKUP & TTS
// ----------------------

export async function lookupWord(
  word: string
): Promise<LookupResult> {
  const response = await client.get<LookupResult>('/cards/lookup', {
    params: { word },
  });
  return response.data;
}

export function playTTSUrl(word: string): string {
  return `/api/audio/tts?word=${encodeURIComponent(word)}`;
}