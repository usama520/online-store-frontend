'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/zustand/cartStore';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { useQuery } from '@apollo/client';
import { GET_STORE_SETTINGS } from '@/lib/graphql/queries';
import Navbar from '@/components/ui/Navbar';
import { StoreSettings } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const { checkout, loading } = useCheckout();
  const { data } = useQuery(GET_STORE_SETTINGS);
  const storeSettings = data?.storeSettings as StoreSettings | null;
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'cash_on_delivery',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const total = getTotalPrice();

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!formData.customerAddress.trim()) newErrors.customerAddress = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await checkout(formData);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.customerName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-2 border ${errors.customerAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.customerAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-semibold text-gray-800">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-semibold text-gray-800">Bank Transfer</div>
                      <div className="text-sm text-gray-600">Transfer to our bank account</div>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'bank_transfer' && storeSettings && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Bank Account Details</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      {storeSettings.bankName && (
                        <p><span className="font-medium">Bank:</span> {storeSettings.bankName}</p>
                      )}
                      {storeSettings.bankAccountName && (
                        <p><span className="font-medium">Account Name:</span> {storeSettings.bankAccountName}</p>
                      )}
                      {storeSettings.bankAccountNumber && (
                        <p><span className="font-medium">Account Number:</span> {storeSettings.bankAccountNumber}</p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Please transfer the amount and we'll confirm your order once payment is received.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

