import React, { useState, useEffect } from 'react';
import { FULL_NAME } from '../data/portfolioData.ts';

interface InitialLoaderProps {
  onComplete: () => void;
  theme: 'dark' | 'light';
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [textRevealed, setTextRevealed] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // If user prefers reduced motion, skip the loader immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    // Step 1: Reveal name immediately with mask animation
    const textTimer = setTimeout(() => {
      setTextRevealed(true);
    }, 60);

    // Step 2: Animate progress line from 0 to 100% smoothly over 1.35 seconds
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 120);

    // Step 3: Trigger smooth fade out at ~1.35s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1380);

    // Step 4: Complete and unmount at ~1.55s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1550);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--bg-page)] transition-opacity duration-350 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading portfolio"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Name with subtle vertical mask reveal */}
        <div className="overflow-hidden py-1">
          <h1
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]"
            style={{
              transform: textRevealed ? 'translate3d(0, 0, 0)' : 'translate3d(0, 110%, 0)',
              opacity: textRevealed ? 1 : 0,
              transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), opacity 850ms cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity',
            }}
          >
            {FULL_NAME}
          </h1>
        </div>

        {/* Thin, understated progress indicator line */}
        <div 
          className="w-28 sm:w-36 h-[1.5px] bg-[var(--border-subtle)] rounded-full overflow-hidden relative"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[var(--text-primary)] rounded-full"
            style={{
              width: `${progress}%`,
              transition: 'width 1250ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'width',
            }}
          />
        </div>
      </div>
    </div>
  );
};
