"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { UPDATE_STORE_SETTINGS } from "@/lib/graphql/mutations";
import { StoreSettings } from "@/lib/types";
import { useToast } from "@/lib/hooks/useToast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Store, Phone, Building2, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const { data, refetch } = useQuery(GET_STORE_SETTINGS);
  const [updateSettings, { loading: saving }] = useMutation(
    UPDATE_STORE_SETTINGS
  );
  const { showError, showSuccess } = useToast();

  const storeSettings = data?.storeSettings as StoreSettings | null;

  const [formData, setFormData] = useState({
    storeName: "",
    primaryColor: "",
    secondaryColor: "",
    currencySymbol: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
    contactEmail: "",
    contactPhone: "",
  });

  useEffect(() => {
    if (storeSettings) {
      setFormData({
        storeName: storeSettings.storeName || "",
        primaryColor: storeSettings.primaryColor || "#3B82F6",
        secondaryColor: storeSettings.secondaryColor || "#10B981",
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryColor: e.target.value })
                    }
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryColor: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white font-mono text-sm"
                  />
                </div>
              </div>
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
