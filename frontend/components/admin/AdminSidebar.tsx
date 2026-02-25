'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    TrendingUp, Building2, Plus, FileText, Users, LogOut, Menu, X, Home
} from 'lucide-react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';

const SIDEBAR_LINKS = [
    { href: '/admin/dashboard', icon: TrendingUp, label: 'Dashboard' },
    { href: '/admin/properties', icon: Building2, label: 'Properties' },
    { href: '/admin/properties/create', icon: Plus, label: 'Create Property' },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { href: '/admin/blogs/create', icon: Plus, label: 'Create Blog' },
    { href: '/admin/leads', icon: Users, label: 'Leads' },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAdminAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col flex-shrink-0 h-screen sticky top-0`}>
            {/* Logo Section */}
            <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
                <div className={`flex items-center space-x-3 ${!sidebarOpen && 'hidden'}`}>
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold">Admin</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded transition ml-auto"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
                {SIDEBAR_LINKS.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`group flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition text-sm relative ${isActive
                                ? 'text-white bg-amber-500/20 border border-amber-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="truncate">{label}</span>}
                            {!sidebarOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                    {label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info Section */}
            <div className="border-t border-gray-700 p-4">
                <div className={`flex items-center justify-between ${!sidebarOpen && 'flex-col space-y-2'}`}>
                    <div className={!sidebarOpen ? 'hidden' : 'min-w-0 flex-1 mr-2'}>
                        <p className="text-xs text-gray-400">Logged in as</p>
                        <p className="text-white font-medium truncate text-sm" title={user?.email || ''}>
                            {user?.email}
                        </p>
                        <p className="text-xs text-amber-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-gray-700 rounded-lg"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
