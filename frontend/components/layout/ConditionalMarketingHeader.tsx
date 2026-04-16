"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import type { Location, Developer, Category } from "@/lib";

interface ConditionalMarketingHeaderProps {
  locations: Location[];
  developers: Developer[];
  categories: Category[];
}

/** Main-site navbar only; hidden under `/admin` (admin is a separate surface). */
export function ConditionalMarketingHeader({
  locations,
  developers,
  categories,
}: ConditionalMarketingHeaderProps) {
  const pathname = usePathname();
  if (pathname !== null && pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <Header locations={locations} developers={developers} categories={categories} />
  );
}
