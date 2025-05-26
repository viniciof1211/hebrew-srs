import React, { useState } from 'react';
import { createCard } from '../services/api';

export const CreateCardForm: React.FC = () => {
  const [hebrewWord, setHebrewWord] = useState('');
  const [translation, setTranslation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCard({ hebrew_word: hebrewWord, translation });
    setHebrewWord('');
    setTranslation('');
    alert('Card created!');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Hebrew Word"
        value={hebrewWord}
        onChange={e => setHebrewWord(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Translation"
        value={translation}
        onChange={e => setTranslation(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Add Card
      </button>
    </form>
  );
};
