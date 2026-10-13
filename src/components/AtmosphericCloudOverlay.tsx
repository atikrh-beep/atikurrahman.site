import React from 'react';

interface AtmosphericCloudOverlayProps {
  theme: 'dark' | 'light';
}

/**
 * AtmosphericCloudOverlay
 * 
 * Provides an ultra-soft, completely smooth atmospheric mist at the top
 * and bottom edges of the viewport:
 * - NO full-page overlay: only two shallow, separate edge strips (top and bottom).
 * - Center of the screen (~85-90% of screen) has ZERO overlay in the DOM.
 * - Both edges have `pointer-events-none` and `touch-action: none` (CSS and inline style)
 *   so they NEVER capture wheel, touch, or click gestures.
 * - Completely symmetrical soft haze in both Dark and Light modes.
 * - Smooth CSS color transition on theme change.
 */
export const AtmosphericCloudOverlay: React.FC<AtmosphericCloudOverlayProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  // Matching exact portfolio page background CSS variables
  // Dark: #1B1A18, Light: #F7F3EA
  const edgeColor = isDark ? '#1B1A18' : '#F7F3EA';
  const midColor = isDark ? 'rgba(27, 26, 24, 0.72)' : 'rgba(247, 243, 234, 0.72)';
  const softColor = isDark ? 'rgba(27, 26, 24, 0.28)' : 'rgba(247, 243, 234, 0.28)';

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
