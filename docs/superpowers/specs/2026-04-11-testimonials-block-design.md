# Testimonials Block Redesign

## Overview

Replace the existing masonry-style testimonial block with a single-testimonial-at-a-time carousel. Manual navigation via counter + arrows. Ultra-minimal centered layout with a decorative quote mark.

## Layout

- **Section header:** Title (font-headline, centered) + optional description (font-body, italic, centered)
- **Testimonial card (centered, stacked):**
  1. Decorative serif `"` character — large, primary-container color (#d4a373)
  2. Quote text — font-headline, italic, centered, text-on-surface-variant
  3. Author line — single line: `Name · Role`, uppercase, tracked, text-outline color
  4. Counter nav — `← 1 / N →`, arrows in primary color, counter in outline color

## Navigation

- Manual only — no auto-advance
- Left/right arrows decrement/increment the active index
- Wraps around: last → first, first → last
- Counter displays `currentIndex / totalCount`

## Transition

- CSS-driven (per CLAUDE.md: always prefer CSS over JS for animations)
- Subtle horizontal slide + fade
- ~20-30px translateX, ~300ms duration, ease timing
- Direction-aware: clicking right slides content left (and vice versa)
- Use CSS transitions on transform + opacity. Manage active state via a CSS class toggle (JS only sets the class, CSS does the animation).

## TinaCMS Schema

**Parent block fields:**
- `background` — section background picker (existing)
- `title` — string
- `description` — textarea (optional)
- `testimonials` — object list (3-6 items expected)

**Individual testimonial fields:**
- `quote` — string (textarea)
- `author` — string
- `role` — string

**Removed:** `avatar` field (not displayed in this layout)

**`defaultItem`** must populate all fields including a sample testimonial list item.

## Responsive

- Quote text: `text-xl` on mobile, `text-2xl md:text-3xl` on larger screens
- Decorative quote mark scales proportionally
- Counter + arrows remain touch-friendly (min 44px tap targets)
- Section padding follows existing Section component (`py-24 md:py-32`, `px-6 md:px-12`)
- Max-width on quote text container (~`max-w-2xl`) to maintain readable line lengths

## Files Modified

- `components/blocks/testimonial.tsx` — full rewrite of component + schema
- `tina/tina-lock.json` — will regenerate after schema change
- `content/pages/home.mdx` — update if existing testimonial block data references avatar

## Implementation Notes

- Component uses `'use client'` since it manages active index state
- Only JS needed: state for `activeIndex` and `direction` (for animation), click handlers to update them
- All visual transitions are CSS — JS only toggles classes
- Keep the existing export names (`Testimonial`, `testimonialBlockSchema`) so no changes needed in `components/blocks/index.tsx` or `tina/collection/page.ts`
