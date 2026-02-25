'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { useRouter } from 'next/navigation';
import {
    Users, LogOut, Menu, X, TrendingUp, Building2,
    FileText, Plus, RefreshCw, Search, Phone, Mail,
    CheckCircle2, XCircle, Clock, Star, AlertCircle, Filter,
    ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { getLeads, updateLeadStatus, Lead } from '@/lib/api/leads';

// ─────────────────────────────────────────
// Sidebar nav — shared across admin pages
// ─────────────────────────────────────────
const SIDEBAR_LINKS = [
    { href: '/admin/dashboard', icon: TrendingUp, label: 'Dashboard' },
    { href: '/admin/properties', icon: Building2, label: 'Properties' },
    { href: '/admin/properties/create', icon: Plus, label: 'Create Property' },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { href: '/admin/leads', icon: Users, label: 'Leads', active: true },
];

// ─────────────────────────────────────────
// Status meta
// ─────────────────────────────────────────
type LeadStatus = Lead['status'];

const STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    new: { label: 'New', color: 'text-blue-400', bg: 'bg-blue-500/15', icon: <Clock className="w-3 h-3" /> },
    contacted: { label: 'Contacted', color: 'text-amber-400', bg: 'bg-amber-500/15', icon: <Phone className="w-3 h-3" /> },
    qualified: { label: 'Qualified', color: 'text-purple-400', bg: 'bg-purple-500/15', icon: <Star className="w-3 h-3" /> },
    converted: { label: 'Converted', color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: <CheckCircle2 className="w-3 h-3" /> },
    lost: { label: 'Lost', color: 'text-red-400', bg: 'bg-red-500/15', icon: <XCircle className="w-3 h-3" /> },
};

const ALL_STATUSES = Object.keys(STATUS_META) as LeadStatus[];

// ─────────────────────────────────────────
// Source formatting helper
// ─────────────────────────────────────────
function formatSource(source?: string) {
    if (!source) return '—';
    return source.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─────────────────────────────────────────
// Date formatter
// ─────────────────────────────────────────
function formatDate(iso?: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
}

// ─────────────────────────────────────────
// Main component
// ─────────────────────────────────────────
export default function AdminLeadsPage() {
    const router = useRouter();
    const { token, user, logout } = useAdminAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<LeadStatus | ''>('');
    const [filterSource, setFilterSource] = useState('');

    // Status update
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleLogout = () => { logout(); router.push('/admin/login'); };

    // ── Load all leads (high limit, filter client-side for speed) ──
    const loadLeads = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            const res = await getLeads({ limit: 500, offset: 0 }, token);
            setLeads(res.data ?? []);
            setTotal(res.pagination?.total ?? (res.data ?? []).length);
        } catch (e: any) {
            setError(e?.message || 'Failed to load leads');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { loadLeads(); }, [loadLeads]);

    // ── Status update inline ──
    const handleStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
        if (!token || newStatus === lead.status) return;
        setUpdatingId(lead.id);
        try {
            await updateLeadStatus(lead.id, newStatus, token);
            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
        } catch (e: any) {
            alert(e?.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    // ── Client-side filtering ──
    const filtered = leads.filter(l => {
        const q = search.toLowerCase();
        const matchesSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q);
        const matchesStatus = !filterStatus || l.status === filterStatus;
        const matchesSource = !filterSource || (l.source || 'website') === filterSource;
        return matchesSearch && matchesStatus && matchesSource;
    });

    // ── Computed stats ──
    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        converted: leads.filter(l => l.status === 'converted').length,
        lost: leads.filter(l => l.status === 'lost').length,
    };

    // ── Unique sources for filter dropdown ──
    const sources = Array.from(new Set(leads.map(l => l.source || 'website'))).sort();

    return (
        <ProtectedAdminRoute>
            <div className="flex h-screen bg-gray-900 overflow-hidden">

                {/* ── Sidebar ── */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col flex-shrink-0`}>
                    <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
                        <div className={`flex items-center space-x-3 ${!sidebarOpen && 'hidden'}`}>
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold">Admin</span>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {SIDEBAR_LINKS.map(({ href, icon: Icon, label, active }) => (
                            <Link key={href} href={href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition text-sm ${active
                                        ? 'text-white bg-amber-500/20 border border-amber-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}>
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span>{label}</span>}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t border-gray-700 p-4">
                        <div className={`flex items-center justify-between ${!sidebarOpen && 'flex-col space-y-2'}`}>
                            <div className={!sidebarOpen ? 'hidden' : ''}>
                                <p className="text-xs text-gray-400">Logged in as</p>
                                <p className="text-white font-medium truncate text-sm">{user?.email}</p>
                                <p className="text-xs text-amber-500">{user?.role}</p>
                            </div>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ── Main ── */}
                <div className="flex-1 overflow-auto">

                    {/* Header */}
                    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10">
                        <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-amber-500" />
                            <h1 className="text-xl font-bold text-white">Leads</h1>
                            {!loading && (
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full font-medium">{total}</span>
                            )}
                        </div>
                        <button
                            onClick={loadLeads}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    <div className="p-8 space-y-6 max-w-7xl mx-auto">

                        {/* ── Stat Cards ── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Leads', val: stats.total, color: 'text-white', border: 'border-gray-600', icon: <Users className="w-5 h-5 text-amber-500" /> },
                                { label: 'New', val: stats.new, color: 'text-blue-400', border: 'border-blue-500/30', icon: <Clock className="w-5 h-5 text-blue-400" /> },
                                { label: 'Converted', val: stats.converted, color: 'text-emerald-400', border: 'border-emerald-500/30', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                                { label: 'Lost', val: stats.lost, color: 'text-red-400', border: 'border-red-500/30', icon: <XCircle className="w-5 h-5 text-red-400" /> },
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

                        {/* ── Filters ── */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name, email or phone…"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                                />
                            </div>
                            {/* Status filter */}
                            <div className="relative">
                                <Filter className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value as LeadStatus | '')}
                                    className="pl-9 pr-8 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm focus:outline-none focus:border-amber-500 appearance-none"
                                >
                                    <option value="">All Statuses</option>
                                    {ALL_STATUSES.map(s => (
                                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            {/* Source filter */}
                            {sources.length > 1 && (
                                <div className="relative">
                                    <select
                                        value={filterSource}
                                        onChange={e => setFilterSource(e.target.value)}
                                        className="pl-4 pr-8 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-sm focus:outline-none focus:border-amber-500 appearance-none"
                                    >
                                        <option value="">All Sources</option>
                                        {sources.map(s => (
                                            <option key={s} value={s}>{formatSource(s)}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-3 h-3 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            )}
                        </div>

                        {/* ── Error ── */}
                        {error && (
                            <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* ── Table ── */}
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-amber-500" />
                                    <h2 className="text-white font-semibold">All Leads</h2>
                                </div>
                                {filtered.length !== leads.length && (
                                    <span className="text-gray-400 text-sm">{filtered.length} of {leads.length}</span>
                                )}
                            </div>

                            {loading ? (
                                <div className="p-8 space-y-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                                            <div className="h-4 flex-1 bg-gray-700 rounded animate-pulse" />
                                            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                                            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="p-16 text-center">
                                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg font-medium">No leads found</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {search || filterStatus || filterSource ? 'Try adjusting your filters' : 'Leads submitted via the website will appear here'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Table Header */}
                                    <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1.2fr_1.2fr_1.5fr] gap-4 px-6 py-3 border-b border-gray-700 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <span>Name</span>
                                        <span>Contact</span>
                                        <span>Source</span>
                                        <span>Status</span>
                                        <span>Update Status</span>
                                        <span>Submitted</span>
                                    </div>

                                    <div className="divide-y divide-gray-700/50">
                                        {filtered.map(lead => {
                                            const meta = STATUS_META[lead.status] ?? STATUS_META.new;
                                            return (
                                                <div key={lead.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_1.2fr_1.2fr_1.5fr] gap-4 px-6 py-4 hover:bg-gray-700/20 transition items-center">

                                                    {/* Name */}
                                                    <div>
                                                        <p className="text-white font-medium text-sm truncate">{lead.name}</p>
                                                        <p className="text-gray-500 text-xs mt-0.5 font-mono">#{lead.id.slice(0, 8)}</p>
                                                    </div>

                                                    {/* Contact */}
                                                    <div className="space-y-1">
                                                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition text-xs">
                                                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="truncate">{lead.email}</span>
                                                        </a>
                                                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition text-xs">
                                                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span>{lead.phone}</span>
                                                        </a>
                                                    </div>

                                                    {/* Source */}
                                                    <div>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 font-medium">
                                                            {formatSource(lead.source)}
                                                        </span>
                                                    </div>

                                                    {/* Status badge */}
                                                    <div>
                                                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${meta.bg} ${meta.color}`}>
                                                            {meta.icon}
                                                            {meta.label}
                                                        </span>
                                                    </div>

                                                    {/* Status updater */}
                                                    <div className="relative">
                                                        {updatingId === lead.id ? (
                                                            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <select
                                                                    value={lead.status}
                                                                    onChange={e => handleStatusChange(lead, e.target.value as LeadStatus)}
                                                                    className="w-full pl-3 pr-7 py-1.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-xs focus:outline-none focus:border-amber-500 appearance-none"
                                                                >
                                                                    {ALL_STATUSES.map(s => (
                                                                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Date */}
                                                    <div>
                                                        <p className="text-gray-400 text-xs">{formatDate(lead.createdAt)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedAdminRoute>
    );
}
