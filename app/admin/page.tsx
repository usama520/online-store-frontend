'use client';

import { useQuery } from '@apollo/client';
import { GET_ORDERS, GET_PRODUCTS, GET_STORE_SETTINGS } from '@/lib/graphql/queries';
import { formatPrice } from '@/lib/utils';
import { Order, Product, StoreSettings } from '@/lib/types';

export default function AdminDashboard() {
  const { data: ordersData } = useQuery(GET_ORDERS);
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);

  const orders = (ordersData?.orders || []) as Order[];
  const products = (productsData?.products || []) as Product[];
  const storeSettings = settingsData?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || 'Rs.';

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stockQuantity < 10).length;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">{formatPrice(totalRevenue, currencySymbol)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600">{lowStockProducts}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">#{order.id.substring(0, 8)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{formatPrice(order.totalAmount, currencySymbol)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 capitalize">
                    {order.payment?.paymentMethod.replace('_', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStockProducts > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Low Stock Alert</h2>
          <div className="space-y-2">
            {products.filter(p => p.stockQuantity < 10).map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="text-gray-800">{product.name}</span>
                <span className="text-red-600 font-semibold">{product.stockQuantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

