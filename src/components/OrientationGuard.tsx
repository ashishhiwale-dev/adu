'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OrientationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⛔ Start as null — unknown on first render
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;

      const portrait =
        window.innerHeight > window.innerWidth && window.innerWidth < 1024;

      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // ⏳ Prevent hydration mismatch
  if (isPortrait === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-white opacity-60">Loading…</p>
      </div>
    );
  }

  // 🚫 Portrait mode → block
  if (isPortrait) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center p-8">
        <motion.div
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <svg
            className="w-20 h-20 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Rotate your device
        </h2>

        <p className="text-gray-400 text-lg max-w-xs">
          To be able to play correctly, you need to put your phone in{' '}
          <b>landscape mode</b>.
        </p>
      </div>
    );
  }

  // ✅ Landscape → allow app
  return <>{children}</>;
}
