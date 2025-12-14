"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { defaultTheme, ThemeId, themeIds } from "@/lib/themes";
import { StoreSettings } from "@/lib/types";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { data, loading } = useQuery(GET_STORE_SETTINGS);
  const [hasApplied, setHasApplied] = useState(false);

  // Get theme from API response, fallback to defaultTheme
  const storeSettings = data?.storeSettings as StoreSettings | null;
  const selectedTheme = storeSettings?.selectedTheme as ThemeId | undefined;
  const theme =
    selectedTheme && themeIds.includes(selectedTheme)
      ? selectedTheme
      : defaultTheme;

  // Apply theme to document when data loads
  useEffect(() => {
    if (!loading && !hasApplied) {
      document.documentElement.setAttribute("data-theme", theme);
      setHasApplied(true);
    } else if (hasApplied) {
      // Update theme if it changes after initial load
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, loading, hasApplied]);

  // Apply default theme immediately on mount to prevent flash
  useEffect(() => {
    if (!hasApplied) {
      document.documentElement.setAttribute("data-theme", defaultTheme);
    }
  }, [hasApplied]);

  return <>{children}</>;
}
