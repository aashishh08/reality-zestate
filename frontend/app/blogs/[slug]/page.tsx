import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogBySlug, getBlogs, BlogPost } from '@/lib/api/blogs';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// ─── Strip full HTML document wrappers from blog content ─────────────────────
// Blogs stored in the DB sometimes contain a full HTML document (with <html>,
// <head>, <body>, <style> … tags). Injecting a complete document into a React
// page via dangerouslySetInnerHTML breaks the DOM — the browser silently
// terminates the outer <body> when it hits the inner </body></html>, so only
// the CTA/More-Articles sections (which appear *after* the content div) remain
// visible. This function extracts just the meaningful inner body content.
function sanitizeContent(html: string): string {
  if (!html) return '';

  let result = html;

  // 1. If a <body>…</body> block exists, use only its contents
  const bodyMatch = result.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    result = bodyMatch[1];
  } else {
    // 2. No <body> tag — strip any leading <html>/<head> open tags and
    //    trailing </html>/</body> close tags
    result = result
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<\/body>/gi, '');
  }

  // 3. Remove any <style>…</style> blocks that snuck in (they would apply
  //    globally and potentially override page styles)
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 4. Remove <script>…</script> blocks for security
  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  return result.trim();
}

// ─── Auto-generate TOC from <h2> tags in HTML content ────────────────────────
function extractTOC(html: string): { id: string; text: string }[] {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
  return matches.map((m) => {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return { id, text };
  });
}

// ─── Inject ids into <h2> headings so TOC anchors work ───────────────────────
function injectHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogBySlug(slug);
    const metaTitle = post.seo?.metaTitle || `${post.title} | Superluxere`;
    const metaDescription =
      post.seo?.metaDescription ||
      post.excerpt ||
      sanitizeContent(post.content || '').replace(/<[^>]+>/g, '').substring(0, 160) ||
      post.title;

    return {
      title: metaTitle,
      description: metaDescription,
      authors: [{ name: post.author?.name || 'Superluxere' }],
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
      },
      alternates: {
        canonical: `https://superluxere.com/blogs/${slug}`,
      },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post: BlogPost;
  try {
    post = await getBlogBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  // Related posts (exclude current)
  let relatedPosts: BlogPost[] = [];
  try {
    const all = await getBlogs({ limit: 4 }, 3600);
    relatedPosts = (all.data || []).filter((p) => p.slug !== slug).slice(0, 3);
  } catch {
    relatedPosts = [];
  }

  const dateSource = post.publishedAt || post.createdAt || '';
  const formattedDate = dateSource
    ? new Date(dateSource).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

  const cleanContent = sanitizeContent(post.content || '');
  const toc = extractTOC(cleanContent);
  const contentWithIds = injectHeadingIds(cleanContent);
  const shareUrl = `https://superluxere.com/blogs/${slug}`;
  const authorName = post.author?.name || 'Team Superluxere';
  const readTime = post.readTime ?? 1;

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero Image ────────────────────────────────────────────────────── */}
      {post.featuredImage ? (
        <div className="relative w-full h-72 md:h-[480px] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {(post.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.tags || []).slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* ── Back + Author byline ──────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-gray-800">{authorName}</span>
            </div>
            {formattedDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-amber-600" />
                <time dateTime={dateSource}>{formattedDate}</time>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: TOC + Article ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">

          {/* Article */}
          <article>
            {/* Excerpt / subtitle */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 font-medium leading-relaxed mb-10 pb-8 border-b border-gray-200">
                {post.excerpt}
              </p>
            )}

            {/* Share bar */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Share this article:</span>
              <div className="flex items-center space-x-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-playfair prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-amber-200
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-amber-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-amber-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-li:my-2 prose-li:text-gray-700
                prose-ol:my-6
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-4 prose-blockquote:border-amber-500
                prose-blockquote:bg-amber-50 prose-blockquote:py-4 prose-blockquote:px-6
                prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-lg
                prose-table:border-collapse prose-th:bg-amber-50 prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-gray-200"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {/* Tags */}
            {(post.tags || []).length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Tagged:</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar: TOC (sticky) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-gray-600 hover:text-amber-700 hover:pl-1 transition-all leading-snug py-1 border-l-2 border-transparent hover:border-amber-500 pl-3"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16 mt-8">
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

      {/* ── Other Blogs ──────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900">
              More Articles
            </h2>
            <Link
              href="/blogs"
              className="inline-flex items-center space-x-2 text-amber-700 font-semibold hover:underline text-sm"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => {
              const relDateSource = related.publishedAt || related.createdAt || '';
              const relDate = relDateSource
                ? new Date(relDateSource).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '';

              return (
                <Link key={related.id} href={`/blogs/${related.slug}`} className="group block">
                  <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-44 overflow-hidden">
                      {related.featuredImage ? (
                        <Image
                          src={related.featuredImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500" />
                      )}
                    </div>
                    <div className="p-5">
                      {relDate && (
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {relDate}
                        </p>
                      )}
                      <h3 className="font-playfair font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">
                        {related.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{related.excerpt}</p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt || cleanContent.replace(/<[^>]+>/g, '').substring(0, 160),
            image: post.featuredImage || undefined,
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt,
            author: { '@type': 'Person', name: authorName },
            publisher: { '@type': 'Organization', name: 'Superluxere' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': shareUrl },
            keywords: (post.tags || []).join(', '),
          }),
        }}
      />
    </main>
  );
}

export const dynamic = 'force-dynamic';
