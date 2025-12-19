"use client";

import { useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_ORDERS, GET_STORE_SETTINGS } from "@/lib/graphql/queries";
import {
  UPDATE_PAYMENT_STATUS,
  CANCEL_ORDER,
  ARCHIVE_ORDER,
  TRANSITION_FULFILLMENT_STATUS,
} from "@/lib/graphql/mutations";
import { formatPrice } from "@/lib/utils";
import { Order, StoreSettings } from "@/lib/types";
import { useToast } from "@/lib/hooks/useToast";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable, {
  TableColumn,
  TableAction,
} from "@/components/admin/AdminTable";
import { Eye, X, Archive, XCircle, Truck, Package, CheckCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const { data, loading, refetch } = useQuery(GET_ORDERS);
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const [updatePaymentStatus] = useMutation(UPDATE_PAYMENT_STATUS);
  const [cancelOrder] = useMutation(CANCEL_ORDER);
  const [archiveOrder] = useMutation(ARCHIVE_ORDER);
  const [transitionFulfillment] = useMutation(TRANSITION_FULFILLMENT_STATUS);
  const { showError, showSuccess } = useToast();

  const orders = (data?.orders || []) as Order[];
  const storeSettings = settingsData?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || "Rs.";
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


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

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await cancelOrder({ variables: { id: orderId } });
      if (response.data?.cancelOrder?.errors?.length > 0) {
        showError(response.data.cancelOrder.errors.join(", "));
        return;
      }
      refetch();
      if (selectedOrder?.id === orderId && response.data?.cancelOrder?.order) {
        setSelectedOrder({
          ...selectedOrder,
          ...response.data.cancelOrder.order,
        });
      }
      showSuccess("Order cancelled successfully");
    } catch (error) {
      showError("Failed to cancel order");
    }
  };

  const handleArchiveOrder = async (orderId: string) => {
    try {
      const response = await archiveOrder({ variables: { id: orderId } });
      if (response.data?.archiveOrder?.errors?.length > 0) {
        showError(response.data.archiveOrder.errors.join(", "));
        return;
      }
      refetch();
      if (selectedOrder?.id === orderId && response.data?.archiveOrder?.order) {
        setSelectedOrder({
          ...selectedOrder,
          ...response.data.archiveOrder.order,
        });
      }
      showSuccess("Order archived successfully");
    } catch (error) {
      showError("Failed to archive order");
    }
  };

  const handleFulfillmentTransition = async (orderId: string, event: string) => {
    try {
      const response = await transitionFulfillment({
        variables: { id: orderId, event },
      });
      if (response.data?.transitionFulfillmentStatus?.errors?.length > 0) {
        showError(response.data.transitionFulfillmentStatus.errors.join(", "));
        return;
      }
      refetch();
      if (selectedOrder?.id === orderId && response.data?.transitionFulfillmentStatus?.order) {
        setSelectedOrder({
          ...selectedOrder,
          ...response.data.transitionFulfillmentStatus.order,
        });
      }
      showSuccess("Fulfillment status updated successfully");
    } catch (error) {
      showError("Failed to update fulfillment status");
    }
  };

  // State badge (order lifecycle)
  const getStateBadge = (state: string) => {
    const stateStyles: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      archived: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span className={`badge ${stateStyles[state] || "bg-gray-100 text-gray-800"}`}>
        {state}
      </span>
    );
  };

  // Fulfillment status badge
  const getFulfillmentBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      unfulfilled: "bg-yellow-100 text-yellow-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      returned: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`badge ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  // Payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      authorized: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      partially_paid: "bg-orange-100 text-orange-800",
      refunded: "bg-purple-100 text-purple-800",
      voided: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`badge ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ")}
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

  // Event labels for display
  const eventLabels: Record<string, string> = {
    start_processing: "Start Processing",
    ship: "Mark Shipped",
    deliver: "Mark Delivered",
    return_order: "Process Return",
    reset_fulfillment: "Reset to Unfulfilled",
    archive: "Archive",
    unarchive: "Unarchive",
    cancel: "Cancel Order",
  };

  const columns: TableColumn<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (value) => (
        <span className="font-mono">#{(value as string).substring(0, 8)}</span>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (value, row) => (
        <div>
          <div className="font-semibold">{value as string}</div>
          <div className="text-xs text-text-secondary hidden sm:block">
            {row.customerEmail as string}
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (value) => formatPrice(value as number, currencySymbol),
      hidden: "mobile",
    },
    {
      key: "state",
      label: "State",
      render: (value) => getStateBadge(value as string),
      hidden: "tablet",
    },
    {
      key: "fulfillmentStatus",
      label: "Fulfillment",
      render: (value) => getFulfillmentBadge(value as string),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      hidden: "mobile",
      render: (value) => getPaymentStatusBadge(value as string),
    },
    {
      key: "createdAt",
      label: "Date",
      hidden: "tablet",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Order>[] = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => setSelectedOrder(row),
      variant: "primary",
    },
  ];

  return (
    <AdminLayout title="Orders" subtitle="Manage customer orders">
      <AdminTable<Order>
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

            {/* Status Overview */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-text-secondary mb-1">Order State</div>
                {getStateBadge(selectedOrder.state)}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-text-secondary mb-1">Fulfillment</div>
                {getFulfillmentBadge(selectedOrder.fulfillmentStatus)}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-text-secondary mb-1">Payment</div>
                {getPaymentStatusBadge(selectedOrder.paymentStatus)}
              </div>
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

            {/* Order Progress Timeline */}
            {selectedOrder.state !== "cancelled" && (
              <div className="mb-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Order Progress
                </h3>
                
                {/* Timeline Stepper */}
                <div className="relative">
                  {/* Progress Line Background */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                  
                  {/* Progress Line Fill */}
                  <div 
                    className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: selectedOrder.fulfillmentStatus === "unfulfilled" ? "0%" :
                             selectedOrder.fulfillmentStatus === "processing" ? "33%" :
                             selectedOrder.fulfillmentStatus === "shipped" ? "66%" :
                             selectedOrder.fulfillmentStatus === "delivered" ? "100%" :
                             selectedOrder.fulfillmentStatus === "returned" ? "100%" :
                             selectedOrder.fulfillmentStatus === "rejected" ? "100%" : "0%"
                    }}
                  />
                  
                  {/* Timeline Steps */}
                  <div className="relative flex justify-between">
                    {[
                      { status: "unfulfilled", label: "New", icon: "📝", event: null },
                      { status: "processing", label: "Processing", icon: "⚙️", event: "start_processing" },
                      { status: "shipped", label: "Shipped", icon: "🚚", event: "ship" },
                      { status: "delivered", label: "Delivered", icon: "✅", event: "deliver" },
                    ].map((step, index) => {
                      const statuses = ["unfulfilled", "processing", "shipped", "delivered"];
                      const currentIndex = statuses.indexOf(selectedOrder.fulfillmentStatus);
                      const stepIndex = statuses.indexOf(step.status);
                      const isCompleted = stepIndex < currentIndex;
                      const isCurrent = step.status === selectedOrder.fulfillmentStatus;
                      const isNext = stepIndex === currentIndex + 1;
                      const canClick = isNext && selectedOrder.availableFulfillmentEvents?.includes(step.event || "");
                      
                      return (
                        <div key={step.status} className="flex flex-col items-center">
                          <button
                            onClick={() => canClick && step.event && handleFulfillmentTransition(selectedOrder.id, step.event)}
                            disabled={!canClick}
                            className={`
                              w-10 h-10 rounded-full flex items-center justify-center text-lg
                              transition-all duration-200 z-10 relative
                              ${isCompleted 
                                ? "bg-primary text-white" 
                                : isCurrent 
                                  ? "bg-primary text-white ring-4 ring-primary/30" 
                                  : isNext && canClick
                                    ? "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
                                    : "bg-white border-2 border-gray-300 text-gray-400"
                              }
                            `}
                            title={canClick ? `Click to ${step.label.toLowerCase()}` : step.label}
                          >
                            {isCompleted ? "✓" : step.icon}
                          </button>
                          <span className={`
                            mt-2 text-xs font-medium text-center
                            ${isCurrent ? "text-primary font-bold" : isCompleted ? "text-text-primary" : "text-text-secondary"}
                          `}>
                            {step.label}
                          </span>
                          {isNext && canClick && (
                            <span className="mt-1 text-xs text-primary animate-pulse">
                              Click to update
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Option */}
                {selectedOrder.fulfillmentStatus === "processing" && 
                 selectedOrder.availableFulfillmentEvents?.includes("reset_fulfillment") && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleFulfillmentTransition(selectedOrder.id, "reset_fulfillment")}
                      className="text-sm text-text-secondary hover:text-red-600 transition-colors"
                    >
                      ← Reset to New
                    </button>
                  </div>
                )}

                {/* Return Option */}
                {selectedOrder.fulfillmentStatus === "delivered" && 
                 selectedOrder.availableFulfillmentEvents?.includes("return_order") && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleFulfillmentTransition(selectedOrder.id, "return_order")}
                      className="text-sm text-text-secondary hover:text-orange-600 transition-colors flex items-center gap-2"
                    >
                      <span>↩️</span> Process Return
                    </button>
                  </div>
                )}

                {/* Returned Status */}
                {selectedOrder.fulfillmentStatus === "returned" && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ↩️ This order has been returned
                    </p>
                  </div>
                )}

                {/* Reject Option */}
                {selectedOrder.fulfillmentStatus === "shipped" && 
                 selectedOrder.availableFulfillmentEvents?.includes("reject_package") && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleFulfillmentTransition(selectedOrder.id, "reject_package")}
                      className="text-sm text-text-secondary hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <span>🚫</span> Package Rejected
                    </button>
                  </div>
                )}

                {/* Rejected Status */}
                {selectedOrder.fulfillmentStatus === "rejected" && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      🚫 This package was rejected by the customer
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Actions */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-3">
                Order Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedOrder.availableStateEvents?.includes("archive") && (
                  <button
                    onClick={() => handleArchiveOrder(selectedOrder.id)}
                    className="btn-secondary text-sm py-2 px-3 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive Order
                  </button>
                )}
                {selectedOrder.availableStateEvents?.includes("cancel") && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="btn-danger text-sm py-2 px-3 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}
                {selectedOrder.state === "cancelled" && (
                  <p className="text-sm text-red-600">This order has been cancelled</p>
                )}
              </div>
            </div>

            {/* Payment Status (legacy) */}
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
                  disabled={selectedOrder.state === "cancelled"}
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
