import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'notes' | 'code' | 'robotics';

interface RouterContextType {
  pathname: string;
  activeRoute: AppRoute;
  noteSlug: string | null;
  roboticsSlug: string | null;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  activeRoute: 'home',
  noteSlug: null,
  roboticsSlug: null,
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname || '/';
  });

  // Listen to browser forward/back buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    // Normal path navigation
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setPathname(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Compute active high-level route and optional project/note slug
  const normalized = pathname.toLowerCase();
  let activeRoute: AppRoute = 'home';
  let noteSlug: string | null = null;
  let roboticsSlug: string | null = null;

  if (normalized.startsWith('/notes')) {
    activeRoute = 'notes';
    const match = normalized.match(/^\/notes\/([^/?#]+)/);
    if (match) {
      noteSlug = match[1];
    }
  } else if (normalized.startsWith('/code') || normalized.startsWith('/programming')) {
    activeRoute = 'code';
  } else if (normalized.startsWith('/robotics')) {
    activeRoute = 'robotics';
    const match = normalized.match(/^\/robotics\/([^/?#]+)/);
    if (match) {
      roboticsSlug = match[1];
    }
  } else {
    activeRoute = 'home';
  }

  return (
    <RouterContext.Provider value={{ pathname, activeRoute, noteSlug, roboticsSlug, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
