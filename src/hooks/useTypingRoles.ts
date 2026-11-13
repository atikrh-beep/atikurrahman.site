import { useState, useEffect, useRef } from 'react';

export interface UseTypingRolesOptions {
  phrases: string[];
  isReady?: boolean;
  disabled?: boolean;
}

type TypingPhase = 'typing' | 'holding' | 'erasing' | 'pausing';

/**
 * Deterministic typing animation hook using setTimeout state machine.
 * Lifecycle: Type (55ms) → Hold (2400ms for phrase 1, 1600ms for phrases 2-5) →
 * Erase (25ms) → Pause (350ms) → Next phrase → Repeat.
 * Pauses and resumes accurately with remaining time on browser tab visibility changes.
 */
export function useTypingRoles({
  phrases,
  isReady = true,
  disabled = false,
}: UseTypingRolesOptions): { displayedText: string } {
  const [displayedText, setDisplayedText] = useState<string>('');

  // Animation state refs (immune to stale closure issues)
  const phrasesRef = useRef<string[]>(phrases);
  phrasesRef.current = phrases;

  const phraseIndexRef = useRef<number>(0);
  const charIndexRef = useRef<number>(0);
  const phaseRef = useRef<TypingPhase>('typing');

  // Timeout management refs
  const timeoutIdRef = useRef<number | null>(null);
  const timeoutStartRef = useRef<number>(0);
  const timeoutRemainingRef = useRef<number>(0);
  const stepCallbackRef = useRef<(() => void) | null>(null);
  const isHiddenRef = useRef<boolean>(false);

  // Clear any active timeout safely
  const clearCurrentTimeout = () => {
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  // Schedule a step with specified duration and execution callback
  const schedule = (duration: number, callback: () => void) => {
    clearCurrentTimeout();
    timeoutStartRef.current = Date.now();
    timeoutRemainingRef.current = duration;
    stepCallbackRef.current = callback;

    if (!isHiddenRef.current) {
      timeoutIdRef.current = window.setTimeout(callback, duration);
    }
  };

  useEffect(() => {
    // If disabled (e.g. reduced motion) or phrases empty, return first phrase statically
    if (disabled || !phrases || phrases.length === 0) {
      clearCurrentTimeout();
      setDisplayedText(phrases && phrases.length > 0 ? phrases[0] : '');
      return;
    }

    // Wait until intro or site is ready
    if (!isReady) {
      clearCurrentTimeout();
      return;
    }

    // Step function driving the deterministic state machine
    const step = () => {
      const currentPhrases = phrasesRef.current;
      if (!currentPhrases || currentPhrases.length === 0) return;

      const currentPhrase = currentPhrases[phraseIndexRef.current] || '';

      switch (phaseRef.current) {
        case 'typing': {
          if (charIndexRef.current < currentPhrase.length) {
            charIndexRef.current += 1;
            setDisplayedText(currentPhrase.slice(0, charIndexRef.current));

            if (charIndexRef.current === currentPhrase.length) {
              // Full phrase typed; transition to holding phase
              phaseRef.current = 'holding';
              const holdDuration = phraseIndexRef.current === 0 ? 2400 : 1600;
              schedule(holdDuration, step);
            } else {
              schedule(55, step);
            }
          } else {
            // Already full, hold
            phaseRef.current = 'holding';
            const holdDuration = phraseIndexRef.current === 0 ? 2400 : 1600;
            schedule(holdDuration, step);
          }
          break;
        }

        case 'holding': {
          // Transition from holding to erasing phase
          phaseRef.current = 'erasing';
          schedule(25, step);
          break;
        }

        case 'erasing': {
          if (charIndexRef.current > 0) {
            charIndexRef.current -= 1;
            setDisplayedText(currentPhrase.slice(0, charIndexRef.current));

            if (charIndexRef.current === 0) {
              // Completely erased; transition to pausing phase
              phaseRef.current = 'pausing';
              schedule(350, step);
            } else {
              schedule(25, step);
            }
          } else {
            phaseRef.current = 'pausing';
            schedule(350, step);
          }
          break;
        }

        case 'pausing': {
          // Advance to next phrase in deterministic order and begin typing
          phraseIndexRef.current = (phraseIndexRef.current + 1) % currentPhrases.length;
          charIndexRef.current = 0;
          phaseRef.current = 'typing';
          schedule(55, step);
          break;
        }
      }
    };

    // Tab visibility handling: pause with remaining time, resume without resetting
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isHiddenRef.current = true;
        if (timeoutIdRef.current !== null) {
          window.clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
          const elapsed = Date.now() - timeoutStartRef.current;
          timeoutRemainingRef.current = Math.max(0, timeoutRemainingRef.current - elapsed);
        }
      } else {
        isHiddenRef.current = false;
        if (stepCallbackRef.current) {
          const remaining = timeoutRemainingRef.current;
          timeoutStartRef.current = Date.now();
          if (remaining > 0) {
            timeoutIdRef.current = window.setTimeout(stepCallbackRef.current, remaining);
          } else {
            stepCallbackRef.current();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial kick-off: schedule first character typing after 55ms
    schedule(55, step);

    return () => {
      clearCurrentTimeout();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReady, disabled]);

  return { displayedText };
}
