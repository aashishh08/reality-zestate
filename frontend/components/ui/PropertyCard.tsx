"use client";

import { NewTabLink } from "@/components/ui/NewTabLink";
import Image from "next/image";
import { Project } from "@/types";
import {
  STATUS_TAG_SLUGS,
  STATUS_BADGE_COLORS,
  isStatusTagSlug,
} from "@/lib/status-tags";

export { STATUS_TAG_SLUGS } from "@/lib/status-tags";

const DEFAULT_BADGE = { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' };

function formatPrice(value: number): string {
  if (value >= 10_000_000) {
    const cr = value / 10_000_000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (value >= 100_000) {
    const l = value / 100_000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

const DEFAULT_CARD_IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

interface PropertyCardProps {
  project: Project;
  index: number;
  /** next/image `sizes` — set when the card sits in a 2+ column grid on small viewports */
  imageSizes?: string;
  /** Denser card on mobile — used on homepage trending grid */
  compact?: boolean;
}

export function PropertyCard({ project, index, imageSizes, compact = false }: PropertyCardProps) {
  if (!project?.slug || !project?.title) return null;

  // First status-type tag drives the badge
  const statusTag = project.Tags?.find((t) => isStatusTagSlug(t.slug));
  const badgeStyle = statusTag
    ? {
        backgroundColor: statusTag.color
          ? `${statusTag.color}20`
          : (STATUS_BADGE_COLORS[statusTag.slug]?.bg ?? DEFAULT_BADGE.bg),
        color: statusTag.color || (STATUS_BADGE_COLORS[statusTag.slug]?.text ?? DEFAULT_BADGE.text),
      }
    : null;

  const priceDisplay = project.priceMin
    ? `From ${formatPrice(project.priceMin)}`
    : null;

  const developerName = project.Developer?.name ?? '';
  const locationName  = project.Location?.name ?? project.location ?? '';

  return (
    <NewTabLink href={`/projects/${project.slug}`} className="block min-w-0">
      <div className="group bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* ── Image / Gradient area ──────────────────────────── */}
        <div
          className={`relative overflow-hidden ${
            compact ? "h-[88px] md:h-[220px]" : "h-[220px]"
          }`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes={imageSizes ?? DEFAULT_CARD_IMAGE_SIZES}
              loading={index < 2 ? undefined : "lazy"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            /* Gradient fallback with diagonal gold pattern */
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#3a3a3a] to-[#505050]">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg,#D4AF37 0,#D4AF37 1px,transparent 1px,transparent 22px)',
                }}
              />
            </div>
          )}

          {/* Gradient overlay for price tag legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Status badge — top left */}
          {statusTag && badgeStyle && (
            <div
              className={`absolute z-10 font-sans font-semibold uppercase tracking-[0.16em] ${
                compact
                  ? "top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] md:top-3 md:left-3 md:px-2.5 md:py-[5px] md:text-xs"
                  : "top-3 left-3 px-2.5 py-[5px] text-[10px] sm:text-xs"
              }`}
              style={badgeStyle}
            >
              {statusTag.name}
            </div>
          )}

          {/* Price tag — bottom right */}
          {priceDisplay && (
            <div
              className={`absolute z-10 bg-black/75 backdrop-blur-sm ${
                compact
                  ? "bottom-1.5 right-1.5 px-1.5 py-0.5 md:bottom-3 md:right-3 md:px-3 md:py-1.5"
                  : "bottom-3 right-3 px-3 py-1.5"
              }`}
            >
              <span
                className={`font-serif font-medium tracking-wide text-gold ${
                  compact ? "text-[10px] md:text-sm" : "text-sm"
                }`}
              >
                {priceDisplay}
              </span>
            </div>
          )}
        </div>

        {/* ── Card body ─────────────────────────────────────── */}
        <div
          className={
            compact ? "px-2 pt-2 pb-2 md:px-5 md:pt-4 md:pb-5" : "px-5 pt-4 pb-5"
          }
        >

          {/* Developer */}
          {developerName && (
            <p
              className={`font-sans font-semibold uppercase tracking-widest text-gold ${
                compact
                  ? "mb-0.5 text-[8px] leading-tight line-clamp-1 md:mb-1 md:text-xs"
                  : "mb-1 text-xs"
              }`}
            >
              {developerName}
            </p>
          )}

          {/* Project name */}
          <h3
            className={`font-serif font-medium leading-snug text-charcoal ${
              compact
                ? "mb-1 text-xs line-clamp-2 md:mb-2 md:text-xl md:line-clamp-2"
                : "mb-2 text-lg sm:text-xl line-clamp-2"
            }`}
          >
            {project.title}
          </h3>

          {/* Location */}
          {locationName && (
            <div
              className={`flex items-center gap-1 min-w-0 ${
                compact ? "mb-0 md:mb-3" : "mb-3 gap-1.5"
              }`}
            >
              <span className="w-[3px] h-[3px] md:w-[4px] md:h-[4px] rounded-full bg-gold flex-shrink-0" />
              <span
                className={`font-sans text-muted-foreground tracking-wide truncate ${
                  compact ? "text-[9px] md:text-xs" : "text-xs"
                }`}
              >
                {locationName}
              </span>
            </div>
          )}

          {/* Specs row */}
          <div
            className={`flex-wrap items-center gap-4 border-t border-border ${
              compact
                ? "hidden md:flex pt-3 mb-4"
                : "flex pt-3 mb-4"
            }`}
          >
            {project.propertyType && (
              <span className="font-sans text-xs text-muted-foreground tracking-wide">
                Type{' '}
                <strong className="text-charcoal font-medium capitalize">
                  {project.propertyType}
                </strong>
              </span>
            )}
            {project.priceMax && project.priceMin && project.priceMax !== project.priceMin && (
              <span className="font-sans text-xs text-muted-foreground tracking-wide">
                Up to{' '}
                <strong className="text-charcoal font-medium">
                  {formatPrice(project.priceMax)}
                </strong>
              </span>
            )}
          </div>

          {/* CTA */}
          <button
            className={`w-full border border-border bg-transparent font-sans font-semibold uppercase tracking-widest text-charcoal transition-all duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-gold ${
              compact
                ? "hidden md:block py-3 text-xs"
                : "py-3 text-xs"
            }`}
          >
            View Project →
          </button>
        </div>
      </div>
    </NewTabLink>
  );
}
