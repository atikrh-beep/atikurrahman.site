import React from 'react';
import { ScrollReveal } from './ScrollReveal.tsx';
import { HandwrittenSignature } from './HandwrittenSignature.tsx';

interface RoboticsPageProps {
  onBackToHome?: () => void;
  onSelectProject?: (slug: string) => void;
}

export const RoboticsPage: React.FC<RoboticsPageProps> = ({ onBackToHome }) => {
  return (
    <div 
      className="w-full max-w-4xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-28 min-h-[70vh] flex flex-col justify-between"
      aria-label="IoT and Robotics Page"
    >
      <div>
        {/* Back navigation */}
        {onBackToHome && (
          <ScrollReveal variant="fade-up" duration={500}>
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150 mb-6 cursor-pointer select-none focus:outline-none focus-visible:underline"
            >
              <span>←</span>
              <span>Back to Home</span>
            </button>
          </ScrollReveal>
        )}

        {/* Category kicker */}
        <ScrollReveal variant="mask-up" delay={40} duration={650}>
          <span className="inline-block text-xs uppercase tracking-widest font-mono text-[var(--text-muted)] select-none mb-2">
            Hardware & Embedded Systems
          </span>
        </ScrollReveal>

        {/* Primary Page Title */}
        <ScrollReveal variant="mask-up" delay={80} duration={700}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-[1.15] mb-6">
            IoT & Robotics
          </h1>
        </ScrollReveal>

        {/* Minimal, elegant under development message matching Notes page */}
        <ScrollReveal variant="fade-up" delay={140} duration={650}>
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)] font-serif italic">
              IoT & Robotics — Under Development.
            </h2>
            <p className="text-sm sm:text-[15px] text-[var(--text-body)] leading-relaxed font-normal">
              Robotics systems, microcontroller architectures, sensor integration experiments, and future embedded hardware projects will appear here as builds are completed and documented.
            </p>
          </div>
        </ScrollReveal>

        {/* Intentional Under-Development Status Notice */}
        <ScrollReveal variant="fade-up" delay={200} duration={700}>
          <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 backdrop-blur-sm max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Status: In Preparation
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed font-normal">
              Physical microcontroller builds, hardware schematics, and sensor control routines are currently in development.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Signature at page base */}
      <div className="mt-20">
        <HandwrittenSignature />
      </div>
    </div>
  );
};
