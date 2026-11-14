import React from 'react';
import { FULL_NAME, UNIVERSITY_NAME, UNIVERSITY_DEPARTMENT } from '../data/portfolioData.ts';
import { SignatureFooter } from './SignatureFooter.tsx';

interface FooterProps {
  revealProgress?: number;
  useStickyCurtain?: boolean;
  footerRef?: React.RefObject<HTMLElement | null>;
}

export const Footer: React.FC<FooterProps> = ({
  revealProgress = 1,
  useStickyCurtain = false,
  footerRef,
}) => {
  return (
    <footer
      ref={footerRef}
      className={`w-full bg-[var(--bg-page)] transition-colors duration-500 ${
        useStickyCurtain ? 'sticky bottom-0 z-0' : 'relative z-0'
      }`}
    >
      <div className="site-container pt-6 sm:pt-8 pb-28">
        <SignatureFooter
          revealProgress={revealProgress}
          isCurtainOpen={!useStickyCurtain || revealProgress > 0.01}
        />

        {/* 
          Minimal Two-Column Footer Row:
          - LEFT SIDE: Daffodil International University / Computer Science and Engineering
          - RIGHT SIDE: © 2026 Atikur Rahman / Built with curiosity & code.
        */}
        <div className="mt-6 sm:mt-8 flex flex-row items-baseline justify-between gap-2.5 sm:gap-6 select-none">
          {/* Left Side: Subtle University Personal Identity */}
          <div className="space-y-0.5 sm:space-y-1 shrink-0 max-w-[50%] sm:max-w-none">
            <p className="font-medium text-[var(--text-primary)] tracking-tight text-[9px] xs:text-[10px] sm:text-xs leading-tight">
              {UNIVERSITY_NAME}
            </p>
            <p className="text-[8px] xs:text-[9px] sm:text-[11px] text-[var(--text-muted)] font-mono leading-tight">
              {UNIVERSITY_DEPARTMENT}
            </p>
          </div>

          {/* Right Side: Copyright & Motto */}
          <div className="space-y-0.5 sm:space-y-1 text-right shrink-0 max-w-[50%] sm:max-w-none">
            <p className="font-normal text-[var(--text-body)] tracking-tight text-[9px] xs:text-[10px] sm:text-xs leading-tight">
              © 2026 {FULL_NAME}
            </p>
            <p className="text-[8px] xs:text-[9px] sm:text-[11px] text-[var(--text-muted)] leading-tight">
              Built with curiosity & code.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
