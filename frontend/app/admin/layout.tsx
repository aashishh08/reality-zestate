import { AdminAuthProvider } from '@/lib/contexts/AdminAuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal - Reality Estate',
  description: 'Admin panel for managing blogs and content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
