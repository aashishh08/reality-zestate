'use client';

import { useEffect, useRef } from 'react';
import { trackViewProject } from '@/lib/analytics';

interface ProjectViewTrackerProps {
  projectSlug: string;
  locationSlug?: string;
  developerSlug?: string;
}

export function ProjectViewTracker({
  projectSlug,
  locationSlug,
  developerSlug,
}: ProjectViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackViewProject({
      project_slug: projectSlug,
      location_slug: locationSlug,
      developer_slug: developerSlug,
    });
  }, [projectSlug, locationSlug, developerSlug]);

  return null;
}
