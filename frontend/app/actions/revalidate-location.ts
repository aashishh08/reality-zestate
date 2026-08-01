'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import {
  HOMEPAGE_DATA_TAG,
  LOCATION_DETAIL_TAG,
  PROPERTY_DETAIL_TAG,
  PROPERTY_LIST_TAG,
  locationDetailTag,
} from '@/lib/cache-tags';

export interface RevalidateLocationOptions {
  /** Primary location slug that changed (city or locality). */
  slug: string;
  /** Related city slugs to refresh (e.g. parent city listing pages). */
  relatedSlugs?: string[];
}

/** Invalidate location pages, property listings, homepage, and project pages after admin location changes. */
export async function revalidateLocationCaches(
  options: RevalidateLocationOptions,
): Promise<void> {
  const slugs = [...new Set([options.slug, ...(options.relatedSlugs ?? [])].filter(Boolean))];

  revalidateTag(LOCATION_DETAIL_TAG, 'max');
  revalidateTag(PROPERTY_LIST_TAG, 'max');
  revalidateTag(HOMEPAGE_DATA_TAG, 'max');
  revalidateTag(PROPERTY_DETAIL_TAG, 'max');

  for (const slug of slugs) {
    revalidateTag(locationDetailTag(slug), 'max');
    revalidatePath(`/location/${slug}`);
  }

  revalidatePath('/');
  revalidatePath('/projects');
}
