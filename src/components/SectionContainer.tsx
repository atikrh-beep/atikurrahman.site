import React from 'react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface SectionContainerProps {
  id?: string;
  label: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  dataIntroHeading?: string;
}

/**
 * Vertical Section Layout with refined scroll-driven reveal transitions
 * Ensures heading, title, subtitle, and content stay together in the main content area.
 */
export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  label,
  title,
  subtitle,
  children,
  className = '',
  dataIntroHeading,
}) => {
  return (
    <section 
      id={id}
      className={`w-full max-w-5xl mx-auto px-6 sm:px-10 py-14 sm:py-20 ${className}`}
      aria-label={title || label}
    >
      <div className="space-y-6">
        {/* Section Heading - Mask Reveal */}
        <div data-intro={dataIntroHeading}>
          <ScrollReveal variant="mask-up" duration={650}>
            <span className="inline-block text-[10px] uppercase tracking-[0.24em] font-mono text-[var(--accent)] select-none">
              {label}
            </span>
          </ScrollReveal>
        </div>

        {/* Title & Subtitle with progressive reveal */}
        {(title || subtitle) && (
          <div className="space-y-1">
            {title && (
              <ScrollReveal variant="mask-up" delay={60} duration={700}>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  {title}
                </h2>
              </ScrollReveal>
            )}
            {subtitle && (
              <ScrollReveal variant="fade-up" delay={120} duration={650}>
                <p className="text-sm text-[var(--text-muted)] font-normal leading-relaxed max-w-xl">
                  {subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* Section Content */}
        <div className="pt-1">
          {children}
        </div>
      </div>
    </section>
  );
};
