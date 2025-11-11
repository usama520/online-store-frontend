'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ORDER } from '@/lib/graphql/queries';
import Navbar from '@/components/ui/Navbar';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data, loading } = useQuery(GET_ORDER, {
    variables: { id },
    skip: !id,
  });
  
  const order = data?.order as Order | null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Order not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-semibold text-gray-800">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-blue-600 capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold text-gray-800 capitalize">
                {order.payment?.paymentMethod.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
              <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
              <p><span className="font-medium">Address:</span> {order.customerAddress}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
          
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${item.subtotal.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

