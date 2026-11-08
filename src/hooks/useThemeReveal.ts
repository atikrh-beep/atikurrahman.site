import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '../context/ThemeContext.tsx';

export function useThemeReveal() {
  const { theme, setTheme } = useTheme();

  return useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Fallbacks: if document.startViewTransition does not exist, or prefers-reduced-motion is on,
      // switch the theme instantly with no animation.
      if (
        typeof document === 'undefined' ||
        !('startViewTransition' in document) ||
        prefersReducedMotion
      ) {
        setTheme(nextTheme);
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Call startViewTransition and apply state update inside flushSync
      const transition = (document as Document & {
        startViewTransition: (callback: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      }).startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      // Animate the root pseudo-element with the Web Animations API
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 800,
            easing: 'cubic-bezier(.65, 0, .25, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    },
    [theme, setTheme]
  );
}
