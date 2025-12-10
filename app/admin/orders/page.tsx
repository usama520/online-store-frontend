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
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable, {
  TableColumn,
  TableAction,
} from "@/components/admin/AdminTable";
import { Eye, X } from "lucide-react";

export default function AdminOrdersPage() {
  const { data, loading, refetch } = useQuery(GET_ORDERS);
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
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
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
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`badge ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      confirmed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`badge ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const columns: TableColumn[] = [
    {
      key: "id",
      label: "Order ID",
      render: (value) => (
        <span className="font-mono">#{value.substring(0, 8)}</span>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (value, row) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-text-secondary hidden sm:block">
            {row.customerEmail}
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (value) => formatPrice(value, currencySymbol),
      hidden: "mobile",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "payment",
      label: "Payment",
      hidden: "mobile",
      render: (value) => (
        <div>
          <div className="text-xs capitalize mb-1">
            {value?.paymentMethod?.replace("_", " ")}
          </div>
          {getPaymentBadge(value?.status || "pending")}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      hidden: "tablet",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: TableAction[] = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => setSelectedOrder(row),
      variant: "primary",
    },
  ];

  return (
    <AdminLayout title="Orders" subtitle="Manage customer orders">
      <AdminTable
        columns={columns}
        data={orders}
        actions={actions}
        loading={loading}
        emptyMessage="No orders yet"
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content max-w-3xl">
            <div className="modal-header">
              <h2 className="modal-title">
                Order #{selectedOrder.id.substring(0, 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="modal-close"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-3">
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p>
                  <span className="font-medium text-text-secondary">Name:</span>{" "}
                  <span className="text-text-primary">
                    {selectedOrder.customerName}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-text-secondary">
                    Email:
                  </span>{" "}
                  <span className="text-text-primary">
                    {selectedOrder.customerEmail}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-text-secondary">
                    Phone:
                  </span>{" "}
                  <span className="text-text-primary">
                    {selectedOrder.customerPhone}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-text-secondary">
                    Address:
                  </span>{" "}
                  <span className="text-text-primary">
                    {selectedOrder.streetAddress}, {selectedOrder.city}
                    {selectedOrder.postalCode
                      ? `, ${selectedOrder.postalCode}`
                      : ""}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-3">
                Order Items
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 text-xs sm:text-sm font-semibold text-text-primary">
                          Product
                        </th>
                        <th className="text-left py-2 px-3 text-xs sm:text-sm font-semibold text-text-primary">
                          Qty
                        </th>
                        <th className="text-left py-2 px-3 text-xs sm:text-sm font-semibold text-text-primary hidden sm:table-cell">
                          Price
                        </th>
                        <th className="text-left py-2 px-3 text-xs sm:text-sm font-semibold text-text-primary">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="py-2 px-3 text-xs sm:text-sm text-text-primary">
                            {item.product.name}
                          </td>
                          <td className="py-2 px-3 text-xs sm:text-sm text-text-primary">
                            {item.quantity}
                          </td>
                          <td className="py-2 px-3 text-xs sm:text-sm text-text-primary hidden sm:table-cell">
                            {formatPrice(item.price, currencySymbol)}
                          </td>
                          <td className="py-2 px-3 text-xs sm:text-sm text-text-primary font-medium">
                            {formatPrice(item.subtotal, currencySymbol)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold">
                      <tr>
                        <td
                          colSpan={2}
                          className="py-2 px-3 text-right text-sm sm:hidden"
                        >
                          Total:
                        </td>
                        <td
                          colSpan={3}
                          className="py-2 px-3 text-right text-sm hidden sm:table-cell"
                        >
                          Total:
                        </td>
                        <td className="py-2 px-3 text-sm text-primary font-bold">
                          {formatPrice(
                            selectedOrder.totalAmount,
                            currencySymbol
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-3">
                Update Order Status
              </h3>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleUpdateOrderStatus(selectedOrder.id, e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
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
                <h3 className="font-semibold text-text-primary mb-3">
                  Payment Status
                </h3>
                <p className="text-sm text-text-secondary mb-2">
                  Method:{" "}
                  <span className="font-medium capitalize text-text-primary">
                    {selectedOrder.payment.paymentMethod.replace("_", " ")}
                  </span>
                </p>
                <select
                  value={selectedOrder.payment.status}
                  onChange={(e) =>
                    handleUpdatePaymentStatus(selectedOrder.id, e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full btn-secondary py-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
