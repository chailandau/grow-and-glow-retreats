# Grow and Glow Retreats

## Tech Stack

- Next.js (App Router)
- TinaCMS for content management
- Tailwind CSS v4
- TypeScript

## Conventions

- **Always prefer CSS over JS** for animations, transitions, layout, scroll behavior, visibility toggling, and any visual effect. Use Tailwind classes or plain CSS before reaching for React state, refs, or JS event listeners. Only use JS when CSS truly cannot achieve the desired result.
- **Always add specific CSS transitions when resizing elements for mobile.** Any element that changes size across breakpoints should include a targeted transition (e.g. `transition-[height] duration-300`, `transition-[padding] duration-300`). Never use `transition-all` — always specify the exact properties being transitioned.
- Use Tailwind utility classes for styling. Custom CSS goes in `styles.css`.
- **Always design for responsive.** Every component must look good on mobile, tablet, and desktop. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) and test all breakpoints.
- Fonts: `font-headline` (Newsreader, serif) for headings, `font-body` / `font-label` (Outfit, sans-serif) for body and labels.
- Color tokens are defined as CSS variables in `styles.css` (e.g. `bg-surface`, `text-on-surface`, `text-primary`, `bg-surface-container`).
- Components live in `components/blocks/` (page blocks) and `components/ui/` (reusable UI).
- Global site settings (header, footer, announcement, theme) are in `content/global/index.json` with schema in `tina/collection/global.ts`.
- Page content is in `content/pages/` as `.mdx` files.
- **Always fill out all block options in `ui.defaultItem`** when creating a new TinaCMS block schema. Every field defined in the block's `fields` array should have a corresponding default value so new blocks are fully populated when added in the CMS.
- **Never use CSS `order` or `flex-direction: row-reverse` to reorder content.** When a block needs a layout toggle (e.g. image left vs right), conditionally render the elements in the correct DOM order (e.g. image then text, or text then image) so DOM order always matches visual order. Use JSX conditionals or duplicate elements with Tailwind `hidden`/`block` classes — never CSS reordering.

## Project Structure

- `app/` — Next.js app router pages
- `components/blocks/` — TinaCMS page block components
- `components/layout/` — Layout, header, footer, section
- `components/ui/` — Shared UI components (button, card, etc.)
- `content/` — TinaCMS content (pages, posts, global settings)
- `tina/` — TinaCMS schema and config
- `public/uploads/` — Uploaded media assets
