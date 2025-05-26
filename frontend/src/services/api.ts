import axios from 'axios';

const API_BASE = 'http://localhost:8000';
let token: string | null = null;

export const setToken = (t: string) => { token = t; };

const client = axios.create({
  baseURL: API_BASE,
});
client.interceptors.request.use(config => {
  if (token) config.headers!['Authorization'] = `Bearer ${token}`;
  return config;
});

// Auth
export const login = async (username: string, password: string) => {
  const { data } = await client.post('/auth/token', new URLSearchParams({ username, password }));
  setToken(data.access_token);
  return data;
};
export const fetchMe = async () => {
  const { data } = await client.get('/auth/users/me');
  return data;
};

// Flashcard
export const fetchDueCards = async (limit = 20) => {
  const { data } = await client.get('/cards/next', { params: { limit } });
  return data;
};
export const createCard = async (card: any) => {
  const { data } = await client.post('/cards/create', card);
  return data;
};
export const updateCard = async (cardId: string, correct: boolean) => {
  const { data } = await client.post('/cards/update', null, { params: { card_id: cardId, correct } });
  return data;
};

// TTS & Lookup
export const lookupWord = async (word: string) => {
  const { data } = await client.get('/cards/lookup', { params: { word } });
  return data;
};
export const playTTSUrl = (word: string) => `${API_BASE}/audio/tts?word=${encodeURIComponent(word)}`;
