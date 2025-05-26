import React, { useState, useEffect } from 'react';
import { fetchDueCards, updateCard } from '../services/api';
import { FlashCard } from '../types';

export const CardReview: React.FC = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    (async () => {
      const due = await fetchDueCards();
      setCards(due);
    })();
  }, []);

  if (!cards.length) return <div>No cards due. Come back later!</div>;

  const card = cards[currentIndex];

  const handleFlip = () => setFlipped(!flipped);

  const handleAnswer = async (correct: boolean) => {
    await updateCard(card.id, correct);
    setFlipped(false);
    const nextIndex = currentIndex + 1;
    if (nextIndex < cards.length) {
      setCurrentIndex(nextIndex);
    } else {
      // reload or show summary
      setCards([]);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-xl rounded-2xl">
      <div onClick={handleFlip} className="cursor-pointer text-center p-6">
        {!flipped ? (
          <span className="text-2xl">{card.hebrew_word}</span>
        ) : (
          <div>
            <div className="text-xl mb-2">{card.translation}</div>
            {card.context_sentence && <p>{card.context_sentence}</p>}
          </div>
        )}
      </div>
      {flipped && (
        <div className="flex justify-around mt-4">
          <button onClick={() => handleAnswer(true)} className="px-4 py-2 rounded-lg shadow">✓</button>
          <button onClick={() => handleAnswer(false)} className="px-4 py-2 rounded-lg shadow">✗</button>
        </div>
      )}
    </div>
  );
};
