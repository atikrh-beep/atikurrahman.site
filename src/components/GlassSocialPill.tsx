import React, { useRef, useState, useCallback } from 'react';
import {
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  WhatsAppIcon,
} from './Icons.tsx';

interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

const SOCIAL_ITEMS: SocialLinkItem[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/',
    icon: <InstagramIcon className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/atikrh-beep',
    icon: <GitHubIcon className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://bd.linkedin.com/in/md-atikur-rahman-4874aa299',
    icon: <LinkedInIcon className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/',
    icon: <FacebookIcon className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://wa.me/',
    icon: <WhatsAppIcon className="w-4 h-4 shrink-0" />,
  },
];

export const GlassSocialPill: React.FC = () => {
  const pillRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [offsets, setOffsets] = useState<{ x: number; y: number }[]>(
    SOCIAL_ITEMS.map(() => ({ x: 0, y: 0 }))
  );

  const isTouchOrReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return reduced || touch;
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchOrReducedMotion()) return;

    const pointerX = e.clientX;
    const pointerY = e.clientY;

    const newOffsets = itemRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < 70) {
        return {
          x: dx * 0.3,
          y: dy * 0.3,
        };
      }
      return { x: 0, y: 0 };
    });

    setOffsets(newOffsets);
  };

  const handlePointerLeave = () => {
    setOffsets(SOCIAL_ITEMS.map(() => ({ x: 0, y: 0 })));
  };

  return (
    <nav aria-label="Social links" className="w-fit self-start">
      {/* 
        FLOATING GLASS PILL
        - Left-aligned with the About text
        - Padding 4px, Gap 2px, Fully rounded
        - Translucent glass styling with backdrop blur and inner top highlight
        - Magnetic tilt interaction on desktop
      */}
      <div
        ref={pillRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="glass-social-pill inline-flex items-center gap-[2px] p-[4px] rounded-full w-fit self-start select-none"
      >
        {SOCIAL_ITEMS.map((item, idx) => (
          <a
            key={item.id}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className="glass-social-item group relative inline-flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-full font-mono text-xs sm:text-[12px] font-medium tracking-tight text-[var(--text-muted)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)] cursor-pointer"
            style={{
              transform: `translate3d(${offsets[idx]?.x || 0}px, ${offsets[idx]?.y || 0}px, 0)`,
            }}
          >
            {item.icon}
            <span className="hidden sm:inline whitespace-nowrap">
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
};
