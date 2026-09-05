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

function getBlogSlugFromPathname(pathname: string | null): string | null {
  const match = normalizePathname(pathname ?? '').match(/^\/blogs\/([^/]+)$/);
  return match?.[1] ?? null;
}

export interface LeadPopupContext {
  propertySlug?: string;
  blogSlug?: string;
  blogTitle?: string;
}

export function resolveLeadPopupSource(
  pathname: string | null,
  modalSource: string,
  context: LeadPopupContext = {},
): string {
  if (modalSource !== 'lead-popup' && modalSource !== 'lead-popup-timer') {
    if (context.propertySlug) return `${modalSource} | ${context.propertySlug}`;
    return modalSource;
  }

  const pageSource = getLeadSourceFromPathname(pathname);

  if (pageSource === 'blogs') {
    const blogSlug = context.blogSlug ?? getBlogSlugFromPathname(pathname);
    if (context.blogTitle?.trim()) return `blogs | ${context.blogTitle.trim()}`;
    if (blogSlug) return `blogs | ${blogSlug}`;
    return 'blogs';
  }

  if (pageSource) return pageSource;
  if (context.propertySlug) return `${modalSource} | ${context.propertySlug}`;
  return modalSource;
}
