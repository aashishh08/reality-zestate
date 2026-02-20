'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Edit2, Trash2, LogOut, Menu, X, Search, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllBlogs, deleteBlog } from '@/lib/api/admin';
import { updateBlog } from '@/lib/api/blogs';

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
  const router = useRouter();
  const { user, token, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadBlogs();
    }
  }, [token]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs(token!, { search });
      setBlogs(response.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setDeleteLoading(id);
      await deleteBlog(id, token!);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      await updateBlog(blog.id, { isPublished: !blog.isPublished }, token!);
      setBlogs(blogs.map((b) => (b.id === blog.id ? { ...b, isPublished: !b.isPublished } : b)));
    } catch (err: any) {
      setError(err?.message || 'Failed to update blog');
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
          {/* Logo */}
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

          {/* Navigation */}
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

          {/* User Info */}
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

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
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
                          <button
                            onClick={() => handleTogglePublish(blog)}
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                              blog.isPublished
                                ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                                : 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                            }`}
                          >
                            {blog.isPublished ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
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
                            onClick={() => handleDelete(blog.id)}
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
