import React from 'react';
import { DhakaTimeThemeControl } from './DhakaTimeThemeControl.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

interface SiteHeaderProps {
  onNavigateHome?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ 
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="relative w-full max-w-4xl mx-auto px-6 sm:px-8 pt-8 sm:pt-10 flex items-center justify-end">
      {/* Top-Right Dhaka Time & Theme Switch locked to master container */}
      <ScrollReveal variant="fade-up" delay={60} duration={650}>
        <DhakaTimeThemeControl
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      </ScrollReveal>
    </header>
  );
};
