"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, ShoppingCart, Package, FolderTree, TrendingUp } from "lucide-react";
import { useAdminWebSocket } from "./AdminWebSocketProvider";

export function AdminNotifications() {
  const { isConnected, notifications, removeNotification, clearNotifications } =
    useAdminWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "category":
        return <FolderTree className="h-4 w-4" />;
      case "analytics":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "product":
        return "bg-green-50 text-green-600 border-green-200";
      case "category":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "analytics":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg border border-neutral-300 bg-white p-2 text-neutral-700 transition hover:bg-neutral-50"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {!isConnected && (
          <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-neutral-200 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                <h3 className="font-serif text-sm font-semibold text-neutral-900">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs text-neutral-500 hover:text-neutral-900"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-neutral-300" />
                    <p className="mt-2 text-sm text-neutral-500">
                      No notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`flex items-start gap-3 border-l-4 p-3 transition hover:bg-neutral-50 ${getColor(
                          notification.type
                        )}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-neutral-900">
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-600">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-[10px] text-neutral-400">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNotification(notification.id)}
                          className="shrink-0 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {!isConnected && (
                <div className="border-t border-neutral-200 bg-red-50 px-4 py-2">
                  <p className="text-xs text-red-600">
                    Disconnected from real-time updates
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

