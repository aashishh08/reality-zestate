"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-black/5 bg-white/80 px-4 py-3 font-sans backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <ol className="flex items-center gap-1 sm:gap-2 text-sm overflow-x-auto no-scrollbar [-webkit-overflow-scrolling:touch]">
          <li className="shrink-0">
            <Link href="/" className="text-zinc-500 hover:text-gold-dark transition-colors flex items-center">
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.href}-${index}`} className="flex items-center min-w-0 shrink">
                <ChevronRight className="w-4 h-4 text-zinc-400 mx-0.5 sm:mx-1 shrink-0" />
                {isLast ? (
                  <span
                    className="font-medium text-gold-dark truncate max-w-[min(60vw,20rem)] sm:max-w-xs"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-zinc-500 hover:text-gold-dark transition-colors font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
