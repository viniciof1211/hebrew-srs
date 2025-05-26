import React, { useState } from 'react';
import { createCard, lookupWord } from '../services/api';
import { LookupResult } from '../types';

export const CreateCardForm: React.FC = () => {
  const [hebrewWord, setHebrewWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [lookupInfo, setLookupInfo] = useState<LookupResult | null>(null);

  const handleLookup = async () => {
    if (!hebrewWord) return;
    const info = await lookupWord(hebrewWord);
    setLookupInfo(info);
    setTranslation(info.translation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      hebrew_word: hebrewWord,
      translation,
      context_sentence: lookupInfo?.context_sentence,
      svg_data: lookupInfo?.svg_data,
      image_url: lookupInfo?.image_url,
    };
    await createCard(payload);
    setHebrewWord('');
    setTranslation('');
    setLookupInfo(null);
    alert('Card created!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl mb-4">Add New Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Hebrew Word"
            value={hebrewWord}
            onChange={e => setHebrewWord(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="button"
            onClick={handleLookup}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Lookup
          </button>
        </div>
        <input
          type="text"
          placeholder="Translation"
          value={translation}
          onChange={e => setTranslation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {lookupInfo?.context_sentence && (
          <p className="italic">“{lookupInfo.context_sentence}”</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600"
        >
          Add Card
        </button>
      </form>
    </div>
  );
};