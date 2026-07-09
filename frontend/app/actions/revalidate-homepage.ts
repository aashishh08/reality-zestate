'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import {
  HOMEPAGE_DATA_TAG,
  HOMEPAGE_PROPERTY_SECTIONS_TAG,
  PROPERTY_DETAIL_TAG,
  PROPERTY_LIST_TAG,
  PROJECTS_INDEX_TAG,
  propertyDetailTag,
} from '@/lib/cache-tags';

/** Invalidate property detail, listing, homepage, and projects index caches after admin changes. */
export async function revalidatePropertyCaches(slug?: string): Promise<void> {
  revalidateTag(HOMEPAGE_PROPERTY_SECTIONS_TAG, 'max');
  revalidateTag(HOMEPAGE_DATA_TAG, 'max');
  revalidateTag(PROPERTY_LIST_TAG, 'max');
  revalidateTag(PROJECTS_INDEX_TAG, 'max');
  revalidateTag(PROPERTY_DETAIL_TAG, 'max');

  if (slug) {
    revalidateTag(propertyDetailTag(slug), 'max');
    revalidatePath(`/projects/${slug}`);
  }

  revalidatePath('/');
  revalidatePath('/projects');
}

/** Call after admin creates/updates/deletes a property or toggles publish. */
export async function revalidateHomepagePropertySections(): Promise<void> {
  await revalidatePropertyCaches();
}
