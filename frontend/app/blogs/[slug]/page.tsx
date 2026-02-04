import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogBySlug, getBlogs } from '@/lib/api/blogs';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogBySlug(slug);

    const metaTitle = `${post.title} | Opulnz Abode`;
    const metaDescription = post.content?.substring(0, 160) || post.title;

    return {
      title: metaTitle,
      description: metaDescription,
      authors: [{ name: 'Opulnz Abode' }],
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        images: [],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
      },
      alternates: {
        canonical: `https://opulnzabode.com/blogs/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

// Generate static params for common posts (optional, for better performance)
export async function generateStaticParams() {
  try {
    const response = await getBlogs({ limit: 10 }, 3600);
    return (response.data || []).map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  let post;
  try {
    post = await getBlogBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently published';

  const shareUrl = `https://opulnzabode.com/blogs/${slug}`;

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/blogs"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.createdAt || ''}>{formattedDate}</time>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Share Buttons */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none
            prose-headings:font-playfair prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-6 prose-li:my-2
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-amber-500 
            prose-blockquote:bg-amber-50 prose-blockquote:py-4 prose-blockquote:px-6
            prose-blockquote:italic prose-blockquote:text-gray-700"
        >
          {post.content}
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-amber-600 to-orange-600 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
            Looking for Your Dream Property?
          </h2>
          <p className="text-lg text-amber-100 mb-8">
            Explore our curated collection of luxury properties across India
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white text-amber-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Explore Properties
          </Link>
        </div>
      </section>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.content?.substring(0, 160),
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            author: {
              '@type': 'Person',
              name: 'Opulnz Abode',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Opulnz Abode',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': shareUrl,
            },
          }),
        }}
      />
    </main>
  );
}

// Use SSR for fresh content on every request
export const dynamic = 'force-dynamic';
