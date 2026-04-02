"use client";

import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";

// Status-type tag slugs shown as badge on the card.
// Add new slugs here to extend badge support automatically.
export const STATUS_TAG_SLUGS = [
  'new-launch',
  'upcoming',
  'under-construction',
  'ready-to-move',
];

// Fallback badge colors by slug (used when tag.color is not set in the DB)
const STATUS_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  'new-launch':         { bg: 'rgba(109,40,217,0.12)', text: '#6D28D9' },
  'upcoming':           { bg: 'rgba(5,150,105,0.12)',  text: '#059669' },
  'under-construction': { bg: 'rgba(180,83,9,0.12)',   text: '#B45309' },
  'ready-to-move':      { bg: 'rgba(29,78,216,0.12)',  text: '#1D4ED8' },
};
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

interface PropertyCardProps {
  project: Project;
  index: number;
}

export function PropertyCard({ project }: PropertyCardProps) {
  if (!project?.slug || !project?.title) return null;

  // First status-type tag drives the badge
  const statusTag = project.Tags?.find(t => STATUS_TAG_SLUGS.includes(t.slug));
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
    <Link href={`/projects/${project.slug}`} className="block">
      <div className="group bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* ── Image / Gradient area ──────────────────────────── */}
        <div className="relative h-[220px] overflow-hidden">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              className="absolute top-3 left-3 z-10 text-[9px] font-medium tracking-[0.16em] uppercase px-2.5 py-[5px]"
              style={badgeStyle}
            >
              {statusTag.name}
            </div>
          )}

          {/* Price tag — bottom right */}
          {priceDisplay && (
            <div className="absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-sm px-3 py-1.5">
              <span className="font-serif text-[14px] font-medium text-gold tracking-wide">
                {priceDisplay}
              </span>
            </div>
          )}
        </div>

        {/* ── Card body ─────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-5">

          {/* Developer */}
          {developerName && (
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gold mb-1">
              {developerName}
            </p>
          )}

          {/* Project name */}
          <h3 className="font-serif text-[19px] font-medium text-charcoal leading-snug mb-2">
            {project.title}
          </h3>

          {/* Location */}
          {locationName && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-[4px] h-[4px] rounded-full bg-gold flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground tracking-[0.04em]">
                {locationName}
              </span>
            </div>
          )}

          {/* Specs row */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border mb-4">
            {project.propertyType && (
              <span className="text-[11px] text-muted-foreground tracking-[0.04em]">
                Type{' '}
                <strong className="text-charcoal font-medium capitalize">
                  {project.propertyType}
                </strong>
              </span>
            )}
            {project.priceMax && project.priceMin && project.priceMax !== project.priceMin && (
              <span className="text-[11px] text-muted-foreground tracking-[0.04em]">
                Up to{' '}
                <strong className="text-charcoal font-medium">
                  {formatPrice(project.priceMax)}
                </strong>
              </span>
            )}
          </div>

          {/* CTA */}
          <button className="w-full py-[11px] text-[10px] font-medium tracking-[0.14em] uppercase text-charcoal border border-border bg-transparent transition-all duration-300 group-hover:bg-charcoal group-hover:text-gold group-hover:border-charcoal">
            View Project →
          </button>
        </div>
      </div>
    </Link>
  );
}
