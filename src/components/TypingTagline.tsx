import React, { useState, useEffect } from 'react';
import { useReveal } from '../context/RevealContext.tsx';
import { TYPING_ROLES } from '../data/portfolioData.ts';
import { useTypingRoles } from '../hooks/useTypingRoles.ts';

/**
 * Accessible, zero-layout-shift animated typing roles tagline.
 * Features:
 * - Deterministic typing state machine with hold/erase/pause phases
 * - Tab visibility pause/resume tracking
 * - CSS Grid stacking with invisible in-flow phrase layers so height & width stay 100% locked at all breakpoints (zero CLS, zero JS measurement delay)
 * - Screen-reader static original tagline (sr-only) for accessibility and SEO
 * - prefers-reduced-motion: displays static first phrase without caret or animation
 */
export const TypingTagline: React.FC = () => {
  const { isSiteLoaded } = useReveal();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Listen for reduced-motion accessibility preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const { displayedText } = useTypingRoles({
    phrases: TYPING_ROLES,
    isReady: isSiteLoaded,
    disabled: prefersReducedMotion,
  });

  return (
    <div className="relative grid w-full max-w-xl">
      <style>{`
        @keyframes heroCaretBlink {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-hero-caret {
          animation: heroCaretBlink 1s steps(2, start) infinite;
        }
      `}</style>

      {/* Screen reader only: original full tagline available once to assistive technology without repetition */}
      <span className="sr-only">
        Exploring Computer Science, Problem Solving, AI &amp; Innovative Technology
      </span>

      {/* In-flow invisible height/width reservation layers sharing the same grid cell */}
      {TYPING_ROLES.map((phrase, idx) => (
        <p
          key={idx}
          aria-hidden="true"
          className="col-start-1 row-start-1 invisible pointer-events-none select-none text-base sm:text-lg font-normal leading-relaxed max-w-xl m-0"
        >
          <span>{phrase}</span>
          {!prefersReducedMotion && (
            <span className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5" />
          )}
        </p>
      ))}

      {/* Visible tagline overlaid in the exact same grid cell */}
      <p
        data-intro="2"
        aria-hidden="true"
        className="col-start-1 row-start-1 text-base sm:text-lg text-[var(--text-body)] font-normal leading-relaxed max-w-xl m-0"
      >
        {prefersReducedMotion ? (
          <span>{TYPING_ROLES[0]}</span>
        ) : (
          <>
            <span>{displayedText}</span>
            <span
              aria-hidden="true"
              className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5 bg-[var(--text-primary)] animate-hero-caret select-none pointer-events-none"
            />
          </>
        )}
      </p>
    </div>
  );
};
