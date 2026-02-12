"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      console.log("⏸️ Already loading, preventing double submission");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      console.log("🚀 Starting login process...");
      const response = await api.login(formData.username, formData.password);
      console.log("✅ Login API call successful");
      
      // Store JWT token (backend returns accessToken in camelCase)
      const token = response.accessToken || (response as any).access_token;
      console.log("🔑 Token received:", token ? "Yes" : "No");
      
      if (!token) {
        console.error("❌ No token in response:", response);
        throw new Error("No token received from server");
      }
      
      console.log("💾 Storing token in localStorage...");
      // Store token and flag
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminLoggedIn", "true");
      
      // Verify token was stored
      const storedToken = localStorage.getItem("adminToken");
      console.log("✅ Token stored:", storedToken ? "Yes" : "No");
      
      if (!storedToken) {
        throw new Error("Failed to store authentication token");
      }
      
      console.log("🔄 Redirecting to /admin...");
      toast.success("Login successful!");
      // Force full page reload to ensure route guard sees the token
      // Use a longer delay to ensure token is stored
      setTimeout(() => {
        window.location.href = "/admin";
      }, 200);
    } catch (err: any) {
      console.error("❌ Login error:", err);
      const errorMessage = err.message || "Invalid username or password";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
            FEEL IT
          </h1>
          <p className="mt-2 text-sm text-neutral-600">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
              placeholder="admin"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

       
      </motion.div>
    </div>
  );
}

