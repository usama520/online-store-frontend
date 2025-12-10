"use client";

import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-container">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="admin-main">
        {/* Header - Always visible on mobile to show menu toggle */}
        <div className="admin-header">
          <div className="flex-1 min-w-0">
            {title && <h1 className="admin-title">{title}</h1>}
            {subtitle && <p className="admin-subtitle">{subtitle}</p>}
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-4"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-text-primary" />
            )}
          </button>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
