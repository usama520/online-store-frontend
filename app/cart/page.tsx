"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/zustand/cartStore";
import { useStoreSettingsStore } from "@/lib/zustand/storeSettingsStore";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/ui/Navbar";
import Image from "next/image";

// Subscribe returns a no-op unsubscribe
const emptySubscribe = () => () => {};

export default function CartPage() {
  const router = useRouter();
  // Track hydration without useEffect + setState
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const { settings } = useStoreSettingsStore();

  // Don't access store values until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-theme-surface">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
          <p className="mt-4 text-theme-text-secondary">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Calculate values after mount check
  const total = getTotalPrice();
  const currencySymbol = settings?.currencySymbol || "Rs.";

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-theme-surface">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-theme-text mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-theme-text-secondary mb-8">
            Add some products to get started!
          </p>
          <button
            onClick={() => router.push("/products")}
            className="btn-theme-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-theme-text mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-theme-surface-card rounded-lg shadow-md p-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 py-4 border-b last:border-b-0"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 bg-theme-surface-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-theme-text-muted text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-theme-text">
                      {item.name}
                    </h3>
                    <p className="text-theme-primary font-bold">
                      {formatPrice(item.price, currencySymbol)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded bg-theme-primary hover:bg-theme-primary-hover text-theme-text-on-primary flex items-center justify-center disabled:bg-theme-surface-secondary disabled:text-theme-text-muted disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-theme-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded bg-theme-primary hover:bg-theme-primary-hover text-theme-text-on-primary flex items-center justify-center disabled:bg-theme-surface-secondary disabled:text-theme-text-muted disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right font-semibold text-theme-text w-24">
                    {formatPrice(item.price * item.quantity, currencySymbol)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-theme-error hover:opacity-80 p-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <div className="mt-6">
                <button
                  onClick={clearCart}
                  className="text-theme-error hover:opacity-80 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-theme-surface-card rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-theme-text mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-theme-text-secondary">
                  <span>Subtotal</span>
                  <span>{formatPrice(total, currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-theme-text-secondary">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-theme-border-light pt-3 flex justify-between text-xl font-bold text-theme-text">
                  <span>Total</span>
                  <span>{formatPrice(total, currencySymbol)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full btn-theme-primary mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/products")}
                className="w-full btn-theme-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
