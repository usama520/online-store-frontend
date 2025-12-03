"use client";

import { useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_ORDERS, GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import {
  UPDATE_ORDER_STATUS,
  UPDATE_PAYMENT_STATUS,
} from "@/lib/graphql/mutations";
import { formatPrice } from "@/lib/utils";
import { Order, StoreSettings } from "@/lib/types";
import { useToast } from "@/lib/hooks/useToast";

export default function AdminOrdersPage() {
  const { data, refetch } = useQuery(GET_ORDERS);
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
  const [updatePaymentStatus] = useMutation(UPDATE_PAYMENT_STATUS);
  const { showError, showSuccess } = useToast();

  const orders = (data?.orders || []) as Order[];
  const storeSettings = settingsData?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || "Rs.";
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await updateOrderStatus({
        variables: { id: orderId, status },
      });

      // Update selectedOrder immediately with the new status from server response
      if (
        selectedOrder?.id === orderId &&
        response.data?.updateOrderStatus?.order
      ) {
        setSelectedOrder({
          ...selectedOrder,
          status: response.data.updateOrderStatus.order.status,
        });
      }

      // Refetch orders list in the background to keep table in sync
      refetch();
      showSuccess("Order status updated successfully");
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error("[GraphQL Error in handleUpdateOrderStatus]:", error);
        showError("Something went wrong");
      } else {
        showError(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    try {
      await updatePaymentStatus({
        variables: { orderId, status },
      });
      refetch();
      if (selectedOrder?.id === orderId) {
        const updated = orders.find((o) => o.id === orderId);
        if (updated) setSelectedOrder(updated);
      }
      showSuccess("Payment status updated successfully");
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error("[GraphQL Error in handleUpdatePaymentStatus]:", error);
        showError("Something went wrong");
      } else {
        showError(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Total
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Payment
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">
                  #{order.id.substring(0, 8)}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {formatPrice(order.totalAmount, currencySymbol)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "shipped"
                              ? "bg-indigo-100 text-indigo-800"
                              : order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="text-sm text-gray-800 capitalize">
                      {order.payment?.paymentMethod.replace("_", " ")}
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.payment?.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : order.payment?.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment?.status}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order #{selectedOrder.id.substring(0, 8)}
            </h2>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedOrder.customerName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedOrder.customerEmail}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedOrder.customerPhone}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.streetAddress}, {selectedOrder.city}
                  {selectedOrder.postalCode
                    ? `, ${selectedOrder.postalCode}`
                    : ""}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
              <div className="border rounded overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                        Qty
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="py-2 px-3 text-sm">
                          {item.product.name}
                        </td>
                        <td className="py-2 px-3 text-sm">{item.quantity}</td>
                        <td className="py-2 px-3 text-sm">
                          {formatPrice(item.price, currencySymbol)}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {formatPrice(item.subtotal, currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-right">
                        Total:
                      </td>
                      <td className="py-2 px-3">
                        {formatPrice(selectedOrder.totalAmount, currencySymbol)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Order Status */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Update Order Status
              </h3>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleUpdateOrderStatus(selectedOrder.id, e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            {selectedOrder.payment && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Payment Status
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Method:{" "}
                      <span className="font-medium capitalize">
                        {selectedOrder.payment.paymentMethod.replace("_", " ")}
                      </span>
                    </p>
                    <select
                      value={selectedOrder.payment.status}
                      onChange={(e) =>
                        handleUpdatePaymentStatus(
                          selectedOrder.id,
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
