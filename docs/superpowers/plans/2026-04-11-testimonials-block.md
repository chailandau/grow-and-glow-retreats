# Testimonials Block Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the masonry testimonial block with a single-at-a-time carousel featuring manual counter + arrow navigation and a subtle slide-fade transition.

**Architecture:** Single `'use client'` component managing `activeIndex` and `direction` state. CSS handles all animation via transition classes toggled by JS. TinaCMS schema updated to remove avatar field.

**Tech Stack:** React, TinaCMS, Tailwind CSS v4, TypeScript

---

### Task 1: Rewrite the TinaCMS schema

**Files:**
- Modify: `components/blocks/testimonial.tsx:54-131` (the `testimonialBlockSchema` export)

- [ ] **Step 1: Replace the schema**

Replace the entire `testimonialBlockSchema` in `components/blocks/testimonial.tsx`. Remove the `avatar` field from testimonial items. Remove the Avatar imports at the top of the file. Keep the same export name.

```tsx
export const testimonialBlockSchema: Template = {
  name: "testimonial",
  label: "Testimonial",
  ui: {
    previewSrc: "/blocks/testimonial.png",
    defaultItem: {
      background: "bg-surface",
      title: "Words from our guests",
      description:
        "Every retreat leaves a lasting imprint. Here's what our community has to say.",
      testimonials: [
        {
          quote:
            "I arrived exhausted and left feeling like myself again. The silence, the space, the intention behind everything — it was exactly what I needed.",
          author: "Maya Chen",
          role: "Returning Guest",
        },
        {
          quote:
            "The morning yoga sessions changed something in me I can't quite name. I came for relaxation and left with clarity.",
          author: "Lena Park",
          role: "First-Time Guest",
        },
        {
          quote:
            "Every detail felt intentional — from the meals to the journaling prompts. I've never felt so held.",
          author: "Sofia Reyes",
          role: "Weekend Retreat",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      list: true,
      label: "Testimonials",
      name: "testimonials",
      ui: {
        defaultItem: {
          quote:
            "This retreat gave me the space to breathe and the clarity to move forward.",
          author: "Guest Name",
          role: "Retreat Attendee",
        },
        itemProps: (item) => ({
          label: `${item.author} — ${item.quote?.substring(0, 40)}...`,
        }),
      },
      fields: [
        {
          type: "string",
          ui: {
            component: "textarea",
          },
          label: "Quote",
          name: "quote",
        },
        {
          type: "string",
          label: "Author",
          name: "author",
        },
        {
          type: "string",
          label: "Role",
          name: "role",
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/testimonial.tsx
git commit -m "refactor: update testimonial schema, remove avatar field"
```

---

### Task 2: Rewrite the Testimonial component

**Files:**
- Modify: `components/blocks/testimonial.tsx:1-52` (the component code)

- [ ] **Step 1: Replace all imports and the full component**

Replace everything above `testimonialBlockSchema` with the new component. The file should start with these imports and contain the `Testimonial` component:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from 'tinacms';
import {
  PageBlocksTestimonial,
  PageBlocksTestimonialTestimonials,
} from '../../tina/__generated__/types';
import { Section } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonial = ({ data }: { data: PageBlocksTestimonial }) => {
  const testimonials = data.testimonials ?? [];
  const total = testimonials.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset to slide-in position, then animate to center
  useEffect(() => {
    // Start off-screen
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 20);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const goNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  if (total === 0) return null;

  const testimonial = testimonials[activeIndex]!;

  // Animation: start offset + transparent, transition to center + opaque
  const slideStyle: React.CSSProperties = {
    transform: isAnimating
      ? `translateX(${direction === 'right' ? '24px' : '-24px'})`
      : 'translateX(0)',
    opacity: isAnimating ? 0 : 1,
    transition: 'transform 300ms ease, opacity 300ms ease',
  };

  return (
    <Section background={data.background!}>
      <div className="text-center mb-16">
        <h2
          className="font-headline text-5xl md:text-6xl text-on-surface"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title}
        </h2>
        {data.description && (
          <p
            className="font-body text-on-surface-variant mt-6 italic leading-relaxed max-w-xl mx-auto"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center">
        {/* Testimonial content */}
        <div className="max-w-2xl text-center" style={slideStyle}>
          {/* Decorative quote mark */}
          <div className="font-headline text-7xl md:text-8xl text-primary-container leading-none select-none">
            &ldquo;
          </div>

          {/* Quote */}
          <blockquote data-tina-field={tinaField(testimonial, 'quote')}>
            <p className="font-headline italic text-xl md:text-2xl lg:text-3xl text-on-surface-variant leading-relaxed">
              {testimonial.quote}
            </p>
          </blockquote>

          {/* Author */}
          <p className="mt-8 font-label text-xs uppercase tracking-[0.2em] text-outline">
            <span data-tina-field={tinaField(testimonial, 'author')}>
              {testimonial.author}
            </span>
            {testimonial.role && (
              <>
                <span className="mx-2">&middot;</span>
                <span data-tina-field={tinaField(testimonial, 'role')}>
                  {testimonial.role}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Counter navigation */}
        {total > 1 && (
          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="flex items-center justify-center size-11 text-primary hover:text-on-surface transition-colors duration-300"
            >
              <ChevronLeft className="size-5" />
            </button>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-outline tabular-nums">
              {activeIndex + 1} / {total}
            </span>
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="flex items-center justify-center size-11 text-primary hover:text-on-surface transition-colors duration-300"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};
```

Remove the old `TestimonialCard` component entirely.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: No errors in `components/blocks/testimonial.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/blocks/testimonial.tsx
git commit -m "feat: rewrite testimonial block as single-item carousel with counter nav"
```

---

### Task 3: Add CSS transition classes to styles.css

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add testimonial transition utility**

Add at the bottom of `styles.css`, before the closing of the file:

```css
/* Testimonial slide-fade transition */
.testimonial-slide {
  transition: transform 300ms ease, opacity 300ms ease;
}
```

Note: The current implementation uses inline styles for the transition. If you prefer utility classes over inline styles for consistency, add this class and swap the inline `style` prop for a className approach. However, since the transform values are dynamic (direction-dependent), inline styles are acceptable here. **This step is optional** — skip if the inline approach from Task 2 is preferred.

- [ ] **Step 2: Commit (if changes made)**

```bash
git add styles.css
git commit -m "style: add testimonial transition utility class"
```

---

### Task 4: Regenerate TinaCMS types and verify

**Files:**
- Regenerated: `tina/__generated__/types.ts`
- Regenerated: `tina/tina-lock.json`

- [ ] **Step 1: Run the TinaCMS dev server to regenerate types**

Run: `npx tinacms dev`

Wait for it to start, then kill it once types are generated. Alternatively:

Run: `npx tinacms build`

This regenerates `tina/__generated__/types.ts` and `tina/tina-lock.json` with the updated schema (no `avatar` field).

- [ ] **Step 2: Verify the generated types no longer include avatar**

Check that `PageBlocksTestimonialTestimonials` in `tina/__generated__/types.ts` does NOT have an `avatar` property.

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add tina/__generated__/ tina/tina-lock.json
git commit -m "chore: regenerate tina types after testimonial schema update"
```

---

### Task 5: Visual verification

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify the testimonial block renders**

Open the site in a browser. Add a testimonial block via TinaCMS admin or check if one exists on a page. Verify:

1. Section header (title + description) renders centered
2. Decorative `"` quote mark visible in gold/primary-container color
3. Quote text is centered, italic, serif
4. Author line shows as `Name · Role` in uppercase tracking
5. Counter shows `1 / N` with left/right chevron arrows
6. Clicking arrows advances/retreats through testimonials
7. Navigation wraps around (last → first, first → last)
8. Slide-fade transition is subtle and direction-aware
9. Responsive: check mobile, tablet, desktop — text scales, arrows are tappable

- [ ] **Step 3: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix: testimonial block visual adjustments"
```
