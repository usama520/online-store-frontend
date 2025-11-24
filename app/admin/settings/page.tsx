'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_STORE_SETTINGS } from '@/lib/graphql/queries';
import { UPDATE_STORE_SETTINGS } from '@/lib/graphql/mutations';
import { StoreSettings } from '@/lib/types';
import { useToast } from '@/lib/hooks/useToast';

export default function AdminSettingsPage() {
  const { data, refetch } = useQuery(GET_STORE_SETTINGS);
  const [updateSettings] = useMutation(UPDATE_STORE_SETTINGS);
  const { showError, showSuccess } = useToast();

  const storeSettings = data?.storeSettings as StoreSettings | null;

  const [formData, setFormData] = useState({
    storeName: '',
    primaryColor: '',
    secondaryColor: '',
    currencySymbol: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    if (storeSettings) {
      setFormData({
        storeName: storeSettings.storeName || '',
        primaryColor: storeSettings.primaryColor || '#3B82F6',
        secondaryColor: storeSettings.secondaryColor || '#10B981',
        currencySymbol: storeSettings.currencySymbol || 'Rs.',
        bankAccountName: storeSettings.bankAccountName || '',
        bankAccountNumber: storeSettings.bankAccountNumber || '',
        bankName: storeSettings.bankName || '',
        contactEmail: storeSettings.contactEmail || '',
        contactPhone: storeSettings.contactPhone || '',
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
      showSuccess('Settings updated successfully!');
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error('[GraphQL Error in handleSubmit]:', error);
        showError('Something went wrong');
      } else {
        showError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Store Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">General Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency Symbol *
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                placeholder="e.g., Rs., $, €, £"
                maxLength={3}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                This symbol will be displayed before all prices (e.g., Rs. 99.99)
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Bank Account Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            These details will be displayed to customers who choose bank transfer as payment method.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g., National Bank"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={formData.bankAccountName}
                onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                placeholder="e.g., My Online Store LLC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                placeholder="e.g., 1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

