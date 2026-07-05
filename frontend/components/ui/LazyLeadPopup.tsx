"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/** Defer lead modal JS until after hydration — only needed on user interaction or timer. */
const LeadPopup = dynamic(
  () => import("@/components/ui/LeadPopup").then((m) => ({ default: m.LeadPopup })),
  { ssr: false },
);

export function LazyLeadPopup() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <LeadPopup />;
}
