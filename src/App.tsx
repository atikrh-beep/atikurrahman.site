/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
import { HandwrittenSignature } from './components/HandwrittenSignature.tsx';
import { BottomNavigation } from './components/BottomNavigation.tsx';
import { Footer } from './components/Footer.tsx';
import { AtmosphericCloudOverlay } from './components/AtmosphericCloudOverlay.tsx';

function PortfolioContent() {
  const { activeRoute, navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] selection:bg-[var(--text-primary)]/15 selection:text-[var(--text-primary)] transition-colors duration-500 relative">
      {/* Website Header + Top-Right Dhaka Time & Theme Control with Circle Reveal */}
      <SiteHeader onNavigateHome={() => navigate('/')} />

      {/* Main Content Area based on active route */}
      <main className="space-y-0 min-h-[calc(100vh-200px)]">
        {activeRoute === 'home' && (
          <>
            <Hero />
            <About />
            <TechnologyStack />
            <Achievements />
            <Skills />
            <HandwrittenSignature />
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

      {/* Minimal Two-Column Footer */}
      <Footer />

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
