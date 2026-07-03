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
}

export function PropertyCard({ project, index, imageSizes }: PropertyCardProps) {
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
        <div className="relative h-[220px] overflow-hidden">
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
              className="absolute top-3 left-3 z-10 px-2.5 py-[5px] font-sans text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs"
              style={badgeStyle}
            >
              {statusTag.name}
            </div>
          )}

          {/* Price tag — bottom right */}
          {priceDisplay && (
            <div className="absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-sm px-3 py-1.5">
              <span className="font-serif text-sm font-medium tracking-wide text-gold">
                {priceDisplay}
              </span>
            </div>
          )}
        </div>

        {/* ── Card body ─────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-5">

          {/* Developer */}
          {developerName && (
            <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-gold">
              {developerName}
            </p>
          )}

          {/* Project name */}
          <h3 className="mb-2 font-serif text-lg font-medium leading-snug text-charcoal sm:text-xl line-clamp-2">
            {project.title}
          </h3>

          {/* Location */}
          {locationName && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-[4px] h-[4px] rounded-full bg-gold flex-shrink-0" />
              <span className="font-sans text-xs text-muted-foreground tracking-wide">
                {locationName}
              </span>
            </div>
          )}

          {/* Specs row */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border mb-4">
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
          <button className="w-full border border-border bg-transparent py-3 font-sans text-xs font-semibold uppercase tracking-widest text-charcoal transition-all duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-gold">
            View Project →
          </button>
        </div>
      </div>
    </NewTabLink>
  );
}
