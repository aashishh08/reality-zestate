'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

function CoverImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
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
      />
    );
  }
  // Fallback gradient when src is missing or image fails to load
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-600" />
  );
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const dateSource = post.publishedAt || post.createdAt || '';
  const formattedDate = dateSource
    ? new Date(dateSource).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

  const categoryName = post.category?.name ?? 'Real Estate';
  const authorName = post.author?.name ?? 'Opulnz Abode';
  const readTime = post.readTime ?? 1;

  if (featured) {
    return (
      <Link href={`/blogs/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Cover */}
            <div className="relative h-64 md:h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <CoverImage
                src={post.featuredImage}
                alt={post.title}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full">
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-medium">
                  {categoryName}
                </span>
                {formattedDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4 group-hover:text-amber-700 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{authorName}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-amber-700 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Read More</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <article className="h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Cover */}
        <div className="relative h-56 overflow-hidden">
          <CoverImage
            src={post.featuredImage}
            alt={post.title}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
            {formattedDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readTime} min</span>
            </div>
          </div>

          <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {authorName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">{authorName}</span>
            </div>

            <div className="flex items-center space-x-1 text-amber-700 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Read</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
