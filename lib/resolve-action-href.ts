type Action = {
  type?: string | null;
  page?: { _sys?: { breadcrumbs?: string[] } } | null;
  link?: string | null;
};

export function isExternalAction(action: Action): boolean {
  return action.type === 'external';
}

export function resolveActionHref(action: Action): string {
  if (isExternalAction(action)) {
    return action.link || '#';
  }
  const breadcrumbs = action.page?._sys?.breadcrumbs;
  if (!breadcrumbs) return '#';
  const slug = breadcrumbs.join('/');
  if (slug === 'home') return '/';
  return `/${slug}`;
}
