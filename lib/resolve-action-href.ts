type Action = {
  __typename?: string | null;
  _template?: string | null;
  page?: { _sys?: { breadcrumbs?: string[] } } | null;
  link?: string | null;
};

function isExternal(action: Action): boolean {
  return (
    action.__typename?.includes('ExternalAction') === true ||
    action._template === 'externalAction'
  );
}

export function resolveActionHref(action: Action): string {
  if (isExternal(action)) {
    return action.link || '#';
  }
  // Internal: reference field resolves to a Page object with _sys.breadcrumbs
  const breadcrumbs = action.page?._sys?.breadcrumbs;
  if (!breadcrumbs) return '#';
  const slug = breadcrumbs.join('/');
  if (slug === 'home') return '/';
  return `/${slug}`;
}

export function isExternalAction(action: Action): boolean {
  return isExternal(action);
}
