import React, { useState } from 'react';
import { ContentBlock } from '../types/contentBlocks.ts';
import { ImageLightbox } from './ImageLightbox.tsx';

interface OrderedBlockRendererProps {
  blocks: ContentBlock[];
  onOpenImage?: (url: string, caption?: string) => void;
}

export const OrderedBlockRenderer: React.FC<OrderedBlockRendererProps> = ({ blocks, onOpenImage }) => {
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; caption?: string; alt?: string } | null>(null);

  const handleImageClick = (url: string, caption?: string, alt?: string) => {
    if (onOpenImage) {
      onOpenImage(url, caption);
    } else {
      setActiveLightboxImage({ url, caption, alt });
    }
  };

  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Helper to extract embeddable video URL (e.g. YouTube)
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-7 leading-relaxed text-[var(--text-body)]">
      {blocks.map((block) => {
        switch (block.type) {
          case 'text':
            return (
              <div key={block.id} className="text-sm sm:text-base leading-relaxed space-y-3 font-normal">
                {block.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            );

          case 'heading':
            if (block.level === 3) {
              return (
                <h3 
                  key={block.id} 
                  className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)] pt-3 pb-1"
                >
                  {block.text}
                </h3>
              );
            }
            return (
              <h2 
                key={block.id} 
                className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)] pt-5 pb-1 border-b border-[var(--border-subtle)]"
              >
                {block.text}
              </h2>
            );

          case 'image':
            return (
              <figure key={block.id} className="my-6 space-y-2">
                <div 
                  className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] cursor-pointer group shadow-sm"
                  onClick={() => handleImageClick(block.url, block.caption, block.alt)}
                >
                  <img
                    src={block.url}
                    alt={block.alt || block.caption || 'Project visual'}
                    className="w-full max-h-[550px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-xs font-mono text-[var(--text-muted)] text-center px-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'gallery':
            return (
              <div key={block.id} className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {block.images.map((img, iIdx) => (
                  <figure key={iIdx} className="space-y-1.5">
                    <div 
                      className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] cursor-pointer group"
                      onClick={() => handleImageClick(img.url, img.caption)}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Gallery visual ${iIdx + 1}`}
                        className="w-full h-48 sm:h-56 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="text-[11px] font-mono text-[var(--text-muted)]">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            );

          case 'video': {
            const embedUrl = getEmbedUrl(block.url);
            const isDirectVideo = block.url.endsWith('.mp4') || block.url.endsWith('.webm');

            return (
              <figure key={block.id} className="my-6 space-y-2">
                <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-black/40 aspect-video">
                  {isDirectVideo ? (
                    <video 
                      src={block.url} 
                      controls 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={embedUrl}
                      title={block.caption || 'Video demonstration'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}
                </div>
                {block.caption && (
                  <figcaption className="text-xs font-mono text-[var(--text-muted)] text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case 'code':
            return (
              <div key={block.id} className="my-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] overflow-hidden">
                {block.filename && (
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface)]">
                    <span>{block.filename}</span>
                    <span className="uppercase text-[10px]">{block.language || 'code'}</span>
                  </div>
                )}
                <pre className="p-4 overflow-x-auto text-xs font-mono text-[var(--text-primary)] leading-relaxed">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          case 'technical_specs':
            return (
              <div key={block.id} className="my-6 p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
                {block.title && (
                  <h4 className="text-xs uppercase tracking-widest font-mono text-[var(--text-muted)] select-none">
                    {block.title}
                  </h4>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {block.items.map((item, itIdx) => (
                    <div key={itIdx} className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--accent-tint)] space-y-0.5">
                      <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
                        {item.label}
                      </span>
                      <span className="font-medium text-[var(--text-primary)] font-mono block">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <ImageLightbox
          url={activeLightboxImage.url}
          caption={activeLightboxImage.caption}
          alt={activeLightboxImage.alt}
          onClose={() => setActiveLightboxImage(null)}
        />
      )}
    </div>
  );
};
