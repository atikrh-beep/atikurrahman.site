import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FULL_NAME } from '../data/portfolioData.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useReveal } from '../context/RevealContext.tsx';

export interface SignatureFooterProps {
  revealProgress?: number;
  isCurtainOpen?: boolean;
  className?: string;
}

interface InkParticle {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  vx: number;
  vy: number;
}

const DARK_BG_HEX = '#121316';
const LIGHT_BG_HEX = '#FFFFFF';
const DARK_FADE_FILL = 'rgba(18, 19, 22, 0.035)';
const LIGHT_FADE_FILL = 'rgba(255, 255, 255, 0.035)';

const STATIC_BLOOMS = [
  { rx: 0.16, ry: 0.34, r: 58 },
  { rx: 0.25, ry: 0.56, r: 74 },
  { rx: 0.34, ry: 0.28, r: 52 },
  { rx: 0.42, ry: 0.62, r: 68 },
  { rx: 0.48, ry: 0.42, r: 84 },
  { rx: 0.55, ry: 0.54, r: 76 },
  { rx: 0.63, ry: 0.32, r: 64 },
  { rx: 0.71, ry: 0.58, r: 72 },
  { rx: 0.79, ry: 0.36, r: 54 },
  { rx: 0.85, ry: 0.52, r: 66 },
  { rx: 0.29, ry: 0.44, r: 60 },
  { rx: 0.59, ry: 0.46, r: 70 },
];

export const SignatureFooter: React.FC<SignatureFooterProps> = ({
  revealProgress = 1,
  isCurtainOpen = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const { isSiteLoaded } = useReveal();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const isDarkRef = useRef<boolean>(theme === 'dark');
  const reducedMotionRef = useRef<boolean>(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;

  const isInViewportRef = useRef<boolean>(false);
  const isCurtainOpenRef = useRef<boolean>(isCurtainOpen);
  isCurtainOpenRef.current = isCurtainOpen;

  const isSiteLoadedRef = useRef<boolean>(isSiteLoaded);
  isSiteLoadedRef.current = isSiteLoaded;

  const particlesRef = useRef<InkParticle[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const trailFadeFramesRef = useRef<number>(0);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const moveDistAccumRef = useRef<number>(0);
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const hasOpeningBloomRef = useRef<boolean>(false);

  const getMaxParticles = () => {
    if (typeof window === 'undefined') return 220;
    return window.innerWidth < 768 ? 120 : 220;
  };

  const fillSolidBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = isDarkRef.current ? DARK_BG_HEX : LIGHT_BG_HEX;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const drawStaticBlooms = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      fillSolidBackground(ctx, width, height);
      const isDark = isDarkRef.current;

      for (const b of STATIC_BLOOMS) {
        const x = b.rx * width;
        const y = b.ry * height;
        const r = b.r;

        if (isDark) {
          ctx.globalCompositeOperation = 'lighter';
          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, 'rgba(236, 190, 100, 0.14)');
          grad.addColorStop(0.55, 'rgba(223, 177, 91, 0.05)');
          grad.addColorStop(1, 'rgba(223, 177, 91, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        } else {
          ctx.globalCompositeOperation = 'source-over';
          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, 'rgba(168, 118, 40, 0.14)');
          grad.addColorStop(0.55, 'rgba(168, 118, 40, 0.05)');
          grad.addColorStop(1, 'rgba(168, 118, 40, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    [fillSolidBackground]
  );

  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastFrameTimeRef.current = 0;
  }, []);

  const canAnimate = useCallback(() => {
    return (
      !reducedMotionRef.current &&
      isSiteLoadedRef.current &&
      isInViewportRef.current &&
      isCurtainOpenRef.current &&
      typeof document !== 'undefined' &&
      !document.hidden
    );
  }, []);

  const renderFrame = useCallback(
    (now: number) => {
      if (!canAnimate()) {
        stopLoop();
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const { width, height } = canvasSizeRef.current;
      if (!canvas || !ctx || width <= 0 || height <= 0) {
        stopLoop();
        return;
      }

      const dt = lastFrameTimeRef.current > 0 ? Math.min(48, now - lastFrameTimeRef.current) : 16.6667;
      lastFrameTimeRef.current = now;
      const step = Math.min(2, Math.max(0.4, dt / 16.6667));

      // Paint subtle background veil (~0.035 alpha) for organic trail persistence
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = isDarkRef.current ? DARK_FADE_FILL : LIGHT_FADE_FILL;
      ctx.fillRect(0, 0, width, height);

      const list = particlesRef.current;
      const isDark = isDarkRef.current;

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];

        const a = Math.sin(p.x * 0.01 + now * 0.0004) + Math.cos(p.y * 0.012 - now * 0.0003);
        p.vx += Math.cos(a * 2) * 0.02 * step;
        p.vy += Math.sin(a * 2) * 0.02 * step;

        const damp = Math.pow(0.97, step);
        p.vx *= damp;
        p.vy *= damp;

        p.x += p.vx * step;
        p.y += p.vy * step;
        p.r += (p.maxR - p.r) * (1 - Math.pow(1 - 0.02, step));
        p.life -= 0.0045 * step;

        if (p.life <= 0) {
          list.splice(i, 1);
          continue;
        }

        if (isDark) {
          ctx.globalCompositeOperation = 'lighter';
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(236, 190, 100, ${(0.055 * p.life).toFixed(4)})`);
          grad.addColorStop(1, 'rgba(223, 177, 91, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        } else {
          ctx.globalCompositeOperation = 'source-over';
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(168, 118, 40, ${(0.072 * p.life).toFixed(4)})`);
          grad.addColorStop(0.55, `rgba(168, 118, 40, ${(0.028 * p.life).toFixed(4)})`);
          grad.addColorStop(1, 'rgba(168, 118, 40, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (list.length > 0) {
        trailFadeFramesRef.current = 90;
        rafIdRef.current = requestAnimationFrame(renderFrame);
      } else if (trailFadeFramesRef.current > 0) {
        trailFadeFramesRef.current -= 1;
        rafIdRef.current = requestAnimationFrame(renderFrame);
      } else {
        fillSolidBackground(ctx, width, height);
        stopLoop();
      }
    },
    [canAnimate, fillSolidBackground, stopLoop]
  );

  const ensureLoopRunning = useCallback(() => {
    if (rafIdRef.current === null && canAnimate()) {
      if (particlesRef.current.length > 0 || trailFadeFramesRef.current > 0) {
        lastFrameTimeRef.current = performance.now();
        rafIdRef.current = requestAnimationFrame(renderFrame);
      }
    }
  }, [canAnimate, renderFrame]);

  const spawnParticles = useCallback(
    (x: number, y: number, count: number, maxRMin: number, maxRMax: number, velocitySpread: number) => {
      if (reducedMotionRef.current) return;

      const list = particlesRef.current;
      const maxParticles = getMaxParticles();

      for (let i = 0; i < count; i++) {
        if (list.length >= maxParticles) {
          list.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * velocitySpread;
        list.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          r: 5 + Math.random() * 2,
          maxR: maxRMin + Math.random() * (maxRMax - maxRMin),
          life: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }

      trailFadeFramesRef.current = 90;
      ensureLoopRunning();
    },
    [ensureLoopRunning]
  );

  // Sync theme via React state + DOM class MutationObserver
  useEffect(() => {
    const syncThemeFromDom = () => {
      const domIsDark = !document.documentElement.classList.contains('light');
      if (isDarkRef.current !== domIsDark) {
        isDarkRef.current = domIsDark;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const { width, height } = canvasSizeRef.current;
        if (canvas && ctx && width > 0 && height > 0) {
          if (reducedMotionRef.current) {
            drawStaticBlooms(ctx, width, height);
          } else {
            fillSolidBackground(ctx, width, height);
          }
        }
      }
    };

    isDarkRef.current = theme === 'dark';
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const { width, height } = canvasSizeRef.current;
    if (canvas && ctx && width > 0 && height > 0) {
      if (reducedMotionRef.current) {
        drawStaticBlooms(ctx, width, height);
      } else {
        fillSolidBackground(ctx, width, height);
      }
    }

    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(syncThemeFromDom);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [theme, drawStaticBlooms, fillSolidBackground]);

  // Listen for OS prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      reducedMotionRef.current = e.matches;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const { width, height } = canvasSizeRef.current;

      if (e.matches) {
        particlesRef.current = [];
        stopLoop();
        if (canvas && ctx && width > 0 && height > 0) {
          drawStaticBlooms(ctx, width, height);
        }
      } else {
        if (canvas && ctx && width > 0 && height > 0) {
          fillSolidBackground(ctx, width, height);
        }
        ensureLoopRunning();
      }
    };

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [drawStaticBlooms, ensureLoopRunning, fillSolidBackground, stopLoop]);

  // ResizeObserver with DPR capped at 2
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvasSizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (reducedMotionRef.current) {
          drawStaticBlooms(ctx, width, height);
        } else {
          fillSolidBackground(ctx, width, height);
        }
      }
    };

    updateSize();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [drawStaticBlooms, fillSolidBackground]);

  // IntersectionObserver to pause offscreen
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') {
      isInViewportRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isInViewportRef.current = entry.isIntersecting;
          if (entry.isIntersecting && canAnimate()) {
            ensureLoopRunning();
          } else if (!entry.isIntersecting) {
            stopLoop();
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canAnimate, ensureLoopRunning, stopLoop]);

  // React to curtain reveal visibility or site-loaded transitions
  useEffect(() => {
    if (isCurtainOpen && isSiteLoaded && !prefersReducedMotion) {
      if (!hasOpeningBloomRef.current) {
        const { width, height } = canvasSizeRef.current;
        if (width > 0 && height > 0) {
          hasOpeningBloomRef.current = true;
          spawnParticles(width * 0.5, height * 0.45, 3, 45, 78, 0.35);
        }
      } else {
        ensureLoopRunning();
      }
    } else if (!isCurtainOpen) {
      stopLoop();
    }
  }, [isCurtainOpen, isSiteLoaded, prefersReducedMotion, ensureLoopRunning, spawnParticles, stopLoop]);

  // Idle bloom every ~1500ms within top 75% of canvas
  useEffect(() => {
    if (prefersReducedMotion || !isSiteLoaded) return;

    const intervalId = window.setInterval(() => {
      if (!canAnimate()) return;
      const { width, height } = canvasSizeRef.current;
      if (width <= 0 || height <= 0) return;

      const x = width * (0.12 + Math.random() * 0.76);
      const y = height * (0.1 + Math.random() * 0.65); // within top 75%
      spawnParticles(x, y, 1, 48, 82, 0.25);
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion, isSiteLoaded, canAnimate, spawnParticles]);

  // Visibility API pause/resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        ensureLoopRunning();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopLoop();
    };
  }, [ensureLoopRunning, stopLoop]);

  const getRelativeCoords = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || e.pointerType === 'touch') return;
    const coords = getRelativeCoords(e.clientX, e.clientY);
    if (!coords) return;

    const prev = lastPointerPosRef.current;
    if (prev) {
      const dist = Math.hypot(coords.x - prev.x, coords.y - prev.y);
      moveDistAccumRef.current += dist;
      if (moveDistAccumRef.current >= 10) {
        const steps = Math.min(3, Math.floor(moveDistAccumRef.current / 10));
        moveDistAccumRef.current %= 10;
        spawnParticles(coords.x, coords.y, steps * 3, 40, 70, 0.45);
      }
    }

    lastPointerPosRef.current = coords;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return;
    const coords = getRelativeCoords(e.clientX, e.clientY);
    if (!coords) return;

    spawnParticles(coords.x, coords.y, 10, 40, 100, 0.85);
  };

  const handlePointerLeave = () => {
    lastPointerPosRef.current = null;
    moveDistAccumRef.current = 0;
  };

  const clampedProgress = prefersReducedMotion
    ? 1
    : Math.max(0, Math.min(1, revealProgress));
  const wordmarkTranslateY = -24 * (1 - clampedProgress);
  const wordmarkOpacity = 0.3 + 0.7 * clampedProgress;
  const wordmarkScale = 0.97 + 0.03 * clampedProgress;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      aria-label={`${FULL_NAME} — Designed and built in Dhaka`}
      className={`relative w-full h-[240px] md:h-[300px] rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-page)] overflow-hidden touch-pan-y select-none transition-colors duration-500 ${className}`}
    >
      {/* Live Ink-Bloom Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      />

      {/* Centered Editorial Signature Wordmark Overlay (curtain reveal transform only here) */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        style={{
          transform: `translate3d(0, ${wordmarkTranslateY.toFixed(2)}px, 0) scale(${wordmarkScale.toFixed(4)})`,
          opacity: wordmarkOpacity,
          willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
        }}
      >
        <p
          className="text-[var(--signature-color)] font-light leading-[1.15] m-0 select-text pointer-events-auto"
          style={{
            fontWeight: 300,
            fontSize: 'clamp(28px, 6vw, 44px)',
            letterSpacing: '0.02em',
          }}
        >
          {FULL_NAME}
        </p>
        <p className="mt-2 text-[11px] sm:text-xs font-normal tracking-wide text-[var(--text-muted)] m-0 select-text pointer-events-auto">
          Designed and built in Dhaka
        </p>
      </div>
    </div>
  );
};
