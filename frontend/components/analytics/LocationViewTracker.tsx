'use client';

import { useEffect, useRef } from 'react';
import { trackViewLocation } from '@/lib/analytics';

interface LocationViewTrackerProps {
  locationSlug: string;
  locationType?: string;
}

export function LocationViewTracker({ locationSlug, locationType }: LocationViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackViewLocation({
      location_slug: locationSlug,
      location_type: locationType,
    });
  }, [locationSlug, locationType]);

  return null;
}
