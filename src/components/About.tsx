import React from 'react';
import { ABOUT_TEXT } from '../data/portfolioData.ts';
import { SectionContainer } from './SectionContainer.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { GlassAccordionSocial } from './GlassAccordionSocial.tsx';

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

        {/* White Glass Accordion Social Navigation — Left-aligned with About text */}
        <div className="pt-2 flex justify-start">
          <ScrollReveal variant="fade-up" delay={80} duration={650}>
            <GlassAccordionSocial />
          </ScrollReveal>
        </div>
      </div>
    </SectionContainer>
  );
};
