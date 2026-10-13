import React, { useState, useEffect } from 'react';
import { checkIsAdminContext, subscribeToVisitorCount } from '../services/visitorStats.ts';
import { auth } from '../firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';

interface DhakaTimeThemeControlProps {
  theme: 'dark' | 'light';
  onToggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DhakaTimeThemeControl: React.FC<DhakaTimeThemeControlProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          hourCycle: 'h23',
        });
        setTimeString(formatter.format(now));
      } catch {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const dhakaTime = new Date(utc + 3600000 * 6);
        const hours = dhakaTime.getHours().toString().padStart(2, '0');
        const minutes = dhakaTime.getMinutes().toString().padStart(2, '0');
        setTimeString(`${hours}:${minutes}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Monitor Admin authorization status
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(checkIsAdminContext());
    };
    checkAdmin();

    const unsubAuth = onAuthStateChanged(auth, () => {
      checkAdmin();
    });

    const handleStorageChange = () => {
      checkAdmin();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubAuth();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Only subscribe to visitor count if authorized admin
  useEffect(() => {
    if (!isAdmin) {
      setVisitorCount(null);
      return;
    }

    const unsubscribe = subscribeToVisitorCount((count) => {
      setVisitorCount(count);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  return (
    <aside 
      aria-label="Dhaka live time, theme switch, and admin controls" 
      className="flex flex-col items-end text-xs tracking-normal font-mono select-none"
    >
      {/* 
        Clean right-corner control:
        [Dhaka] (same gap) [Time] (same gap) [Moon/Sun Icon]
        Normal font weight for time and text.
      */}
      <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-normal">
        {/* Label */}
        <span>Dhaka</span>

        {/* 24-Hour Time in normal font weight (staying normal as others) */}
        <span className="font-normal tracking-tight">
          {timeString || '--:--'}
        </span>

        {/* Theme Switch Icon Button - No square background on hover */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-0 text-[var(--text-primary)] hover:opacity-70 transition-opacity duration-200 cursor-pointer focus:outline-none focus-visible:underline inline-flex items-center justify-center bg-transparent border-0"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            /* Crescent Moon for Dark Mode */
            <svg 
              className="w-3.5 h-3.5 text-[var(--text-primary)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            /* Sun with soft rays for Light Mode */
            <svg 
              className="w-3.5 h-3.5 text-[var(--text-primary)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          )}
        </button>
      </div>

      {/* 
        ADMIN ONLY:
        Visitor Count displayed directly below Dhaka time & theme switcher.
        Normal public visitors NEVER see this element.
      */}
      {isAdmin && visitorCount !== null && (
        <div 
          className="text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] tracking-tight mt-0.5 animate-fade-in"
          aria-label={`Visitor count: ${visitorCount}`}
        >
          Visitors: {visitorCount}
        </div>
      )}
    </aside>
  );
};
