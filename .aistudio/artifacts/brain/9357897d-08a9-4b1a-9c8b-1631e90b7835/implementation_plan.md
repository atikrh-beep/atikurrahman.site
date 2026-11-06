# Implementation Plan — Admin Visitor Management & Rebuilt Website Reveal System

Implement a secure, admin-only Visitor Management system with optional Google Sign-In visitor identification, and rebuild the website reveal animation system featuring a 1.5-second editorial loading screen, coordinated entrance reveal, and continuous scroll reveal.

---

## 1. Architecture & Proposed Changes

### Part 1: Admin-Only Visitor Management

#### A. Database Schema (`firebase-blueprint.json` & `firestore.rules`)
- **Preserve Existing Counter:** Keep `portfolio_stats/visitors` (`totalCount: number`, `updatedAt: number`) for tracking public anonymous visits.
- **Identified Visitors Collection:** Introduce `identified_visitors/{visitorUid}`:
  - `uid`: string (matches `request.auth.uid`)
  - `name`: string (Google profile name)
  - `email`: string (Google email address)
  - `photoUrl`: string (optional Google avatar)
  - `identifiedAt`: number (timestamp)
  - `consentGiven`: boolean (`true`)
- **Security Rules (`firestore.rules`):**
  - `isAuthAdmin()`: Only authenticated admin can `read` (list/get) and `delete` identified visitor records.
  - Public / Identified visitor: Can only `create` or `update` their own record (`request.auth.uid == visitorUid`), verifying non-empty name/email, `consentGiven == true`, and prevents reading or enumerating other visitors' records.
  - Deploy rules via `deploy_firebase` or Firestore RPC.

#### B. Services (`src/services/visitorStats.ts`)
- `recordPublicVisit()`: Existing robust visit counter (prevents double-counting from React StrictMode/re-renders, skips admin sessions).
- `identifyVisitorWithGoogle()`: Authenticates via Google Sign-In popup with explicit consent; saves name, email, and timestamp to `identified_visitors/{uid}`.
- `subscribeToIdentifiedVisitors(callback)`: Real-time listener for the admin to view all identified visitors.
- `deleteIdentifiedVisitor(id: string)`: Admin-only deletion capability.

#### C. User Interface
- **Public Portfolio (Footer Placement):**
  - In `Footer.tsx`, place a subtle, minimal text button beside the copyright:
    - Default: `Identify as visitor`
    - If already identified: `Identified as [First Name]` with an option to sign out / clear.
  - Clicking opens a privacy consent modal:
    > "Identify yourself as a visitor. By signing in with Google, your permitted name and email address will be visible exclusively to Atikur Rahman in his private admin panel."
    > [Sign in with Google] [Cancel]
- **Admin Section (Top-Right Badge Placement):**
  - In `DhakaTimeThemeControl.tsx`, the `Visitors: {count}` indicator is styled as an interactive admin badge with hover feedback and a subtle indicator icon.
  - Clicking the badge opens the **Admin Visitor Management Modal**:
    - **Header:** "Visitors" & close button
    - **Summary Metric Cards:**
      - Total Visits: `250`
      - Identified Visitors: `18`
    - **Identified Visitors Table:**
      - Columns: Name | Email | Date | Actions
      - Clean editorial styling matching the dark/light palette
      - Delete button with confirmation
      - Empty state if no visitors have voluntarily identified themselves yet

---

### Part 2: Fix & Rebuild Complete Website Reveal System

#### A. Initial Loading Screen (`src/components/InitialLoader.tsx`)
- Appears on public website entrance and refresh for ~1.5 seconds.
- Does not re-trigger when navigating views ('home' vs 'programming') or in admin sessions.
- **Editorial Design:**
  - Full-screen matching warm dark/light theme (`--bg-page`).
  - Name "Atikur Rahman" centered with refined typography and subtle vertical mask unmasking.
  - Understated thin horizontal progress line (0% to 100% over 1.4s) centered beneath the name.
  - Smooth fade/clip transition out at 1.5s, handing off to the entrance reveal.

#### B. Coordinated Website Entrance Reveal
- Coordinated via a lightweight `LoaderStateContext` or entrance state in `App.tsx`:
  1. **T = 0ms (after loader dismiss):** Main layout unmasks.
  2. **T = 100ms:** SiteHeader (Dhaka time & theme control) slides softly into view.
  3. **T = 200ms:** Hero photo container and name "Atikur Rahman" unmask vertically with mask-up clip.
  4. **T = 350ms:** Tagline and headline fade in.
  5. **T = 450ms:** Fixed bottom navigation dock smoothly rises into position from the bottom, with its sliding indicator ball active and intact.

#### C. Continuous Scroll Reveal (`src/components/ScrollReveal.tsx`)
- Resolve the initial viewport bug (preventing immediate static rendering without transition).
- Ensure elements that enter viewport progressively uncover with:
  - Vertical mask-up for titles and section headings.
  - Subtle 14px upward drift with cubic-bezier easing for body text and cards.
  - Staggered reveals for cards in Achievements, Skills, and Programming.
  - Single-trigger observer (`once: true`) so revealed elements stay permanently visible on scroll-up/down.
  - Strict preservation of the floating technology ticker (speed, continuous motion, full-bleed 100vw).
  - Respect `prefers-reduced-motion: reduce`.

---

## 2. Strict Design Preservations
- **No changes to:** colors, typography, layout container widths, profile photo sizing, Dhaka time format, theme transition mechanism, floating tech ticker speed/direction/spacing, fixed bottom navigation dock, or signature drawing stroke.
- **Zero scroll-jacking:** Pure native browser scrolling throughout.

---

## 3. Verification Plan

### Automated Build & Lint Verification
1. `npm run lint` (`tsc --noEmit`) to verify zero TypeScript errors.
2. `npm run build` (`vite build`) to verify clean production bundle.

### Functional Verification
1. **Public Visitor Counter:**
   - Open public portfolio in incognito/preview: verify counter increments by 1.
   - Refresh page: verify duplicate increments are prevented.
   - Verify admin session does not increment counter.
2. **Voluntary Visitor Identification:**
   - Click "Identify as visitor" in footer -> verify consent modal text.
   - Complete Google Sign-In -> verify name and email stored in `identified_visitors`.
   - Verify public visitors cannot read other visitors' records in Firestore.
3. **Admin Visitor Section:**
   - Click "Visitors: {count}" in top-right header -> verify modal opens.
   - Check that "Total Visits" and "Identified Visitors" counts are displayed separately.
   - Verify identified visitors table displays Name, Email, and Date.
   - Test deleting a record as admin.
4. **Website Reveal & Loading Screen:**
   - Load public portfolio -> verify 1.5s loader with "Atikur Rahman" and thin progress bar.
   - Verify smooth transition into the website entrance reveal (header, hero, bottom dock).
   - Scroll through all sections (About, Tech Stack, Programming, Achievements, Signature, Footer) -> verify progressive mask and stagger reveals.
   - Scroll up and down -> verify elements remain permanently visible without glitching.
