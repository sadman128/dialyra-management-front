---
name: Dialyra Management
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#4c444f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#7d7481'
  outline-variant: '#cec3d1'
  surface-tint: '#784a9b'
  primary: '#280044'
  on-primary: '#ffffff'
  primary-container: '#411264'
  on-primary-container: '#af7fd4'
  inverse-primary: '#e1b6ff'
  secondary: '#805600'
  on-secondary: '#ffffff'
  secondary-container: '#feb21f'
  on-secondary-container: '#6b4800'
  tertiary: '#001c10'
  on-tertiary: '#ffffff'
  tertiary-container: '#003320'
  on-tertiary-container: '#00a774'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f2daff'
  primary-fixed-dim: '#e1b6ff'
  on-primary-fixed: '#2e004e'
  on-primary-fixed-variant: '#5e3281'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#ffba43'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

The design system establishes a high-density, authoritative, and frictionless workspace engineered for telecom operations, real-time call flow oversight, and automated order confirmation verification. The interface projects stability, precision, and operational clarity.

The aesthetic blends **Modern Corporate** structure with technical, high-performance data architecture. Surfaces are clean and luminous, counterbalancing dense telemetry and mission-critical audit trails. Visual hierarchy is strictly enforced through crisp micro-borders, purposeful chromatic signaling, and high typographic contrast. The UI avoids ornamental distraction, prioritizing immediate glanceability for high-volume dispatchers, automated routing supervisors, and compliance managers.

## Colors

The palette is tuned specifically for light-mode enterprise ergonomics, providing sustained readability during multi-hour operational shifts.

- **Primary Brand (`#411264`)**: Deep Royal Purple provides authoritative weight. Used for navigation anchors, high-level interactive states, primary action triggers, and brand framing.
- **Accent & Operational State (`#f0a60a`)**: Warm Amber drives immediate visual focus for active telemetry, ongoing automated retries, latency thresholds, and non-blocking warnings.
- **Success & Confirmation (`#10b981`)**: Emerald Green denotes verified telephony handshakes, completed order captures, and healthy trunk connections. An alternate deeper green (`#059669`) provides high-contrast text on soft green badges.
- **Canvas & Surface Tiering**:
  - Global Background: `#f8fafc` (Slate 50) creates a soft, low-glare backdrop that separates cards effortlessly.
  - Surface Tier 1 (Cards, Tables, Panels): `#ffffff` (Pure White).
  - Surface Tier 2 (Nested tables, cell hovers, data headers): `#f1f5f9` (Slate 100).
- **Text & Borders**:
  - Headings & Data Values: `#0f172a` (Slate 900) ensures maximum clarity.
  - Body & Muted Metadata: `#64748b` (Slate 500) for timestamps, telephony route paths, and secondary metrics.
  - Hairline Borders: `#e2e8f0` (Slate 200) for clean containment without heavy visual weight.

## Typography

The typography uses Inter across all levels to maintain systematic cohesion, uniform vertical metrics, and distinct tabular figures.

- **Tabular Numerals**: Numerical data across order counts, call duration, jitter, packet loss, and cost amounts must explicitly use OpenType feature settings `font-feature-settings: "tnum" 1` to ensure aligned columns in data grids.
- **Hierarchy Rules**:
  - Headings prioritize high legibility at concise heights to conserve vertical screen space.
  - Section headers utilize negative tracking (`-0.015em` to `-0.025em`) for modern corporate crispness.
  - Micro-labels (`label-sm`) use uppercase transforms paired with positive tracking (`0.03em`) for telemetry descriptors, SIP status codes, and badge tags.

## Layout & Spacing

The layout operates on an 8px base grid (with a strict 4px sub-grid for inputs, table cells, and badges), ensuring dense yet breathable data arrangements.

- **Grid Architecture**:
  - **Desktop (>= 1280px)**: 12-column fluid grid with fixed collapsible navigation (width: 260px) and fixed telemetry action panel (width: 320px when expanded). Gutter is set to `gutter-desktop` (24px) with canvas padding at `margin-desktop` (32px).
  - **Tablet (768px - 1279px)**: 8-column layout. Navigation folds to a compact 64px icon bar. Telemetry docks to a modal drawer. Gutters scale to `gutter` (20px) with canvas margins at `margin-tablet` (24px).
  - **Mobile (< 768px)**: 4-column single-stream stack. Canvas margins contract to `margin` (16px). Complex multi-column data grids transform into stacked order-confirmation cards.
- **Component Padding Rhythm**:
  - Standard cards utilize `space-lg` (20px) internal padding.
  - Dense analytical blocks and telemetry widgets compress to `space-md` (12px).
  - Table cell row heights conform to 40px (compact) or 48px (standard), with `space-md` horizontal padding.

## Elevation & Depth

The design system relies on clean planar layering paired with hairline boundary separation rather than heavy skeuomorphic cast shadows.

- **Level 0 (Base Canvas)**: Flat `#f8fafc`. Houses the application layout frame and passive background regions.
- **Level 1 (Card & Section Containers)**: `#ffffff` background bounded by a continuous 1px solid border (`#e2e8f0`). Backed by an ultra-diffused shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Interactive Cards, Active Dialing Sessions, Dropdown Menus)**: `#ffffff` bounded by `#cbd5e1`. Elevation lifts via an ambient shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, Confirmation Sheets, Floating Call Controls)**: Anchored with a precise 1px border (`#cbd5e1`) and deep ambient shadow: `0 12px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.04)`.

## Shapes

The interface balances soft modern curves with structural data alignment.

- **Cards & Primary Modules**: Styled with `rounded-xl` (16px / 1rem to 1.5rem scaling) to soften the analytical rigidity of telephony graphs and logs.
- **Interactive Controls (Buttons, Inputs, Selects)**: Standardized at 8px (`rounded-md` equivalent to shape scale standard) to preserve precise hit-targets and form integrity.
- **Badges, Chips & Telemetry Dots**: Full capsule radii (`9999px`) to immediately distinguish stateful indicators and protocol badges from structural input boxes.

## Components

### Buttons
- **Primary Action (Confirm Order / Connect Trunk)**: Solid Royal Purple (`#411264`) fill, white text (`#ffffff`), 8px border radius, medium weight (`label-md`). Hover state transitions to a deepened purple (`#310b4d`) with subtle micro-scale.
- **Retry Action (Trigger Queue / Re-dial)**: Warm Amber background tint (`#fffbeb`), Amber border (`#fcd34d`), and Amber text (`#b45309`). Active/Hover triggers solid Warm Amber (`#f0a60a`) with white text.
- **Secondary / Ghost**: Pure white surface, 1px border (`#e2e8f0`), Slate text (`#0f172a`). Hover introduces subtle background shift (`#f8fafc`) and border tint (`#cbd5e1`).

### Cards & Analytical Widgets
- Pure white fill (`#ffffff`), `rounded-xl` boundary (16px), bordered in 1px `#e2e8f0`.
- Card headers feature an integrated lower border divider (`#f1f5f9`) separating control summaries from child lists.
- Analytical counter cards feature oversized numerical metrics (`headline-lg` in `#0f172a`) paired with secondary status micro-labels.

### Status Chips & Verification Badges
- **Success (Order Confirmed / Trunk Online)**: Light emerald tint background (`#ecfdf5`), border (`#a7f3d0`), with text in deep emerald (`#047857`). Preceded by a 6px solid emerald dot.
- **Warning / Retrying (Connecting / Audio Jitter)**: Soft amber tint background (`#fffbeb`), border (`#fde68a`), text in dark amber (`#b45309`).
- **Inactive / Idle**: Soft slate background (`#f1f5f9`), border (`#e2e8f0`), text in `#64748b`.

### Data Tables & Tabular Telemetry
- Header row utilizes `#f8fafc` background with uppercase `label-sm` text in `#64748b` and bottom border `#e2e8f0`.
- Alternating or clean unified rows with 1px horizontal dividers (`#f1f5f9`).
- Row hover triggers immediate transition to `#f8fafc`. Monospaced tabular alignment applied across telephony routing times, E.164 phone formats, order IDs, and latency readouts.

### Form Inputs & Search Fields
- Crisp `#ffffff` surface, 1px `#e2e8f0` stroke, 8px border radius. Placeholder styled in `#94a3b8`.
- Focus state explicitly swaps outline for a 1px solid Royal Purple border (`#411264`) backed by a soft glow ring (`rgba(65, 18, 100, 0.12)`).

### Telemetry Meters & Call Signal Indicators
- Segmented bar monitors or continuous progress tracks with `#e2e8f0` track backgrounds.
- Active signal levels map through Green (`#10b981`) for nominal decibels, escalating to Amber (`#f0a60a`) for clipping or high jitter.