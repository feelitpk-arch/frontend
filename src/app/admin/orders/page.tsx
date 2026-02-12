"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useAdminWebSocket } from "@/components/AdminWebSocketProvider";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  shipping: number;
  status: OrderStatus;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      image: string;
    };
    quantity: number;
    size: number;
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || undefined;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const { on } = useAdminWebSocket();

  useEffect(() => {
    // Only load data if we have a token
    const token = localStorage.getItem("adminToken");
    if (token) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // Listen to WebSocket events to refresh order list
    if (!on) return;

    const unsubscribeNewOrder = on("new-order", () => {
      loadOrders();
    });

    const unsubscribeStatusChange = on("order-status-changed", () => {
      loadOrders();
    });

    return () => {
      unsubscribeNewOrder();
      unsubscribeStatusChange();
    };
  }, [on]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const data = await api.getOrders(statusFilter);
      setOrders(data);
    } catch (err: any) {
      // Handle 401 errors gracefully - don't show error if it's an auth issue
      // The api.ts will handle redirect
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        return;
      }

      await api.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully!");
      await loadOrders();
    } catch (err: any) {
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      const errorMessage = err.message || "Failed to update order status";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    
    try {
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        return;
      }

      await api.deleteOrder(orderToDelete.id);
      toast.success("Order deleted successfully!");
      setError("");
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      await loadOrders();
    } catch (err: any) {
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      const errorMessage = err.message || "Failed to delete order";
      toast.error(errorMessage);
      setError(errorMessage);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-600";
      case "processing":
        return "bg-blue-50 text-blue-600";
      case "shipped":
        return "bg-purple-50 text-purple-600";
      case "delivered":
        return "bg-green-50 text-green-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-neutral-50 text-neutral-600";
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-neutral-900 lg:text-3xl">
          Orders
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Manage customer orders
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
      </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-300 border-r-black"></div>
                </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <p className="text-neutral-600">No orders found</p>
              </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm lg:rounded-2xl">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  Order
                </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  Customer
                </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  Items
                </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  Total
                </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  Status
                </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-neutral-50"
                >
                    <td className="px-4 py-4">
                    <div>
                        <p className="font-medium text-neutral-900">
                        {order.orderNumber}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                    <td className="px-4 py-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-neutral-500">{order.email}</p>
                    </div>
                  </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-neutral-900">
                        {order.items?.length || 0} items
                      </p>
                  </td>
                    <td className="px-4 py-4">
                    <p className="font-semibold text-neutral-900">
                        Rs. {order.total?.toLocaleString("en-PK") || "0"}
                    </p>
                  </td>
                    <td className="px-4 py-4">
                    <select
                      value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)} border-0 outline-none`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg border border-neutral-300 bg-white p-2 text-neutral-700 transition hover:bg-neutral-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(order)}
                          className="rounded-lg border border-red-300 bg-white p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-neutral-900">
                {selectedOrder.orderNumber}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Customer</h3>
                <p className="text-sm text-neutral-600">{selectedOrder.customerName}</p>
                <p className="text-sm text-neutral-600">{selectedOrder.email}</p>
                <p className="text-sm text-neutral-600">{selectedOrder.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Shipping Address</h3>
                <p className="text-sm text-neutral-600">
                  {selectedOrder.address}, {selectedOrder.city} {selectedOrder.postalCode}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Items</h3>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Size: {item.size}ml • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">
                        Rs. {item.price?.toLocaleString("en-PK") || "0"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Subtotal</span>
                  <span className="text-sm font-semibold text-neutral-900">
                    Rs. {(selectedOrder.total - selectedOrder.shipping).toLocaleString("en-PK")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Shipping</span>
                  <span className="text-sm font-semibold text-neutral-900">
                    Rs. {selectedOrder.shipping?.toLocaleString("en-PK") || "0"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-bold text-neutral-900">
                    Rs. {selectedOrder.total?.toLocaleString("en-PK") || "0"}
                  </span>
                </div>
              </div>
          </div>
          </motion.div>
          </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        itemName={orderToDelete ? `Order ${orderToDelete.orderNumber}` : undefined}
      />
    </div>
  );
}
