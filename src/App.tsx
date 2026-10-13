/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteHeader } from './components/SiteHeader.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { ProgrammingPage } from './components/ProgrammingPage.tsx';
import { TechnologyStack } from './components/TechnologyStack.tsx';
import { Achievements } from './components/Achievements.tsx';
import { Skills } from './components/Skills.tsx';
import { HandwrittenSignature } from './components/HandwrittenSignature.tsx';
import { BottomNavigation, NavTarget } from './components/BottomNavigation.tsx';
import { Footer } from './components/Footer.tsx';
import { AtmosphericCloudOverlay } from './components/AtmosphericCloudOverlay.tsx';
import { recordPublicVisit } from './services/visitorStats.ts';

export default function App() {
  // Dark mode is the primary default experience
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Dedicated view switching: 'home' vs 'programming'
  const [currentView, setCurrentView] = useState<'home' | 'programming'>('home');

  const [radialOverlay, setRadialOverlay] = useState<{
    x: number;
    y: number;
    targetTheme: 'dark' | 'light';
    active: boolean;
  } | null>(null);

  // Automatically count public portfolio visit (exact 1 increment, admin excluded)
  useEffect(() => {
    recordPublicVisit();
  }, []);

  // Initialize theme class on document element
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Soft radial reveal theme toggle handler
  const handleToggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const x = event.clientX;
    const y = event.clientY;

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const doc = document as any;
      const transition = doc.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 550,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      setRadialOverlay({ x, y, targetTheme: nextTheme, active: true });
      setTimeout(() => {
        setTheme(nextTheme);
      }, 250);
      setTimeout(() => {
        setRadialOverlay(null);
      }, 600);
    }
  };

  // Coordinated navigation handler between views and section scrolling
  const handleNavigate = (target: NavTarget) => {
    if (target === 'programming') {
      setCurrentView('programming');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigating to a Home section (home, about, stack, achievements)
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        if (target === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 60);
    } else {
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] selection:bg-[var(--text-primary)]/15 selection:text-[var(--text-primary)] transition-colors duration-500">
      {/* Website Identity Header (atikurrahman.site) + Top-Right Dhaka Time & Theme Control */}
      <SiteHeader 
        onNavigateHome={() => handleNavigate('home')} 
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area based on current view */}
      <main className="space-y-0 min-h-[calc(100vh-200px)]">
        {currentView === 'home' ? (
          <>
            <Hero />
            <About />
            <TechnologyStack />
            <Achievements />
            <Skills />
            <HandwrittenSignature />
          </>
        ) : (
          <ProgrammingPage onBackToHome={() => handleNavigate('home')} />
        )}
      </main>

      {/* Minimal Two-Column Footer */}
      <Footer />

      {/* Atmospheric Cloud / Mist Scroll Transition Overlay */}
      <AtmosphericCloudOverlay theme={theme} />

      {/* Fixed Bottom Dock Navigation (Home | About | Programming | Technology & Stack | Achievement) */}
      <BottomNavigation
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Fallback Radial Transition Overlay */}
      {radialOverlay && radialOverlay.active && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999] transition-all duration-550 ease-in-out"
          style={{
            clipPath: `circle(150vmax at ${radialOverlay.x}px ${radialOverlay.y}px)`,
            backgroundColor: radialOverlay.targetTheme === 'dark' ? '#1B1A18' : '#F7F3EA',
            opacity: 0.15,
          }}
        />
      )}
    </div>
  );
}
