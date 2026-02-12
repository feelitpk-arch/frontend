"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, FileText, FileSpreadsheet, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";

type ReportPeriod = "weekly" | "monthly" | "yearly";

export default function AdminAnalyticsPage() {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("monthly");
  const [showComparison, setShowComparison] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only load data if we have a token
    const token = localStorage.getItem("adminToken");
    if (token) {
      loadReport();
    } else {
      setIsLoading(false);
    }
  }, [reportPeriod]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const data = await api.getSalesReport(reportPeriod);
      setReportData(data);
    } catch (err: any) {
      // Handle 401 errors gracefully - don't show error if it's an auth issue
      // The api.ts will handle redirect
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      setError(err.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const { exportToPDF } = await import("@/utils/reportExport");
      exportToPDF(reportData, reportPeriod);
    } catch (err) {
      console.error("Failed to export PDF:", err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const { exportToExcel } = await import("@/utils/reportExport");
      exportToExcel(reportData, reportPeriod);
    } catch (err) {
      console.error("Failed to export Excel:", err);
    }
  };

  const salesChartData = useMemo(() => {
    if (!reportData) return [];
    
    return reportData.salesByDate.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      currentSales: item.sales,
      currentOrders: item.orders,
      previousSales: showComparison && reportData.comparison?.previousPeriod?.salesByDate
        ? reportData.comparison.previousPeriod.salesByDate.find((p: any) => p.date === item.date)?.sales || 0
        : undefined,
      previousOrders: showComparison && reportData.comparison?.previousPeriod?.salesByDate
        ? reportData.comparison.previousPeriod.salesByDate.find((p: any) => p.date === item.date)?.orders || 0
        : undefined,
    }));
  }, [reportData, showComparison]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-300 border-r-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
          <h1 className="font-serif text-2xl tracking-wide text-neutral-900 lg:text-3xl">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
            Sales reports and insights
        </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                showComparison
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
            {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Comparison
            </button>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value as ReportPeriod)}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
          </div>
        </div>
      </div>

      {showComparison && reportData.comparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Sales Change
              </p>
            <p className={`mt-2 text-2xl font-bold ${
              reportData.comparison.salesChange >= 0 ? "text-green-600" : "text-red-600"
              }`}>
              {reportData.comparison.salesChange >= 0 ? "+" : ""}
              {reportData.comparison.salesChange.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-neutral-500">
              Previous: Rs. {reportData.comparison.previousPeriod.totalSales.toLocaleString("en-PK")}
              </p>
            </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Orders Change
              </p>
            <p className={`mt-2 text-2xl font-bold ${
              reportData.comparison.ordersChange >= 0 ? "text-green-600" : "text-red-600"
              }`}>
              {reportData.comparison.ordersChange >= 0 ? "+" : ""}
              {reportData.comparison.ordersChange.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-neutral-500">
              Previous: {reportData.comparison.previousPeriod.totalOrders}
              </p>
            </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Avg Order Value
              </p>
            <p className={`mt-2 text-2xl font-bold ${
              reportData.comparison.avgOrderValueChange >= 0 ? "text-green-600" : "text-red-600"
              }`}>
              {reportData.comparison.avgOrderValueChange >= 0 ? "+" : ""}
              {reportData.comparison.avgOrderValueChange.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-neutral-500">
              Previous: Rs. {reportData.comparison.previousPeriod.averageOrderValue.toLocaleString("en-PK")}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6"
        >
          <h2 className="mb-4 font-serif text-lg tracking-wide text-neutral-900">
            Sales Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "10px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "10px" }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="currentSales"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  stroke="#3b82f6"
                  name="Current Sales"
                />
                {showComparison && (
                  <Line
                  type="monotone"
                  dataKey="previousSales"
                    stroke="#94a3b8"
                  strokeDasharray="5 5"
                  name="Previous Period"
                />
              )}
              </ComposedChart>
          </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6"
        >
          <h2 className="mb-4 font-serif text-lg tracking-wide text-neutral-900">
              Orders Trend
            </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "10px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "10px" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="currentOrders" fill="#10b981" name="Current Orders" />
                {showComparison && (
                <Line
                  type="monotone"
                  dataKey="previousOrders"
                    stroke="#94a3b8"
                  strokeDasharray="5 5"
                    name="Previous Period"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {reportData.topProducts && reportData.topProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:rounded-2xl lg:p-6"
        >
          <h2 className="mb-4 font-serif text-lg tracking-wide text-neutral-900">
            Top Products by Sales
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                  data={reportData.topProducts.slice(0, 5)}
                cx="50%"
                cy="50%"
                labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                fill="#8884d8"
                  dataKey="sales"
                >
                  {reportData.topProducts.slice(0, 5).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
                <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
