"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/zustand/cartStore";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { useToast } from "@/lib/hooks/useToast";
import { useQuery, ApolloError } from "@apollo/client";
import { GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/ui/Navbar";
import { StoreSettings } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const { checkout, loading } = useCheckout();
  const { showError } = useToast();
  const { data } = useQuery(GET_STORE_SETTINGS);
  const storeSettings = data?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || "Rs.";

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    paymentMethod: "cash_on_delivery",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const total = getTotalPrice();

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim())
      newErrors.customerName = "Name is required";
    if (!formData.customerEmail.trim())
      newErrors.customerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }
    if (!formData.customerPhone.trim())
      newErrors.customerPhone = "Phone is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    // Postal code is optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await checkout(formData);
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error("[GraphQL Error in handleSubmit]:", error);
        showError("Something went wrong");
      } else {
        showError(
          error instanceof Error ? error.message : "Failed to place order"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-theme-text mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-theme-surface-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-theme-text mb-6">
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`input-theme ${
                        errors.customerName
                          ? "!border-theme-error focus:!ring-theme-error"
                          : ""
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-theme-error text-sm mt-1">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`input-theme ${
                        errors.customerEmail
                          ? "!border-theme-error focus:!ring-theme-error"
                          : ""
                      }`}
                    />
                    {errors.customerEmail && (
                      <p className="text-theme-error text-sm mt-1">
                        {errors.customerEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className={`input-theme ${
                        errors.customerPhone
                          ? "!border-theme-error focus:!ring-theme-error"
                          : ""
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="text-theme-error text-sm mt-1">
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      placeholder="House/Flat #, Street name"
                      className={`input-theme ${
                        errors.streetAddress
                          ? "!border-theme-error focus:!ring-theme-error"
                          : ""
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="text-theme-error text-sm mt-1">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`input-theme ${
                          errors.city
                            ? "!border-theme-error focus:!ring-theme-error"
                            : ""
                        }`}
                      />
                      {errors.city && (
                        <p className="text-theme-error text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="input-theme"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-theme-surface-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-theme-text mb-6">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-theme-border-light rounded-lg cursor-pointer hover:border-theme-primary">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === "cash_on_delivery"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-semibold text-theme-text">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-theme-text-secondary">
                        Pay when you receive your order
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border-2 border-theme-border-light rounded-lg cursor-pointer hover:border-theme-primary">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-semibold text-theme-text">
                        Bank Transfer
                      </div>
                      <div className="text-sm text-theme-text-secondary">
                        Transfer to our bank account
                      </div>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === "bank_transfer" &&
                  storeSettings && (
                    <div className="mt-4 p-4 bg-theme-primary/10 border border-theme-primary/30 rounded-lg">
                      <h3 className="font-semibold text-theme-text mb-2">
                        Bank Account Details
                      </h3>
                      <div className="space-y-1 text-sm text-theme-text-secondary">
                        {storeSettings.bankName && (
                          <p>
                            <span className="font-medium">Bank:</span>{" "}
                            {storeSettings.bankName}
                          </p>
                        )}
                        {storeSettings.bankAccountName && (
                          <p>
                            <span className="font-medium">Account Name:</span>{" "}
                            {storeSettings.bankAccountName}
                          </p>
                        )}
                        {storeSettings.bankAccountNumber && (
                          <p>
                            <span className="font-medium">Account Number:</span>{" "}
                            {storeSettings.bankAccountNumber}
                          </p>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-theme-text-secondary">
                        Please transfer the amount and we&apos;ll confirm your
                        order once payment is received.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-theme-surface-card rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-theme-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-theme-text-secondary">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-theme-text">
                        {formatPrice(
                          item.price * item.quantity,
                          currencySymbol
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-theme-border-light pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-xl font-bold text-theme-text">
                    <span>Total</span>
                    <span>{formatPrice(total, currencySymbol)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-theme-primary disabled:bg-theme-surface-secondary disabled:text-theme-text-muted disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
