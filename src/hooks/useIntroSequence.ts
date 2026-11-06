import { useEffect, useRef, useState, useCallback } from 'react';
import { useReveal } from '../context/RevealContext.tsx';

// 14 soft muted cursor colors matching the near-black theme
export const CURSOR_COLORS: string[] = [
  '#D4A853', // Muted Gold
  '#8FA895', // Soft Sage
  '#7E9DB0', // Steel Blue
  '#C9B69B', // Warm Sand
  '#BD8C7D', // Soft Terracotta
  '#A396B0', // Lavender
  '#6BA8A3', // Muted Teal
  '#8E9DA6', // Slate
  '#B88A96', // Dusty Rose
  '#99A680', // Pale Olive
  '#C29F68', // Soft Ochre
  '#709CB5', // Muted Sky
  '#B89C8A', // Pale Clay
  '#7EA396', // Soft Mint
];

export interface CursorDriftState {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  ctrlX: number;
  ctrlY: number;
  startTime: number;
  duration: number;
  phase: 'loading' | 'targeting' | 'scatter';
  noiseAngle: number;
  speed: number;
}

export interface InViewportTarget {
  index: number;
  element: HTMLElement;
  rect: DOMRect;
}

// Module-level variable to ensure intro runs once per full page load, but never on client-side route changes
let hasIntroRunOnPageLoad = false;

export function useIntroSequence() {
  const { setIsSiteLoaded } = useReveal();
  const [isActive, setIsActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    // Only play on the very first mount of the page session, not on client-side navigation
    return !hasIntroRunOnPageLoad;
  });

  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);
  const isCleaningUpRef = useRef<boolean>(false);

  // Measure in-viewport data-intro targets (1 to 9)
  const getInViewportTargets = useCallback((): InViewportTarget[] => {
    const list: InViewportTarget[] = [];
    const viewportHeight = window.innerHeight;

    for (let i = 1; i <= 9; i++) {
      const el = document.querySelector(`[data-intro="${i}"]`) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        // Only choreograph elements within the first screen
        if (rect.top < viewportHeight && rect.bottom >= 0) {
          list.push({ index: i, element: el, rect });
        }
      }
    }
    return list;
  }, []);

  // Complete cleanup function
  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;
    hasIntroRunOnPageLoad = true;

    // Remove intro-pending from html
    document.documentElement.classList.remove('intro-pending');

    // Unlock scrolling completely
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Clean up all revealed elements: return completely to original DOM styles
    const allTargets = document.querySelectorAll('[data-intro]');
    allTargets.forEach((el) => {
      const hEl = el as HTMLElement;
      hEl.classList.remove('intro-animating', 'intro-revealed', 'intro-card-border-highlight');
      hEl.style.opacity = '';
      hEl.style.transform = '';
      hEl.style.filter = '';
      hEl.style.transition = '';
      hEl.style.willChange = '';
    });

    // Notify reveal context
    setIsSiteLoaded(true);
    setIsActive(false);
  }, [setIsSiteLoaded]);

  return {
    isActive,
    overlayOpacity,
    setOverlayOpacity,
    cleanup,
    getInViewportTargets,
  };
}
