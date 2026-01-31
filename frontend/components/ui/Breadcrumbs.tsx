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
    <nav className="flex sticky top-[60px] z-40 bg-white/80 backdrop-blur-md border-b border-black/5 py-3 px-6">
      <div className="max-w-7xl mx-auto w-full">
         <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-zinc-500 hover:text-gold-dark transition-colors flex items-center">
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-zinc-400 mx-1" />
              <Link
                href={item.href}
                className={`transition-colors font-medium ${
                  index === items.length - 1
                    ? "text-gold-dark pointer-events-none"
                    : "text-zinc-500 hover:text-gold-dark"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
