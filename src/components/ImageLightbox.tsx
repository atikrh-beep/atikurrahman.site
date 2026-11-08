import React, { useEffect } from 'react';

export interface ImageLightboxProps {
  url?: string;
  imageUrl?: string;
  caption?: string;
  alt?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  url,
  imageUrl,
  caption,
  alt,
  isOpen = true,
  onClose,
}) => {
  const activeUrl = imageUrl || url;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !activeUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999999] flex flex-col items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-fade-in"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-5 text-sm font-mono text-white/80 hover:text-white p-2 cursor-pointer z-10"
        aria-label="Close image viewer"
      >
        ✕ Close
      </button>

      <div 
        className="max-w-4xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={activeUrl}
          alt={alt || caption || 'Expanded preview'}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
        />
        {caption && (
          <p className="mt-3 text-xs sm:text-[13px] font-mono text-white/80 text-center max-w-xl">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
