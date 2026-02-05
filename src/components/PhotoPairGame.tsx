'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// image paths MUST exist in /public/game-photos/
const images = Array.from(
  { length: 18 },
  (_, i) => `/game-photos/${i + 1}.png`
);

// create pairs (36 total)
const imagePairs = images.flatMap((img) => [img, img]);

const shuffleArray = (array: string[]) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const heartLayout: (number | null)[][] = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type Props = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({ handleShowProposal }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  const [shuffledImages] = useState(() => shuffleArray(imagePairs));

  const handleClick = async (index: number) => {
    if (
      selected.length === 2 ||
      matched.includes(index) ||
      selected.includes(index)
    )
      return;

    if (selected.length === 1) {
      const firstIndex = selected[0];
      setSelected((prev) => [...prev, index]);

      if (shuffledImages[firstIndex] === shuffledImages[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
        setSelected([]);
      } else {
        await new Promise((res) => setTimeout(res, 1000));

        setIncorrect([firstIndex, index]);
        setTimeout(() => setIncorrect([]), 1000);
        setTimeout(() => setSelected([]), 1000);
      }
    } else {
      setSelected([index]);
    }
  };

  useEffect(() => {
    if (matched.length === imagePairs.length) {
      handleShowProposal();
    }
  }, [matched, handleShowProposal]);

  return (
    <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">
      {heartLayout.flat().map((index, i) =>
        index !== null ? (
          <motion.div
            key={i}
            className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => handleClick(index)}
            style={{ perspective: '1000px' }}
          >
            {/* BACK */}
            {!selected.includes(index) && !matched.includes(index) && (
              <motion.div
                className="w-full h-full bg-gray-300 rounded-sm lg:rounded-md absolute z-10"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: 'hidden' }}
              />
            )}

            {/* FRONT */}
            {(selected.includes(index) || matched.includes(index)) && (
              <motion.div
                className="w-full h-full absolute"
                initial={{ rotateY: -180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Image
                  src={shuffledImages[index]}
                  alt={`Image ${index + 1}`}
                  fill
                  className="rounded-sm lg:rounded-md object-cover"
                />
              </motion.div>
            )}

            {/* INCORRECT */}
            {incorrect.includes(index) && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-red-500 rounded-sm lg:rounded-md" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />
        )
      )}
    </div>
  );
}
