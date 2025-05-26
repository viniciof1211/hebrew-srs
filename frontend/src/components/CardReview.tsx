import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchDueCards, updateCard } from '../services/api';
import { FlashCard } from '../types';

export const CardReview: React.FC = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    (async () => setCards(await fetchDueCards()))();
  }, []);

  if (!cards.length) {
    return <div className="text-center mt-20">No cards due. Relax for now! 🌙</div>;
  }

  const card = cards[index];
  const handleFlip = () => setFlipped(!flipped);

  const handleAnswer = async (correct: boolean) => {
    await updateCard(card.id, correct);
    setFlipped(false);
    const next = index + 1;
    if (next < cards.length) setIndex(next);
    else setCards([]);
  };

  return (
    <div className="flex justify-center mt-12">
      <motion.div
        className="w-80 h-48 relative perspective"
        onClick={handleFlip}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute w-full h-full backface-hidden bg-white shadow-xl rounded-2xl flex items-center justify-center p-4"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-3xl font-bold">{card.hebrew_word}</span>
        </motion.div>

        <motion.div
          className="absolute w-full h-full backface-hidden bg-white shadow-xl rounded-2xl p-4 rotateY-180 flex flex-col items-center justify-between"
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xl mb-2">{card.translation}</div>
          {card.svg_data && (
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: card.svg_data }}
            />
          )}
          {card.image_url && (
            <img src={card.image_url} alt="visual hint" className="max-h-24 mt-2" />
          )}
          <div className="flex space-x-6">
            <button
              onClick={() => handleAnswer(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-xl"
            >
              ✓
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl"
            >
              ✗
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};