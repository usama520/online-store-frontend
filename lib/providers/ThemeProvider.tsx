"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/lib/zustand/themeStore";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, hasHydrated } = useThemeStore();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    if (hasHydrated) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, hasHydrated]);

  return (
    <>
      {children}
      {!isAdminRoute && <ThemeSwitcher />}
    </>
  );
}
