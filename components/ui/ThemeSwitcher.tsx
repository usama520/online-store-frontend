"use client";

import { useSyncExternalStore } from "react";
import { useThemeStore } from "@/lib/zustand/themeStore";
import { themes, themeIds, ThemeId } from "@/lib/themes";

// Subscribe returns a no-op unsubscribe
const emptySubscribe = () => () => {};

export default function ThemeSwitcher() {
  const { theme, setTheme, hasHydrated } = useThemeStore();

  // Track hydration for SSR safety
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Don't render until hydrated to prevent mismatch
  if (!isMounted || !hasHydrated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-soft-lg px-2 py-2 flex items-center gap-1 border border-theme-border">
        {/* Theme label */}
        <span className="text-xs font-medium text-theme-text-secondary pl-3 pr-2 hidden sm:block">
          Theme:
        </span>

        {/* Theme buttons */}
        {themeIds.map((themeId: ThemeId) => {
          const themeConfig = themes[themeId];
          const isActive = theme === themeId;

          return (
            <button
              key={themeId}
              onClick={() => setTheme(themeId)}
              className={`
                relative group flex items-center justify-center
                w-9 h-9 sm:w-10 sm:h-10 rounded-full
                transition-all duration-200
                ${
                  isActive
                    ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                    : "hover:scale-105"
                }
              `}
              style={{ backgroundColor: themeConfig.previewColor }}
              title={themeConfig.name}
              aria-label={`Switch to ${themeConfig.name} theme`}
            >
              {/* Active indicator */}
              {isActive && (
                <svg
                  className="w-4 h-4 text-white drop-shadow-sm"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {/* Tooltip */}
              <div
                className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  px-3 py-1.5 rounded-lg
                  bg-gray-900 text-white text-xs font-medium whitespace-nowrap
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-opacity duration-200
                "
              >
                <span className="mr-1">{themeConfig.emoji}</span>
                {themeConfig.name}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
