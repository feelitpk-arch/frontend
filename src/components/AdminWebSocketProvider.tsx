"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { WebSocketEvent } from "@/hooks/useWebSocket";

type Notification = {
  id: string;
  type: "order" | "product" | "category" | "analytics";
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
};

type WebSocketContextType = {
  isConnected: boolean;
  notifications: Notification[];
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
  on: (event: WebSocketEvent, handler: (data: any) => void) => () => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function AdminWebSocketProvider({
  children,
  token,
}: {
  children: ReactNode;
  token: string | null;
}) {
  // Only connect WebSocket if we have a valid token
  const actualToken = token || (typeof window !== "undefined" ? localStorage.getItem("adminToken") : null);
  const { isConnected, on } = useWebSocket(actualToken);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeOrder = on("new-order", (order) => {
      setNotifications((prev) => [
        {
          id: `order-${order.id}-${Date.now()}`,
          type: "order",
          title: "New Order",
          message: `Order ${order.orderNumber} from ${order.customerName}`,
          data: order,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    const unsubscribeStatus = on("order-status-changed", (data) => {
      setNotifications((prev) => [
        {
          id: `status-${data.orderId}-${Date.now()}`,
          type: "order",
          title: "Order Status Updated",
          message: `Order ${data.order.orderNumber} is now ${data.status}`,
          data: data.order,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    const unsubscribeProduct = on("product-created", (product) => {
      setNotifications((prev) => [
        {
          id: `product-${product.id}-${Date.now()}`,
          type: "product",
          title: "Product Created",
          message: `New product: ${product.name}`,
          data: product,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    const unsubscribeProductUpdate = on("product-updated", (product) => {
      setNotifications((prev) => [
        {
          id: `product-update-${product.id}-${Date.now()}`,
          type: "product",
          title: "Product Updated",
          message: `${product.name} has been updated`,
          data: product,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    const unsubscribeProductDelete = on("product-deleted", (data) => {
      setNotifications((prev) => [
        {
          id: `product-delete-${data.productId}-${Date.now()}`,
          type: "product",
          title: "Product Deleted",
          message: "A product has been deleted",
          data: { productId: data.productId },
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    const unsubscribeCategory = on("category-created", (category) => {
      setNotifications((prev) => [
        {
          id: `category-${category.id}-${Date.now()}`,
          type: "category",
          title: "Category Created",
          message: `New category: ${category.label}`,
          data: category,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    const unsubscribeCategoryUpdate = on("category-updated", (category) => {
      setNotifications((prev) => [
        {
          id: `category-update-${category.id}-${Date.now()}`,
          type: "category",
          title: "Category Updated",
          message: `${category.label} has been updated`,
          data: category,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    return () => {
      unsubscribeOrder();
      unsubscribeStatus();
      unsubscribeProduct();
      unsubscribeProductUpdate();
      unsubscribeProductDelete();
      unsubscribeCategory();
      unsubscribeCategoryUpdate();
    };
  }, [isConnected, on]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        notifications,
        clearNotifications,
        removeNotification,
        on,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useAdminWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useAdminWebSocket must be used within AdminWebSocketProvider"
    );
  }
  return context;
}

