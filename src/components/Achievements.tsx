import React from 'react';
import { ACHIEVEMENTS } from '../data/portfolioData.ts';
import { SectionContainer } from './SectionContainer.tsx';

export const Achievements: React.FC = () => {
  return (
    <SectionContainer
      id="achievements"
      label="Achievements"
      title="Contests, Workshops & Commitments"
      subtitle="Competitive programming finals, applied hardware labs, and active club involvement."
    >
      {/* Clean Editorial List Layout adhering strictly to verified achievements */}
      <div className="space-y-4">
        {ACHIEVEMENTS.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] transition-colors duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-1.5">
              <h3 className="text-sm sm:text-[15px] font-medium text-[var(--text-primary)] tracking-tight">
                {item.title}
              </h3>
              <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 self-start sm:self-auto pt-0.5">
                {item.period}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)] mb-2">
              <span>{item.subtitle}</span>
              {item.isOngoing && (
                <>
                  <span aria-hidden="true" className="opacity-50">·</span>
                  <span className="text-[var(--text-primary)]">Active Project</span>
                </>
              )}
            </div>

            {item.details && (
              <p className="text-[11px] sm:text-xs text-[var(--text-body)] leading-relaxed font-normal">
                {item.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};
