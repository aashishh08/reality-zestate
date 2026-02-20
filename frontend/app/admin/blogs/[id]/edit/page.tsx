'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { useRouter, useParams } from 'next/navigation';
import { FileText, LogOut, Menu, X, Save, EyeOff, AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getBlogById } from '@/lib/api/admin';
import { updateBlog } from '@/lib/api/blogs';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { user, token, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [authorName, setAuthorName] = useState('Team Opulnz Abode');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token && id) {
      loadBlog();
    }
  }, [token, id]);

  const loadBlog = async () => {
    try {
      setFetchLoading(true);
      const blog = await getBlogById(id, token!) as any;
      setTitle(blog.title || '');
      setSlug(blog.slug || '');
      setContent(blog.content || '');
      setExcerpt(blog.excerpt || '');
      setAuthorName(blog.authorName || 'Team Opulnz Abode');
      setFeaturedImage(blog.featuredImage || '');
      setMetaTitle(blog.metaTitle || '');
      setMetaDescription(blog.metaDescription || '');
      setTagsInput((blog.tags || []).join(', '));
      setIsPublished(blog.isPublished ?? false);
    } catch (err: any) {
      setError(err?.message || 'Failed to load blog');
    } finally {
      setFetchLoading(false);
    }
  };

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

      await updateBlog(
        id,
        {
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          authorName: authorName.trim() || 'Team Opulnz Abode',
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
      setError(err?.message || 'Failed to update blog');
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
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}
        >
          <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'hidden'}`}>
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link
              href="/admin/blogs"
              className="flex items-center space-x-3 px-4 py-3 text-white bg-amber-500/20 border border-amber-500/30 rounded-lg font-medium"
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Blogs</span>}
            </Link>
            <Link
              href="/admin/blogs/create"
              className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Create Blog</span>}
            </Link>
          </nav>

          <div className="border-t border-gray-700 p-4">
            <div className={`flex items-center justify-between ${!sidebarOpen && 'flex-col space-y-2'}`}>
              <div className={`${!sidebarOpen && 'hidden'}`}>
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-white font-medium truncate text-sm">{user?.email}</p>
                <p className="text-xs text-amber-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="h-16 bg-gray-800 border-b border-gray-700 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <Link href="/admin/blogs" className="text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Edit Blog</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading || fetchLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
              >
                <EyeOff className="w-5 h-5" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading || fetchLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Publish'}</span>
              </button>
            </div>
          </div>

          <div className="p-8">
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

            {fetchLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-2">Loading blog...</p>
              </div>
            ) : (
              <div className="space-y-8 max-w-4xl">

                {/* ── CORE CONTENT ─────────────────────────── */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-amber-500 border-b border-gray-700 pb-2">Content</h2>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Blog Title *</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition" />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">URL Slug *</label>
                    <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition" />
                    <p className="text-xs text-gray-500 mt-1">Changing the slug will break existing links to this post.</p>
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">Excerpt / Subtitle</label>
                    <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm" />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                      Content * <span className="text-gray-500 font-normal">(HTML supported)</span>
                    </label>
                    <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-mono text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Full HTML. TOC auto-generated from &lt;h2&gt; headings on the public page.</p>
                  </div>
                </div>

                {/* ── AUTHOR & IMAGE ────────────────────────── */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-amber-500 border-b border-gray-700 pb-2">Author & Image</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
                      <input id="authorName" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition" />
                    </div>
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                      <input id="tags" type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Noida, Luxury, Art"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition" />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
                    <input id="featuredImage" type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition" />
                    {featuredImage && (
                      <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-gray-700">
                        <img src={featuredImage} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── SEO ──────────────────────────────────── */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-amber-500 border-b border-gray-700 pb-2">SEO</h2>
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                    <input id="metaTitle" type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition" />
                    <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters recommended.</p>
                  </div>
                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                    <textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm" />
                    <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 characters recommended.</p>
                  </div>
                </div>

                {/* ── PUBLISH ──────────────────────────────── */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 accent-amber-500" />
                    <span className="text-sm font-medium text-gray-300">Published</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Save/Publish buttons in the header override this.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
