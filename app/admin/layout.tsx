'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-8">Admin Panel</h1>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
              >
                Settings
              </Link>
              <Link
                href="/"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
              >
                Back to Store
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

