---
name: Equatorial Expedition Utility
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#623c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#825100'
  on-tertiary-container: '#ffcb8f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies the ethos of a resilient digital companion for regional travel across Central Kalimantan. Built around the core promise—*Rencanakan Saat Online, Tetap Siap Saat Offline*—it reconciles two divergent contexts: high-bandwidth discovery at home and zero-connectivity execution deep within river corridors and rainforest reserves.

### Personality & Emotional Response
The interface evokes absolute preparedness, utilitarian trust, and unpretentious warmth. The user must feel secure knowing that logistical criticalities—cash reserves, emergency river crossings, offline geo-tokens, and verified local micro-merchants (UMKM)—remain intact without cellular coverage. Visually, it communicates institutional reliability without bureaucratic stiffness, balancing modern travel optimism with rugged field-utility.

### Design Movement: Functional Digital Utility & Modern Minimalism
The system relies on high-legibility modern minimalism:
- **Zero Decorative Noise:** Visual elements exist purely to clarify hierarchy, state, or operational offline status.
- **Physical-Digital Parity:** Badges and cards function like digital laminates or waterproof trail field cards—crisp, modular, structured.
- **Lightweight Footprint:** Avoiding heavy blurred backdrops or compute-heavy animations to conserve device battery and render instantly on lower-tier regional mobile hardware.

## Colors

The palette directly anchors digital reliability against the geography of Central Kalimantan. High-contrast tokens prioritize readability under direct equatorial sunlight.

### Color Roles
- **Primary (`#1D4ED8`):** Trustworthy Royal Blue. Drives primary actions, system connectivity statuses, verified institutional notices, and critical transactional anchors.
- **Secondary (`#10B981`):** Rainforest Emerald Green. Designated for positive affirmation, "Offline-Ready" downloaded states, river network pass confirmations, and ecological discovery tags.
- **Tertiary (`#F59E0B`):** Warm Amber / Sunrise Orange. Reserved strictly for preparedness alerts: low ATM coverage warnings, cash-only transition points, unconfirmed boat schedules, and attention-requiring trip logistics.
- **Neutral Primary (`#0F172A`):** Deep Slate Ink. Used for high-contrast typography, structural outlines, and critical content hierarchies.
- **Neutral Secondary (`#64748B`):** Muted Slate. Used for metadata, secondary descriptions, path indicators, and disabled states.
- **Canvas Base (`#F8FAFC`):** Soft Slate White. Minimizes glare during field use while preventing harsh pure-white eye fatigue.
- **Surface Layer (`#FFFFFF`):** High-clarity foreground panels, cards, and modal sheets with structural `#E2E8F0` border delineations.

### Semantic Status Badging & Indicators
- **Offline Pack Badge:** `#ECFDF5` surface paired with `#047857` text and `#A7F3D0` subtle stroke.
- **Cash Preparation Alert Badge:** `#FFFBEB` surface paired with `#B45309` text and `#FDE68A` border.
- **QRIS Digital Readiness Badge:** `#EFF6FF` surface paired with `#1D4ED8` text and `#BFDBFE` border.

## Typography

The design system standardizes on **Plus Jakarta Sans** across all roles to project an approachable, clean, contemporary Indonesian identity. With wide apertures, balanced counters, and clean geometric foundations, it renders sharply at low PPI and resists visual degrading under aggressive compression or dim screen settings.

### Hierarchy & Mobile Scaling Rules
- **Headline XL / Large:** Applied strictly to destination headers, offline checklist totals, and trip readiness scores. Mobile viewport sizes downscale instantly to avoid awkward multiline wrapping in Bahasa Indonesia compound phrases (e.g., *Persiapan Perjalanan*).
- **Body Text:** Standardized to a 1.4–1.5 line height ratio to facilitate rapid scanning of field advisories and itinerary checklists.
- **Labels & Micro-data:** Strict uppercase usage is restricted solely to compact badge indicators (`label-sm`), such as `QRIS VERIFIKASI` and `OFFLINE READY`, paired with slight letter spacing (`0.04em`) to ensure legibility when rendered at small scale.

## Layout & Spacing

A mobile-first fluid layout forms the backbone of the platform, recognizing that tourists, tour guides, and transport operators interface primarily via single-handed mobile devices.

### Layout Mechanics
- **Mobile (<640px):** 4-column fluid layout with `1rem` outer canvas padding and `1rem` gutters. Interactive actionable targets (such as download triggers and payment pills) span full or half-grid blocks with zero side overflow.
- **Tablet (640px–1024px):** 8-column layout with `1.5rem` canvas margin. Readiness calculations sit alongside destination overviews in stacked paired containers.
- **Desktop (>1024px):** 12-column layout max-capped at `1200px` centered width with `2.5rem` margin and `1.5rem` gutters. Sidebars pin trip readiness tallies and offline syncing panels.

### Vertical Rhythm
Spacers strictly obey a 4px/8px modular base. Related micro-elements (e.g., payment icon and payment label) sit at `space-xs` (4px). Form element pairings and internal card blocks scale through `space-sm` (8px) and `space-md` (16px). Major content modules separate at `space-xl` (32px).

## Elevation & Depth

This design system avoids heavy shadows, dark drop filters, and frosted glass blurs that compromise visibility outdoors and drain battery life. Depth is created through low-contrast physical outlines, micro-borders, and subtle ambient lifts.

### Elevation Levels
- **Level 0 (Flat Canvas):** `#F8FAFC`. Base view canvas. Zero shadow, zero borders.
- **Level 1 (Card & Module Surface):** `#FFFFFF` paired with a mandatory `1px solid #E2E8F0` border. Elevation is structural, not shadowed, creating razor-sharp division across content zones.
- **Level 2 (Interactive Floating Modules & Sticky Navigation):** `#FFFFFF` surface with `1px solid #E2E8F0` reinforced by an ambient soft lift: `0px 4px 12px rgba(15, 23, 42, 0.06)`. Used for the mobile bottom navigation bar, readiness summaries, and floating offline status drawers.
- **Level 3 (Modals & Emergency Alerts):** `#FFFFFF` elevated with `0px 12px 32px rgba(15, 23, 42, 0.12)`, overlaid on `#0F172A` at 40% opacity.

## Shapes

The system implements a structured **Rounded** standard (Level 2). This creates an approachable visual presence that softens high-density travel logistics without appearing childish.

### Shape Geometry Application
- **Core Elements (0.5rem / 8px):** Input fields, interactive list cards, payment condition modules, and offline download progress containers.
- **Large Surfaces (1rem / 16px):** Readiness score dashboard widgets, hero cards, bottom sheet top edges, and modal containers.
- **Full Pill (`9999px`):** Status badges (Offline-Ready, QRIS, Tunai), category filter tags (UMKM, Kuliner, Kelotok), and action buttons. Pill geometry guarantees immediate visual distinction between state tags and rectangular data cards.

## Components

### Buttons & Offline Triggers
- **Primary Action (Cari, Simpan, Unduh Pack):** Solid `#1D4ED8` background, `#FFFFFF` text, bold `label-lg`, pill-shaped or rounded `0.5rem`, minimum height `48px` for one-hand touch-target ergonomics. Active state: `#1E40AF`.
- **Offline Pack Download Button:** Outlined button with `#10B981` border and text. Upon offline completion, transitions into a solid `#10B981` background with a checkmark icon and text: `Tersimpan Offline (12 MB)`.

### Chips & Readiness Badges
- **Payment Method Chips:** Multi-select/informative pills displaying status via explicit color pairing:
  - *QRIS Tersedia:* Surface `#EFF6FF`, Border `#BFDBFE`, Text `#1D4ED8`, leading QR code micro-glyph.
  - *Tunai Wajib (Cash Only):* Surface `#FFFBEB`, Border `#FDE68A`, Text `#B45309`, leading bank-note micro-glyph.
  - *Transfer Bank:* Surface `#F1F5F9`, Border `#CBD5E1`, Text `#334155`.
- **UMKM Category Pills:** Clean `#F1F5F9` background with `#0F172A` text. Selected state transforms to `#0F172A` background with `#FFFFFF` text.

### Cards & Readiness Indicator Modules
- **Readiness Score Card:** White `#FFFFFF` card with `1px solid #E2E8F0` border and `1rem` radius. Features a segmented progress track with color logic: Red (<40% not ready), Amber (40-80% cash or documents missing), Emerald (100% all packs saved, cash verified).
- **Listing & Itinerary Cards:** White surface with zero elevation, bordered by `#E2E8F0`. Highlights an immediate payment/connectivity chip strip directly beneath the title to prevent surprises during field transit.

### Input Fields & Budget Calculators
- **Inputs:** `48px` height, `#FFFFFF` background, `1px solid #CBD5E1` border, `0.5rem` radius. Focus ring: `2px solid #1D4ED8` with zero blur offset.
- **Cash Estimator Widget:** Integrated slate-white box displaying calculated river transport fees (Perahu Kelotok), national park permits, and offline merchant buffers, featuring dynamic warnings if regional ATMs are absent within a 25km radius.

### Mobile Bottom Navigation Bar
- Fixed to device viewport bottom with `Level 2` elevation and `1px solid #E2E8F0` top edge.
- 4 or 5 primary destinations (`Eksplor`, `Kesiapan`, `Offline Pack`, `Akun`) utilizing vertical stacking: 20px glyph over 11px label.
- Offline status ping: A persistent 6px emerald dot affixed to the `Offline Pack` tab indicating background sync readiness.