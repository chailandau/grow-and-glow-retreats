# Cal.com Booking Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Cal.com Booking" TinaCMS page block that embeds an inline booking calendar using the Cal.com JS API for dynamic auto-resizing.

**Architecture:** A new `cal-booking.tsx` block component holds both the React component and TinaCMS schema. The component uses a `useEffect` to bootstrap the Cal.com embed script (queued approach — calls work before the script loads). The schema is registered in `page.ts` and the component is wired into the block switcher in `index.tsx`. TinaCMS auto-generates the TypeScript type `PageBlocksCalBooking` when the dev server runs.

**Tech Stack:** Next.js App Router, TinaCMS, TypeScript, Tailwind CSS v4, Cal.com embed JS API (`https://app.cal.com/embed/embed.js`)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `components/blocks/cal-booking.tsx` | Component + TinaCMS schema |
| Modify | `tina/collection/page.ts` | Register `calBookingBlockSchema` |
| Modify | `components/blocks/index.tsx` | Import `CalBooking`, add `PageBlocksCalBooking` switch case |
| Auto-generated | `tina/__generated__/types.ts` | TinaCMS generates `PageBlocksCalBooking` type — do not edit |

---

## Task 1: Register the schema in TinaCMS

This must happen first so that TinaCMS can generate the `PageBlocksCalBooking` type before the component imports it.

**Files:**
- Create: `components/blocks/cal-booking.tsx`
- Modify: `tina/collection/page.ts`

- [ ] **Step 1: Create the block file with schema only (no component yet)**

Create `components/blocks/cal-booking.tsx` with this exact content:

```tsx
"use client";
import React, { useEffect } from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { Section, sectionBlockSchemaField } from "../layout/section";

// Placeholder type — replaced with generated type in Task 2
type CalBookingData = {
  background?: string | null;
  title?: string | null;
  url?: string | null;
};

declare global {
  interface Window {
    Cal: any;
  }
}

export const CalBooking = ({ data }: { data: CalBookingData }) => {
  const calLink = data.url?.replace("https://cal.com/", "") ?? "";
  const elementId = `cal-inline-${calLink.replace(/\//g, "-")}`;

  useEffect(() => {
    if (!calLink) return;

    if (!window.Cal) {
      (function (C: any, A: string, L: string) {
        const p = (a: any, ar: any) => { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["-queue", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
    }

    window.Cal("init", { origin: "https://cal.com" });
    window.Cal("inline", {
      elementOrSelector: `#${elementId}`,
      calLink,
    });
  }, [calLink, elementId]);

  if (!data.url) return null;

  return (
    <Section background={data.background!}>
      <div className="max-w-screen-md mx-auto" data-tina-field={tinaField(data as any, "url")}>
        {data.title && (
          <h2
            className="font-headline text-4xl md:text-5xl text-on-surface mb-12"
            data-tina-field={tinaField(data as any, "title")}
          >
            {data.title}
          </h2>
        )}
        <div
          id={elementId}
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
        />
      </div>
    </Section>
  );
};

export const calBookingBlockSchema: Template = {
  name: "calBooking",
  label: "Cal.com Booking",
  ui: {
    defaultItem: {
      background: "bg-surface",
      title: "",
      url: "",
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
      label: "Cal.com URL",
      name: "url",
    },
  ],
};
```

- [ ] **Step 2: Register the schema in `tina/collection/page.ts`**

Add the import at the top with the other block imports:

```ts
import { calBookingBlockSchema } from '@/components/blocks/cal-booking';
```

Add `calBookingBlockSchema` to the `templates` array (after `embedBlockSchema`):

```ts
templates: [
  imageTextBlockSchema,
  textBlockSchema,
  testimonialBlockSchema,
  calloutBlockSchema,
  heroBlockSchema,
  featureBlockSchema,
  statsBlockSchema,
  longTextBlockSchema,
  embedBlockSchema,
  calBookingBlockSchema,   // ← add this
],
```

- [ ] **Step 3: Run the dev server to generate the TinaCMS type**

```bash
pnpm dev
```

Wait for the server to start. TinaCMS will regenerate `tina/__generated__/types.ts`, which will now include `PageBlocksCalBooking`. Once you see the Next.js ready message, you can stop it with `Ctrl+C`.

---

## Task 2: Swap placeholder type for generated type

**Files:**
- Modify: `components/blocks/cal-booking.tsx`

- [ ] **Step 1: Replace the placeholder type with the generated import**

In `components/blocks/cal-booking.tsx`, remove the `CalBookingData` type definition and replace it with the generated import:

Remove:
```tsx
// Placeholder type — replaced with generated type in Task 2
type CalBookingData = {
  background?: string | null;
  title?: string | null;
  url?: string | null;
};
```

Add this import alongside the other imports at the top of the file:
```tsx
import { PageBlocksCalBooking } from "@/tina/__generated__/types";
```

Then update the component signature:
```tsx
export const CalBooking = ({ data }: { data: PageBlocksCalBooking }) => {
```

And remove the two `as any` casts from `tinaField(data as any, ...)` — they're now unnecessary:
```tsx
data-tina-field={tinaField(data, "url")}
// ...
data-tina-field={tinaField(data, "title")}
```

- [ ] **Step 2: Run TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: no errors. If `PageBlocksCalBooking` is not found, re-run `pnpm dev` briefly (Step 3 of Task 1) to ensure the type was generated.

---

## Task 3: Wire the component into the block switcher

**Files:**
- Modify: `components/blocks/index.tsx`

- [ ] **Step 1: Add the import and switch case**

In `components/blocks/index.tsx`, add the import at the top:
```tsx
import { CalBooking } from "./cal-booking";
```

Add the case to the `Block` switch statement (after the `PageBlocksEmbed` case):
```tsx
case "PageBlocksCalBooking":
  return <CalBooking data={block} />;
```

The full switch after the edit:
```tsx
const Block = (block: PageBlocks) => {
  switch (block.__typename) {
    case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksCallout":
      return <Callout data={block} />;
    case "PageBlocksStats":
      return <Stats data={block} />;
    case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block} />;
    case "PageBlocksText":
      return <Text data={block} />;
    case "PageBlocksImageText":
      return <ImageText data={block} />;
    case "PageBlocksLongText":
      return <LongText data={block} />;
    case "PageBlocksEmbed":
      return <Embed data={block} />;
    case "PageBlocksCalBooking":
      return <CalBooking data={block} />;
    default:
      return null;
  }
};
```

- [ ] **Step 2: Run TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

---

## Task 4: Manual verification and commit

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Add the block to a page via TinaCMS**

Open `http://localhost:3000` and navigate to a page in the TinaCMS editor. Click "Add Block" and verify "Cal.com Booking" appears in the list.

- [ ] **Step 3: Test the embed**

Paste `https://cal.com/growandglow/workshop` into the Cal.com URL field. The inline booking calendar should appear on the page with dynamic height.

- [ ] **Step 4: Test edge cases**

- Leave the URL field empty — block should render nothing (no error, no empty div)
- Add a title — heading should appear above the calendar

- [ ] **Step 5: Commit**

```bash
git add components/blocks/cal-booking.tsx tina/collection/page.ts components/blocks/index.tsx tina/__generated__/types.ts tina/__generated__/client.ts
git commit -m "feat: add Cal.com Booking block with inline JS embed"
```
