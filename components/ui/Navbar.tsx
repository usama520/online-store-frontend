'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/zustand/cartStore';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const cartItemCount = getTotalItems();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              My Store
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <Link href="/account" className="text-gray-700 hover:text-blue-600">
                {user?.email}
              </Link>
            )}
            
            {isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                Admin
              </Link>
            )}

            <Link href="/cart" className="text-gray-700 hover:text-blue-600 relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

