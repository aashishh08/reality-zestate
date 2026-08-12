'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import {
  HOMEPAGE_DATA_TAG,
  PROPERTY_DETAIL_TAG,
  PROPERTY_LIST_TAG,
} from '@/lib/cache-tags';

/** Invalidate developer collection pages after admin SEO edits. */
export async function revalidateDeveloperCaches(slug: string): Promise<void> {
  revalidateTag(PROPERTY_LIST_TAG, 'max');
  revalidateTag(PROPERTY_DETAIL_TAG, 'max');
  revalidateTag(HOMEPAGE_DATA_TAG, 'max');
  revalidatePath(`/developer/${slug}`);
  revalidatePath('/projects');
}
