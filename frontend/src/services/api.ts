import axios from 'axios';
import { FlashCard, LookupResult } from '../types';

const api = axios.create({ baseURL: 'http://localhost:8000/cards' });

export const fetchDueCards = async (limit = 20): Promise<FlashCard[]> => {
  const { data } = await api.get('/next', { params: { limit } });
  return data;
};

export const createCard = async (card: Omit<FlashCard, 'id' | 'next_review'>) => {
  const { data } = await api.post('/create', card);
  return data as FlashCard;
};

export const updateCard = async (cardId: string, correct: boolean) => {
  const { data } = await api.post('/update', null, { params: { card_id: cardId, correct } });
  return data;
};

export const lookupWord = async (word: string): Promise<LookupResult> => {
  const { data } = await api.get('/lookup', { params: { word } });
  return data;
};
