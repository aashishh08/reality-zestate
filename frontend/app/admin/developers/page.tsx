'use client';

import { useEffect, useState } from 'react';
import { Building2, Edit2, Search } from 'lucide-react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  AdminDeveloper,
  getAdminDevelopers,
  updateDeveloperSeo,
} from '@/lib/api/developers-admin';
import { revalidateDeveloperCaches } from '@/app/actions/revalidate-developer';

export default function AdminDevelopersPage() {
  const { token } = useAdminAuth();
  const [developers, setDevelopers] = useState<AdminDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<AdminDeveloper | null>(null);
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editMetaDescription, setEditMetaDescription] = useState('');
  const [editHeroImageUrl, setEditHeroImageUrl] = useState('');

  const loadDevelopers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      setDevelopers(await getAdminDevelopers(token));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadDevelopers();
  }, [token]);

  const filtered = developers.filter((dev) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return dev.name.toLowerCase().includes(q) || dev.slug.includes(q);
  });

  const openEdit = (developer: AdminDeveloper) => {
    setEditTarget(developer);
    setEditSeoTitle(developer.seoTitle ?? '');
    setEditMetaDescription(developer.metaDescription ?? '');
    setEditHeroImageUrl(developer.heroImageUrl ?? '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editTarget) return;
    try {
      setSaving(true);
      setError('');
      await updateDeveloperSeo(token, editTarget.id, {
        seoTitle: editSeoTitle.trim() || null,
        metaDescription: editMetaDescription.trim() || null,
        heroImageUrl: editHeroImageUrl.trim() || null,
      });
      setEditTarget(null);
      await loadDevelopers();
      await revalidateDeveloperCaches(editTarget.slug);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update developer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedAdminRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          <div className="h-16 bg-gray-800 border-b border-gray-700 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">Developer SEO</h1>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-400 max-w-2xl">
              Customize search titles, meta descriptions, and hero images for developer collection pages
              at <code className="text-amber-400/90">/developer/[slug]</code>.
            </p>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search developers..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              />
            </div>

            {loading ? (
              <p className="text-gray-400">Loading developers...</p>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl divide-y divide-gray-700">
                {filtered.map((developer) => (
                  <div
                    key={developer.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="text-white font-medium">{developer.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{developer.slug}</p>
                      {developer.seoTitle && (
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-xl">
                          SEO: {developer.seoTitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {developer.propertyCount > 0 && (
                        <span className="text-xs text-gray-500">
                          {developer.propertyCount} listing{developer.propertyCount === 1 ? '' : 's'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(developer)}
                        className="p-2 text-gray-400 hover:text-amber-400 transition"
                        aria-label={`Edit SEO for ${developer.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="px-6 py-8 text-sm text-gray-500">No developers match your search.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form
              onSubmit={handleSave}
              className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">SEO — {editTarget.name}</h3>
              <p className="text-xs text-gray-500 font-mono">Slug: {editTarget.slug}</p>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  SEO title (max 90 chars)
                </label>
                <input
                  value={editSeoTitle}
                  onChange={(e) => setEditSeoTitle(e.target.value)}
                  maxLength={90}
                  placeholder={`${editTarget.name} Luxury Projects in India`}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Meta description (max 320 chars)
                </label>
                <textarea
                  value={editMetaDescription}
                  onChange={(e) => setEditMetaDescription(e.target.value)}
                  maxLength={320}
                  rows={4}
                  placeholder="Compelling summary for Google search results..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Hero / OG image URL
                </label>
                <input
                  type="url"
                  value={editHeroImageUrl}
                  onChange={(e) => setEditHeroImageUrl(e.target.value)}
                  placeholder="https://... (falls back to logo if empty)"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  Save SEO
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedAdminRoute>
  );
}
