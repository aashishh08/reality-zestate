import { getSiteUrl } from "@/lib/site-url";

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}/images/luxury-living.jpg`;
}
