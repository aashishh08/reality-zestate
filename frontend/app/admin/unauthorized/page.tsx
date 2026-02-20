'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
        <Link
          href="/admin/dashboard"
          className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
