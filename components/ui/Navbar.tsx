"use client";

import { useState } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/zustand/cartStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { useStoreName } from "@/lib/hooks/useStoreName";

// Subscribe returns a no-op unsubscribe
const emptySubscribe = () => () => {};

export default function Navbar() {
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user, isAdmin, logout, hasHydrated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const storeName = useStoreName();

  // Track hydration without useEffect + setState
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const cartItemCount = isMounted ? getTotalItems() : 0;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-theme-surface-card/95 backdrop-blur-md border-b border-theme-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-18">
            {/* Left: Logo and Desktop Nav */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 -ml-2 mr-2 rounded-xl text-theme-text-secondary hover:bg-theme-surface-secondary transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight"
              >
                {storeName}
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center ml-10 space-x-1">
                <Link
                  href="/products"
                  className="px-4 py-2 rounded-xl text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
                >
                  Products
                </Link>
              </div>
            </div>

            {/* Right: Cart and Auth */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-secondary transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-theme-accent text-theme-text-on-accent text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-soft-sm">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Auth Section */}
              {hasHydrated ? (
                isAuthenticated ? (
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="hidden sm:block px-3 py-2 rounded-xl text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-xl text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Link
                      href="/login"
                      className="hidden sm:block px-4 py-2 rounded-xl text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2.5 rounded-xl bg-theme-primary text-theme-text-on-primary font-semibold hover:bg-theme-primary-hover transition-colors shadow-soft-sm"
                    >
                      Sign Up
                    </Link>
                  </div>
                )
              ) : (
                <div
                  className="w-20 h-8 rounded-xl bg-theme-surface-secondary animate-pulse"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-theme-surface-card z-50 lg:hidden
          transform transition-transform duration-300 ease-out shadow-soft-xl
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-theme-border-light">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-xl font-bold text-theme-primary"
            >
              {process.env.NEXT_PUBLIC_STORE_NAME || "My Store"}
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-xl text-theme-text-secondary hover:bg-theme-surface-secondary transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/products"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 rounded-xl text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-3 text-theme-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Products
            </Link>

            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 rounded-xl text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-3 text-theme-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Cart
              {cartItemCount > 0 && (
                <span className="ml-auto bg-theme-accent text-theme-text-on-accent text-xs font-bold rounded-full px-2 py-0.5">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {hasHydrated && isAdmin && (
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-xl text-theme-text hover:bg-theme-surface-secondary font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3 text-theme-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Drawer Footer - Auth */}
          <div className="p-4 border-t border-theme-border-light">
            {hasHydrated ? (
              isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 text-sm text-theme-text-secondary truncate">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface-secondary text-theme-text font-medium hover:bg-theme-border transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 rounded-xl bg-theme-primary text-theme-text-on-primary font-semibold text-center hover:bg-theme-primary-hover transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 rounded-xl bg-theme-surface-secondary text-theme-text font-medium text-center hover:bg-theme-border transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <div className="h-12 rounded-xl bg-theme-surface-secondary animate-pulse" />
                <div className="h-12 rounded-xl bg-theme-surface-secondary animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
