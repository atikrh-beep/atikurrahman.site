import React from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData.ts';
import { InstagramIcon, GitHubIcon, LinkedInIcon, FacebookIcon, WhatsAppIcon } from './Icons.tsx';

export const SocialBar: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'instagram':
        return <InstagramIcon className="w-3.5 h-3.5 text-current" />;
      case 'github':
        return <GitHubIcon className="w-3.5 h-3.5 text-current" />;
      case 'linkedin':
        return <LinkedInIcon className="w-3.5 h-3.5 text-current" />;
      case 'facebook':
        return <FacebookIcon className="w-3.5 h-3.5 text-current" />;
      case 'whatsapp':
        return <WhatsAppIcon className="w-3.5 h-3.5 text-current" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex flex-wrap items-center gap-2 sm:gap-2.5" 
      aria-label="Social connections"
    >
      {/* 
        COMPACT PILL/BUTTON SOCIAL LINKS
        Order: Instagram | GitHub | LinkedIn | Facebook | WhatsApp
        - Pill style with rounded-full
        - Recognizable platform icon + platform name
        - Small, clean, minimal, consistently spaced
        - Wraps naturally into two rows on mobile
      */}
      {SOCIAL_LINKS.map((link) => {
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[var(--text-body)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] bg-[var(--bg-surface)] hover:bg-[var(--accent-tint)] rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)]"
            title={link.name}
          >
            <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
              {getIcon(link.id)}
            </span>
            <span className="tracking-tight text-[11px] sm:text-xs font-medium">
              {link.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};
