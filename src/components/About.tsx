import React from 'react';
import { ABOUT_TEXT, DISCORD_INVITE_URL } from '../data/portfolioData.ts';
import { SocialBar } from './SocialBar.tsx';
import { DiscordIcon } from './Icons.tsx';
import { SectionContainer } from './SectionContainer.tsx';

export const About: React.FC = () => {
  return (
    <SectionContainer 
      id="about" 
      label="About"
    >
      <div className="space-y-6">
        {/* Description */}
        <p className="text-[15px] sm:text-base text-[var(--text-body)] leading-relaxed font-normal">
          {ABOUT_TEXT}
        </p>

        {/* Social Links directly after description */}
        <div className="pt-1">
          <SocialBar />
        </div>

        {/* Existing action button following the social links */}
        <div className="pt-1">
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] text-xs font-mono text-[var(--text-primary)] transition-all duration-200"
            title="Join private Discord server"
          >
            <DiscordIcon className="w-3.5 h-3.5" />
            <span>Private Discord</span>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </div>
      </div>
    </SectionContainer>
  );
};
