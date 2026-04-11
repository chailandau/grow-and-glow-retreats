# Internal/External Link Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an internal/external toggle to CMS action links so internal pages show a dropdown and external URLs use a text field, with conditional visibility in the sidebar.

**Architecture:** Create a shared actions schema with conditional custom field components. A `linkType` toggle controls whether the `page` (reference) or `link` (string) field is visible. A shared `resolveActionHref` helper converts page references to URLs in all block components.

**Tech Stack:** TinaCMS custom field components (`wrapFieldsWithMeta`, `form.getFieldState`), TinaCMS reference fields, Next.js `Link`

---

### File Map

- **Create:** `tina/fields/actions.tsx` — shared actions schema definition with conditional field components
- **Create:** `lib/resolve-action-href.ts` — shared URL resolution helper
- **Modify:** `components/blocks/hero.tsx` — use shared actions schema + resolveActionHref
- **Modify:** `components/blocks/image-text.tsx` — use shared actions schema + resolveActionHref
- **Modify:** `components/blocks/call-to-action.tsx` — use shared actions schema + resolveActionHref
- **Modify:** `content/pages/home.mdx` — migrate existing actions to new schema

---

### Task 1: Create shared actions schema with conditional fields

**Files:**
- Create: `tina/fields/actions.tsx`

**Note on approach:** TinaCMS `reference` fields provide a built-in dropdown, but overriding `ui.component` replaces the entire field UI, losing that dropdown. Instead, we use `type: 'string'` for the page field and use the TinaCMS `useCMS` hook inside a custom component to query the page collection and render our own select dropdown. This gives us both conditional visibility AND an auto-updating page list.

- [ ] **Step 1: Create the shared actions schema file**

```tsx
'use client';
import React from 'react';
import { useCMS, wrapFieldsWithMeta } from 'tinacms';

// Custom field: shows a dropdown of all pages when linkType === 'internal'
const InternalPageField = wrapFieldsWithMeta((props) => {
  const { field, input, form } = props;
  const cms = useCMS();
  const [pages, setPages] = React.useState<{ label: string; value: string }[]>([]);

  const basePath = field.name.replace(/\.[^.]+$/, '');
  const linkType = form.getFieldState(`${basePath}.linkType`)?.value;

  React.useEffect(() => {
    if (linkType !== 'internal') return;
    // Query TinaCMS for all pages in the page collection
    cms.api.tina
      .request(
        `query { pageConnection { edges { node { _sys { relativePath breadcrumbs } } } } }`,
        { variables: {} }
      )
      .then((res: any) => {
        const edges = res?.data?.pageConnection?.edges || [];
        setPages(
          edges.map((edge: any) => {
            const relativePath = edge.node._sys.relativePath;
            const name = edge.node._sys.breadcrumbs.join('/');
            return {
              label: name === 'home' ? 'Home (/)' : `${name} (/${name})`,
              value: `content/pages/${relativePath}`,
            };
          })
        );
      });
  }, [cms, linkType]);

  if (linkType !== 'internal') return null;

  return (
    <select
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      value={input.value || ''}
      onChange={(e) => input.onChange(e.target.value)}
    >
      <option value="">Select a page...</option>
      {pages.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
});

// Custom field: shows a URL text input when linkType === 'external'
const ExternalLinkField = wrapFieldsWithMeta((props) => {
  const { field, input, form } = props;
  const basePath = field.name.replace(/\.[^.]+$/, '');
  const linkType = form.getFieldState(`${basePath}.linkType`)?.value;
  if (linkType === 'internal') return null;

  return (
    <input
      type="url"
      placeholder="https://example.com"
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      value={input.value || ''}
      onChange={(e) => input.onChange(e.target.value)}
    />
  );
});

export const actionsFieldSchema = {
  label: 'Actions',
  name: 'actions',
  type: 'object' as const,
  list: true,
  ui: {
    defaultItem: {
      label: 'Learn More',
      type: 'button',
      linkType: 'internal',
      page: 'content/pages/home.mdx',
      link: '',
    },
    itemProps: (item: any) => ({ label: item.label }),
  },
  fields: [
    {
      label: 'Label',
      name: 'label',
      type: 'string' as const,
    },
    {
      label: 'Style',
      name: 'type',
      type: 'string' as const,
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Link', value: 'link' },
      ],
    },
    {
      label: 'Link Type',
      name: 'linkType',
      type: 'string' as const,
      options: [
        { label: 'Internal Page', value: 'internal' },
        { label: 'External URL', value: 'external' },
      ],
    },
    {
      label: 'Page',
      name: 'page',
      type: 'string' as const,
      ui: {
        component: InternalPageField,
      },
    },
    {
      label: 'URL',
      name: 'link',
      type: 'string' as const,
      ui: {
        component: ExternalLinkField,
      },
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add tina/fields/actions.tsx
git commit -m "feat: add shared actions schema with conditional internal/external link fields"
```

---

### Task 2: Create resolveActionHref helper

**Files:**
- Create: `lib/resolve-action-href.ts`

- [ ] **Step 1: Create the helper file**

```ts
export function resolveActionHref(action: {
  linkType?: string | null;
  page?: string | null;
  link?: string | null;
}): string {
  if (action.linkType === 'external') {
    return action.link || '#';
  }
  // Internal: convert reference path to URL
  // "content/pages/about.mdx" → "/about"
  // "content/pages/home.mdx" → "/"
  if (!action.page) return '#';
  const slug = action.page
    .replace('content/pages/', '')
    .replace('.mdx', '');
  if (slug === 'home') return '/';
  return `/${slug}`;
}

export function isExternalAction(action: {
  linkType?: string | null;
}): boolean {
  return action.linkType === 'external';
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/resolve-action-href.ts
git commit -m "feat: add resolveActionHref helper for internal/external link resolution"
```

---

### Task 3: Update hero block to use shared actions schema and resolveActionHref

**Files:**
- Modify: `components/blocks/hero.tsx:1-185`

- [ ] **Step 1: Update imports**

Add at the top of the file:
```tsx
import { resolveActionHref, isExternalAction } from '@/lib/resolve-action-href';
import { actionsFieldSchema } from '@/tina/fields/actions';
```

- [ ] **Step 2: Update action rendering in the component**

Replace the action link rendering (lines 43-59) — every `action!.link!` becomes `resolveActionHref(action!)`. For external links, add `target="_blank"` and `rel="noopener noreferrer"`:

```tsx
{data.actions &&
  data.actions.map((action) => {
    const href = resolveActionHref(action!);
    const isExternal = isExternalAction(action!);
    const externalProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
    return (
      <div key={action!.label} data-tina-field={tinaField(action)}>
        {action!.type === 'link' ? (
          <Link
            href={href}
            {...externalProps}
            className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-widest border-b border-primary pb-1 text-primary hover:text-on-surface transition-colors duration-300"
          >
            <span>{action!.label}</span>
            <ArrowRight className="size-4" />
          </Link>
        ) : (
          <Button asChild>
            <Link href={href} {...externalProps}>
              <span>{action!.label}</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    );
  })}
```

- [ ] **Step 3: Replace inline actions schema with shared one**

Replace the entire `actions` field object in `heroBlockSchema.fields` (lines 133-165) with:

```tsx
actionsFieldSchema as any,
```

Update `defaultItem.actions` (lines 94-105) to include the new fields:

```tsx
actions: [
  {
    label: 'Book a Retreat',
    type: 'button',
    linkType: 'internal',
    page: 'content/pages/home.mdx',
    link: '',
  },
  {
    label: 'Our Story',
    type: 'link',
    linkType: 'internal',
    page: 'content/pages/about.mdx',
    link: '',
  },
],
```

- [ ] **Step 4: Remove unused Link import if no longer needed directly**

The `Link` import from `next/link` is still needed (used in the component JSX). Keep it.

- [ ] **Step 5: Commit**

```bash
git add components/blocks/hero.tsx
git commit -m "refactor: update hero block to use shared actions schema with internal/external links"
```

---

### Task 4: Update image-text block to use shared actions schema and resolveActionHref

**Files:**
- Modify: `components/blocks/image-text.tsx:1-236`

- [ ] **Step 1: Update imports**

Add at the top of the file:
```tsx
import { resolveActionHref, isExternalAction } from '@/lib/resolve-action-href';
import { actionsFieldSchema } from '@/tina/fields/actions';
```

- [ ] **Step 2: Update action rendering in TextColumn**

Replace the action link rendering (lines 88-107) with the same pattern as hero:

```tsx
{data.actions && data.actions.length > 0 && (
  <div className="flex items-center gap-8 mt-10">
    {data.actions.map((action) => {
      const href = resolveActionHref(action!);
      const isExternal = isExternalAction(action!);
      const externalProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
      return (
        <div key={action!.label} data-tina-field={tinaField(action)}>
          {action!.type === 'link' ? (
            <Link
              href={href}
              {...externalProps}
              className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-widest border-b border-primary pb-1 text-primary hover:text-on-surface transition-colors duration-300"
            >
              <span>{action!.label}</span>
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Button asChild>
              <Link href={href} {...externalProps}>
                <span>{action!.label}</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      );
    })}
  </div>
)}
```

- [ ] **Step 3: Replace inline actions schema with shared one**

Replace the entire `actions` field object in `imageTextBlockSchema.fields` (lines 199-233) with:

```tsx
actionsFieldSchema as any,
```

Update `defaultItem.actions` (lines 125-131) to include the new fields:

```tsx
actions: [
  {
    label: 'Learn More',
    type: 'link',
    linkType: 'internal',
    page: 'content/pages/about.mdx',
    link: '',
  },
],
```

- [ ] **Step 4: Commit**

```bash
git add components/blocks/image-text.tsx
git commit -m "refactor: update image-text block to use shared actions schema with internal/external links"
```

---

### Task 5: Update call-to-action block to use shared actions schema and resolveActionHref

**Files:**
- Modify: `components/blocks/call-to-action.tsx:1-121`

- [ ] **Step 1: Update imports**

Add at the top of the file:
```tsx
import { resolveActionHref, isExternalAction } from '@/lib/resolve-action-href';
import { actionsFieldSchema } from '@/tina/fields/actions';
```

- [ ] **Step 2: Update action rendering in the component**

Replace the action link rendering (lines 17-38) with the same pattern:

```tsx
<div className="flex flex-wrap justify-center gap-6">
    {data.actions && data.actions.map((action) => {
        const href = resolveActionHref(action!);
        const isExternal = isExternalAction(action!);
        const externalProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
        return (
            <div
                key={action!.label}
                data-tina-field={tinaField(action)}>
                {action!.type === 'link' ? (
                    <Link
                        href={href}
                        {...externalProps}
                        className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary pb-1 transition-colors duration-300"
                    >
                        <span>{action!.label}</span>
                        <ArrowRight className="size-4" />
                    </Link>
                ) : (
                    <Button asChild>
                        <Link href={href} {...externalProps}>
                            <span>{action!.label}</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                )}
            </div>
        );
    })}
</div>
```

- [ ] **Step 3: Replace inline actions schema with shared one**

Replace the entire `actions` field object in `textBlockSchema.fields` (lines 85-118) with:

```tsx
actionsFieldSchema as any,
```

Update `defaultItem.actions` (lines 55-66) to include the new fields:

```tsx
actions: [
    {
        label: 'Reserve Your Spot',
        type: 'button',
        linkType: 'internal',
        page: 'content/pages/home.mdx',
        link: '',
    },
    {
        label: 'Learn More',
        type: 'link',
        linkType: 'internal',
        page: 'content/pages/about.mdx',
        link: '',
    },
],
```

- [ ] **Step 4: Commit**

```bash
git add components/blocks/call-to-action.tsx
git commit -m "refactor: update call-to-action block to use shared actions schema with internal/external links"
```

---

### Task 6: Migrate existing content in home.mdx

**Files:**
- Modify: `content/pages/home.mdx`

- [ ] **Step 1: Migrate all action entries**

Each existing action needs `linkType` and either `page` or `link` depending on the target. Current actions in `home.mdx`:

1. Hero "I'm ready" → `link: /about` → internal, page: `content/pages/about.mdx`
2. ImageText "Apply to Ignite" → `link: /apply` → external (no `/apply` page exists yet), keep link
3. ImageText "Reserve your spot" → `link: /apply` → external, keep link
4. ImageText "Learn More" → `link: /about` → internal, page: `content/pages/about.mdx`
5. Text "Get Started" → `link: /` → internal, page: `content/pages/home.mdx`
6. Text "Book Demo" → `link: https://tina.io` → external, keep link

Updated `home.mdx` actions (only showing the changed action blocks):

**Hero block (line 8-11):**
```yaml
    actions:
      - label: I'm ready
        type: button
        linkType: internal
        page: content/pages/about.mdx
```

**First imageText block (line 39-42):**
```yaml
    actions:
      - label: Apply to Ignite
        type: button
        linkType: external
        link: /apply
```

**Second imageText block (line 57-60):**
```yaml
    actions:
      - label: Reserve your spot — it's free
        type: button
        linkType: external
        link: /apply
```

**Third imageText "About" block (line 93-96):**
```yaml
    actions:
      - label: Learn More
        type: link
        linkType: internal
        page: content/pages/about.mdx
```

**Text/CTA block (line 100-106):**
```yaml
    actions:
      - label: Get Started
        type: button
        linkType: internal
        page: content/pages/home.mdx
      - label: Book Demo
        type: link
        linkType: external
        link: 'https://tina.io'
```

- [ ] **Step 2: Commit**

```bash
git add content/pages/home.mdx
git commit -m "content: migrate home.mdx actions to internal/external link schema"
```

---

### Task 7: Regenerate tina-lock.json and verify

**Files:**
- Modify: `tina/tina-lock.json` (auto-generated)

- [ ] **Step 1: Run TinaCMS build to regenerate types and lock file**

```bash
npx tinacms build
```

This regenerates `tina/__generated__/types.ts` and `tina/tina-lock.json` to include the new `linkType`, `page` (reference), and updated `link` fields on all action objects.

- [ ] **Step 2: Verify the generated types include new fields**

Check that `PageBlocksHeroActions`, `PageBlocksImageTextActions`, and `PageBlocksTextActions` in `tina/__generated__/types.ts` now include `linkType` and `page` fields.

- [ ] **Step 3: Start the dev server and verify**

```bash
npm run dev
```

Open the site and verify:
- Pages render correctly with existing content
- CMS sidebar shows the Link Type toggle on action items
- Selecting "Internal Page" shows the page dropdown
- Selecting "External URL" shows the URL text field
- External links open in a new tab

- [ ] **Step 4: Commit**

```bash
git add tina/tina-lock.json tina/__generated__/
git commit -m "chore: regenerate tina types and lock file for internal/external link schema"
```
