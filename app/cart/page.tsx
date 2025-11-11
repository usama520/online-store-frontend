'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/zustand/cartStore';
import Navbar from '@/components/ui/Navbar';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 py-4 border-b last:border-b-0"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right font-semibold text-gray-800 w-24">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <div className="mt-6">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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

