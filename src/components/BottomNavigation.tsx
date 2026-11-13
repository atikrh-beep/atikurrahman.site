import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, AppRoute } from '../context/RouterContext.tsx';
import {
  Clipboard,
  Code,
  Laptop,
  AtSign,
} from 'lucide-react';

// Geometric pentagon-shaped house outline without door or interior lines
const PentagonHouseIcon: React.FC<{ className?: string; strokeWidth?: number }> = ({
  className = 'w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]',
  strokeWidth = 1.8,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3.5 L20.5 10 V20.5 H3.5 V10 Z" />
  </svg>
);

export type NavTarget = AppRoute | 'contact';

interface NavItemConfig {
  id: NavTarget;
  tooltip: string;
  icon: React.ReactNode;
  routeMatch?: AppRoute;
}

const PORTFOLIO_COPY_URL = 'https://atikurrahmansite.vercel.app/';

export const BottomNavigation: React.FC = () => {
  const { activeRoute, navigate } = useRouter();
  const [hoveredItem, setHoveredItem] = useState<NavTarget | null>(null);
  const [showTopNotification, setShowTopNotification] = useState<boolean>(false);

  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorLeft, setIndicatorLeft] = useState<number | null>(null);
  const [isIndicatorVisible, setIsIndicatorVisible] = useState<boolean>(false);
  const copyTimeoutRef = useRef<number | null>(null);

  // Exactly five icons in required order:
  // 1. Home (Pentagon-shaped house silhouette)
  // 2. Notes
  // 3. Code
  // 4. IoT & Robotics (Laptop)
  // 5. Contact (@)
  const navItems: NavItemConfig[] = [
    {
      id: 'home',
      tooltip: 'Home',
      routeMatch: 'home',
      icon: <PentagonHouseIcon className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.8} />,
    },
    {
      id: 'notes',
      tooltip: 'Notes',
      routeMatch: 'notes',
      icon: <Clipboard className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.8} />,
    },
    {
      id: 'code',
      tooltip: 'Code',
      routeMatch: 'code',
      icon: <Code className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.8} />,
    },
    {
      id: 'robotics',
      tooltip: 'IoT & Robotics',
      routeMatch: 'robotics',
      icon: <Laptop className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.8} />,
    },
    {
      id: 'contact',
      tooltip: 'Contact',
      icon: <AtSign className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.8} />,
    },
  ];

  // Active route target
  const activeTarget: NavTarget | null = 
    activeRoute === 'home' || activeRoute === 'notes' || activeRoute === 'code' || activeRoute === 'robotics'
      ? activeRoute
      : null;

  // The indicator smoothly follows the hovered icon, returning to the active icon on mouse leave
  const currentTarget: NavTarget | null = hoveredItem || activeTarget;

  // Compute horizontal center position of the single circular indicator dot
  const updateDotPosition = useCallback(() => {
    if (!currentTarget || !dockRef.current) {
      setIsIndicatorVisible(false);
      return;
    }

    const targetIndex = navItems.findIndex((item) => item.id === currentTarget);

    if (targetIndex !== -1) {
      const buttonEl = itemRefs.current[targetIndex];
      if (buttonEl) {
        const dockRect = dockRef.current.getBoundingClientRect();
        const btnRect = buttonEl.getBoundingClientRect();
        const center = btnRect.left - dockRect.left + btnRect.width / 2;
        setIndicatorLeft(center);
        setIsIndicatorVisible(true);
        return;
      }
    }

    setIsIndicatorVisible(false);
  }, [currentTarget, navItems]);

  useEffect(() => {
    updateDotPosition();
  }, [updateDotPosition]);

  useEffect(() => {
    const handleResize = () => updateDotPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDotPosition]);

  // Robust Clipboard copy handler for @ contact icon:
  // Copies URL, and triggers the top-of-screen notification only on success
  const handleCopyContact = async () => {
    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current);
    }

    let success = false;

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(PORTFOLIO_COPY_URL);
        success = true;
      } catch (_) {
        success = false;
      }
    }

    // Fallback using textarea for iframe environments
    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = PORTFOLIO_COPY_URL;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (_) {
        success = false;
      }
    }

    // Show top-center notification ONLY upon successful clipboard copying
    if (success) {
      setShowTopNotification(true);
      copyTimeoutRef.current = window.setTimeout(() => {
        setShowTopNotification(false);
      }, 2000);
    }
  };

  const handleItemClick = (item: NavItemConfig) => {
    switch (item.id) {
      case 'home':
        navigate('/');
        break;
      case 'notes':
        navigate('/notes');
        break;
      case 'code':
        navigate('/code');
        break;
      case 'robotics':
        navigate('/robotics');
        break;
      case 'contact':
        handleCopyContact();
        break;
    }
  };

  return (
    <>
      {/* Top-of-screen notification after successful clipboard copy */}
      {showTopNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full border border-[var(--border-hover)] bg-[var(--bg-surface-elevated)]/95 text-[var(--text-primary)] text-xs font-mono font-medium shadow-xl shadow-black/10 backdrop-blur-md flex items-center gap-2 animate-fade-in pointer-events-none select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          <span>Copied to clipboard</span>
        </div>
      )}

      {/* Compact Floating Navigation Capsule */}
      <nav
        role="navigation"
        aria-label="Floating Navigation Capsule"
        className="fixed bottom-5 sm:bottom-6 left-1/2 z-50 select-none pointer-events-auto -translate-x-1/2"
      >
        <div 
          ref={dockRef}
          onMouseLeave={() => setHoveredItem(null)}
          className="relative flex items-center gap-2 sm:gap-3 px-3.5 py-1 sm:px-4 sm:py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-md shadow-lg shadow-black/20"
        >
          {navItems.map((item, index) => {
            const isActive = item.routeMatch && activeRoute === item.routeMatch;
            const isHovered = hoveredItem === item.id;

            return (
              <div key={item.id} className="relative flex flex-col items-center">
                {/* Elegant plain text tooltip above hovered icon */}
                {isHovered && (
                  <div
                    role="tooltip"
                    className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 text-[11px] font-mono font-medium tracking-tight text-[var(--text-primary)] pointer-events-none whitespace-nowrap animate-fade-in drop-shadow-sm select-none"
                  >
                    {item.tooltip}
                  </div>
                )}

                <button
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseMove={() => setHoveredItem(item.id)}
                  onFocus={() => setHoveredItem(item.id)}
                  onBlur={() => setHoveredItem(null)}
                  aria-label={item.tooltip}
                  className={`relative w-[34px] h-8 sm:w-9 sm:h-[34px] rounded-full inline-flex items-center justify-center transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)] ${
                    isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.icon}
                </button>
              </div>
            );
          })}

          {/* 
            ANIMATED HOVER INDICATOR
            - A single small circular dot beneath the icons
            - Smoothly follows cursor as it moves between icons
            - Returns to the active route item when cursor leaves the capsule
            - Exactly ONE dot at all times
          */}
          {indicatorLeft !== null && (
            <span
              aria-hidden="true"
              className="absolute bottom-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--text-primary)] pointer-events-none"
              style={{
                left: `${indicatorLeft}px`,
                transform: 'translateX(-50%)',
                opacity: isIndicatorVisible ? 1 : 0,
                transition: 'left 220ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 150ms ease',
              }}
            />
          )}
        </div>
      </nav>
    </>
  );
};
