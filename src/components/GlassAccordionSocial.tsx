import React, { useState } from 'react';
import { SOCIAL_NAV_ITEMS, SocialNavItem } from '../data/portfolioData.ts';

interface GlassAccordionSocialProps {
  className?: string;
}

/**
 * White Glass Accordion Social Navigation (Example 26 Style)
 * - Pure text labels, absolutely no logos or decorative icons
 * - Connected horizontal accordion capsule with expanding active item
 * - Soft translucent glass surface with backdrop blur
 * - Left-aligned with About section text
 * - Adapts to light and dark themes
 */
export const GlassAccordionSocial: React.FC<GlassAccordionSocialProps> = ({ className = '' }) => {
  // Default first item (Instagram) as active, track hovered item for preview expansion
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Active item receives horizontal expansion and visual emphasis
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;

  return (
    <nav 
      aria-label="Social media profiles"
      className={`relative inline-flex max-w-full overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {/* 
        WHITE GLASS ACCORDION CAPSULE
        - Light mode: refined white translucent glass surface with soft border & subtle shadow
        - Dark mode: deep charcoal translucent glass surface with delicate light border
      */}
      <div 
        onMouseLeave={() => setHoveredIndex(null)}
        className="relative flex items-center p-1 sm:p-1.5 rounded-full border border-[#E5E5E5] dark:border-white/[0.1] bg-white/85 dark:bg-[#1A1C20]/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-colors duration-300 gap-0.5 sm:gap-1 select-none"
      >
        {SOCIAL_NAV_ITEMS.map((item: SocialNavItem, index: number) => {
          const isExpanded = activeIndex === index;

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(index)}
              aria-label={`${item.name} profile`}
              className={`
                relative flex items-center justify-center whitespace-nowrap rounded-full
                text-xs sm:text-[13px] tracking-tight sm:tracking-normal cursor-pointer
                transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)]
                ${
                  isExpanded
                    ? 'px-3.5 sm:px-5 py-1 sm:py-1.5 font-medium text-[#171717] dark:text-white bg-white dark:bg-[#23262D] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-none border border-[#E5E5E5] dark:border-white/[0.08]'
                    : 'px-2 sm:px-3 py-1 sm:py-1.5 font-normal text-[#737373] dark:text-neutral-400 hover:text-[#171717] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.04] border border-transparent'
                }
              `}
            >
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
