import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeId, defaultTheme } from "@/lib/themes";

interface ThemeState {
  theme: ThemeId;
  hasHydrated: boolean;
  setTheme: (theme: ThemeId) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      hasHydrated: false,
      setTheme: (theme) => set({ theme }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
