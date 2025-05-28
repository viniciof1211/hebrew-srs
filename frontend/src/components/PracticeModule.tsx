import React, { useState, useEffect } from 'react';
import { fetchPracticeSentences, submitPracticeAttempt } from '../services/practiceApi';

interface PracticeSent {
  _id: string;
  sentence: string;
  leitner_box: number;
}

export const PracticeModule: React.FC = () => {
  const [queue, setQueue] = useState<PracticeSent[]>([]);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    (async () => {
      const sents = await fetchPracticeSentences();
      setQueue(sents);
    })();
  }, []);

  const current = queue[0];
  const handleSubmit = async () => {
    const correct = await submitPracticeAttempt(current._id, answer);
    setQueue(prev => prev.slice(1));
    setAnswer('');
  };

  return current ? (
    <div className="card">
      <p>Translate this sentence:</p>
      <p className="mb-4 font-semibold">{current.sentence}</p>
      <input
        className="w-full p-2 border rounded mb-2"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
      />
      <button onClick={handleSubmit} className="btn-primary">
        Submit
      </button>
    </div>
  ) : (
    <p>No sentences due. You're all caught up!</p>
  );
};