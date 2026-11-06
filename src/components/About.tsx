import React from 'react';
import { ABOUT_TEXT, DISCORD_INVITE_URL } from '../data/portfolioData.ts';
import { SocialBar } from './SocialBar.tsx';
import { DiscordIcon } from './Icons.tsx';
import { SectionContainer } from './SectionContainer.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

export const About: React.FC = () => {
  return (
    <SectionContainer 
      id="about" 
      label="About"
      dataIntroHeading="3"
    >
      <div className="space-y-6">
        {/* Description - Gradually unmasks as the visitor scrolls */}
        <ScrollReveal variant="fade-up" delay={40} duration={700}>
          <p data-intro="4" className="text-[15px] sm:text-base text-[var(--text-body)] leading-relaxed font-normal">
            {ABOUT_TEXT}
          </p>
        </ScrollReveal>

        {/* Social Links directly after description */}
        <ScrollReveal variant="fade-up" delay={100} duration={650}>
          <div data-intro="5" className="pt-1">
            <SocialBar />
          </div>
        </ScrollReveal>

        {/* Existing action button following the social links */}
        <ScrollReveal variant="fade-up" delay={160} duration={600}>
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
        </ScrollReveal>
      </div>
    </SectionContainer>
  );
};

