'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Search, Building2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  AdminCity,
  AdminLocality,
  createCity,
  createLocality,
  getAdminLocations,
  slugify,
  updateLocation,
} from '@/lib/api/locations-admin';
import { revalidateLocationCaches } from '@/app/actions/revalidate-location';

type EditTarget =
  | { kind: 'city'; item: AdminCity }
  | { kind: 'locality'; item: AdminLocality };

export default function AdminLocationsPage() {
  const { token } = useAdminAuth();
  const [cities, setCities] = useState<AdminCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const [cityName, setCityName] = useState('');
  const [citySlug, setCitySlug] = useState('');
  const [citySlugTouched, setCitySlugTouched] = useState(false);

  const [localityName, setLocalityName] = useState('');
  const [localitySlug, setLocalitySlug] = useState('');
  const [localitySlugTouched, setLocalitySlugTouched] = useState(false);
  const [localityParentId, setLocalityParentId] = useState('');

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editName, setEditName] = useState('');
  const [editParentId, setEditParentId] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editFeaturedOrder, setEditFeaturedOrder] = useState('');

  const loadLocations = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      const data = await getAdminLocations(token);
      setCities(data);
      if (!localityParentId && data[0]?.id) {
        setLocalityParentId(data[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadLocations();
  }, [token]);

  const filteredCities = cities.filter((city) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    if (city.name.toLowerCase().includes(q) || city.slug.includes(q)) return true;
    return city.children.some(
      (loc) => loc.name.toLowerCase().includes(q) || loc.slug.includes(q),
    );
  });

  const parentSlugForCityId = (cityId: string) =>
    cities.find((city) => city.id === cityId)?.slug;

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSaving(true);
      setError('');
      const slug = citySlug.trim();
      await createCity(token, { name: cityName.trim(), slug });
      setCityName('');
      setCitySlug('');
      setCitySlugTouched(false);
      await loadLocations();
      await revalidateLocationCaches({ slug });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create city');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLocality = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !localityParentId) return;
    try {
      setSaving(true);
      setError('');
      const slug = localitySlug.trim();
      const parentSlug = parentSlugForCityId(localityParentId);
      await createLocality(token, {
        name: localityName.trim(),
        slug,
        parentId: localityParentId,
      });
      setLocalityName('');
      setLocalitySlug('');
      setLocalitySlugTouched(false);
      await loadLocations();
      await revalidateLocationCaches({
        slug,
        relatedSlugs: parentSlug ? [parentSlug] : undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create locality');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (target: EditTarget) => {
    setEditTarget(target);
    setEditName(target.item.name);
    if (target.kind === 'locality') {
      setEditParentId(target.item.parentId);
      setEditIsFeatured(Boolean(target.item.isFeatured));
      setEditFeaturedOrder(
        target.item.featuredOrder != null ? String(target.item.featuredOrder) : '',
      );
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editTarget) return;
    try {
      setSaving(true);
      setError('');
      const payload: {
        name: string;
        parentId?: string;
        isFeatured?: boolean;
        featuredOrder?: number | null;
      } = { name: editName.trim() };
      if (editTarget.kind === 'locality' && editTarget.item.propertyCount === 0) {
        payload.parentId = editParentId;
      }
      if (editTarget.kind === 'locality') {
        payload.isFeatured = editIsFeatured;
        payload.featuredOrder = editFeaturedOrder.trim()
          ? parseInt(editFeaturedOrder, 10)
          : null;
      }
      await updateLocation(token, editTarget.item.id, payload);
      setEditTarget(null);
      await loadLocations();

      const relatedSlugs: string[] = [];
      if (editTarget.kind === 'locality') {
        if (editTarget.item.parent?.slug) relatedSlugs.push(editTarget.item.parent.slug);
        const newParentSlug = parentSlugForCityId(editParentId);
        if (newParentSlug) relatedSlugs.push(newParentSlug);
      }
      await revalidateLocationCaches({
        slug: editTarget.item.slug,
        relatedSlugs: relatedSlugs.length ? relatedSlugs : undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
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
              <MapPin className="w-6 h-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">Cities &amp; Localities</h1>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-400">
              Cities and localities are stored in the database. Existing property slugs are never changed —
              only display names can be edited. Slugs are fixed after creation.
            </p>

            <div className="grid lg:grid-cols-2 gap-6">
              <form onSubmit={handleCreateCity} className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  Add City
                </h2>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                  <input
                    value={cityName}
                    onChange={(e) => {
                      setCityName(e.target.value);
                      if (!citySlugTouched) setCitySlug(slugify(e.target.value));
                    }}
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g. Bangalore"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Slug</label>
                  <input
                    value={citySlug}
                    onChange={(e) => {
                      setCitySlugTouched(true);
                      setCitySlug(e.target.value);
                    }}
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                    placeholder="e.g. bangalore"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  Create City
                </button>
              </form>

              <form onSubmit={handleCreateLocality} className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  Add Locality
                </h2>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Parent City</label>
                  <select
                    value={localityParentId}
                    onChange={(e) => setLocalityParentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="">— Select city —</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                  <input
                    value={localityName}
                    onChange={(e) => {
                      setLocalityName(e.target.value);
                      if (!localitySlugTouched) setLocalitySlug(slugify(e.target.value));
                    }}
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g. Whitefield"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Slug</label>
                  <input
                    value={localitySlug}
                    onChange={(e) => {
                      setLocalitySlugTouched(true);
                      setLocalitySlug(e.target.value);
                    }}
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                    placeholder="e.g. whitefield"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving || cities.length === 0}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  Create Locality
                </button>
              </form>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities or localities..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              />
            </div>

            {loading ? (
              <p className="text-gray-400">Loading locations...</p>
            ) : (
              <div className="space-y-4">
                {filteredCities.map((city) => (
                  <div key={city.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/80">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-white font-semibold">{city.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{city.slug}</p>
                        </div>
                        {city.propertyCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                            {city.propertyCount} propert{city.propertyCount === 1 ? 'y' : 'ies'}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => openEdit({ kind: 'city', item: city })}
                        className="p-2 text-gray-400 hover:text-amber-400 transition"
                        aria-label={`Edit ${city.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    {city.children.length === 0 ? (
                      <p className="px-6 py-4 text-sm text-gray-500">No localities yet.</p>
                    ) : (
                      <div className="divide-y divide-gray-700">
                        {city.children
                          .filter((loc) => {
                            const q = search.trim().toLowerCase();
                            if (!q) return true;
                            if (city.name.toLowerCase().includes(q) || city.slug.includes(q)) return true;
                            return loc.name.toLowerCase().includes(q) || loc.slug.includes(q);
                          })
                          .map((locality) => (
                            <div key={locality.id} className="flex items-center justify-between px-6 py-3 pl-12">
                              <div>
                                <p className="text-gray-200 flex items-center gap-2">
                                  {locality.name}
                                  {locality.isFeatured && (
                                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                      Featured
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">{locality.slug}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {locality.propertyCount > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {locality.propertyCount} propert{locality.propertyCount === 1 ? 'y' : 'ies'}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openEdit({ kind: 'locality', item: locality })}
                                  className="p-2 text-gray-400 hover:text-amber-400 transition"
                                  aria-label={`Edit ${locality.name}`}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}

                {filteredCities.length === 0 && (
                  <p className="text-gray-500 text-sm">No cities match your search.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form
              onSubmit={handleSaveEdit}
              className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">
                Edit {editTarget.kind === 'city' ? 'City' : 'Locality'}
              </h3>
              <p className="text-xs text-gray-500 font-mono">Slug: {editTarget.item.slug} (cannot be changed)</p>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              {editTarget.kind === 'locality' && (
                <>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Parent City</label>
                  <select
                    value={editParentId}
                    onChange={(e) => setEditParentId(e.target.value)}
                    disabled={editTarget.item.propertyCount > 0}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white disabled:opacity-50"
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {editTarget.item.propertyCount > 0 && (
                    <p className="text-xs text-amber-400/80 mt-1">
                      Parent city is locked because properties reference this locality.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="edit-is-featured"
                    type="checkbox"
                    checked={editIsFeatured}
                    onChange={(e) => setEditIsFeatured(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-900 text-amber-500"
                  />
                  <label htmlFor="edit-is-featured" className="text-sm text-gray-300">
                    Show on homepage featured corridors
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Homepage order (optional, lower = first)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={editFeaturedOrder}
                    onChange={(e) => setEditFeaturedOrder(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                </>
              )}

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
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedAdminRoute>
  );
}
