import { create } from 'zustand';
import { apolloClient } from '../graphql/client';
import { GET_STORE_SETTINGS } from '../graphql/queries';
import { UPDATE_STORE_SETTINGS } from '../graphql/mutations';

export interface StoreSettings {
  id?: string;
  storeName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface StoreSettingsStore {
  settings: StoreSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;
  getStoreName: () => string;
  getPrimaryColor: () => string;
  getSecondaryColor: () => string;
  getBankDetails: () => { name?: string; accountNumber?: string; bankName?: string };
  getContactInfo: () => { email?: string; phone?: string };
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: process.env.NEXT_PUBLIC_STORE_NAME || 'My Online Store',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
};

export const useStoreSettingsStore = create<StoreSettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apolloClient.query({
        query: GET_STORE_SETTINGS,
        fetchPolicy: 'network-only',
      });

      if (data?.storeSettings) {
        set({
          settings: {
            ...DEFAULT_SETTINGS,
            ...data.storeSettings,
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch store settings:', error);
      set({
        error: 'Failed to load store settings',
        loading: false,
      });
    }
  },

  updateSettings: async (newSettings: Partial<StoreSettings>) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_STORE_SETTINGS,
        variables: {
          input: newSettings,
        },
      });

      if (data?.updateStoreSettings?.storeSettings) {
        set({
          settings: {
            ...DEFAULT_SETTINGS,
            ...data.updateStoreSettings.storeSettings,
          },
          loading: false,
        });
        return true;
      } else if (data?.updateStoreSettings?.errors) {
        set({
          error: data.updateStoreSettings.errors.join(', '),
          loading: false,
        });
        return false;
      }
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Failed to update store settings:', error);
      set({
        error: 'Failed to update store settings',
        loading: false,
      });
      return false;
    }
  },

  getStoreName: () => {
    const state = get();
    return state.settings?.storeName || DEFAULT_SETTINGS.storeName;
  },

  getPrimaryColor: () => {
    const state = get();
    return state.settings?.primaryColor || DEFAULT_SETTINGS.primaryColor;
  },

  getSecondaryColor: () => {
    const state = get();
    return state.settings?.secondaryColor || DEFAULT_SETTINGS.secondaryColor;
  },

  getBankDetails: () => {
    const state = get();
    return {
      name: state.settings?.bankAccountName,
      accountNumber: state.settings?.bankAccountNumber,
      bankName: state.settings?.bankName,
    };
  },

  getContactInfo: () => {
    const state = get();
    return {
      email: state.settings?.contactEmail,
      phone: state.settings?.contactPhone,
    };
  },
}));

