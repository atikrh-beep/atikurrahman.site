import React, { useEffect, useRef } from 'react';
import { 
  CURSOR_COLORS, 
  CursorDriftState, 
  useIntroSequence 
} from '../hooks/useIntroSequence.ts';

export const CursorSwarmIntro: React.FC = () => {
  const {
    isActive,
    overlayOpacity,
    setOverlayOpacity,
    cleanup,
    getInViewportTargets,
  } = useIntroSequence();

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // 1. Prevent scrolling during the intro
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // 2. Setup hard safety timeout of 6 seconds
    const hardSafetyTimer = setTimeout(() => {
      cleanup();
    }, 6000);

    const isMobile = window.innerWidth < 768;
    const cursorCount = isMobile ? 8 : 14;
    const activeColors = CURSOR_COLORS.slice(0, cursorCount);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize 14 desktop / 8 mobile cursors entering from edges
    const cursors: CursorDriftState[] = activeColors.map((_, i) => {
      const edge = i % 4;
      let startX = 0;
      let startY = 0;
      if (edge === 0) { startX = Math.random() * width; startY = -30; }
      else if (edge === 1) { startX = width + 30; startY = Math.random() * height; }
      else if (edge === 2) { startX = Math.random() * width; startY = height + 30; }
      else { startX = -30; startY = Math.random() * height; }

      const restX = 80 + Math.random() * (width - 160);
      const restY = 80 + Math.random() * (height - 160);

      return {
        x: startX,
        y: startY,
        startX,
        startY,
        targetX: restX,
        targetY: restY,
        ctrlX: (startX + restX) / 2 + (Math.random() - 0.5) * 180,
        ctrlY: (startY + restY) / 2 + (Math.random() - 0.5) * 180,
        startTime: performance.now() + i * 35,
        duration: 900 + Math.random() * 300,
        phase: 'loading',
        noiseAngle: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.7,
      };
    });

    const introStartTime = performance.now();
    let currentStep = 0;
    let nextStepTime = 0;
    let targets: ReturnType<typeof getInViewportTargets> = [];
    let phase: 'phase1_loading' | 'phase2_building' | 'scatter' | 'done' = 'phase1_loading';

    // Helper bezier calculation
    const getBezierPoint = (p0: number, p1: number, p2: number, t: number) => {
      const invT = 1 - t;
      return invT * invT * p0 + 2 * invT * t * p1 + t * t * p2;
    };
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    // Trigger cursor flight to a specific data-intro target
    const triggerTargetStep = (stepIndex: number) => {
      if (stepIndex >= targets.length) {
        // All targets revealed: scatter off-screen
        phase = 'scatter';
        const now = performance.now();
        cursors.forEach((c, idx) => {
          c.startX = c.x;
          c.startY = c.y;
          const angle = (idx / cursors.length) * Math.PI * 2;
          c.targetX = c.x + Math.cos(angle) * (width * 0.85);
          c.targetY = c.y + Math.sin(angle) * (height * 0.85);
          c.ctrlX = (c.startX + c.targetX) / 2;
          c.ctrlY = (c.startY + c.targetY) / 2;
          c.startTime = now;
          c.duration = 550;
          c.phase = 'scatter';
        });

        // After cursors scatter, finish intro and unlock scroll
        setTimeout(() => {
          cleanup();
        }, 550);
        return;
      }

      const target = targets[stepIndex];
      const el = target.element;
      const rect = el.getBoundingClientRect();

      // Pick 2-3 cursors to work on this element
      const numWorkers = Math.min(3, cursors.length);
      const startIdx = (stepIndex * 2) % cursors.length;
      const assigned: number[] = [];
      for (let k = 0; k < numWorkers; k++) {
        assigned.push((startIdx + k) % cursors.length);
      }

      const now = performance.now();

      assigned.forEach((cIdx, k) => {
        const c = cursors[cIdx];
        c.startX = c.x;
        c.startY = c.y;

        // Position neatly on the element
        const destX = rect.left + 14 + (k * (rect.width - 28)) / Math.max(1, numWorkers - 1);
        const destY = rect.top + Math.min(rect.height / 2, 24);

        c.targetX = Math.max(20, Math.min(width - 30, destX));
        c.targetY = Math.max(20, Math.min(height - 30, destY));

        const midX = (c.startX + c.targetX) / 2;
        const midY = (c.startY + c.targetY) / 2;
        const arch = (k % 2 === 0 ? 1 : -1) * (50 + Math.random() * 40);
        c.ctrlX = midX + arch;
        c.ctrlY = midY - Math.abs(arch);

        c.startTime = now;
        c.duration = 380 + Math.random() * 80;
        c.phase = 'targeting';
      });

      // Moment cursor arrives on element: reveal step by step
      setTimeout(() => {
        el.classList.add('intro-animating');

        // After the 450ms reveal transition completes, clean up all classes and inline styles
        // so the element returns to its ORIGINAL style with ZERO leftover transform or filter
        setTimeout(() => {
          el.classList.remove('intro-animating', 'intro-pending');
          el.style.opacity = '';
          el.style.transform = '';
          el.style.filter = '';
          el.style.transition = '';
          el.style.willChange = '';
        }, 460);
      }, 380);

      // Stagger to next target element
      nextStepTime = now + 420;
    };

    // 60fps render loop
    const render = (time: number) => {
      const elapsed = time - introStartTime;

      // Phase 1 -> Phase 2 Transition at 1.35 seconds
      if (phase === 'phase1_loading' && elapsed >= 1350) {
        phase = 'phase2_building';
        // Dark overlay background fades out over 400ms so real page appears underneath
        setOverlayOpacity(0);
        targets = getInViewportTargets();
        currentStep = 0;
        triggerTargetStep(0);
      } else if (phase === 'phase2_building') {
        if (time >= nextStepTime && currentStep < targets.length) {
          currentStep += 1;
          triggerTargetStep(currentStep);
        }
      }

      // Update cursor positions
      cursors.forEach((c, idx) => {
        const el = cursorElementsRef.current[idx];
        if (!el) return;

        if (c.phase === 'targeting' || c.phase === 'scatter') {
          const progress = Math.min(1, Math.max(0, (time - c.startTime) / c.duration));
          const eased = easeInOutQuad(progress);
          c.x = getBezierPoint(c.startX, c.ctrlX, c.targetX, eased);
          c.y = getBezierPoint(c.startY, c.ctrlY, c.targetY, eased);

          if (progress >= 1 && c.phase === 'targeting') {
            c.phase = 'loading'; // wander gently around the element
            c.startX = c.x;
            c.startY = c.y;
          }
        } else {
          // Phase 1 loading & idle wandering: smooth curved paths, drifting and looping
          c.noiseAngle += 0.02 * c.speed;
          c.x += Math.cos(c.noiseAngle) * (1.2 * c.speed);
          c.y += Math.sin(c.noiseAngle * 0.8) * (1.1 * c.speed);

          // Soft bounce back if drifting near screen edges
          if (c.x < 30) c.noiseAngle = 0;
          if (c.x > width - 40) c.noiseAngle = Math.PI;
          if (c.y < 30) c.noiseAngle = Math.PI / 2;
          if (c.y > height - 40) c.noiseAngle = -Math.PI / 2;
        }

        const opacity = c.phase === 'scatter' ? Math.max(0, 1 - (time - c.startTime) / c.duration) : 1;
        el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
        el.style.opacity = `${opacity}`;
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      clearTimeout(hardSafetyTimer);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      cleanup();
    };
  }, [isActive, cleanup, getInViewportTargets, setOverlayOpacity]);

  if (!isActive) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const cursorCount = isMobile ? 8 : 14;
  const activeColors = CURSOR_COLORS.slice(0, cursorCount);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 
        Phase 1: Dark background overlay in #1B1A18.
        Phase 2: Fades out in 400ms so the real portfolio page becomes visible underneath.
        Plain dark screen with NO text, NO logos, NO counters, NO spinners.
      */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-400 ease-out"
        style={{
          backgroundColor: '#1B1A18',
          opacity: overlayOpacity,
        }}
      />

      {/* Plain Arrow Cursors: NO name tags, NO labels, NO extra UI */}
      <div className="absolute inset-0 pointer-events-none">
        {activeColors.map((color, idx) => (
          <div
            key={idx}
            ref={(node) => { cursorElementsRef.current[idx] = node; }}
            className="absolute top-0 left-0 will-change-transform pointer-events-none"
            style={{
              transform: 'translate3d(-100px, -100px, 0)',
            }}
          >
            {/* Plain arrow pointer in soft muted color */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ transform: 'rotate(-12deg)' }}
            >
              <path
                d="M3 3L10.07 20.97L13.58 13.58L20.97 10.07L3 3Z"
                fill={color}
                stroke="#1B1A18"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
