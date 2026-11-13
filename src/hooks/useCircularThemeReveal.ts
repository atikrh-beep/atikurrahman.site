import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '../context/ThemeContext.tsx';

/**
 * Hook for smooth, OS-level circular reveal theme transitions.
 * - When theme is toggled, expands a growing circular clip-path from the button position
 * - Works identically dark-to-light and light-to-dark
 * - Falls back cleanly if View Transitions API is unsupported or user prefers reduced motion
 */
export function useCircularThemeReveal() {
  const { theme, setTheme } = useTheme();
  const isTransitioningRef = useRef(false);

  const toggleWithCircularReveal = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent rapid overlapping clicks from interrupting the transition
      if (isTransitioningRef.current) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Fallback if View Transitions API is not available or reduced-motion is requested
      if (
        typeof document === 'undefined' ||
        typeof (document as any).startViewTransition !== 'function' ||
        prefersReducedMotion
      ) {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
        return;
      }

      // Calculate origin coordinates from the theme toggle button center
      let x = window.innerWidth - 40;
      let y = 40;

      if (event?.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      // Maximum distance to the furthest corner of the viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      isTransitioningRef.current = true;

      try {
        const transition = (document as any).startViewTransition(() => {
          // Immediately sync DOM class on html so View Transitions captures the new theme state
          const root = document.documentElement;
          if (nextTheme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
          } else {
            root.classList.remove('light');
            root.classList.add('dark');
          }

          flushSync(() => {
            setTheme(nextTheme);
          });
        });

        transition.ready
          .then(() => {
            // Animate growing circle on the new view snapshot layer
            document.documentElement
              .animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 900,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  pseudoElement: '::view-transition-new(root)',
                }
              )
              .finished.finally(() => {
                isTransitioningRef.current = false;
              });
          })
          .catch(() => {
            isTransitioningRef.current = false;
          });
      } catch {
        isTransitioningRef.current = false;
        setTheme(nextTheme);
      }
    },
    [theme, setTheme]
  );

  return toggleWithCircularReveal;
}
