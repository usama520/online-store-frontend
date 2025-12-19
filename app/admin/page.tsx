"use client";

import { useQuery } from "@apollo/client";
import {
  GET_ORDERS,
  GET_PRODUCTS,
  GET_STORE_SETTINGS,
} from "@/lib/graphql/queries";
import { formatPrice } from "@/lib/utils";
import { Order, Product, StoreSettings } from "@/lib/types";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { ShoppingCart, TrendingUp, Package, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ORDERS);
  const { data: productsData, loading: productsLoading } =
    useQuery(GET_PRODUCTS);
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);

  const loading = ordersLoading || productsLoading;

  const orders = (ordersData?.orders || []) as Order[];
  const products = (productsData?.products || []) as Product[];
  const storeSettings = settingsData?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || "Rs.";

  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === "unfulfilled").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10).length;

  const statCards = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      iconColor: "bg-icon-blue",
      iconTextColor: "text-icon-blue",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      iconColor: "bg-icon-green",
      iconTextColor: "text-icon-green",
    },
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue, currencySymbol),
      icon: TrendingUp,
      iconColor: "bg-icon-purple",
      iconTextColor: "text-icon-purple",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: AlertCircle,
      iconColor: "bg-icon-orange",
      iconTextColor: "text-icon-orange",
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.email?.split("@")[0] || "Admin"}`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {loading
          ? // Loading skeletons
            [...Array(4)].map((_, index) => (
              <div key={index} className="stat-card animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          : statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="stat-label">{stat.title}</p>
                      <p className="stat-number">{stat.value}</p>
                    </div>
                    <div
                      className={`stat-icon ${stat.iconColor} ml-2 flex-shrink-0`}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconTextColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Recent Activity */}
      <div className="stat-card mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-text-primary mb-3 sm:mb-4">
          Recent Activity
        </h2>
        <p className="text-text-secondary text-sm">
          No recent activity to display.
        </p>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="stat-card mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-bold text-text-primary mb-3 sm:mb-4">
            Recent Orders
          </h2>
          <div className="table-responsive">
            <table className="min-w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary">
                    Order ID
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary">
                    Customer
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary">
                    Total
                  </th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary">
                    Status
                  </th>
                  <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-text-primary">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-primary">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-primary truncate">
                      {order.customerName}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-primary">
                      {formatPrice(order.totalAmount, currencySymbol)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span
                        className={`badge ${
                          order.fulfillmentStatus === "unfulfilled"
                            ? "badge-yellow"
                            : order.fulfillmentStatus === "processing"
                            ? "badge-purple"
                            : order.fulfillmentStatus === "shipped"
                            ? "badge-indigo"
                            : order.fulfillmentStatus === "delivered"
                            ? "badge-green"
                            : order.fulfillmentStatus === "returned"
                            ? "badge-red"
                            : order.state === "cancelled"
                            ? "badge-red"
                            : "badge-gray"
                        }`}
                      >
                        {order.state === "cancelled" ? "cancelled" : order.fulfillmentStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-primary capitalize">
                      {order.payment?.paymentMethod.replace("_", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Stock Products */}
      {lowStockProducts > 0 && (
        <div className="stat-card">
          <h2 className="text-base sm:text-lg font-bold text-text-primary mb-3 sm:mb-4">
            Low Stock Alert
          </h2>
          <div className="space-y-2">
            {products
              .filter((p) => p.stockQuantity < 10)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 sm:p-3 bg-red-50 rounded text-sm sm:text-base"
                >
                  <span className="text-text-primary truncate">
                    {product.name}
                  </span>
                  <span className="text-primary font-semibold ml-2 flex-shrink-0">
                    {product.stockQuantity} left
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
