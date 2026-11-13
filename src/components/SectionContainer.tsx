import React from 'react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface SectionContainerProps {
  id?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
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
}) => {
  return (
    <section 
      id={id}
      className={`site-container py-8 sm:py-12 ${className}`}
      aria-label={title || label}
    >
      <div className="space-y-4">
        {/* Section Heading - Mask Reveal */}
        {label && (
          <div>
            <ScrollReveal variant="mask-up" duration={650}>
              <span className="inline-block text-[11px] uppercase tracking-widest font-mono text-[var(--text-muted)] select-none">
                {label}
              </span>
            </ScrollReveal>
          </div>
        )}

        {/* Title & Subtitle with progressive reveal */}
        {(title || subtitle) && (
          <div className="space-y-1">
            {title && (
              <ScrollReveal variant="mask-up" delay={60} duration={700}>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {title}
                </h2>
              </ScrollReveal>
            )}
            {subtitle && (
              <ScrollReveal variant="fade-up" delay={120} duration={650}>
                <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-normal leading-relaxed">
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
