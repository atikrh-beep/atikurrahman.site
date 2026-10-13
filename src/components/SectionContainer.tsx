import React from 'react';

interface SectionContainerProps {
  id?: string;
  label: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Vertical Section Layout
 * Ensures heading, title, subtitle, and content stay together in the main content area:
 * - Label / Heading at top
 * - Title & Subtitle directly below (if present)
 * - Section content directly below
 * - Identical structure in both full-screen and non-full-screen modes
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
      className={`w-full max-w-4xl mx-auto px-6 sm:px-8 py-8 sm:py-12 ${className}`}
      aria-label={title || label}
    >
      <div className="space-y-4">
        {/* Section Heading */}
        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-[var(--text-muted)] select-none">
            {label}
          </span>
        </div>

        {/* Title & Subtitle if present */}
        {(title || subtitle) && (
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-normal leading-relaxed">
                {subtitle}
              </p>
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
