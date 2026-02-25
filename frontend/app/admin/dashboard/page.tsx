'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { useRouter } from 'next/navigation';
import {
  FileText, Plus, LogOut, Menu, X,
  Eye, EyeOff, Edit2, TrendingUp, BookOpen, PenTool, Building2, Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { getAllBlogs } from '@/lib/api/admin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface Blog {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAdminAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      // Fetch up to 100 so we can derive accurate counts client-side
      const response = await getAllBlogs(token, { limit: 100 }) as any;
      const blogs: Blog[] = response.data || [];

      setStats({
        total: response.pagination?.total ?? blogs.length,
        published: blogs.filter((b) => b.isPublished).length,
        drafts: blogs.filter((b) => !b.isPublished).length,
      });

      // Show 5 most recently updated
      setRecentBlogs(
        [...blogs]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5)
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const statCards = [
    {
      label: 'Total Blogs',
      value: stats?.total,
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      bg: 'border-amber-500/20',
      sub: 'All time',
    },
    {
      label: 'Published',
      value: stats?.published,
      icon: <Eye className="w-5 h-5 text-green-500" />,
      bg: 'border-green-500/20',
      sub: 'Live on site',
    },
    {
      label: 'Drafts',
      value: stats?.drafts,
      icon: <PenTool className="w-5 h-5 text-blue-400" />,
      bg: 'border-blue-400/20',
      sub: 'Not published',
    },
  ];

  return (
    <ProtectedAdminRoute>
      <div className="flex h-screen bg-gray-900">

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <Link
              href="/admin/blogs/create"
              className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Blog</span>
            </Link>
          </div>

          <div className="p-8 space-y-8">

            {/* Welcome */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.email}!</h2>
              <p className="text-gray-400 text-sm">Here&apos;s a live snapshot of your blog content.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statCards.map((card) => (
                <div key={card.label} className={`bg-gray-800 border ${card.bg} rounded-xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">{card.label}</h3>
                    {card.icon}
                  </div>
                  {loading ? (
                    <div className="h-9 w-16 bg-gray-700 rounded animate-pulse" />
                  ) : (
                    <p className="text-4xl font-bold text-white">{card.value ?? 0}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Posts */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">Recent Posts</h3>
                <Link href="/admin/blogs" className="text-amber-500 hover:text-amber-400 text-sm font-medium transition">
                  View all →
                </Link>
              </div>

              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-4 bg-gray-700 rounded animate-pulse flex-1" />
                      <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : recentBlogs.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No blogs yet.</p>
                  <Link href="/admin/blogs/create" className="mt-3 inline-block text-amber-500 hover:underline text-sm">
                    Create your first blog →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {recentBlogs.map((blog) => (
                    <div key={blog.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-700/30 transition">
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${blog.isPublished ? 'bg-green-500' : 'bg-blue-400'}`} />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate max-w-xs">{blog.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                            {blog.authorName && ` · ${blog.authorName}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${blog.isPublished
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-blue-500/15 text-blue-400'
                          }`}>
                          {blog.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{blog.isPublished ? 'Published' : 'Draft'}</span>
                        </span>
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-gray-700 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/blogs/create"
                className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition shadow-lg shadow-amber-500/20"
              >
                <div>
                  <p className="font-semibold">Create New Blog</p>
                  <p className="text-amber-100 text-sm mt-0.5">Write and publish an article</p>
                </div>
                <Plus className="w-6 h-6 flex-shrink-0" />
              </Link>
              <Link
                href="/admin/blogs"
                className="flex items-center justify-between p-5 bg-gray-800 border border-gray-700 text-white rounded-xl hover:bg-gray-700 transition"
              >
                <div>
                  <p className="font-semibold">Manage Blogs</p>
                  <p className="text-gray-400 text-sm mt-0.5">Edit, publish, or delete posts</p>
                </div>
                <FileText className="w-6 h-6 flex-shrink-0 text-gray-400" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
