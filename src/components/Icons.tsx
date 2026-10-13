import React from 'react';

// Social platform icons
export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.5 9a.5.5 0 0 0-.5.5v.5c0 1.7 1.3 3.5 3 4.5h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-.5a2.5 2.5 0 0 1-1.5-1.5v-.5a.5.5 0 0 0-.5-.5h-.5z" />
    </svg>
  );
}

export function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18.89 5.43a16.63 16.63 0 0 0-4.14-1.28.07.07 0 0 0-.08.04c-.18.32-.38.74-.52 1.07a15.42 15.42 0 0 0-4.3 0c-.14-.33-.35-.75-.53-1.07a.07.07 0 0 0-.08-.04 16.66 16.66 0 0 0-4.14 1.28.06.06 0 0 0-.03.02C2.47 9.38 1.74 13.23 2.09 17.03a.08.08 0 0 0 .03.06 16.73 16.73 0 0 0 5.04 2.55.07.07 0 0 0 .08-.03c.39-.53.74-1.09 1.04-1.68a.07.07 0 0 0-.04-.1 10.97 10.97 0 0 1-1.57-.75.07.07 0 0 1-.01-.12c.11-.08.21-.16.31-.25a.07.07 0 0 1 .07-.01c3.31 1.51 6.89 1.51 10.16 0a.07.07 0 0 1 .08.01c.1.09.2.17.31.25a.07.07 0 0 1-.01.12 11.23 11.23 0 0 1-1.58.75.07.07 0 0 0-.04.1c.3.59.65 1.15 1.04 1.68a.07.07 0 0 0 .08.03 16.68 16.68 0 0 0 5.05-2.55.08.08 0 0 0 .03-.06c.41-4.42-.7-8.24-2.98-11.58a.06.06 0 0 0-.03-.02z" />
      <circle cx="8.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// VJudge platform icon (with recognizable brand crest)
export function VJudgeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4 L12 20 L20 4" />
      <path d="M8 4 L12 12 L16 4" stroke="#3B82F6" strokeWidth="2" />
      <line x1="2" y1="4" x2="6" y2="4" />
      <line x1="18" y1="4" x2="22" y2="4" />
    </svg>
  );
}

// Toph platform icon (clean geometric polygonal logo in official green)
export function TophIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="6" x2="12" y2="18" stroke="#22C55E" />
      <line x1="7" y1="9" x2="17" y2="9" stroke="#22C55E" />
    </svg>
  );
}

// Beecrowd icon (official bee hexagon in brand gold/amber)
export function BeecrowdIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 L20 6.5 L20 15.5 L12 20 L4 15.5 L4 6.5 Z" />
      <circle cx="12" cy="11" r="3.5" fill="#F59E0B" fillOpacity="0.2" />
      <line x1="12" y1="2" x2="12" y2="7.5" stroke="#D97706" />
      <line x1="12" y1="14.5" x2="12" y2="20" stroke="#D97706" />
      <line x1="8.5" y1="11" x2="15.5" y2="11" stroke="#D97706" />
    </svg>
  );
}

// Amazon AWS recognizable icon with brand colors
export function AwsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* "aws" letters */}
      <path d="M4 11.5c.8-2 2.2-3.5 4.5-3.5s3.5 1.5 3.5 4v2" stroke="#FF9900" strokeWidth="2" />
      <path d="M12 12c.5-2 1.8-3.5 3.8-3.5 2 0 3.2 1.5 3.2 3.8v1.7" stroke="#FF9900" strokeWidth="2" />
      {/* Official AWS smile arrow */}
      <path d="M4 16.5c4 2.5 10 2.5 14 0" stroke="#FF9900" strokeWidth="2.2" />
      <path d="M18 15.5l1.2 1.2-1.6 1.4" fill="#FF9900" stroke="#FF9900" strokeWidth="1" />
    </svg>
  );
}

// BigCrowd Icon in brand indigo/purple
export function BigCrowdIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="#6366F1" strokeWidth="2" fill="#6366F1" fillOpacity="0.15" />
      <circle cx="16" cy="10" r="2.5" stroke="#8B5CF6" strokeWidth="2" fill="#8B5CF6" fillOpacity="0.15" />
      <path d="M4 18c0-2.5 2.5-4 5-4s5 1.5 5 4" stroke="#6366F1" strokeWidth="2" />
      <path d="M14 18c0-1.8 1.5-3 3.5-3s3.5 1.2 3.5 3" stroke="#8B5CF6" strokeWidth="2" />
    </svg>
  );
}

// Navigation Icons
// HOME: clean geometric house icon
export function PentagonHomeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 L21 10 L18 21 L6 21 L3 10 Z" />
      <path d="M10 21 L10 14 L14 14 L14 21" />
    </svg>
  );
}

// ABOUT: minimal outlined document/notepad icon
export function OutlinedNotepadIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  );
}

// PROGRAMMING: clean minimal code / brackets icon
export function CodePracticeNavIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

// TECHNOLOGY/STACK: minimal user/technology outline icon
export function MinimalPersonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 20.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

// ACHIEVEMENT: thin/minimal @ symbol
export function MinimalAtSymbolIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  );
}

// Technology & Stack Icons — Full Original Brand Colors
export function TechIcon({ iconKey, className = "w-4 h-4" }: { iconKey: string; className?: string }) {
  switch (iconKey) {
    case 'aws':
      return <AwsIcon className={className} />;
    case 'bigcrowd':
      return <BigCrowdIcon className={className} />;
    case 'top':
      return <TophIcon className={className} />;
    case 'c':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00599C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 9a6 6 0 1 0 0 6" />
        </svg>
      );
    case 'cpp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#004482" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 9a5 5 0 1 0 0 6" stroke="#00599C" />
          <path d="M14 12h3M15.5 10.5v3" stroke="#007ACC" />
          <path d="M19 12h3M20.5 10.5v3" stroke="#007ACC" />
        </svg>
      );
    case 'java':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" stroke="#5382A1" strokeWidth="1.8" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" stroke="#5382A1" strokeWidth="1.8" />
          <line x1="6" y1="2" x2="6" y2="4" stroke="#E76F00" strokeWidth="2" />
          <line x1="10" y1="2" x2="10" y2="4" stroke="#CC292B" strokeWidth="2" />
          <line x1="14" y1="2" x2="14" y2="4" stroke="#E76F00" strokeWidth="2" />
        </svg>
      );
    case 'datastructures':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="#10B981" fill="#10B981" fillOpacity="0.15" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="#10B981" fill="#10B981" fillOpacity="0.15" />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="#10B981" fill="#10B981" fillOpacity="0.15" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="#10B981" fill="#10B981" fillOpacity="0.15" />
          <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" stroke="#34D399" />
        </svg>
      );
    case 'algorithms':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" stroke="#F59E0B" strokeWidth="1.8" fill="#F59E0B" fillOpacity="0.2" />
          <circle cx="18" cy="6" r="3" stroke="#F59E0B" strokeWidth="1.8" fill="#F59E0B" fillOpacity="0.2" />
          <circle cx="12" cy="18" r="3" stroke="#F59E0B" strokeWidth="1.8" fill="#F59E0B" fillOpacity="0.2" />
          <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" stroke="#FBBF24" strokeWidth="1.5" />
          <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" stroke="#FBBF24" strokeWidth="1.5" />
          <line x1="16.5" y1="8.5" x2="13.5" y2="15.5" stroke="#FBBF24" strokeWidth="1.5" />
        </svg>
      );
    case 'oop':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="#8B5CF6" fillOpacity="0.1" />
          <polyline points="3.29 7 12 12 20.71 7" stroke="#A78BFA" />
          <line x1="12" y1="22" x2="12" y2="12" stroke="#A78BFA" />
        </svg>
      );
    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="#A3A3A3" />
          <path d="M9 18c-4.51 2-5-2-7-2" stroke="#A3A3A3" />
        </svg>
      );
    case 'vscode':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#007ACC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16.5 2 5.5 3v14l-5.5 3-10-8 6-3.5-6-3.5L16.5 2z" stroke="#007ACC" fill="#007ACC" fillOpacity="0.1" />
          <path d="m2 16.5 4.5-4.5L2 7.5v9z" stroke="#38BDF8" />
        </svg>
      );
    case 'replit':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F26207" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="7" height="4.5" rx="1" fill="#F26207" />
          <rect x="11" y="9.75" width="9" height="4.5" rx="1" fill="#F26207" />
          <rect x="4" y="15.5" width="7" height="4.5" rx="1" fill="#F26207" />
        </svg>
      );
    case 'arduino':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00979C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 8a4 4 0 1 0 0 8c2.2 0 4-1.8 4-4s-1.8-4-4-4Z" stroke="#00979C" />
          <path d="M16 8a4 4 0 1 1 0 8c-2.2-0-4-1.8-4-4s1.8-4 4-4Z" stroke="#00979C" />
          <line x1="6.5" y1="12" x2="9.5" y2="12" stroke="#008184" />
          <line x1="14.5" y1="12" x2="17.5" y2="12" stroke="#008184" />
          <line x1="16" y1="10.5" x2="16" y2="13.5" stroke="#008184" />
        </svg>
      );
    case 'api':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5" cy="12" r="3" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity="0.2" />
          <circle cx="19" cy="12" r="3" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity="0.2" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="#38BDF8" />
          <path d="M12 8l4 4-4 4" stroke="#38BDF8" />
        </svg>
      );
    case 'telegram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#26A5E4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2.5 2 10l7.5 3 2.5 8 3.5-4 6 5.5z" stroke="#26A5E4" fill="#26A5E4" fillOpacity="0.1" />
          <path d="M9.5 13l7.5-7-5 8" stroke="#38BDF8" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
