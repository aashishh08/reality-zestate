'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { FileText, Plus, Eye, EyeOff, Trash2, Edit2, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { getAllBlogs, deleteBlog } from '@/lib/api/admin';
import { updateBlog } from '@/lib/api/blogs';
import { revalidateBlogCaches } from '@/app/actions/revalidate-homepage';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogsListPage() {
  const { token } = useAdminAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadBlogs = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      const filters: { search?: string; isPublished?: boolean } = {};
      if (appliedSearch) filters.search = appliedSearch;
      if (filterStatus !== '') filters.isPublished = filterStatus === 'published';
      const response: any = await getAllBlogs(token, filters);
      setBlogs(response.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, [token, appliedSearch, filterStatus]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search);
  };

  const handleDelete = async (blog: Blog) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setDeleteLoading(blog.id);
      await deleteBlog(blog.id, token!);
      await revalidateBlogCaches(blog.slug);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      setTogglingId(blog.id);
      await updateBlog(blog.id, { isPublished: !blog.isPublished }, token!);
      await revalidateBlogCaches(blog.slug);
      setBlogs(blogs.map((b) => (b.id === blog.id ? { ...b, isPublished: !b.isPublished } : b)));
    } catch (err: any) {
      setError(err?.message || 'Failed to update blog');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <ProtectedAdminRoute>
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 px-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Blog Management</h1>
            <Link
              href="/admin/blogs/create"
              className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              <Plus className="w-5 h-5" />
              <span>New Blog</span>
            </Link>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Search + Status filter */}
            <form onSubmit={handleSearch} className="mb-6 flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <button
                type="button"
                onClick={loadBlogs}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </form>

            {/* Blogs Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-2">Loading blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No blogs found</p>
                <p className="text-gray-500 text-sm mb-4">Create your first blog post to get started</p>
                <Link
                  href="/admin/blogs/create"
                  className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                >
                  Create Blog
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Slug</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition">
                        <td className="px-6 py-4 text-sm text-white truncate max-w-xs">{blog.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-xs">{blog.slug}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                              blog.isPublished
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {blog.isPublished ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2 flex">
                          <Link
                            href={`/admin/blogs/${blog.id}/edit`}
                            className="p-2 text-amber-500 hover:bg-gray-700 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(blog)}
                            disabled={togglingId === blog.id}
                            className="p-2 text-gray-400 hover:text-amber-400 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                            title={blog.isPublished ? 'Unpublish / hide' : 'Publish'}
                          >
                            {togglingId === blog.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : blog.isPublished ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(blog)}
                            disabled={deleteLoading === blog.id}
                            className="p-2 text-red-500 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deleteLoading === blog.id ? (
                              <div className="w-4 h-4 border border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
