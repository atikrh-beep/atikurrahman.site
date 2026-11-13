import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface AtmosphericCloudOverlayProps {
  theme?: 'dark' | 'light';
}

export const AtmosphericCloudOverlay: React.FC<AtmosphericCloudOverlayProps> = ({ theme: propTheme }) => {
  const contextTheme = useTheme();
  const theme = propTheme || contextTheme.theme;
  const isDark = theme === 'dark';

  // Matching exact portfolio page background CSS variables
  // Dark: #121316, Light: #FFFFFF
  const edgeColor = isDark ? '#121316' : '#FFFFFF';
  const midColor = isDark ? 'rgba(18, 19, 22, 0.72)' : 'rgba(255, 255, 255, 0.72)';
  const softColor = isDark ? 'rgba(18, 19, 22, 0.28)' : 'rgba(255, 255, 255, 0.28)';

  return (
    <>
      {/* Top Atmospheric Mist - Shallow edge strip */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed top-0 left-0 right-0 h-16 sm:h-20 z-30 select-none transition-colors duration-500"
        style={{
          pointerEvents: 'none',
          touchAction: 'none',
          background: `linear-gradient(to bottom, ${edgeColor} 0%, ${midColor} 45%, ${softColor} 75%, transparent 100%)`,
        }}
      />

      {/* Bottom Atmospheric Mist - Shallow edge strip */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-16 sm:h-20 z-30 select-none transition-colors duration-500"
        style={{
          pointerEvents: 'none',
          touchAction: 'none',
          background: `linear-gradient(to top, ${edgeColor} 0%, ${midColor} 45%, ${softColor} 75%, transparent 100%)`,
        }}
      />
    </>
  );
};
