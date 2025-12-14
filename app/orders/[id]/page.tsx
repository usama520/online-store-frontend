"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ORDER, GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/ui/Navbar";
import { Order, StoreSettings } from "@/lib/types";
import Link from "next/link";

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading } = useQuery(GET_ORDER, {
    variables: { id },
    skip: !id,
  });

  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const storeSettings = settingsData?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || "Rs.";

  const order = data?.order as Order | null;

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-surface">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
          <p className="mt-4 text-theme-text-secondary">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-theme-surface">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-theme-text">
            Order not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="bg-theme-success/10 border-2 border-theme-success rounded-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-theme-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-theme-text mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-theme-text-secondary">
            Thank you for your order. We&apos;ll send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-theme-surface-card rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-theme-text mb-6">
            Order Details
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-theme-text-secondary">Order Number</p>
              <p className="font-semibold text-theme-text">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-theme-text-secondary">Order Date</p>
              <p className="font-semibold text-theme-text">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-theme-text-secondary">Status</p>
              <p className="font-semibold text-theme-primary capitalize">
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-theme-text-secondary">
                Payment Method
              </p>
              <p className="font-semibold text-theme-text capitalize">
                {order.payment?.paymentMethod.replace("_", " ")}
              </p>
            </div>
          </div>

          <div className="border-t border-theme-border-light pt-4">
            <h3 className="font-semibold text-theme-text mb-2">
              Customer Information
            </h3>
            <div className="space-y-1 text-sm text-theme-text-secondary">
              <p>
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.customerEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.customerPhone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.streetAddress}, {order.city}
                {order.postalCode ? `, ${order.postalCode}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-theme-surface-card rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-theme-text mb-6">
            Order Items
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-theme-border-light last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-semibold text-theme-text">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-theme-text-secondary">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-theme-text">
                    {formatPrice(item.subtotal, currencySymbol)}
                  </p>
                  <p className="text-sm text-theme-text-secondary">
                    {formatPrice(item.price, currencySymbol)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-theme-border-light mt-6 pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-theme-text">Total</span>
            <span className="text-2xl font-bold text-theme-primary">
              {formatPrice(order.totalAmount, currencySymbol)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 btn-theme-primary text-center"
          >
            Continue Shopping
          </Link>
          <Link href="/" className="flex-1 btn-theme-secondary text-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
