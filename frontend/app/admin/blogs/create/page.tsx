'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { useRouter } from 'next/navigation';
import { FileText, LogOut, Menu, X, Save, Eye, EyeOff, AlertCircle, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createBlog } from '@/lib/api/blogs';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, token, logout } = useAdminAuth();

  // Core fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // Rich meta fields
  const [excerpt, setExcerpt] = useState('');
  const [authorName, setAuthorName] = useState('Team Superluxere');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
    if (!metaTitle) setMetaTitle(value);
  };

  const handleSubmit = async (e: React.MouseEvent, publish: boolean) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Title, slug, and content are required');
      return;
    }

    setLoading(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createBlog(
        {
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          authorName: authorName.trim() || 'Team Superluxere',
          featuredImage: featuredImage.trim() || undefined,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          tags: tags.length ? tags : undefined,
          isPublished: publish,
        } as any,
        token!
      );

      setSuccess(publish ? 'Blog published successfully!' : 'Blog saved as draft!');
      setTimeout(() => {
        router.push('/admin/blogs');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <ProtectedAdminRoute>
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blogs"
                className="text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Create New Blog</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => handleSubmit(e as any, false)}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
              >
                <EyeOff className="w-5 h-5" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={(e) => handleSubmit(e as any, true)}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Publishing...' : 'Publish'}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start space-x-3">
                <Save className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-500 text-sm">{success}</p>
              </div>
            )}

            {/* Editor Form */}
            <div className="space-y-8 max-w-4xl">

              {/* ── CORE CONTENT ─────────────────────────────── */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-amber-500 border-b border-gray-700 pb-2">Content</h2>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Blog Title *</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Elie Saab Noida Residences: Where Art Collectors Store Their Collections"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">URL Slug *</label>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="elie-saab-noida-residences-art-collectors"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from title. The URL will be: /blogs/your-slug</p>
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">Excerpt / Subtitle</label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short description shown on blog listing cards (1-2 sentences)"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">If blank, auto-generated from the first 160 characters of content.</p>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                    Content * <span className="text-gray-500 font-normal">(HTML supported)</span>
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="<h2>When Haute Couture Enters Real Estate...</h2>&#10;<p>Your article content here. Full HTML is supported.</p>"
                    rows={20}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste your full HTML content. Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a href=""&gt; etc.
                    The Table of Contents will be auto-generated from &lt;h2&gt; tags.
                  </p>
                </div>
              </div>

              {/* ── AUTHOR & IMAGE ───────────────────────────── */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-amber-500 border-b border-gray-700 pb-2">Author & Image</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
                    <input
                      id="authorName"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Team SuperLuxeRE"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                    <input
                      id="tags"
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Noida, Luxury, Art, Elie Saab"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
                  <input
                    id="featuredImage"
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a full image URL. Shown as the hero image on the blog post and thumbnail on listing cards.
                    If blank, an amber gradient is shown.
                  </p>
                  {featuredImage && (
                    <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-gray-700">
                      <img src={featuredImage} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* ── SEO ─────────────────────────────────────── */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-amber-500 border-b border-gray-700 pb-2">SEO</h2>

                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                  <input
                    id="metaTitle"
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Elie Saab Noida: Where Art Collectors Store Their Collections | Superluxere"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaTitle.length}/60 characters recommended. If blank, falls back to blog title.
                  </p>
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                  <textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Discover how Elie Saab's Noida debut is redefining luxury residential real estate for India's art collector class."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaDescription.length}/160 characters recommended.
                  </p>
                </div>
              </div>

              {/* ── PUBLISH ─────────────────────────────────── */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 accent-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Publish immediately</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Unchecked saves as draft. Use the Publish button in the header to override.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
