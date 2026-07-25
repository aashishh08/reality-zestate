function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/$/, '') || '/';
}

/** Page-level lead source for popup submissions (homepage, blogs, etc.). */
export function getLeadSourceFromPathname(pathname: string | null): string | null {
  const path = normalizePathname(pathname ?? '');

  if (path === '/') return 'homepage';
  if (path === '/blogs' || path.startsWith('/blogs/')) return 'blogs';

  return null;
}

export function resolveLeadPopupSource(
  pathname: string | null,
  modalSource: string,
  propertySlug?: string,
): string {
  const pageSource = getLeadSourceFromPathname(pathname);
  if (pageSource) return pageSource;
  if (propertySlug) return `${modalSource} | ${propertySlug}`;
  return modalSource;
}
