import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PentagonHomeIcon,
  OutlinedNotepadIcon,
  CodePracticeNavIcon,
  MinimalPersonIcon,
  MinimalAtSymbolIcon,
} from './Icons.tsx';

export type NavTarget = 'home' | 'about' | 'programming' | 'stack' | 'achievements';

interface BottomNavigationProps {
  currentView: 'home' | 'programming';
  onNavigate: (target: NavTarget) => void;
}

interface NavItem {
  id: NavTarget;
  label: string;
  tooltip: string;
  icon: React.ReactNode;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<NavTarget>('home');
  const [hoveredItem, setHoveredItem] = useState<NavTarget | null>(null);

  // References to dock and buttons for exact position calculation
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorLeft, setIndicatorLeft] = useState<number | null>(null);

  // Monitor active section using IntersectionObserver
  useEffect(() => {
    if (currentView === 'programming') {
      setActiveSection('programming');
      return;
    }

    const sectionIds: ('home' | 'about' | 'stack' | 'achievements')[] = [
      'home',
      'about',
      'stack',
      'achievements',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => {
            const indexA = sectionIds.indexOf(a.target.id as any);
            const indexB = sectionIds.indexOf(b.target.id as any);
            return indexA - indexB;
          });
          const activeId = visibleEntries[0].target.id as NavTarget;
          setActiveSection((prev) => (prev === activeId ? prev : activeId));
        }
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [currentView]);

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      tooltip: 'Home',
      icon: <PentagonHomeIcon className="w-4 h-4" />,
    },
    {
      id: 'about',
      label: 'About',
      tooltip: 'About',
      icon: <OutlinedNotepadIcon className="w-4 h-4" />,
    },
    {
      id: 'programming',
      label: 'Programming',
      tooltip: 'Programming',
      icon: <CodePracticeNavIcon className="w-4 h-4" />,
    },
    {
      id: 'stack',
      label: 'Technology & Stack',
      tooltip: 'Technology & Stack',
      icon: <MinimalPersonIcon className="w-4 h-4" />,
    },
    {
      id: 'achievements',
      label: 'Achievement',
      tooltip: 'Achievement',
      icon: <MinimalAtSymbolIcon className="w-4 h-4" />,
    },
  ];

  // The single target for the sliding ball:
  // Glides to whichever navigation icon the cursor is placed on.
  // Defaults to the active section / home.
  const currentTarget: NavTarget =
    hoveredItem || (currentView === 'programming' ? 'programming' : activeSection) || 'home';

  // Compute exact center position under the target icon using bounding rectangles
  const updateIndicatorPosition = useCallback(() => {
    const index = navItems.findIndex((item) => item.id === currentTarget);
    if (index !== -1) {
      const dockEl = dockRef.current;
      const buttonEl = itemRefs.current[index];
      if (dockEl && buttonEl) {
        const dockRect = dockEl.getBoundingClientRect();
        const btnRect = buttonEl.getBoundingClientRect();
        const center = btnRect.left - dockRect.left + btnRect.width / 2;
        setIndicatorLeft(center);
      }
    }
  }, [currentTarget, navItems]);

  // Update position on mount and whenever currentTarget changes
  useEffect(() => {
    updateIndicatorPosition();
  }, [updateIndicatorPosition]);

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicatorPosition]);

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none"
    >
      {/* 
        BOTTOM NAVIGATION DOCK
        Contains: Home | About | Programming | Technology & Stack | Achievement
        Features exactly ONE sliding moving ball just below the navigation icons.
        Whenever the cursor is placed at any icon, the ball slides smoothly to that icon.
      */}
      <div 
        ref={dockRef}
        onMouseLeave={() => setHoveredItem(null)}
        className="relative flex items-center gap-1 sm:gap-2 px-3 pt-2 pb-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md shadow-lg shadow-black/20"
      >
        {navItems.map((item, index) => {
          const isActive =
            currentView === 'programming'
              ? item.id === 'programming'
              : activeSection === item.id;

          return (
            <div key={item.id} className="relative flex flex-col items-center">
              {hoveredItem === item.id && (
                <div 
                  role="tooltip" 
                  className="absolute -top-9 px-2 py-1 text-[11px] font-mono tracking-tight text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded shadow-md pointer-events-none whitespace-nowrap animate-fade-in"
                >
                  {item.tooltip}
                </div>
              )}
              <button
                ref={(el) => {
                  itemRefs.current[index] = el;
                  if (indicatorLeft === null && item.id === 'home' && el && dockRef.current) {
                    const dockRect = dockRef.current.getBoundingClientRect();
                    const btnRect = el.getBoundingClientRect();
                    setIndicatorLeft(btnRect.left - dockRect.left + btnRect.width / 2);
                  }
                }}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  onNavigate(item.id);
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseMove={() => setHoveredItem(item.id)}
                onFocus={() => setHoveredItem(item.id)}
                onBlur={() => setHoveredItem(null)}
                aria-label={item.label}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)] ${
                  isActive
                    ? 'text-[var(--text-primary)] bg-[var(--accent-tint)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-tint)]'
                }`}
              >
                {item.icon}
              </button>
            </div>
          );
        })}

        {/* 
          SLIDING MOVING BALL
          - Placed just below the navigation icons (bottom-1.5)
          - Moves fluidly horizontally whenever the cursor is placed on any icon
          - Small circular dot with subtle muted theme color (var(--text-muted))
          - Exactly ONE ball at all times
        */}
        {indicatorLeft !== null && (
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] pointer-events-none"
            style={{
              left: `${indicatorLeft}px`,
              transform: 'translateX(-50%)',
              transition: 'left 250ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          />
        )}
      </div>
    </nav>
  );
};
