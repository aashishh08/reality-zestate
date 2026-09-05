import { getSiteUrl } from "@/lib/site-url";

/** Gold lotus on black — favicon + default social share preview image. */
export const SITE_LOGO_PATH = "/images/superluxere-site-icon.jpg";

export const DEFAULT_OG_IMAGE_PATH = SITE_LOGO_PATH;

export const DEFAULT_OG_IMAGE_WIDTH = 1024;
export const DEFAULT_OG_IMAGE_HEIGHT = 1024;

export const DEFAULT_OG_IMAGE_ALT = "SuperLuxeRE — Super Luxury Real Estate Advisory India";

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}${DEFAULT_OG_IMAGE_PATH}`;
}

export function getSiteLogoUrl(): string {
  return `${getSiteUrl()}${SITE_LOGO_PATH}`;
}

export function getDefaultOgImageEntry() {
  return {
    url: getDefaultOgImageUrl(),
    width: DEFAULT_OG_IMAGE_WIDTH,
    height: DEFAULT_OG_IMAGE_HEIGHT,
    alt: DEFAULT_OG_IMAGE_ALT,
  };
}
