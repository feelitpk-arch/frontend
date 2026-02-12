"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only load data if we have a token
    const token = localStorage.getItem("adminToken");
    if (token) {
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Load dashboard stats - handle errors gracefully
      try {
        const dashboardStats = await api.getDashboardStats();
        setStats(dashboardStats);
      } catch (err: any) {
        if (err.message && err.message.includes("Unauthorized")) {
          console.warn("⚠️ Dashboard stats returned 401");
        }
        // Set default stats on error
        setStats({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
      }

      // Load orders - handle errors gracefully
      try {
        const orders = await api.getOrders();
        setRecentOrders(orders.slice(0, 5));
      } catch (err: any) {
        if (err.message && err.message.includes("Unauthorized")) {
          console.warn("⚠️ Orders returned 401");
        }
        setRecentOrders([]);
      }
      
      // Get top products (best sellers) - handle errors gracefully
      try {
        const products = await api.getProducts();
        setTopProducts(products.filter((p: any) => p.isBestSeller).slice(0, 5));
      } catch (err: any) {
        if (err.message && err.message.includes("Unauthorized")) {
          console.warn("⚠️ Products returned 401");
        }
        setTopProducts([]);
      }
    } catch (err: any) {
      // Handle 401 errors gracefully - don't clear token or redirect here
      // Let the route guard handle it if token is truly invalid
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("⚠️ Authentication error - but not clearing token");
        return;
      }
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
      href: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toLocaleString("en-PK")}`,
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/analytics",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      href: "/admin/orders?status=pending",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-neutral-900 lg:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Welcome back! Here's an overview of your store.
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
      ) : (
        <>
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={stat.href}
                className="block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md lg:rounded-2xl lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-xl font-bold text-neutral-900 lg:text-2xl">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full p-2.5 lg:p-3 ${stat.color}`}>
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
          className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg tracking-wide text-neutral-900 lg:text-xl">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 transition hover:text-black"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3 lg:space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-neutral-500">No recent orders</p>
                ) : (
                  recentOrders.map((order) => (
              <div
                      key={order.id}
                className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                          {order.orderNumber}
                  </p>
                  <p className="text-xs text-neutral-500">
                          {order.items?.length || 0} items • Rs.{" "}
                          {order.total?.toLocaleString("en-PK") || "0"}
                  </p>
                </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium lg:px-3 ${
                          order.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : order.status === "pending"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {order.status}
                </span>
                    </div>
                  ))
                )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
          className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm lg:rounded-2xl lg:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg tracking-wide text-neutral-900 lg:text-xl">
              Top Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 transition hover:text-black"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3 lg:space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-neutral-500">No products yet</p>
                ) : (
                  topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                          Rs. {product.price?.toLocaleString("en-PK") || "0"}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 lg:px-3">
                    Best Seller
                  </span>
                </div>
                  ))
                )}
          </div>
        </motion.div>
      </div>
        </>
      )}
    </div>
  );
}
