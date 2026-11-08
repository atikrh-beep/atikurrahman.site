# Implementation Plan — Floating Glass Social Pill & Circle Reveal Theme Transition

Status: **Completed & Verified**

---

## 1. Floating Glass Social Pill (`src/components/GlassSocialPill.tsx` & `src/components/About.tsx`)
- **Location & Alignment**:
  - Rendered directly inside the **About section** (`src/components/About.tsx`), replacing the old chips row and separate Private Discord button.
  - Left-aligned exactly with the "ABOUT" label and paragraph above it.
  - Wrapper classes: `flex justify-start w-fit`, with `space-y-6` providing 24px vertical spacing below the paragraph.
  - No centering classes (`mx-auto`, `justify-center`, or `text-center`) used on the pill or its wrapper.
- **Contents (5 items in exact required order)**:
  1. **Instagram** (`InstagramIcon`): `https://instagram.com/`
  2. **GitHub** (`GitHubIcon`): `https://github.com/atikrh-beep`
  3. **LinkedIn** (`LinkedInIcon`): `https://bd.linkedin.com/in/md-atikur-rahman-4874aa299`
  4. **Facebook** (`FacebookIcon`): `https://facebook.com/`
  5. **WhatsApp** (`WhatsAppIcon`): `https://wa.me/`
- **Glass Aesthetics**:
  - Fully rounded capsule with 4px padding and 2px gap.
  - Dark theme: `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.12)`, `backdrop-filter: blur(16px) saturate(1.4)`, inner highlight `inset 0 1px 0 rgba(255,255,255,0.14)`, shadow `0 10px 30px rgba(0,0,0,0.35)`.
  - Light theme: `background: rgba(0,0,0,0.04)`, `border: 1px solid rgba(0,0,0,0.10)`, inner highlight `inset 0 1px 0 rgba(255,255,255,0.6)`, shadow `0 10px 24px rgba(0,0,0,0.06)`.
- **Magnetic Effect**:
  - Items lean 30% toward the cursor when within a 70px radius of the item's center.
  - Smooth reset to 0 with `250ms cubic-bezier(.3,.8,.2,1)` on pointer leave.
  - Automatically disabled on touch devices and when `prefers-reduced-motion` is enabled.
- **Mobile Responsive**:
  - Below 640px, text labels are hidden (`hidden sm:inline`) while keeping 16px icons and `aria-label`s on real `<a>` tags.
  - Fits comfortably within all screen widths down to 320px without horizontal overflow.

---

## 2. Circle Reveal Theme Transition (`src/hooks/useThemeReveal.ts`)
- **Behavior**:
  - When the moon/sun toggle is clicked, the new theme expands outward from the button's center as a growing circle covering the entire viewport over 800ms (`cubic-bezier(.65, 0, .25, 1)`). Works identically dark-to-light and light-to-dark.
- **Implementation**:
  - Hook `useThemeReveal.ts` triggers `document.startViewTransition` with state update synchronized via `flushSync`.
  - Once transition is ready, animates `document.documentElement`'s `::view-transition-new(root)` pseudo-element with `clipPath: [circle(0px at x y), circle(radius at x y)]`.
- **CSS Rule (`src/index.css`)**:
  - `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`
  - `::view-transition-old(root) { z-index: 1; }`
  - `::view-transition-new(root) { z-index: 9999; }`
- **Fallbacks**:
  - Instantly toggles theme if `document.startViewTransition` is unsupported or `prefers-reduced-motion` is active. Never blocks clicks or interferes with normal page scrolling.
