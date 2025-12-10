"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/zustand/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isAuthenticated } = useAuth();
  const { _hasHydrated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;

    // Only redirect if not on login page
    if (!isLoginPage && (!isAuthenticated || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isAdmin, router, isLoginPage, _hasHydrated]);

  // If on login page, render children directly without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-content-bg flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // For other admin routes, require authentication
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
