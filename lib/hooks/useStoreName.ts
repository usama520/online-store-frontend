import { useStoreSettingsStore } from "@/lib/zustand/storeSettingsStore";

const DEFAULT_STORE_NAME = "My Online Store";

/**
 * Hook to get the store name from settings.
 * Falls back to environment variable or default name if not set.
 */
export function useStoreName(): string {
  const settings = useStoreSettingsStore((state) => state.settings);
  return settings?.storeName || DEFAULT_STORE_NAME;
}
