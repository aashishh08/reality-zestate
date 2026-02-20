'use client';

import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasPermission } = useAdminAuth();

  useEffect(() => {
    // Only redirect AFTER context has finished reading from localStorage
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/admin/login');
      } else if (!hasPermission(requiredRoles)) {
        router.replace('/admin/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, hasPermission, requiredRoles, router]);

  // While context is hydrating from localStorage — show spinner, never redirect
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Context is done loading but user is not authenticated — show nothing while redirect fires
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated but wrong role
  if (!hasPermission(requiredRoles)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
