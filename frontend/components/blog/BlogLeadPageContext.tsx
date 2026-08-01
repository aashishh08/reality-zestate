"use client";

import { useEffect } from "react";
import { useLeadModal } from "@/lib/contexts/LeadModalContext";

interface BlogLeadPageContextProps {
  blogSlug: string;
  blogTitle: string;
}

/** Sets lead popup page context for the current blog post (cleared on unmount). */
export function BlogLeadPageContext({ blogSlug, blogTitle }: BlogLeadPageContextProps) {
  const { setLeadPageContext } = useLeadModal();

  useEffect(() => {
    setLeadPageContext({ blogSlug, blogTitle });
    return () => setLeadPageContext({});
  }, [blogSlug, blogTitle, setLeadPageContext]);

  return null;
}
