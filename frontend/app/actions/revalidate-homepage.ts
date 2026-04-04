'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { HOMEPAGE_PROPERTY_SECTIONS_TAG } from '@/lib/cache-tags';

/** Call after admin creates/updates/deletes a property or toggles publish so the public homepage reflects tag changes immediately. */
export async function revalidateHomepagePropertySections(): Promise<void> {
  revalidateTag(HOMEPAGE_PROPERTY_SECTIONS_TAG, 'max');
  revalidatePath('/');
}
