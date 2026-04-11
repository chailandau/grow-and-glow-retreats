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
