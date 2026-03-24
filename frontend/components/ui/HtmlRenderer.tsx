"use client";

import { sanitizeHtml } from "@/lib/utils/sanitize-html";

/**
 * HtmlRenderer — a shared component for rendering HTML content safely
 * across all property detail sections (Intro, Overview, Why Invest, Master Plan).
 *
 * Uses Tailwind's @tailwindcss/typography `prose` class (same as blogs)
 * which correctly renders h1 > h2 > h3 at different sizes.
 *
 * Flow:
 *  1. sanitizeHtml() strips <!DOCTYPE>, <html>, <head>, <body>, <style>, <script>
 *  2. dangerouslySetInnerHTML renders the clean HTML
 *  3. `prose` class from typography plugin handles all heading/list/link styles
 *
 * For plain text (no HTML tags detected) it splits on double-newlines → paragraphs.
 */

interface HtmlRendererProps {
  /** Raw HTML or plain text from the admin textarea */
  html: string;
  /** Extra CSS classes to add on the wrapper div (optional) */
  className?: string;
  /** Font size override — defaults to text-base. Use text-sm for admin previews. */
  fontSize?: string;
}

/** Returns true if the string contains at least one HTML tag */
const hasHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

export function HtmlRenderer({ html, className = "", fontSize = "text-base" }: HtmlRendererProps) {
  if (!html || !html.trim()) return null;

  const safe = sanitizeHtml(html);

  if (hasHtml(safe)) {
    return (
      <div
        className={[
          // Tailwind typography plugin — proven to render h1/h2/h3 at correct sizes
          "prose",
          "prose-headings:text-[#2C2416]",
          "prose-headings:font-bold",
          "prose-p:text-gray-700",
          "prose-strong:text-[#2C2416]",
          "prose-strong:font-semibold",
          "prose-a:text-[#C9A961]",
          "prose-a:underline",
          "prose-li:text-gray-700",
          "prose-blockquote:border-l-[#C9A961]",
          "prose-blockquote:text-gray-600",
          // Layout
          "max-w-none",
          fontSize,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  // Plain text fallback — split on double-newlines
  return (
    <div className={`space-y-4 ${fontSize} text-gray-700 leading-relaxed ${className}`}>
      {safe.split("\n\n").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
