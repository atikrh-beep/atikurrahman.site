/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { RevealProvider } from './context/RevealContext.tsx';
import { SiteHeader } from './components/SiteHeader.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { ProgrammingPage } from './components/ProgrammingPage.tsx';
import { NotesPage } from './components/NotesPage.tsx';
import { RoboticsPage } from './components/RoboticsPage.tsx';
import { TechnologyStack } from './components/TechnologyStack.tsx';
import { Achievements } from './components/Achievements.tsx';
import { Skills } from './components/Skills.tsx';
import { BottomNavigation } from './components/BottomNavigation.tsx';
import { Footer } from './components/Footer.tsx';
import { AtmosphericCloudOverlay } from './components/AtmosphericCloudOverlay.tsx';

function PortfolioContent() {
  const { activeRoute, navigate } = useRouter();
  const mainRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const [revealProgress, setRevealProgress] = useState<number>(0);
  const [useStickyCurtain, setUseStickyCurtain] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const measureCurtain = () => {
      rafId = null;
      const mainEl = mainRef.current;
      const footerEl = footerRef.current;
      if (!mainEl || !footerEl) return;

      const viewportHeight = window.innerHeight;
      const footerHeight = footerEl.getBoundingClientRect().height;
      const canStick = footerHeight > 0 && footerHeight < viewportHeight - 16;

      setUseStickyCurtain((prev) => (prev !== canStick ? canStick : prev));

      if (reducedMotionQuery.matches || !canStick || footerHeight <= 0) {
        setRevealProgress(1);
        return;
      }

      const mainRect = mainEl.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (viewportHeight - mainRect.bottom) / footerHeight));
      setRevealProgress((prev) => (Math.abs(prev - progress) > 0.001 ? progress : prev));
    };

    const scheduleMeasure = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(measureCurtain);
    };

    measureCurtain();

    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    reducedMotionQuery.addEventListener('change', scheduleMeasure);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      if (mainRef.current) resizeObserver.observe(mainRef.current);
      if (footerRef.current) resizeObserver.observe(footerRef.current);
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      reducedMotionQuery.removeEventListener('change', scheduleMeasure);
      resizeObserver?.disconnect();
    };
  }, [activeRoute]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] selection:bg-[var(--text-primary)]/15 selection:text-[var(--text-primary)] transition-colors duration-500 relative">
      {/* Website Header + Top-Right Dhaka Time & Theme Control */}
      <SiteHeader onNavigateHome={() => navigate('/')} />

      {/* Main Content Area (acts as foreground curtain sliding over the sticky footer) */}
      <main
        ref={mainRef}
        className="relative z-[1] bg-[var(--bg-page)] rounded-b-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_28px_50px_rgba(0,0,0,0.55)] transition-colors duration-500 space-y-0 min-h-[calc(100vh-200px)]"
      >
        {activeRoute === 'home' && (
          <>
            <Hero />
            <About />
            <TechnologyStack />
            <Achievements />
            <Skills />
          </>
        )}

        {activeRoute === 'notes' && (
          <NotesPage onBackToHome={() => navigate('/')} />
        )}

        {activeRoute === 'code' && (
          <ProgrammingPage onBackToHome={() => navigate('/')} />
        )}

        {activeRoute === 'robotics' && (
          <RoboticsPage onBackToHome={() => navigate('/')} />
        )}
      </main>

      {/* Curtain-Revealed Signature & Minimal Two-Column Footer */}
      <Footer
        footerRef={footerRef}
        revealProgress={revealProgress}
        useStickyCurtain={useStickyCurtain}
      />

      {/* Atmospheric Cloud / Mist Scroll Transition Overlay */}
      <AtmosphericCloudOverlay />

      {/* Fixed Bottom Dock Navigation (Home | Notes | Code | IoT & Robotics | @) */}
      <BottomNavigation />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <RevealProvider>
          <PortfolioContent />
        </RevealProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}
