import React, { createContext, useContext, useState, useEffect } from 'react';

interface RevealContextType {
  isSiteLoaded: boolean;
  setIsSiteLoaded: (loaded: boolean) => void;
}

const RevealContext = createContext<RevealContextType>({
  isSiteLoaded: false,
  setIsSiteLoaded: () => {},
});

export const RevealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSiteLoaded, setIsSiteLoaded] = useState<boolean>(false);

  return (
    <RevealContext.Provider value={{ isSiteLoaded, setIsSiteLoaded }}>
      {children}
    </RevealContext.Provider>
  );
};

export const useReveal = () => useContext(RevealContext);
