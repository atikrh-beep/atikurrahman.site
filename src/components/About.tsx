import React from 'react';
import { ABOUT_TEXT } from '../data/portfolioData.ts';
import { SectionContainer } from './SectionContainer.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { GlassSocialPill } from './GlassSocialPill.tsx';

export const About: React.FC = () => {
  return (
    <SectionContainer 
      id="about" 
      label="About"
    >
      <div className="space-y-6">
        {/* Description - Gradually unmasks as the visitor scrolls */}
        <ScrollReveal variant="fade-up" delay={40} duration={700}>
          <p className="text-[15px] sm:text-base text-[var(--text-body)] leading-relaxed font-normal">
            {ABOUT_TEXT}
          </p>
        </ScrollReveal>

        {/* Floating Glass Pill - Left-aligned with the About text */}
        <ScrollReveal variant="fade-up" delay={100} duration={650}>
          <div className="flex justify-start w-fit">
            <GlassSocialPill />
          </div>
        </ScrollReveal>
      </div>
    </SectionContainer>
  );
};
