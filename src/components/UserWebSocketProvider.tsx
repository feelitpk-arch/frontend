"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { usePublicWebSocket } from "@/hooks/usePublicWebSocket";

type WebSocketContextType = {
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function UserWebSocketProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isConnected, on } = usePublicWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    // Listen to product events - components can subscribe to these
    const unsubscribeProductCreated = on("product-created", (product) => {
      // Dispatch custom event for components to listen to
      window.dispatchEvent(
        new CustomEvent("product-created", { detail: product })
      );
    });

    const unsubscribeProductUpdated = on("product-updated", (product) => {
      window.dispatchEvent(
        new CustomEvent("product-updated", { detail: product })
      );
    });

    const unsubscribeProductDeleted = on("product-deleted", (data) => {
      window.dispatchEvent(
        new CustomEvent("product-deleted", { detail: data })
      );
    });

    return () => {
      unsubscribeProductCreated();
      unsubscribeProductUpdated();
      unsubscribeProductDeleted();
    };
  }, [isConnected, on]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useUserWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useUserWebSocket must be used within UserWebSocketProvider"
    );
  }
  return context;
}

