import React from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData.ts';
import { SectionContainer } from './SectionContainer.tsx';

export const Skills: React.FC = () => {
  return (
    <SectionContainer
      id="skills"
      label="Skills"
      title="Competencies & Tooling"
      subtitle="Structured representation of programming languages, foundational computer science, and practical tooling."
    >
      {/* Visual Hierarchy Layout - Zero Fake Percentages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SKILL_CATEGORIES.map((category) => (
          <div
            key={category.title}
            className="p-4 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] transition-colors duration-200"
          >
            <h3 className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] tracking-tight mb-1">
              {category.title}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-3 leading-relaxed">
              {category.description}
            </p>

            {/* Clean unboxed tags with subtle hairline border */}
            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[11px] font-mono text-[var(--text-body)] rounded border border-[var(--border-subtle)] bg-[var(--accent-tint)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};
