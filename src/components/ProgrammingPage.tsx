import React from 'react';
import { 
  PROGRAMMING_DESCRIPTION, 
  PROGRAMMING_STATS, 
  PROGRAMMING_PROFILES 
} from '../data/portfolioData.ts';
import { VJudgeIcon, TophIcon, BeecrowdIcon } from './Icons.tsx';

interface ProgrammingPageProps {
  onBackToHome?: () => void;
}

export const ProgrammingPage: React.FC<ProgrammingPageProps> = ({ onBackToHome }) => {
  const getPlatformIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'vjudge':
        return <VJudgeIcon className="w-4 h-4" />;
      case 'toph':
        return <TophIcon className="w-4 h-4" />;
      case 'beecrowd':
        return <BeecrowdIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-24 animate-fade-in"
      aria-label="Programming Page"
    >
      {/* Editorial Page Heading */}
      <div className="space-y-3 mb-10 sm:mb-12">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150 mb-3 cursor-pointer select-none focus:outline-none focus-visible:underline"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-mono text-[var(--text-muted)] select-none">
            Competitive Problem Solving
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-[1.15]">
          Programming
        </h1>

        {/* Short & elegant description */}
        <p className="text-sm sm:text-[15px] text-[var(--text-body)] font-normal leading-relaxed max-w-2xl pt-1">
          {PROGRAMMING_DESCRIPTION}
        </p>
      </div>

      {/* 
        PROGRAMMING STATISTICS BAR:
        - Exactly one minimalistic horizontal statistics bar
        - Exactly three separate statistic sections:
            120 Problems Solved | 4 Contests Participated | 3 Platforms
        - Subtle, elegant vertical divider lines between them
        - Hover interaction:
            Very subtle light background highlight on individual section with smooth transition
            No glowing, no bright colors, no large animations
        - Mobile responsive: cleanly resizes or stacks naturally while remaining one unified component
      */}
      <div className="mb-12 sm:mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)] select-none">
          {PROGRAMMING_STATS.map((stat) => (
            <div
              key={stat.id}
              className="group p-5 sm:p-6 flex flex-col justify-center transition-colors duration-200 hover:bg-[var(--accent-tint)] cursor-default"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)] font-mono leading-none mb-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                {stat.value}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)] tracking-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 
        SUBSECTION: PROFILES (NOT "Profiles & Activity")
        - Cleanly lists VJudge, Toph, and Beecrowd
        - Minimal icons, handles, and "View Profile →" actions
      */}
      <div className="space-y-5">
        <div className="pb-2.5 border-b border-[var(--border-subtle)]">
          <h2 className="text-[11px] uppercase tracking-widest font-mono text-[var(--text-muted)] select-none">
            Profiles
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {PROGRAMMING_PROFILES.map((profile) => (
            <div
              key={profile.id}
              className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 transition-transform duration-200 group-hover:scale-105">
                  {getPlatformIcon(profile.iconKey)}
                </span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)] font-mono">
                    {profile.name}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    @{profile.handle}
                  </span>
                </div>
              </div>

              {/* Minimal "View Profile →" link */}
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-primary)] hover:underline focus:outline-none self-start sm:self-auto cursor-pointer"
                title={`Open ${profile.name} Profile`}
              >
                <span>View Profile</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
