import { create } from "zustand";
import { StoreSettings } from "../types";

interface StoreSettingsStore {
  settings: StoreSettings | null;
  setSettings: (settings: StoreSettings) => void;
  getStoreName: () => string;
}

export const useStoreSettingsStore = create<StoreSettingsStore>((set, get) => ({
  settings: null,

  setSettings: (settings) => set({ settings }),

  getStoreName: () => {
    const state = get();
    return (
      state.settings?.storeName ||
      process.env.NEXT_PUBLIC_STORE_NAME ||
      "My Online Store"
    );
  },
}));
