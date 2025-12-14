"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { defaultTheme, ThemeId, themeIds } from "@/lib/themes";
import { StoreSettings } from "@/lib/types";
import { useStoreSettingsStore } from "@/lib/zustand/storeSettingsStore";

const DEFAULT_STORE_NAME = "My Online Store";
const THEME_STORAGE_KEY = "store-theme";

// Helper to get cached theme from localStorage
function getCachedTheme(): ThemeId | null {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(THEME_STORAGE_KEY);
  if (cached && themeIds.includes(cached as ThemeId)) {
    return cached as ThemeId;
  }
  return null;
}

// Helper to save theme to localStorage
function setCachedTheme(theme: ThemeId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { data, loading } = useQuery(GET_STORE_SETTINGS);
  const [hasAppliedInitial, setHasAppliedInitial] = useState(false);
  const setSettings = useStoreSettingsStore((state) => state.setSettings);

  // Get theme from API response
  const storeSettings = data?.storeSettings as StoreSettings | null;
  const selectedTheme = storeSettings?.selectedTheme as ThemeId | undefined;
  const apiTheme =
    selectedTheme && themeIds.includes(selectedTheme) ? selectedTheme : null;

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

  // On mount: Apply cached theme from localStorage, or default theme
  useEffect(() => {
    if (!hasAppliedInitial) {
      const cachedTheme = getCachedTheme();
      const initialTheme = cachedTheme || defaultTheme;
      document.documentElement.setAttribute("data-theme", initialTheme);
      setHasAppliedInitial(true);
    }
  }, [hasAppliedInitial]);

  // When API returns theme: apply it and save to localStorage
  useEffect(() => {
    if (!loading && apiTheme) {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      // Only update if the theme from API is different
      if (currentTheme !== apiTheme) {
        document.documentElement.setAttribute("data-theme", apiTheme);
        setCachedTheme(apiTheme);
      } else {
        // Ensure localStorage is in sync even if theme matches
        setCachedTheme(apiTheme);
      }
    }
  }, [apiTheme, loading]);

  return <>{children}</>;
}
