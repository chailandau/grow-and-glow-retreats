export function resolveActionHref(action: {
  _template?: string | null;
  page?: { _sys?: { breadcrumbs?: string[] } } | null;
  link?: string | null;
}): string {
  if (action._template === 'externalAction') {
    return action.link || '#';
  }
  // Internal: reference field resolves to a Page object with _sys.breadcrumbs
  const breadcrumbs = action.page?._sys?.breadcrumbs;
  if (!breadcrumbs) return '#';
  const slug = breadcrumbs.join('/');
  if (slug === 'home') return '/';
  return `/${slug}`;
}

export function isExternalAction(action: {
  _template?: string | null;
}): boolean {
  return action._template === 'externalAction';
}
