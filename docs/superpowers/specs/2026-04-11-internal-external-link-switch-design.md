# Internal/External Link Switch for CMS Actions

## Problem

Action link fields across hero, image-text, and call-to-action blocks use a plain text string for the URL. There is no way to select an internal page from a dropdown, and no validation that the URL is correct. Adding new pages requires manually remembering their paths.

## Solution

Add a `linkType` toggle (internal/external) to each action item. When set to "internal", a TinaCMS reference field shows a dropdown of all pages. When set to "external", a free text URL field appears. The fields are conditionally visible using TinaCMS custom field components.

## Schema Changes

### Action fields (shared across hero, image-text, call-to-action)

| Field | Type | Visibility | Notes |
|-------|------|------------|-------|
| `label` | string | Always | Button/link text |
| `type` | string options: button, link | Always | Visual style (renamed to "Style" in CMS label) |
| `linkType` | string options: internal, external | Always | Defaults to `internal` |
| `page` | reference to `page` collection | `linkType === 'internal'` | Auto-populated dropdown of all pages |
| `link` | string | `linkType === 'external'` | Free text URL |

### Shared actions schema

Extract the actions field definition into a shared constant (e.g. `actionsFieldSchema`) used by all three blocks. This avoids tripling the conditional field logic.

### Conditional visibility

Uses TinaCMS custom field components via `ui.component`. Each conditional field derives the sibling `linkType` path from its own `field.name`:

```ts
const basePath = field.name.replace(/\.[^.]+$/, '');
const linkType = form.getFieldState(`${basePath}.linkType`)?.value;
```

- `page` field: renders reference field when `linkType === 'internal'`, returns `null` otherwise
- `link` field: renders text input when `linkType === 'external'`, returns `null` otherwise

Uses `wrapFieldsWithMeta` to preserve field labels and descriptions on the custom components.

## Component Changes

### URL resolution helper

```ts
function resolveActionHref(action: { linkType?: string; page?: string; link?: string }): string {
  if (action.linkType === 'external') return action.link || '#';
  if (!action.page) return '#';
  const slug = action.page.replace('content/pages/', '').replace('.mdx', '');
  if (slug === 'home') return '/';
  return `/${slug}`;
}
```

### Blocks updated

- `components/blocks/hero.tsx` — use shared actions schema, use `resolveActionHref`
- `components/blocks/image-text.tsx` — use shared actions schema, use `resolveActionHref`
- `components/blocks/call-to-action.tsx` — use shared actions schema, use `resolveActionHref`

### External links

When `linkType === 'external'`, the rendered `<a>` tag should include `target="_blank"` and `rel="noopener noreferrer"` so external links always open in a new tab.

## Content Migration

Existing actions in `home.mdx` currently use `link` strings (e.g. `/apply`, `/about`). These need to be migrated to include `linkType` and `page` fields. Current internal links like `/apply` that don't have a corresponding page yet stay as `linkType: external` with the raw `link` value until those pages are created.

## Default values

New actions default to:
```yaml
label: Learn More
type: button
linkType: internal
page: content/pages/home.mdx
link: ''
```
