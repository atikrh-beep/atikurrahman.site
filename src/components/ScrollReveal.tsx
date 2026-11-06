import React, { useState, useEffect, useRef, ElementType } from 'react';
import { useReveal } from '../context/RevealContext.tsx';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'mask-up' | 'clip-reveal' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  threshold?: number;
  rootMargin?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

/**
 * High-performance, single-trigger IntersectionObserver hook.
 * Coordinated with the initial loading screen:
 * - Remains unrevealed until the initial loader finishes.
 * - Automatically reveals elements inside the initial viewport with their respective delays.
 * - Progressively uncovers elements below the fold as the user scrolls.
 * - Keeps revealed elements permanently visible on scroll-up/down.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px'
): [React.RefObject<T | null>, boolean] {
  const { isSiteLoaded } = useReveal();
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, reveal immediately without animation
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    // Do not reveal while the initial site loading screen is still active
    if (!isSiteLoaded) {
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Check if element is already within the viewport when the site finishes loading
    const rect = node.getBoundingClientRect();
    const inInitialViewport = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (inInitialViewport) {
      setIsInView(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isSiteLoaded, threshold, rootMargin]);

  return [ref, isInView];
}

/**
 * Editorial Scroll Reveal Component
 * Provides smooth, filmic entrance transitions:
 * - 'mask-up': Content unmasks vertically from behind an invisible boundary
 * - 'fade-up': Subtle 14px upward drift with opacity transition
 * - 'clip-reveal': Sleek curtain unmasking via clip-path
 * - 'fade': Soft opacity transition
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 750,
  className = '',
  as: Component = 'div',
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  style = {},
  ...rest
}) => {
  const [ref, isInView] = useInViewOnce<HTMLDivElement>(threshold, rootMargin);

  // Cubic-bezier for natural, refined easing without bouncing or elastic effects
  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  let initialStyle: React.CSSProperties = {};
  let revealedStyle: React.CSSProperties = {};

  if (variant === 'mask-up') {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`} style={style} {...rest}>
        <div
          style={{
            transform: isInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
            opacity: isInView ? 1 : 0,
            transition: `transform ${duration}ms ${easeCurve} ${delay}ms, opacity ${duration}ms ${easeCurve} ${delay}ms`,
            willChange: 'transform, opacity',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'clip-reveal') {
    initialStyle = {
      clipPath: 'inset(0 0 100% 0)',
      WebkitClipPath: 'inset(0 0 100% 0)',
      opacity: 0,
      transform: 'translate3d(0, 10px, 0)',
    };
    revealedStyle = {
      clipPath: 'inset(0 0 0 0)',
      WebkitClipPath: 'inset(0 0 0 0)',
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    };
  } else if (variant === 'fade') {
    initialStyle = {
      opacity: 0,
    };
    revealedStyle = {
      opacity: 1,
    };
  } else {
    // Default 'fade-up': subtle 14px upward drift
    initialStyle = {
      opacity: 0,
      transform: 'translate3d(0, 14px, 0)',
    };
    revealedStyle = {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    };
  }

  const activeTransition = [
    `opacity ${duration}ms ${easeCurve} ${delay}ms`,
    `transform ${duration}ms ${easeCurve} ${delay}ms`,
    `clip-path ${duration}ms ${easeCurve} ${delay}ms`,
    `-webkit-clip-path ${duration}ms ${easeCurve} ${delay}ms`,
  ].join(', ');

  const Tag = Component as any;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(isInView ? revealedStyle : initialStyle),
        transition: activeTransition,
        willChange: 'transform, opacity',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
