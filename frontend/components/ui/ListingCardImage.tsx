'use client';

import { useState } from 'react';
import Image from 'next/image';

const DEFAULT_CARD_IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

interface ListingCardImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

/** Property card image with gradient fallback when src is missing or fails to load. */
export function ListingCardImage({
  src,
  alt,
  className = 'object-cover transition-transform duration-700 group-hover:scale-105',
  sizes = DEFAULT_CARD_IMAGE_SIZES,
  loading,
  priority,
}: ListingCardImageProps) {
  const [imgError, setImgError] = useState(false);
  const trimmed = src?.trim();

  if (trimmed && !imgError) {
    return (
      <Image
        src={trimmed}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        priority={priority}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#3a3a3a] to-[#505050]">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg,#D4AF37 0,#D4AF37 1px,transparent 1px,transparent 22px)',
        }}
      />
    </div>
  );
}
