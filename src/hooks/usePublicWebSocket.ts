"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

type WebSocketEvent =
  | "product-created"
  | "product-updated"
  | "product-deleted"
  | "category-created"
  | "category-updated"
  | "category-deleted";

type EventHandler = (data: any) => void;

export function usePublicWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<Map<WebSocketEvent, Set<EventHandler>>>(new Map());

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/public`, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connected", (data) => {
      setIsConnected(true);
    });

    // Register all event handlers
    const eventTypes: WebSocketEvent[] = [
      "product-created",
      "product-updated",
      "product-deleted",
      "category-created",
      "category-updated",
      "category-deleted",
    ];

    eventTypes.forEach((eventType) => {
      socket.on(eventType, (data) => {
        const handlers = handlersRef.current.get(eventType);
        if (handlers) {
          handlers.forEach((handler) => handler(data));
        }
      });
    });

    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, []);

  const on = useCallback((event: WebSocketEvent, handler: EventHandler) => {
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
    }
    handlersRef.current.get(event)?.add(handler);

    return () => {
      handlersRef.current.get(event)?.delete(handler);
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  return {
    isConnected,
    on,
    emit,
  };
}

