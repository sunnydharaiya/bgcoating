# BG CoatingOS™ — UI Design System & Legacy Style Audit Specification

> **Source of Truth Reference**: Extracted and consolidated from all 12 original standalone legacy HTML suites in `Reference/` and `backend/static/calculator/`.  
> **Document Purpose**: Serves as the master visual and architectural blueprint for the React Single Page Application (`calculator-react`).

---

## Table of Contents

1. [Executive Summary & Core Design Philosophy](#1-executive-summary--core-design-philosophy)
2. [Layout & Container System](#2-layout--container-system)
3. [Header & Top Navigation System](#3-header--top-navigation-system)
4. [Typography Hierarchy](#4-typography-hierarchy)
5. [Color Palette & Token System](#5-color-palette--token-system)
6. [Button System & Interactive Controls](#6-button-system--interactive-controls)
7. [Form & Input Design Language](#7-form--input-design-language)
8. [Card, Panel & Section Containers](#8-card-panel--section-containers)
9. [Table System & Data Grid](#9-table-system--data-grid)
10. [Badges, Chips & Status Indicators](#10-badges-chips--status-indicators)
11. [Iconography & Micro-Visual Elements](#11-iconography--micro-visual-elements)
12. [Modals, Drawers & Overlays](#12-modals-drawers--overlays)
13. [A4 Engineering Reports & Print Engine](#13-a4-engineering-reports--print-engine)
14. [Responsive Breakpoints & Layout Adaptations](#14-responsive-breakpoints--layout-adaptations)
15. [Global vs. Module-Specific Design Patterns](#15-global-vs-module-specific-design-patterns)
16. [Current React vs. Legacy HTML Gap Analysis](#16-current-react-vs-legacy-html-gap-analysis)
17. [Phased Implementation Plan (Readiness Blueprint)](#17-phased-implementation-plan-readiness-blueprint)
18. [Ambiguities, Variations & Resolution Strategy](#18-ambiguities-variations--resolution-strategy)

---

## 1. Executive Summary & Core Design Philosophy

The legacy BG CoatingOS™ platform visual language is an **"Industrial Metallic & White Enterprise Theme"**. It avoids generic SaaS flat dark modes and instead combines:
- **Clean, High-Legibility White/Mist Engineering Workspaces** (`#FFFFFF`, `#F7F8FA`, `#F3F5F8` / `#F2F4F6`).
- **Signature BG Corporate Brand Dual-Tone Accents**:
  - **BG Crimson / Deep Maroon** (`#9E1B1E` / `#A50021` / `#A41E22`) representing the "B" in the corporate emblem.
  - **Industrial Golden Orange** (`#E87B1E` / `#E8700A` / `#F7941D` / `#F39322`) representing the "G".
- **Charcoal-Blue Graphite Sidebar Rail** (`#343A45` to `#2B303A` to `#22262E`) creating a solid, grounding anchor against the bright workspace.
- **Deep Metallic Top Header** (`linear-gradient(150deg, #14181F, #1E2530, #14181F)` or `linear-gradient(150deg, #180900, #2C1206, #1A0B03)`) with a 3px radiant amber border accent.
- **Color-Coded Engineering Calculations**:
  - **Inputs / Pre-conditions**: Warm Sand (`#FFF9EE` with border `#E6B878` and label `#8B3A00`).
  - **Outputs / Results / Pass**: Crisp Mint (`#EAF6EB` with border `#84C98A` and label `#1B5E20`).
  - **Failures / Alerts**: Soft Rose (`#FFEBEE` with border `#EF9A9A` and text `#C62828`).

```
+---------------------------------------------------------------------------------------------+
|                                    BG CoatingOS™ SHELL                                      |
+---------------------+-----------------------------------------------------------------------+
|  SIDEBAR RAIL       | TOP BAR: 64px Height | Metallic Gradient / Glassmorphism Blur         |
|  Charcoal-Blue      | Breadcrumb Trail | Project Title | Live Status Pill | Print PDF       |
|  (#343A45 ->        +-----------------------------------------------------------------------+
|   #2B303A)          | HERO BANNER: Deep Warm Metallic Gradient + Radial Ambient Glow        |
|                     | Kicker Badge | 32-36px Rajdhani Title | ISO/NACE Badges | KPI Metric  |
|  250px Width        +-----------------------------------------------------------------------+
|  Sticky             | STICKY PROGRESS & TAB RAIL: Frozen 48px Tab Bar + Live Cost/Metric    |
|  Minimal Clean Text +-----------------------------------------------------------------------+
|  Active Orange Bar  | WORKING CANVAS (Max 1100px or 1400px Container):                      |
|                     | [ Section Card 1: Parameters ]  [ Section Card 2: Take-off Grid ]    |
|                     | [ Input: #FFF9EE / #E6B878 ]    [ Output: #EAF6EB / #84C98A ]        |
+---------------------+-----------------------------------------------------------------------+
```

---

## 2. Layout & Container System

### 2.1 CSS Layout Variables
```css
:root {
  --header-h: 64px;       /* Top bar height */
  --sidebar-w: 250px;     /* Full expanded sidebar width */
  --sidebar-c: 74px;      /* Collapsed icon-only rail */
  --gut: 12px;            /* Workspace outer padding & gap */
  --box-r: 12px;          /* Main workspace rounded container */
  --barh: 48px;           /* Sub-tab navigation bar height */
}
```

### 2.2 Container Dimensions & Max-Widths
| Layout Context | Legacy Max Width | Padding / Gutter | Usage Scope |
| :--- | :--- | :--- | :--- |
| **OS Global App Shell (`#app`)** | `100vw` (Viewport bound) | `padding: 12px; gap: 12px;` | Master flex wrapper housing sidebar + canvas |
| **Full Module Canvas (`.main`)** | `flex: 1; min-width: 0;` | `border-radius: 12px; overflow: hidden;` | Outer white container with border `#E6E8EC` |
| **Standard Module Page (`.wrap`)** | `max-width: 1400px;` | `padding: 0 18px 60px; margin: 0 auto;` | Blaster, Painter, TSA, Inspection Suites |
| **Compact Estimator (`.wrap`)** | `max-width: 1100px;` | `padding: 18px 14px 60px; margin: 0 auto;` | Quick Unit-Rate, Manpower Estimator |
| **Narrow Forms (`.narrow`)** | `max-width: 1040px;` | `margin-inline: auto;` | Single-column forms & account modals |
| **A4 Printable Dossier (`.a4-sheet`)**| `210mm` (Portrait) / `297mm` (Landscape)| `padding: 15mm; margin: 0 auto;` | Formal engineering reports, QC certifications |

### 2.3 Surface Color Tokens
- **`--paper`**: `#FFFFFF` — Card faces, printable sheets, modal dialogs.
- **`--mist`**: `#F7F8FA` — Secondary section background, inner wells, disabled controls.
- **`--ws`**: `#F3F5F8` (or `#F2F4F6`) — Global canvas background behind white cards.
- **`--card-2`**: `#FFF8F1` — Hover highlighting on table rows and selected cards.
- **`--line`**: `#E6E8EC` / `#D8DEE5` — Standard 1px structural container borders.
- **`--line-strong`**: `#CBD5E1` / `#BFC8D2` — Strong borders on interactive inputs and active tabs.

### 2.4 Shadows & Elevation
- **Card Base**: `0 2px 8px rgba(20, 24, 32, 0.06)` (Tailwind: `shadow-xs` / `shadow-sm`)
- **Card Hover / Elevation**: `0 6px 18px rgba(20, 24, 32, 0.08)` (Tailwind: `shadow-md`)
- **Floating Modals / Popovers**: `0 10px 30px rgba(20, 24, 32, 0.14)` (Tailwind: `shadow-xl`)
- **Button Glow**: `0 4px 12px rgba(247, 148, 29, 0.28)` (Tailwind: `shadow-orange-500/30`)

---

## 3. Header & Top Navigation System

The legacy design provides two distinct, premium header standards:

```
Pattern A (Platform OS Header):
+------------------------------------------------------------------------------------+
| [=]  BG COATINGOS™ / COATING CALCULATOR / WFT RANGE        [PRO PASS] [?] [Zoom] [👤]|
+------------------------------------------------------------------------------------+

Pattern B (Industrial Engineering Suite Header):
+------------------------------------------------------------------------------------+
| [LOGO]  BG GROUP | QUICK UNIT-RATE ESTIMATION              [LIVE ● ACTIVE] [🖨️ PDF]|
|         PAINT & COATING CONSULTANTS                                                |
+------------------------------------------------------------------------------------+
```

### 3.1 Pattern A: White Enterprise OS Header (`.apphead` / `Header.jsx`)
- **Dimensions**: Height `64px` (`h-16`), padding `0 1.4rem`.
- **Background**: `rgba(255, 255, 255, 0.92)` with `backdrop-filter: blur(12px)`.
- **Border**: Bottom `1px solid var(--line)` (`#E6E8EC`).
- **Left Elements**:
  - Sidebar toggle button (`.icon-btn .sb-toggle`): `38x38px`, `border-radius: 11px`, `border: 1px solid #E6E8EC`. Hover: `border-color: #F7941D; background: #FFF4E3;`.
  - Breadcrumb trail (`.crumb`): `font-family: 'IBM Plex Mono' / 'JetBrains Mono'`, `font-size: 0.70rem`, `letter-spacing: 0.14em`, uppercase, with chevron separators.
- **Right Elements**:
  - Plan Status Pill (`.plan-pill`): `background: #FFF4E3; border: 1px solid #F3D2A0; color: #B05E00; border-radius: 999px; padding: 0.4rem 0.8rem; font-size: 0.62rem; font-family: monospace; font-weight: 700;`.
  - Zoom Controls (`.zoomer`): Minimal rounded pill with `[-] [90%] [+]`.
  - User Avatar (`.avatar`): `34x34px`, `border-radius: 10px`, `background: linear-gradient(135deg, #A41E22, #7E1418)`, white initials.

### 3.2 Pattern B: Industrial Engineering Header (`.hdr`)
- **Dimensions**: Height `64px` (or `62px`), container max-width `1400px` (or `1100px`).
- **Background**: `linear-gradient(150deg, #14181F, #1E2530, #14181F)` or `linear-gradient(150deg, #180900, #2C1206, #1A0B03)`.
- **Border**: Bottom `3px solid #E87B1E` with radiant glow `linear-gradient(90deg, transparent, #E87B1E 20%, #F39322 50%, #E87B1E 80%, transparent)`.
- **Branding Area**:
  - Logo Container (`.lw`): `46x46px`, `border-radius: 10px`, `background: linear-gradient(135deg, #FFF, #FFF3E5)`, `border: 2px solid rgba(232, 112, 10, 0.5)`, shadow `0 4px 14px rgba(232, 112, 10, 0.35)`.
  - Title (`.bn`): `font-family: 'Rajdhani', sans-serif`, `font-size: 20px`, `font-weight: 700`, `color: #FFFFFF`. Suffix span (`.bn span`): `color: #F39322`.
  - Subtitle (`.bt`): `font-size: 9px`, `color: rgba(255, 255, 255, 0.5)`, `letter-spacing: 1.6px`, uppercase.
- **Header Actions**:
  - Live Status Pill (`.hpill`): `background: linear-gradient(135deg, #F39322, #9E1B1E)`, `color: #fff`, `border-radius: 20px`, `font-size: 10px font-bold`, with animated glowing green/yellow dot (`.dot`).
  - Action Buttons (`.hbtn`): `background: rgba(255, 255, 255, 0.08)`, `border: 1px solid rgba(255, 255, 255, 0.22)`, `color: #fff`.
  - Primary Print/Export Button (`.hbtn.primary`): `background: linear-gradient(135deg, #E87B1E, #9E1B1E)`, `border-color: #9E1B1E`, shadow `0 2px 10px rgba(232, 112, 10, 0.4)`.

---

## 4. Typography Hierarchy

The typography system uses 4 purpose-driven font families across the legacy files:

```
1. 'Rajdhani', sans-serif      --> Hero titles, KPI numbers, section titles, table headers
2. 'Inter', sans-serif         --> Body copy, form inputs, labels, descriptions
3. 'Sora', sans-serif          --> Platform display headings, modal titles
4. 'IBM Plex Mono' / Monospace --> Standards codes (ISO 12944), formulas, units, badges
```

| Type Role | Font Family | Size | Weight | Letter Spacing | Case | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title (`.htit`)** | `Rajdhani` | `clamp(22px, 3.5vw, 36px)` | 700 (Bold) | `-0.4px` | Title Case | `#FFFFFF` (Accent: `#F39322`) |
| **Hero Subtitle (`.hsub`)** | `Inter` | `11.5px / 12px` | 400 (Regular) | Normal | Sentence | `rgba(255, 255, 255, 0.65)` |
| **Section Header (`.sec-t`)** | `Rajdhani` | `14px - 16px` | 700 (Bold) | `+0.3px` | Upper/Title | `#1B222C` / `#222222` |
| **Section Subtitle (`.sec-s`)** | `Inter` | `10px - 11px` | 400 (Regular) | Normal | Sentence | `#7E8B99` / `#8A9099` |
| **Field Label (`label`)** | `Inter` | `10px` | 700 (Bold) | `+0.7px` | UPPERCASE | `#4E5B6A` / `#6B3A1E` |
| **Field Hint (`.lhint`)** | `Inter` | `9px` | 400 (Regular) | Normal | Sentence | `#7E8B99` / `#9C7551` |
| **Input Value (`input`)** | `Inter` / `Mono` | `12px` | 600 (Semibold)| Normal | Normal | `#1B222C` / `#222222` |
| **Large KPI Stat (`.prog-cost-v`)** | `Rajdhani` | `28px - 36px` | 700 / 800 | `-0.5px` | Normal | `#9E1B1E` / `#E87B1E` |
| **Technical Code / Standard** | `IBM Plex Mono` | `10.5px` | 600 (Semibold)| `+0.12em` | UPPERCASE | `#D97706` / `#A50021` |
| **Table Header (`th`)** | `Rajdhani` | `11px` | 700 (Bold) | `+0.5px` | UPPERCASE | `#FFFFFF` (on dark) / `#4E5B6A` |
| **Table Body (`td`)** | `Inter` | `11.5px / 12px` | 500 (Medium) | Normal | Normal | `#1B222C` |

---

## 5. Color Palette & Token System

```
[ PRIMARY BRAND ACCENTS ]
#A50021 / #9E1B1E (Deep Crimson)  ████████████  Brand "B", Primary Buttons, Critical KPI
#E8700A / #E87B1E (BG Orange)     ████████████  Brand "G", Active Rails, Gradients
#F5911F / #F39322 (Golden Amber)  ████████████  Highlights, Progress Bars, Accents
#FFF4E3 / #FFF9EE (Warm Sand)     ████████████  Input Wells, Active Chips, Badges

[ CANVAS & SURFACES ]
#FFFFFF (Paper White)             ████████████  Cards, Modals, Printable Dossiers
#F7F8FA / #FAFBFC (Mist Gray)     ████████████  Secondary Surfaces, Table Alternating
#F3F5F8 / #F2F4F6 (Workspace Gray)████████████  Underlying Workspace Background

[ INDUSTRIAL STATUS COLORS ]
#2E7D32 / #1E9E50 (ISO Green)     ████████████  Pass, Approved, Compliant, Released
#1565C0 / #1976D2 (Info Blue)     ████████████  In Progress, Testing, Data Verification
#E65100 / #D97706 (Warning Amber) ████████████  Review Required, Hold, Quarantined
#C62828 / #D32F2F (Danger Red)    ████████████  Fail, Non-Compliant, Rejected
```

### Complete Hex Reference Table
| Token Name | Hex Code | Purpose / Application |
| :--- | :--- | :--- |
| `brand-crimson` | `#A50021` / `#9E1B1E` | Primary header gradient, active indicator, danger/emphasis |
| `brand-orange` | `#E8700A` / `#E87B1E` | Primary accent, border accent, active sidebar glow |
| `brand-gold` | `#F5911F` / `#F39322` | Hero highlights, progress bar fills, kicker badges |
| `brand-gold-light`| `#FAC472` / `#F8C078` | Gradient end-stops, sub-nav dots, hover outlines |
| `bg-canvas` | `#F3F5F8` / `#F2F4F6` | Global page background |
| `bg-card` | `#FFFFFF` | Primary card background |
| `bg-card-header` | `linear-gradient(135deg, #FDF1E6, #FAFBFC)` | Section card top bar gradient |
| `input-bg` | `#FAFBFC` / `#FFF9EE` | Form input background well |
| `input-border` | `#D8DEE5` / `#E6B878` | Input normal & highlighted borders |
| `output-bg` | `#EAF6EB` | Calculation output background well |
| `output-border` | `#84C98A` | Calculation output green border |
| `txt-primary` | `#1B222C` / `#222222` | Primary high-contrast text |
| `txt-secondary` | `#4E5B6A` / `#5F6672` | Secondary text, form labels |
| `txt-muted` | `#7E8B99` / `#8A9099` | Helper text, hints, breadcrumbs |

---

## 6. Button System & Interactive Controls

```
1. Primary Action Button (Gradient Pill):
   +---------------------------------------+
   |  ⚡ CALCULATE & RECONCILE BATCH  ->   |   bg: linear-gradient(135deg, #E87B1E, #9E1B1E)
   +---------------------------------------+   color: #fff | shadow: 0 4px 14px rgba(232,112,10,.4)

2. Secondary Action Button (Ghost / White):
   +---------------------------------------+
   |  🔄 RESET DEFAULTS                    |   bg: #FFFFFF | border: 1px solid #D8DEE5
   +---------------------------------------+   color: #4E5B6A | hover: text-#9E1B1E, border-#F3D2A0

3. Table / Header Mini Button (.hbtn / .btn-sm):
   +-------------------+
   |  🖨️ Print Dossier |   bg: rgba(255,255,255,0.08) | border: 1px solid rgba(255,255,255,0.2)
   +-------------------+   padding: 5px 12px | font-size: 11px font-weight: 600
```

### Button Specifications
| Button Variant | Classes / CSS Styling | Padding & Radius | Hover / Active Behavior |
| :--- | :--- | :--- | :--- |
| **Primary Pill (`.btn-primary`)** | `background: linear-gradient(135deg, #E87B1E, #9E1B1E); color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;` | `padding: 10px 22px; border-radius: 999px;` | `transform: translateY(-2px); box-shadow: 0 6px 18px rgba(232,112,10,0.45);` |
| **Secondary Reset (`.btn-ghost`)** | `background: #FFFFFF; border: 1.5px solid #D8DEE5; color: #4E5B6A; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px;` | `padding: 9px 18px; border-radius: 10px;` | `border-color: #E87B1E; color: #9E1B1E; background: #FFF4E3;` |
| **Report Green Action (`.btn-success`)** | `background: linear-gradient(135deg, #43A047, #2E7D32); color: #fff; font-family: 'Rajdhani'; font-weight: 700;` | `padding: 10px 22px; border-radius: 999px;` | `box-shadow: 0 4px 14px rgba(46,125,50,0.4); transform: translateY(-2px);` |
| **Action Icon Button (`.icon-btn`)** | `width: 36px; height: 36px; border-radius: 9px; border: 1px solid #D8DEE5; background: #fff; color: #4E5B6A; display: grid; place-items: center;` | `36x36px square` | `border-color: #E87B1E; color: #E87B1E; background: #FFF4E3; transform: translateY(-1px);` |

---

## 7. Form & Input Design Language

```
+-------------------------------------------------------------+
|  NOMINAL DRY FILM THICKNESS (DFT) * [REQ]                   |  <-- label (10px, bold, uppercase #4E5B6A)
|  +-------------------------------------------------------+  |
|  |  250                                             µm   |  |  <-- input well (12px Inter, border: #D8DEE5)
|  +-------------------------------------------------------+  |
|  Target dry film thickness specified in ISO 12944-5 table   |  <-- hint (9px, text-#7E8B99)
+-------------------------------------------------------------+
```

### 7.1 Field Structure & CSS Values
- **Input Wrapper (`.iw input, .iw select, .iw textarea`)**:
  - `background: #FAFBFC;`
  - `border: 1.5px solid #D8DEE5;`
  - `border-radius: 10px;`
  - `padding: 8px 11px;`
  - `font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #1B222C;`
- **Focus State**:
  - `border-color: #E87B1E;`
  - `box-shadow: 0 0 0 3px rgba(232, 112, 10, 0.12);`
  - `background: #FFFFFF;`
- **Calculation Input Well (`.calc-in`)**:
  - `background: #FFF9EE; border: 1.5px solid #E6B878; color: #8B3A00;`
- **Calculation Output Well (`.calc-out`)**:
  - `background: #EAF6EB; border: 1.5px solid #84C98A; color: #1B5E20; font-weight: 700;`

### 7.2 Multi-Column Grids
- `.frow.c2`: `grid-template-columns: 1fr 1fr; gap: 10px;`
- `.frow.c3`: `grid-template-columns: 1fr 1fr 1fr; gap: 10px;`
- `.frow.c4`: `grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;`
- Responsive breakdown: Below `680px`, grids collapse to single column `grid-template-columns: 1fr;`.

---

## 8. Card, Panel & Section Containers

The fundamental structural unit across all legacy engineering calculators is the `.sec` section card:

```
+---------------------------------------------------------------------------------------------+
| [🎨] 01. SURFACE PREPARATION SPECIFICATION                          [ISO 8501-1 SA 2.5]     | <-- .sec-h
|      Abrasive blast cleaning profile & cleanliness requirements                             |
+---------------------------------------------------------------------------------------------+
|                                                                                             |
|   [ Form Field Grid .frow .c3 ]                                                             | <-- .sec-b
|   +-------------------+  +-------------------+  +-------------------+                       |
|   | Abrasive Media    |  | Blast Grade (ISO) |  | Profile Rz (µm)   |                       |
|   | [ Garnet 30/60 v] |  | [ Sa 2½ (Near-W) ]|  | [ 65 - 85       ] |                       |
|   +-------------------+  +-------------------+  +-------------------+                       |
|                                                                                             |
+---------------------------------------------------------------------------------------------+
```

### 8.1 Card CSS Specifications
- **Container (`.sec` / `.card`)**:
  - `background: #FFFFFF;`
  - `border: 1px solid #D8DEE5;`
  - `border-radius: 16px;`
  - `box-shadow: 0 2px 12px rgba(20, 24, 31, 0.08);`
  - `overflow: hidden; margin-bottom: 14px;`
- **Header (`.sec-h`)**:
  - `background: linear-gradient(135deg, #FDF1E6, #FAFBFC);`
  - `padding: 11px 16px;`
  - `border-bottom: 1px solid #D8DEE5;`
  - `display: flex; align-items: center; gap: 10px;`
- **Header Icon (`.sec-i`)**:
  - `width: 32px; height: 32px; border-radius: 8px;`
  - `background: linear-gradient(135deg, #E87B1E, #9E1B1E);`
  - `display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;`
  - `box-shadow: 0 2px 7px rgba(200, 73, 10, 0.28);`
- **Header Tag / Badge (`.sec-bd`)**:
  - `background: rgba(184, 52, 0, 0.07); border: 1px solid rgba(184, 52, 0, 0.16);`
  - `border-radius: 5px; padding: 3px 8px; font-size: 9px; font-weight: 700; color: #9E1B1E;`
- **Body (`.sec-b`)**:
  - `padding: 16px 18px;`

---

## 9. Table System & Data Grid

```
+---------------------------------------------------------------------------------------------+
| COAT NO. | PRODUCT GENERIC TYPE     | DFT (µm) | VS (%) | SPREAD (m²/L)| RATE (₹) | AMOUNT |
+----------+--------------------------+----------+--------+--------------+----------+--------+
| Coat 01  | Zinc Rich Epoxy Primer   | 75       | 65%    | 8.67         | ₹450     | PASS ✓ |
| Coat 02  | Epoxy High Build MIO     | 150      | 80%    | 5.33         | ₹380     | PASS ✓ |
| Coat 03  | Aliphatic Polyurethane   | 50       | 60%    | 12.00        | ₹520     | PASS ✓ |
+----------+--------------------------+----------+--------+--------------+----------+--------+
```

### Table CSS Specifications
- **Header Row (`th`)**:
  - `background: linear-gradient(135deg, #2A3340, #1E2530);`
  - `color: #FFFFFF;`
  - `font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;`
  - `padding: 9px 12px; border-right: 1px solid rgba(255,255,255,0.08);`
- **Body Rows (`td`)**:
  - `font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; color: #1B222C;`
  - `padding: 8px 12px; border-bottom: 1px solid #E6E8EC;`
  - Alternating rows (`tbody tr:nth-child(even)`): `background: #FAFBFC;`
  - Hover (`tbody tr:hover`): `background: #FFF8F1;`
- **Numerical Alignment**: Right-aligned (`text-right font-mono font-bold`).

---

## 10. Badges, Chips & Status Indicators

```
[ STATUS BADGES ]
Compliant / Pass:    [ ● PASS (ISO 19840) ]   bg: #E8F5E9 | border: #A5D6A7 | color: #2E7D32
In Review / Hold:    [ ⚠️ REVIEW REQUIRED ]   bg: #FFF3E0 | border: #FFE082 | color: #E65100
Rejected / Fail:     [ ✗ NON-COMPLIANT ]      bg: #FFEBEE | border: #EF9A9A | color: #C62828
Information / Code:  [ ℹ️ ISO 12944 C5-M ]    bg: #E3F2FD | border: #90CAF9 | color: #1565C0
Hot / Focus Stat:    [ 🔥 25-YR LCC ]         bg: #FFF4E3 | border: #F3D2A0 | color: #B05E00
```

### Chip CSS Specifications
- **Standard Filter Chip (`.chip`)**:
  - `display: inline-flex; align-items: center; gap: 0.4rem;`
  - `font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase;`
  - `padding: 0.32rem 0.75rem; border-radius: 999px; border: 1px solid #CBD5E1; background: #F7F8FA; color: #475569;`
- **Pulsing Status Indicator (`.dot`)**:
  - `width: 6px; height: 6px; border-radius: 50%; display: inline-block;`
  - Animation: `animation: pulse 1.6s infinite;`
  - Pass: `#4ADE80` (shadow: `0 0 8px #4ADE80`), Warning: `#FFE45A` (shadow: `0 0 8px #FFE45A`).

---

## 11. Iconography & Micro-Visual Elements

- **Primary Icons**: Industrial coating SVGs / Lucide React icons.
- **Icon Sizing Scale**:
  - Micro / Inline: `12px - 14px` (Button & chip icons)
  - Standard Form / Header: `16px - 18px`
  - Section Icon Well (`.sec-i`): `32x32px` container with `16px` icon
  - Module Hub Icon Card (`.mc-ico`): `46x46px` container with `22px` icon
- **Icon Backgrounds**:
  - Default: `background: #FFF4E3; border: 1px solid #F3D2A0; color: #D97706;`
  - Accent / Section: `background: linear-gradient(135deg, #E87B1E, #9E1B1E); color: #FFFFFF;`

---

## 12. Modals, Drawers & Overlays

```
+-----------------------------------------------------------------------------+
| [MODAL BACKDROP: rgba(34, 38, 44, 0.45) + backdrop-filter: blur(4px)]      |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | [⚙️] COMPANY PROFILE & LETTERHEAD CUSTOMIZATION              [ ✕ ]    |  |
|  +-----------------------------------------------------------------------+  |
|  |                                                                       |  |
|  |  Modal Body: Form Grid, Logo Uploader, Tax ID, Address                |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|  | [ Cancel ]                                         [ Save Changes ]   |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
```

### Modal CSS Specifications
- **Backdrop Overlay (`#modalBackdrop` / `#faqScrim`)**:
  - `position: fixed; inset: 0; z-index: 400;`
  - `background: rgba(34, 38, 44, 0.45); backdrop-filter: blur(4px);`
- **Modal Window (`.modal-box` / `.up-box`)**:
  - `width: min(840px, 94vw); max-height: 90vh; overflow-y: auto;`
  - `background: #FFFFFF; border: 1px solid #E6E8EC; border-radius: 16px;`
  - `box-shadow: 0 10px 30px rgba(20, 24, 32, 0.14); padding: 24px;`
  - Animation: `animation: upIn .35s cubic-bezier(.22,1,.36,1);`
- **Slide-in Right Drawer (`#faqPanel` / `.drawer-panel`)**:
  - `width: min(460px, 94vw); position: fixed; top: 0; right: 0; bottom: 0;`
  - `background: #FFFFFF; border-left: 1px solid #E6E8EC; box-shadow: -18px 0 60px rgba(20,24,32,0.22);`

---

## 13. A4 Engineering Reports & Print Engine

Every major module includes a dedicated A4 Print Engine for generating compliance certificates, inspection dossiers, and quotation sheets.

```
+-----------------------------------------------------------------------------+
|                               A4 SHEET (210mm x 297mm)                      |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | [CLIENT LOGO]         BG GROUP OF CONSULTANTS          [BG OS LOGO]   |  |
|  |                       PROTECTIVE COATING DOSSIER                      |  |
|  +-----------------------------------------------------------------------+  |
|  | Project: 50,000 m³ Crude Oil Storage Tank   | Report No: CIR-2026-08    |  |
|  | Client: Indian Oil Corporation Ltd.         | Date: 31-Aug-2026         |  |
|  +-----------------------------------------------------------------------+  |
|  |                                                                       |  |
|  |  WATERMARK: "CONFIDENTIAL / QC PASSED" (rgba(165,0,33,0.08) rotated) |  |
|  |                                                                       |  |
|  |  [ Engineering Specification & Measurement Table ]                   |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|  | Prepared By (QA/QC):            | Approved By (NACE/AMPP III):        |  |
|  | [ Stamp & Signature ]           | [ Stamp & Signature ]               |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
```

### Print CSS Architecture
```css
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  body {
    background: #FFFFFF !important;
    color: #1B222C !important;
    zoom: 1 !important;
  }
  .sidebar, .topbar, .hdr, .hero, .frozen-top, .btn-row, .no-print {
    display: none !important;
  }
  .main, .wrap {
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
  }
  .a4-sheet {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    width: 100% !important;
    break-after: page;
  }
}
```

---

## 14. Responsive Breakpoints & Layout Adaptations

| Breakpoint | Screen Width | Sidebar Behavior | Header Behavior | Grid Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop Ultra** | `> 1400px` | Expanded (250px) | Full Title + Status Pill + Print | Multi-column (`.c4`, `.c3`) |
| **Desktop Standard**| `1100px - 1400px` | Expanded (250px) | Full Breadcrumb + Actions | Responsive (`.c3`, `.c2`) |
| **Tablet Landscape**| `960px - 1100px` | Collapsed Rail (74px)| Compact Breadcrumb | 2 Columns (`.c2`) |
| **Tablet Portrait** | `768px - 960px` | Off-canvas Drawer | Hamburger menu visible | 2 / 1 Columns |
| **Mobile Device** | `< 768px` | Mobile overlay modal | Hidden contact text, stacked buttons| Single Column (`.c1`) |

---

## 15. Global vs. Module-Specific Design Patterns

| Pattern Category | Global Standard Pattern | Module-Specific Variations |
| :--- | :--- | :--- |
| **Main Canvas Layout** | White Enterprise Card Layout (`#ws` background + `#FFFFFF` card layers) | Quick Unit-Rate & Manpower Estimators use dark warm metallic hero headers with glowing ambient radial lights |
| **Color Coding** | `--accent: #F7941D` (Orange), `--crimson: #A41E22` (Maroon) | TSA suite uses orange-amber highlights; PFP suite uses crimson fire highlights; Inspection CIR uses green pass indicators |
| **Navigation Tabs** | Horizontal clean pill tabs (`48px` bar) | Estimators include a frozen sticky progress panel with live SVG circular donut gauges |
| **Form Inputs** | Pale well `#FAFBFC`, focus border `#E87B1E` | Calculation forms highlight raw material inputs in `#FFF9EE` and output totals in `#EAF6EB` |
| **Reports** | Formal A4 Letterhead with Dual-Logo | Blaster/Painter qualifications include digital ID card badge generation with operator photograph |

---

## 16. Current React vs. Legacy HTML Gap Analysis

| UI Area | Legacy Reference HTML Standard | Current React Implementation | Gap / Discrepancy | Correction Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Color Tokens** | White/Mist enterprise canvas (`#F3F5F8`), White cards (`#FFFFFF`), Crimson `#A50021`, Orange `#E8700A` | Some sub-components render dark slate surfaces (`bg-slate-900`, `bg-slate-950`) | Inconsistent light/dark theme mixing across pages | **HIGH** |
| **Typography System** | `Rajdhani` (Headers/Numbers), `Inter` (Body/Forms), `JetBrains Mono` (Data) | Only `Inter` and `JetBrains Mono` imported in `index.html` | Missing Google Font `Rajdhani` for engineering titles and stats | **HIGH** |
| **Section Card Headers** | Subtle warm gradient `linear-gradient(135deg, #FDF1E6, #FAFBFC)` with icon box `32x32px` | Plain flat borders or dark slate backgrounds in several tools | Cards lack the signature BG CoatingOS warm section header | **MEDIUM** |
| **Calculation Inputs** | Highlighted Sand (`#FFF9EE` with border `#E6B878`) vs Mint Output (`#EAF6EB`) | Generic white/slate inputs used for both inputs and outputs | Loss of clear visual distinction between user inputs & formulas | **MEDIUM** |
| **Sticky Progress Panel**| Frozen top bar with live SVG donut chart (`.prog-donut`) and cost summary | Implemented in React but styled with dark slate colors | Needs exact gradient background `linear-gradient(180deg, #FFFAF0, #FFF3E5)` | **LOW** |
| **Print & A4 Styling** | Dedicated `@media print` with exact 210mm sheet borders and watermark | Print buttons present, but some CSS rules missing print hide tags | Printouts may include sidebar or unwanted UI buttons | **MEDIUM** |

---

## 17. Phased Implementation Plan (Readiness Blueprint)

> **Notice**: As per strict instructions, execution of this plan will **NOT** begin until you give explicit instruction.

### Phase A — Global Foundations & Font Injection
- Add `Rajdhani:wght@500;600;700` and `Sora:wght@600;700;800` Google Fonts to `index.html`.
- Standardize CSS root variables in `src/styles/coatingos.css`.
- Ensure base `<body>` in `index.html` uses `background-color: var(--ws)` (`#F3F5F8`).

### Phase B — Core UI Primitives & Card Standardization
- Standardize `.sec` card wrapper with `linear-gradient(135deg, #FDF1E6, #FAFBFC)` header across all components.
- Apply `.calc-in` (`#FFF9EE`) and `.calc-out` (`#EAF6EB`) classes to calculation tools.
- Unify Primary Pill Button gradient (`linear-gradient(135deg, #E87B1E, #9E1B1E)`).

### Phase C — Top Header & Hero Banners
- Align `Header.jsx` with the exact 64px height, glassmorphic backdrop blur, and live status pill.
- Ensure Hero Banners in Estimator & Qualification modules reflect the dark warm metallic styling.

### Phase D — Module Pages & Register Panels
- Review and verify all 11 module pages (`CoatingCalculatorPage`, `UnitRateEstimationPage`, `ManpowerEstimationPage`, `BlasterQualificationPage`, `PainterQualificationPage`, `TsaQualificationPage`, `InspectionReportingPage`, `AcademyLmsPage`, `ContractorManagementPage`, `KnowledgePage`, `SettingsPage`).
- Standardize registers, history tables, and modal letterhead controls.

### Phase E — A4 Print Engine & Cross-Browser Validation
- Validate print stylesheets (`@media print`) across Chrome, Firefox, Edge, and Safari.
- Verify zero regression across all calculation engines and formula solvers.

---

## 18. Ambiguities, Variations & Resolution Strategy

1. **Font Family Divergence Across HTML Files**:
   - *Observation*: `02. Coating Calculator` uses `Sora` for display, while `04. Quick Unit-Rate`, `06. Blaster`, and `08. TSA` use `Rajdhani`.
   - *Resolution*: Standardize on `Rajdhani` for technical titles, KPI cards, and table headers; `Inter` for all form inputs, body text, and labels; `JetBrains Mono` for standards, units, and formulas.
2. **Canvas Width Variations (1100px vs 1400px)**:
   - *Observation*: Estimator tools use `max-width: 1100px`, whereas Inspection and Qualification dossiers use `max-width: 1400px`.
   - *Resolution*: Maintain responsive max-widths where dense tables (CIR Inspection, TSA matrix) utilize `max-w-7xl` (1400px) and focused forms utilize `max-w-6xl` (1150px).
3. **Light Mode vs Dark Mode Accents**:
   - *Observation*: The platform shell is predominantly a crisp, white enterprise canvas (`#FFFFFF` on `#F3F5F8`), but Hero Banners and Table Headers leverage dark industrial graphite (`#14181F` to `#1E2530`).
   - *Resolution*: Preserve this exact signature dual-tone contrast. Do not turn the whole page dark, and do not make the headers flat white.
