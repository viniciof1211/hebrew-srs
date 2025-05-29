import axios from 'axios';
const client = axios.create({ baseURL: '/api' });

export const fetchPracticeSentences = async () => {
  const { data } = await client.get('/practice/sentences');
  return data;
};

export const submitPracticeAttempt = async (id: string, answer: string) => {
  const { data } = await client.post('/practice/attempt', { id, answer });
  return data.correct;
};