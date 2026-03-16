# Design System: Uusi kielemme (Language Learning)

A semantic design system for a text-heavy, educational language-learning site. Optimized for long reading, vocabulary tables, grammar content, and clear hierarchy without visual noise.

---

## 1. Visual Theme & Atmosphere

The interface embodies a **calm, editorial study space**: clear, warm, and highly readable. The mood is **focused and encouraging**—like a well-designed textbook or a trusted reference site, not a flashy app. Generous whitespace and a restrained palette reduce cognitive load so learners can concentrate on Finnish grammar and vocabulary.

**Key characteristics:**
- High legibility for long-form articles and tables (vocabulary lists, conjugation tables)
- Warm, paper-like backgrounds to reduce screen glare during long sessions
- One strong accent color for actions and links; neutrals handle the rest
- Subtle depth (soft borders, gentle cards) without distraction
- Accessible contrast (WCAG AA minimum, AAA where practical for body text)

---

## 2. Color Architecture (Centralized)

**Rule:** Components must not use custom or hardcoded colors. All color comes from `web/app/globals.css` via semantic tokens (e.g. `bg-primary`, `text-foreground`, `var(--color-primary)` in SVG/inline).

**Palette:** High School & University — mature, calming, professional. Navy, deep green, charcoal. Subtle accents; strong hierarchy; no loud saturation except for key UI.

### Tokens (defined in `@theme` and `.dark`)

| Token | Role |
|-------|------|
| `background` | Page canvas (cool off-white light / charcoal dark) |
| `foreground` | Body text, headings (charcoal) |
| `primary` | Navy — links, primary buttons, key UI |
| `primary-foreground` | Text on primary |
| `primary-muted` | Light primary tint (e.g. mascot surfaces) |
| `secondary` | Subtle cool gray surfaces |
| `muted` / `muted-foreground` | Sections, stripes, metadata |
| `accent` | Deep green — subtle highlights, progress, secondary emphasis |
| `accent-foreground` | Text on accent |
| `success` | Deep green — correct, completed |
| `warning` / `warning-muted` | Muted amber — warnings, soft highlights |
| `destructive` | Errors, delete |
| `border` / `ring` / `ring-offset` | UI edges and focus |
| `card` / `card-foreground` | Cards and raised content |
| `dot` | Dot grid background pattern |
| `tag-1` … `tag-5` | Decorative pills/tags (landing) — from palette |

Use Tailwind utilities (`bg-primary`, `text-success`) or CSS variables (`var(--color-primary)`) in SVG/inline. Do not use hex, raw oklch, or Tailwind arbitrary colors for brand/UI.

---

## 3. Typography Rules

### Font Stack
- **Sans (UI & headings):** **DM Sans** – Clear, modern, good for headings and nav. Slightly rounded, friendly but professional.
- **Serif (Body / long reading):** **Source Serif 4** – Optimized for long-form reading; use for article body and vocabulary blocks.

Avoid: Inter, Roboto, Arial, system-ui for brand identity. System fallbacks only as last resort.

### Scale & Weights
- **Display (H1):** DM Sans, 600, 2rem–2.5rem, letter-spacing 0.02em. Page title only.
- **Heading 2:** DM Sans, 600, 1.5rem–1.75rem. Section titles (e.g. grammar sections).
- **Heading 3:** DM Sans, 500, 1.25rem. Subsections.
- **Body:** Source Serif 4, 400, 1.0625rem (17px), line-height 1.7. Articles and vocabulary text.
- **Small / Meta:** DM Sans, 400, 0.875rem, line-height 1.5. Dates, labels, breadcrumbs.
- **Table / Vocabulary:** Source Serif 4 or DM Sans, 400, 0.9375rem. Dense but readable.
- **Buttons / CTAs:** DM Sans, 500, 0.9375rem.

### Principles
- Body line-height ≥ 1.7 for long reading.
- Headings use tighter line-height (1.3) and slightly increased letter-spacing where appropriate.
- No italic for long blocks; reserve for terms or emphasis only.

---

## 4. Component Stylings

### Buttons
- **Shape:** Rounded medium (0.5rem / 8px).
- **Primary:** Background primary, text primary-foreground. Hover: primary darker.
- **Secondary:** Border border, bg transparent; hover: muted surface.
- **Ghost:** No border; hover: muted surface. For nav and low-emphasis actions.
- **Focus:** 2px ring in ring color, 2px offset. Always visible for keyboard users.

### Cards (Lesson / Article Blocks)
- **Background:** Surface (white).
- **Border:** 1px border color.
- **Radius:** 0.5rem–0.75rem.
- **Shadow:** None by default; optional subtle shadow (e.g. 0 1px 3px rgba(0,0,0,0.06)) for “elevated” cards.
- **Padding:** 1.5rem (mobile), 2rem (desktop).

### Vocabulary / Grammar Tables
- **Border:** 1px border color; collapse borders.
- **Header:** Muted surface background, font-weight 600, padding 0.75rem 1rem.
- **Cells:** Padding 0.75rem 1rem; font size 0.9375rem.
- **Striping (optional):** Every other row muted surface at 50% opacity for scannability.

### Inputs & Forms
- **Border:** 1px border; focus: 2px ring in primary.
- **Radius:** 0.375rem.
- **Padding:** 0.5rem 0.75rem (compact), 0.625rem 0.875rem (default).
- **Placeholder:** Faint color.

### Navigation
- **Items:** Medium weight, comfortable gap (1rem–1.5rem).
- **Default:** Muted foreground; **hover/active:** Primary.
- **Current page:** Primary + optional underline or bold.

---

## 5. Layout Principles

### Container & Content Width
- **Max content width (reading):** 720px (45rem) for article body to keep line length comfortable (~60–75 characters).
- **Max layout width:** 1280px for full-width layouts (home, category grids).
- **Padding:** 1rem mobile, 1.5rem tablet, 2rem desktop.

### Spacing Scale (Base 4px)
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 3rem (48px)
- **3xl:** 4rem (64px)

Use consistent vertical rhythm between sections (e.g. 2rem between article sections).

### Breakpoints (Tailwind-aligned)
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Grid
- **Article:** Single column, centered, max-width 720px.
- **Category / card grids:** 1 col mobile, 2 col tablet, 3 col desktop; gap 1.5rem.

---

## 6. Tailwind Architecture Summary

- **Tokens:** All colors and radii live in `@theme` as semantic tokens (`--color-primary`, `--color-foreground`, `--radius-md`, etc.). Use `bg-primary`, `text-muted-foreground`, not raw hex.
- **Typography:** `font-sans` (DM Sans) for UI/headings; `font-serif` (Source Serif 4) for body. Utility classes for `text-balance` on headings and `prose`-like spacing in article content.
- **Components:** Prefer CVA (class-variance-authority) for buttons, cards, inputs with variants (default, secondary, ghost) and sizes (sm, md, lg).
- **Dark mode:** Optional; use `@custom-variant dark` and override semantic colors in `.dark` so reading remains comfortable.
- **Accessibility:** Focus rings on all interactive elements; sufficient contrast for foreground/muted; avoid color alone for correct/incorrect (pair with icon or text).

---

## 7. Usage in Code

- **Tailwind:** Use semantic tokens: `bg-background`, `text-foreground`, `text-primary`, `bg-primary text-primary-foreground`, `border-border`, `rounded-lg`, `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Article body:** Wrap content in an element with class `post-body` (or use the same utility classes) so serif body and table/link styles apply.
- **Fonts:** `font-sans` (DM Sans) for UI and headings; `font-serif` for body. Loaded via `next/font` in `app/layout.tsx`.

---

## 8. Quick Reference

- **Tailwind:** `bg-primary`, `text-foreground`, `border-border`, `bg-success`, `bg-tag-1`, etc.
- **SVG / inline:** `fill="var(--color-primary)"`, `stroke="var(--color-muted-foreground)"`.
- **No custom colors:** Do not use hex, `oklch(...)`, or arbitrary Tailwind colors (`bg-[#...]`) in components. Add new tokens in `globals.css` if a new role is needed.
