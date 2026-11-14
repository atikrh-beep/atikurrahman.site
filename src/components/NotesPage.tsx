import React from 'react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface NotesPageProps {
  onBackToHome?: () => void;
  onSelectNote?: (slug: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({ onBackToHome }) => {
  return (
    <div 
      className="site-container pt-12 sm:pt-20 pb-14 sm:pb-16"
      aria-label="Notes Page"
    >
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
            Knowledge & Perspectives
          </span>
        </ScrollReveal>

        {/* Primary Page Title */}
        <ScrollReveal variant="mask-up" delay={80} duration={700}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-[1.15] mb-6">
            Notes
          </h1>
        </ScrollReveal>

        {/* Minimal, elegant under development message */}
        <ScrollReveal variant="fade-up" delay={140} duration={650}>
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)] font-serif italic">
              Notes are under development.
            </h2>
            <p className="text-sm sm:text-[15px] text-[var(--text-body)] leading-relaxed font-normal">
              Personal reflections, philosophical perspectives, thoughts on technology and society, Java programming notes, and foundational computer science concepts will be published here as they are written and curated.
            </p>
          </div>
        </ScrollReveal>

        {/* Intentional Under-Development Status Notice */}
        <ScrollReveal variant="fade-up" delay={200} duration={700}>
          <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 backdrop-blur-sm max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Status: In Preparation
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed font-normal">
              Structured concept summaries, technical learning resources, and personal essays are currently being prepared.
            </p>
          </div>
      </ScrollReveal>
    </div>
  );
};
