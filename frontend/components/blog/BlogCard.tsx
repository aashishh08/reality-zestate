'use client';

import { useState } from 'react';
import { NewTabLink } from '@/components/ui/NewTabLink';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  priority?: boolean;
}

function CoverImage({
  src,
  alt,
  className,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setImgError(true)}
        priority={priority}
        sizes={sizes}
      />
    );
  }
  // Fallback gradient when src is missing or image fails to load
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-600" />
  );
}

export default function BlogCard({ post, featured = false, priority = false }: BlogCardProps) {
  const dateSource = post.publishedAt || post.createdAt || '';
  const formattedDate = dateSource
    ? new Date(dateSource).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

  const categoryName = post.category?.name ?? 'Real Estate';
  const authorName = post.author?.name ?? 'Superluxere';
  const readTime = post.readTime ?? 1;

  if (featured) {
    return (
      <NewTabLink href={`/blogs/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Stack vertically on mobile, side-by-side on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Cover */}
            <div className="relative h-56 sm:h-72 md:h-full min-h-[240px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <CoverImage
                src={post.featuredImage}
                alt={post.title}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                <span className="px-3 py-1 sm:px-4 sm:py-2 bg-amber-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-7 md:p-10 flex flex-col justify-center">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3 sm:mb-4">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full font-medium text-xs sm:text-sm">
                  {categoryName}
                </span>
                {formattedDate && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-amber-700 transition-colors leading-tight">
                {post.title}
              </h2>

              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    {authorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{authorName}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-700 font-semibold group-hover:translate-x-1 transition-transform shrink-0 text-sm">
                  <span className="hidden sm:inline">Read More</span>
                  <span className="sm:hidden">Read</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </NewTabLink>
    );
  }

  return (
    <NewTabLink href={`/blogs/${post.slug}`} className="group block h-full">
      <article className="h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
        {/* Cover */}
        <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
          <CoverImage
            src={post.featuredImage}
            alt={post.title}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Content — grows to fill card height */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2.5">
            {formattedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{readTime} min</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug">
            {post.title}
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-2 sm:line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {authorName.charAt(0)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{authorName}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-700 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform shrink-0">
              <span>Read</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </article>
    </NewTabLink>
  );
}
