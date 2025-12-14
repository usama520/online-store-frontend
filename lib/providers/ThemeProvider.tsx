"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { defaultTheme, ThemeId, themeIds } from "@/lib/themes";
import { StoreSettings } from "@/lib/types";
import { useStoreSettingsStore } from "@/lib/zustand/storeSettingsStore";

const DEFAULT_STORE_NAME = "My Online Store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { data, loading } = useQuery(GET_STORE_SETTINGS);
  const [hasApplied, setHasApplied] = useState(false);
  const setSettings = useStoreSettingsStore((state) => state.setSettings);

  // Get theme from API response, fallback to defaultTheme
  const storeSettings = data?.storeSettings as StoreSettings | null;
  const selectedTheme = storeSettings?.selectedTheme as ThemeId | undefined;
  const theme =
    selectedTheme && themeIds.includes(selectedTheme)
      ? selectedTheme
      : defaultTheme;

  // Get store name for document title
  const storeName = storeSettings?.storeName || DEFAULT_STORE_NAME;

  // Sync store settings to zustand store when data loads
  useEffect(() => {
    if (storeSettings) {
      setSettings(storeSettings);
    }
  }, [storeSettings, setSettings]);

  // Update document title when store name changes
  useEffect(() => {
    if (!loading) {
      document.title = storeName;
    }
  }, [storeName, loading]);

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
