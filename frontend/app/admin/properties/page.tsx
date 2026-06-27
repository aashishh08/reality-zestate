'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import {
    listAdminProperties, deleteAdminProperty, togglePublishProperty, AdminProperty,
} from '@/lib/api/properties-admin';
import { revalidatePropertyCaches } from '@/app/actions/revalidate-homepage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Building2, Plus, TrendingUp, FileText, LogOut, Menu, X,
    Eye, EyeOff, Trash2, ExternalLink, RefreshCw, Search, Filter,
    Home, CheckCircle2, XCircle, Layers, Users, Pencil,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';


export default function AdminPropertiesPage() {
    const router = useRouter();
    const { token, user, logout } = useAdminAuth();
    const [properties, setProperties] = useState<AdminProperty[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleLogout = () => { logout(); router.push('/admin/login'); };

    const loadProperties = useCallback(async () => {
        if (!token) return;
        setLoading(true); setError('');
        try {
            const filters: Record<string, any> = { limit: 200 };
            if (filterType) filters.propertyType = filterType;
            if (filterStatus !== '') filters.isPublished = filterStatus === 'published';
            const result = await listAdminProperties(token, filters);
            setProperties(result.properties);
            setTotal(result.total);
        } catch (e: any) {
            setError(e.message || 'Failed to load properties');
        } finally {
            setLoading(false);
        }
    }, [token, filterType, filterStatus]);

    useEffect(() => { loadProperties(); }, [loadProperties]);

    const handleDelete = async (p: AdminProperty) => {
        if (!token) return;
        if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
        setDeletingId(p.id);
        try {
            await deleteAdminProperty(p.id, token);
            await revalidatePropertyCaches(p.slug);
            loadProperties();
        }
        catch (e: any) { alert(e.message || 'Delete failed'); }
        finally { setDeletingId(null); }
    };

    const handleTogglePublish = async (p: AdminProperty) => {
        if (!token) return;
        setTogglingId(p.id);
        try {
            await togglePublishProperty(p.id, !p.isPublished, token);
            await revalidatePropertyCaches(p.slug);
            loadProperties();
        }
        catch (e: any) { alert(e.message || 'Update failed'); }
        finally { setTogglingId(null); }
    };

    const filtered = properties.filter(p =>
        !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
    );

    const published = properties.filter(p => p.isPublished).length;
    const drafts = properties.filter(p => !p.isPublished).length;

    return (
        <ProtectedAdminRoute>
            <div className="flex h-screen bg-gray-900 overflow-hidden">

                <AdminSidebar />

                {/* Main */}
                <div className="flex-1 overflow-auto">
                    {/* Header */}
                    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-5 h-5 text-amber-500" />
                            <h1 className="text-xl font-bold text-white">Properties</h1>
                            {!loading && (
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full font-medium">{total}</span>
                            )}
                        </div>
                        <Link href="/admin/properties/create"
                            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-semibold transition">
                            <Plus className="w-4 h-4" />
                            <span>Create Property</span>
                        </Link>
                    </div>

                    <div className="p-8 space-y-6 max-w-7xl mx-auto">

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Total Properties', val: total, color: 'text-white', border: 'border-gray-600', icon: <Building2 className="w-5 h-5 text-amber-500" /> },
                                { label: 'Published', val: published, color: 'text-emerald-400', border: 'border-emerald-500/30', icon: <Eye className="w-5 h-5 text-emerald-500" /> },
                                { label: 'Drafts', val: drafts, color: 'text-blue-400', border: 'border-blue-500/30', icon: <EyeOff className="w-5 h-5 text-blue-400" /> },
                            ].map(c => (
                                <div key={c.label} className={`bg-gray-800 border ${c.border} rounded-2xl p-5`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-gray-400 text-sm">{c.label}</p>
                                        {c.icon}
                                    </div>
                                    {loading
                                        ? <div className="h-9 w-16 bg-gray-700 rounded animate-pulse" />
                                        : <p className={`text-3xl font-bold ${c.color}`}>{c.val}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by title or slug…"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                                />
                            </div>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm focus:outline-none focus:border-amber-500">
                                <option value="">All Types</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                            </select>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm focus:outline-none focus:border-amber-500">
                                <option value="">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                            <button onClick={loadProperties} className="flex items-center space-x-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition">
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Table */}
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-700 flex items-center space-x-2">
                                <Layers className="w-5 h-5 text-amber-500" />
                                <h2 className="text-white font-semibold">All Properties</h2>
                                {filtered.length !== properties.length && (
                                    <span className="text-gray-400 text-sm">({filtered.length} of {properties.length})</span>
                                )}
                            </div>

                            {loading ? (
                                <div className="p-8 space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <div className="h-4 bg-gray-700 rounded animate-pulse flex-1" />
                                            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                                            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="p-16 text-center">
                                    <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg font-medium">No properties found</p>
                                    <p className="text-gray-500 text-sm mt-1 mb-6">
                                        {search ? 'Try a different search term' : 'Create your first property to get started'}
                                    </p>
                                    <Link href="/admin/properties/create"
                                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-semibold transition">
                                        <Plus className="w-4 h-4" />
                                        <span>Create Property</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-700/50">
                                    {filtered.map(p => (
                                        <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-700/20 transition group">
                                            <div className="flex items-center space-x-4 min-w-0">
                                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.isPublished ? 'bg-emerald-500' : 'bg-blue-400'}`} />
                                                <div className="min-w-0">
                                                    <p className="text-white font-medium text-sm truncate max-w-xs group-hover:text-amber-400 transition">
                                                        {p.title}
                                                    </p>
                                                    <div className="flex items-center space-x-3 mt-0.5">
                                                        <span className="text-xs font-mono text-gray-500">{p.slug}</span>
                                                        {p.developerSlug && <>
                                                            <span className="text-xs text-gray-600">·</span>
                                                            <span className="text-xs text-gray-500">{p.developerSlug}</span>
                                                        </>}
                                                        {(p.localitySlug || p.citySlug) && <>
                                                            <span className="text-xs text-gray-600">·</span>
                                                            <span className="text-xs text-gray-500">{p.localitySlug || p.citySlug}</span>
                                                        </>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                                                {/* Type badge */}
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.propertyType === 'residential' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'}`}>
                                                    {p.propertyType}
                                                </span>

                                                {/* Section count */}
                                                {p.PropertySections && (
                                                    <span className="text-xs text-gray-400 hidden sm:block">
                                                        {p.PropertySections.length} section{p.PropertySections.length !== 1 ? 's' : ''}
                                                    </span>
                                                )}

                                                {/* Status badge */}
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1 ${p.isPublished ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                                                    {p.isPublished ? <CheckCircle2 className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                    <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                                                </span>

                                                {/* Edit */}
                                                <Link
                                                    href={`/admin/properties/${p.id}/edit`}
                                                    title="Edit property"
                                                    className="p-1.5 text-gray-500 hover:text-amber-400 transition"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>

                                                {/* Toggle publish */}
                                                <button
                                                    onClick={() => handleTogglePublish(p)}
                                                    disabled={togglingId === p.id}
                                                    title={p.isPublished ? 'Unpublish' : 'Publish'}
                                                    className="p-1.5 text-gray-500 hover:text-amber-400 transition disabled:opacity-40">
                                                    {togglingId === p.id
                                                        ? <RefreshCw className="w-4 h-4 animate-spin" />
                                                        : p.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>

                                                {/* View live */}
                                                <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer"
                                                    className="p-1.5 text-gray-500 hover:text-emerald-400 transition" title="View on site">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(p)}
                                                    disabled={deletingId === p.id}
                                                    title="Delete"
                                                    className="p-1.5 text-gray-500 hover:text-red-400 transition disabled:opacity-40">
                                                    {deletingId === p.id
                                                        ? <RefreshCw className="w-4 h-4 animate-spin" />
                                                        : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedAdminRoute>
    );
}
