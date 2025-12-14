"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { UPDATE_STORE_SETTINGS } from "@/lib/graphql/mutations";
import { StoreSettings } from "@/lib/types";
import { useToast } from "@/lib/hooks/useToast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Store,
  Phone,
  Building2,
  Save,
  Palette,
  Check,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { themes, themeIds, ThemeId, defaultTheme } from "@/lib/themes";

export default function AdminSettingsPage() {
  const { data, refetch } = useQuery(GET_STORE_SETTINGS);
  const [updateSettings, { loading: saving }] = useMutation(
    UPDATE_STORE_SETTINGS
  );
  const { showError, showSuccess } = useToast();

  const storeSettings = data?.storeSettings as StoreSettings | null;

  const [formData, setFormData] = useState({
    storeName: "",
    selectedTheme: defaultTheme as ThemeId,
    currencySymbol: "Rs.",
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Track if we've synced to prevent re-syncing
  const hasSynced = useRef(false);

  // Get the selected theme config for preview
  const selectedThemeConfig = themes[formData.selectedTheme];

  // Sync form data when storeSettings loads - this is syncing external data
  useEffect(() => {
    if (storeSettings && !hasSynced.current) {
      hasSynced.current = true;
      const theme = (storeSettings.selectedTheme as ThemeId) || defaultTheme;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        storeName: storeSettings.storeName || "",
        selectedTheme: theme,
        currencySymbol: storeSettings.currencySymbol || "Rs.",
        bankAccountName: storeSettings.bankAccountName || "",
        bankAccountNumber: storeSettings.bankAccountNumber || "",
        bankName: storeSettings.bankName || "",
        contactEmail: storeSettings.contactEmail || "",
        contactPhone: storeSettings.contactPhone || "",
      });
    }
  }, [storeSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
        variables: { input: formData },
      });
      refetch();
      showSuccess("Settings updated successfully!");
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error("[GraphQL Error in handleSubmit]:", error);
        showError("Something went wrong");
      } else {
        showError(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure your store settings">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* General Settings */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-icon-blue/10 rounded-lg">
              <Store className="w-5 h-5 text-icon-blue" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              General Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Store Name *
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Currency Symbol *
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) =>
                  setFormData({ ...formData, currencySymbol: e.target.value })
                }
                placeholder="e.g., Rs., $, €, £"
                maxLength={3}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
              <p className="text-xs text-text-muted mt-1.5">
                This symbol will be displayed before all prices (e.g., Rs.
                99.99)
              </p>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-icon-purple/10 rounded-lg">
              <Palette className="w-5 h-5 text-icon-purple" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                Store Theme
              </h2>
              <p className="text-sm text-text-muted">
                Choose a color theme for your store. Preview updates instantly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Theme Grid */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">
                Available Themes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themeIds.map((themeId) => {
                  const themeConfig = themes[themeId];
                  const isSelected = formData.selectedTheme === themeId;

                  return (
                    <button
                      key={themeId}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, selectedTheme: themeId })
                      }
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200
                        hover:shadow-md hover:scale-[1.02]
                        ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Theme preview colors */}
                      <div className="flex gap-1 mb-2">
                        <div
                          className="w-6 h-6 rounded-full shadow-sm border border-black/5"
                          style={{
                            backgroundColor: themeConfig.colors.primary,
                          }}
                          title="Primary color"
                        />
                        <div
                          className="w-6 h-6 rounded-full shadow-sm border border-black/5"
                          style={{ backgroundColor: themeConfig.colors.accent }}
                          title="Accent color"
                        />
                        <div
                          className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                          style={{
                            backgroundColor: themeConfig.colors.surface,
                          }}
                          title="Background color"
                        />
                      </div>

                      {/* Theme info */}
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{themeConfig.emoji}</span>
                          <span className="font-medium text-xs text-text-primary truncate">
                            {themeConfig.name}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-text-secondary" />
                <h3 className="text-sm font-medium text-text-secondary">
                  Live Preview
                </h3>
              </div>
              <div
                className="rounded-xl border border-gray-200 overflow-hidden shadow-lg"
                style={{
                  backgroundColor: selectedThemeConfig.colors.surface,
                }}
              >
                {/* Mock Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{
                    backgroundColor:
                      selectedThemeConfig.colors.surfaceSecondary,
                    borderBottom: `1px solid ${selectedThemeConfig.colors.border}`,
                  }}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: selectedThemeConfig.colors.textPrimary }}
                  >
                    {formData.storeName || "My Store"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs"
                      style={{ color: selectedThemeConfig.colors.textSecondary }}
                    >
                      Products
                    </span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: selectedThemeConfig.colors.primary,
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Mock Hero */}
                <div
                  className="px-4 py-6 text-center"
                  style={{
                    backgroundColor: selectedThemeConfig.colors.surface,
                  }}
                >
                  <h2
                    className="text-lg font-bold mb-1"
                    style={{ color: selectedThemeConfig.colors.textPrimary }}
                  >
                    Welcome to Our Store
                  </h2>
                  <p
                    className="text-xs mb-3"
                    style={{ color: selectedThemeConfig.colors.textSecondary }}
                  >
                    Discover amazing products
                  </p>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-medium text-white"
                    style={{
                      backgroundColor: selectedThemeConfig.colors.primary,
                    }}
                  >
                    Shop Now
                  </button>
                </div>

                {/* Mock Products */}
                <div
                  className="px-4 py-4 grid grid-cols-2 gap-3"
                  style={{
                    backgroundColor:
                      selectedThemeConfig.colors.surfaceSecondary,
                  }}
                >
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: selectedThemeConfig.colors.surfaceCard,
                        border: `1px solid ${selectedThemeConfig.colors.borderLight}`,
                      }}
                    >
                      <div
                        className="w-full h-12 rounded mb-2"
                        style={{
                          backgroundColor:
                            selectedThemeConfig.colors.surfaceSecondary,
                        }}
                      />
                      <div
                        className="text-xs font-medium mb-1"
                        style={{
                          color: selectedThemeConfig.colors.textPrimary,
                        }}
                      >
                        Product {i}
                      </div>
                      <div
                        className="text-xs font-bold"
                        style={{ color: selectedThemeConfig.colors.primary }}
                      >
                        {formData.currencySymbol} 99.00
                      </div>
                      <button
                        className="w-full mt-2 py-1 rounded text-xs font-medium text-white"
                        style={{
                          backgroundColor: selectedThemeConfig.colors.accent,
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mock Footer */}
                <div
                  className="px-4 py-2 text-center"
                  style={{
                    backgroundColor: selectedThemeConfig.colors.textPrimary,
                  }}
                >
                  <span
                    className="text-xs"
                    style={{
                      color: selectedThemeConfig.colors.surfaceSecondary,
                    }}
                  >
                    © {formData.storeName || "My Store"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2 text-center">
                {selectedThemeConfig.emoji} {selectedThemeConfig.name} —{" "}
                {selectedThemeConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-icon-green/10 rounded-lg">
              <Phone className="w-5 h-5 text-icon-green" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              Contact Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="support@yourstore.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-icon-purple/10 rounded-lg">
              <Building2 className="w-5 h-5 text-icon-purple" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                Bank Account Details
              </h2>
              <p className="text-sm text-text-muted">
                Displayed to customers who choose bank transfer
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                placeholder="e.g., National Bank"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Account Name
              </label>
              <input
                type="text"
                value={formData.bankAccountName}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccountName: e.target.value })
                }
                placeholder="e.g., My Online Store LLC"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankAccountNumber: e.target.value,
                  })
                }
                placeholder="e.g., 1234567890"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </AdminLayout>
  );
}
