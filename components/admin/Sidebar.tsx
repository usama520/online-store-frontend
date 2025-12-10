"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const navigationItems = [
  {
    section: "MAIN",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    section: "STORE",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Layers },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    section: "CONFIGURATION",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleClose = () => {
    onClose();
  };

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-sidebar bg-sidebar h-screen flex flex-col overflow-y-auto scrollbar-hide transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              S
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="text-white font-bold text-sm truncate">STORE</div>
              <div className="text-primary text-xs font-medium truncate">
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 scrollbar-hide">
          {navigationItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 sm:px-4 mb-2 sm:mb-3">
                {section.section}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleClose}
                      className={`nav-link ${active ? "active" : ""}`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - User Profile */}
        <div className="flex-shrink-0 border-t border-gray-800 p-2 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3 px-2 py-2 bg-primary rounded-lg">
            <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "SA"}
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-white text-xs sm:text-sm font-medium truncate">
                {user?.email?.split("@")[0] || "Admin"}
              </p>
              <p className="text-red-100 text-xs truncate">
                {user?.email || "admin@store.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center space-x-3 px-2 sm:px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white transition-colors text-xs sm:text-sm font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu toggle button - positioned in header via AdminLayout */}
    </>
  );
}
