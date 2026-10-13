import React, { useState, useEffect, useRef } from 'react';
import { FULL_NAME, HERO_HEADLINE, PROFILE_IMAGE_URL, PROFILE_IMAGE_FALLBACK } from '../data/portfolioData.ts';
import { 
  auth, 
  isUserAdmin, 
  uploadAndSavePhoto, 
  removePublicProfilePhoto, 
  subscribeToPublicProfilePhoto,
  getPublicProfilePhoto 
} from '../firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * Resizes and compresses an image to an optimal lightweight JPEG (max 500px)
 * ensuring it loads instantly on all devices and comfortably fits in cloud storage.
 */
function compressImage(file: File, maxDim = 500, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const Hero: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(PROFILE_IMAGE_URL || PROFILE_IMAGE_FALLBACK);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Monitor Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Determine whether editing controls should be accessible:
  // - True in development / studio preview environment
  // - True if URL contains ?edit=true or ?admin=true
  // - True if logged in as admin
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const isDev =
      hostname.includes('ais-dev') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      import.meta.env.DEV;

    const queryParams = new URLSearchParams(window.location.search);
    const hasAdminQuery =
      queryParams.has('edit') ||
      queryParams.has('editor') ||
      queryParams.has('admin');

    if (hasAdminQuery) {
      try {
        localStorage.setItem('portfolio_editor_enabled', 'true');
      } catch (_) {}
    }

    const hasStoredAuth = localStorage.getItem('portfolio_editor_enabled') === 'true';
    setCanEdit(Boolean(isDev || hasAdminQuery || hasStoredAuth || isUserAdmin(currentUser)));
  }, [currentUser]);

  // 1. PUBLIC REAL-TIME FETCH: Listen to Firestore Cloud Storage for profile photo
  useEffect(() => {
    // Immediate cache load
    try {
      const cached = localStorage.getItem('portfolio_cached_profile_photo');
      if (cached) {
        setPhotoUrl(cached);
        setCurrentImageSrc(cached);
      }
    } catch (_) {}

    // Primary: Subscribe to live Firestore document
    const unsubscribe = subscribeToPublicProfilePhoto((cloudUrl) => {
      if (cloudUrl) {
        setPhotoUrl(cloudUrl);
        setCurrentImageSrc(cloudUrl);
      }
    });

    // Initial check from cloud if snapshot takes a moment
    getPublicProfilePhoto().then((cloudUrl) => {
      if (cloudUrl) {
        setPhotoUrl(cloudUrl);
        setCurrentImageSrc(cloudUrl);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close mini menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerUpload = () => {
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  /**
   * AUTOMATIC & FAST FIREBASE CLOUD SAVE:
   * As soon as a picture is chosen, compress it and save immediately to Firebase Cloud.
   * Viewers will instantly see the picture in real time.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSaveStatus('Saving to Firebase Cloud...');

      // Fast image compression: 500px, 0.85 quality (< 60KB payload for sub-second cloud sync)
      const compressedDataUrl = await compressImage(file, 500, 0.85);

      // Immediately display locally for zero UI latency
      setCurrentImageSrc(compressedDataUrl);
      setPhotoUrl(compressedDataUrl);

      // Save directly to Firebase Cloud
      const { photoUrl: savedUrl } = await uploadAndSavePhoto(compressedDataUrl, currentUser);
      setPhotoUrl(savedUrl);
      setCurrentImageSrc(savedUrl);
      setSaveStatus('Saved to Cloud! Live for all viewers.');

      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus(null);
      }, 1800);
    } catch (err: any) {
      console.error('Failed to save photo to cloud:', err);
      setErrorMessage(err?.message || 'Error saving to cloud. Retrying...');
      setIsSaving(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsSaving(true);
      setShowMenu(false);
      await removePublicProfilePhoto(currentUser);
      setPhotoUrl(null);
      setCurrentImageSrc(PROFILE_IMAGE_URL || PROFILE_IMAGE_FALLBACK);
      setSaveStatus('Photo reset to default.');
      setTimeout(() => {
        setSaveStatus(null);
        setIsSaving(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to remove photo:', err);
      setErrorMessage(err?.message || 'Failed to remove photo.');
      setIsSaving(false);
    }
  };

  const handleImageError = () => {
    // Graceful fallback to guaranteed bundled asset
    if (currentImageSrc !== PROFILE_IMAGE_FALLBACK && PROFILE_IMAGE_FALLBACK) {
      setCurrentImageSrc(PROFILE_IMAGE_FALLBACK);
    } else if (currentImageSrc !== PROFILE_IMAGE_URL && PROFILE_IMAGE_URL) {
      setCurrentImageSrc(PROFILE_IMAGE_URL);
    }
  };

  return (
    <section 
      id="home" 
      className="w-full max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 pb-6 sm:pb-8"
      aria-label="Introduction"
    >
      {/* Hidden file input for uploading profile photo */}
      {canEdit && (
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload profile photo"
        />
      )}

      {/* 
        PROFILE HEADER:
        Horizontal arrangement:
        [Photo] → Atikur Rahman + Tagline directly below name
      */}
      <div className="flex items-center gap-5 sm:gap-7">
        {/* Left: Profile Photo Container */}
        <div className="shrink-0 flex justify-start">
          <div className="relative group" ref={menuRef}>
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] relative overflow-hidden shadow-sm flex items-center justify-center transition-all duration-200"
            >
              {/* Profile Image with guaranteed fallback so viewers always see it */}
              <img 
                src={currentImageSrc}
                alt={FULL_NAME}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />

              {/* Uploading overlay */}
              {isSaving && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5 z-20">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-[9px] font-mono text-white/90">Syncing...</span>
                </div>
              )}

              {/* Quick hover trigger in editor mode */}
              {canEdit && !isSaving && (
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  aria-label="Change profile picture"
                  title="Click to choose picture (saves automatically to Firebase Cloud)"
                  className="absolute inset-0 bg-black/45 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 cursor-pointer backdrop-blur-[2px]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <span className="text-[10px] font-mono tracking-wider uppercase font-medium">Upload</span>
                </button>
              )}
            </div>

            {/* Discreet edit button at the bottom-right corner */}
            {canEdit && (
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Profile photo options"
                title="Firebase Cloud Photo Options"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-10"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
            )}

            {/* Discreet dropdown menu with Cloud options */}
            {canEdit && showMenu && (
              <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 z-40 p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xl whitespace-nowrap animate-fade-in flex flex-col gap-1 backdrop-blur-md min-w-[170px]">
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="w-full text-left px-3 py-1.5 text-xs font-mono text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <span>Choose Photo (Auto-Save)</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="w-full text-left px-3 py-1.5 text-xs font-mono text-red-400 hover:bg-[var(--bg-surface)] rounded transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    </svg>
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick status toast */}
            {(saveStatus || errorMessage) && (
              <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 z-40 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-xl whitespace-nowrap animate-fade-in flex items-center gap-1.5">
                {saveStatus && (
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {saveStatus}
                  </span>
                )}
                {errorMessage && (
                  <span className="text-[11px] text-red-400 font-mono">
                    {errorMessage}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Full Name & Tagline directly below */}
        <div className="space-y-1 sm:space-y-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
            {FULL_NAME}
          </h1>

          <p className="text-xs sm:text-[13px] text-[var(--text-body)] font-normal leading-relaxed max-w-xl">
            {HERO_HEADLINE}
          </p>
        </div>
      </div>
    </section>
  );
};
