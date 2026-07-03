"use client";

import { useEffect } from "react";
import { useLeadModal } from "@/lib/contexts/LeadModalContext";

interface ProjectLeadPageContextProps {
  propertyId?: string;
  propertySlug: string;
  propertyTitle: string;
}

/** Sets lead popup page context for the current project (cleared on unmount). */
export function ProjectLeadPageContext({
  propertyId,
  propertySlug,
  propertyTitle,
}: ProjectLeadPageContextProps) {
  const { setLeadPageContext } = useLeadModal();

  useEffect(() => {
    setLeadPageContext({ propertyId, propertySlug, propertyTitle });
    return () => setLeadPageContext({});
  }, [propertyId, propertySlug, propertyTitle, setLeadPageContext]);

  return null;
}
