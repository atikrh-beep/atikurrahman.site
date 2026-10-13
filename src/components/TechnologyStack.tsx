import React from 'react';
import { TECH_ROW_TOP, TECH_ROW_BOTTOM } from '../data/portfolioData.ts';
import { TechIcon } from './Icons.tsx';

export const TechnologyStack: React.FC = () => {
  // Multiply rows into two identical halves to ensure a mathematically seamless, unbroken marquee sequence
  const oneHalfTop = [...TECH_ROW_TOP, ...TECH_ROW_TOP, ...TECH_ROW_TOP];
  const rowTopSequence = [...oneHalfTop, ...oneHalfTop];

  const oneHalfBottom = [...TECH_ROW_BOTTOM, ...TECH_ROW_BOTTOM, ...TECH_ROW_BOTTOM];
  const rowBottomSequence = [...oneHalfBottom, ...oneHalfBottom];

  return (
    <section
      id="stack"
      className="w-full py-8 sm:py-12 overflow-x-hidden"
      aria-label="Technologies, Platforms & Ecosystem"
    >
      {/* 
        Main portfolio section heading remains centered and constrained:
        Matches max-w-4xl mx-auto px-6 sm:px-8 exactly as other sections
      */}
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 space-y-4 mb-5">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-[var(--text-muted)] select-none">
            Technology & Stack
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Technologies, Platforms & Ecosystem
          </h2>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            Cloud infrastructure, foundational languages, and development environments.
          </p>
        </div>
      </div>

      {/* 
        FULL VIEWPORT FLOATING TICKER (SCREEN EDGE TO SCREEN EDGE)
        - Extends across the entire browser viewport width
        - Independent of the centered main portfolio container
        - Zero horizontal padding or edge gaps
        - Top Row: LEFT SCREEN EDGE → RIGHT SCREEN EDGE
        - Bottom Row: RIGHT SCREEN EDGE → LEFT SCREEN EDGE
      */}
      <div className="w-full overflow-hidden py-2 touch-pan-y">
        {/* TOP ROW: Moving Left → Right (LEFT SCREEN EDGE → RIGHT SCREEN EDGE) */}
        <div className="flex w-max animate-ticker-reverse select-none mb-2.5 touch-pan-y pointer-events-none">
          {rowTopSequence.map((item, idx) => (
            <div
              key={`top-${item.name}-${idx}`}
              className="inline-flex items-center gap-2 mx-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-body)] cursor-default select-none"
            >
              <span className="shrink-0">
                <TechIcon iconKey={item.iconKey} className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono font-medium tracking-tight whitespace-nowrap text-[var(--text-body)]">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* BOTTOM ROW: Moving Right → Left (RIGHT SCREEN EDGE → LEFT SCREEN EDGE) */}
        <div className="flex w-max animate-ticker-forward select-none touch-pan-y pointer-events-none">
          {rowBottomSequence.map((item, idx) => (
            <div
              key={`bottom-${item.name}-${idx}`}
              className="inline-flex items-center gap-2 mx-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-body)] cursor-default select-none"
            >
              <span className="shrink-0">
                <TechIcon iconKey={item.iconKey} className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono font-medium tracking-tight whitespace-nowrap text-[var(--text-body)]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
