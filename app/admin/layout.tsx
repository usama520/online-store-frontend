'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/zustand/authStore';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isAuthenticated } = useAuth();
  const { _hasHydrated } = useAuthStore();

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;

    // Only redirect if not on login page
    if (!isLoginPage && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, router, isLoginPage, _hasHydrated]);

  // If on login page, render children directly without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // For other admin routes, require authentication
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

