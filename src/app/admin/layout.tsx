"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  BarChart3,
  Globe,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { AdminWebSocketProvider } from "@/components/AdminWebSocketProvider";
import { AdminNotifications } from "@/components/AdminNotifications";
import { Toaster } from "react-hot-toast";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("adminToken");
      setAdminToken(token);
    };
    
    checkToken();
    
    // Listen for token changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminToken") {
        setAdminToken(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <AdminRouteGuard>{children}</AdminRouteGuard>;
  }

  return (
    <AdminRouteGuard>
      <AdminWebSocketProvider token={adminToken || null}>
      <div className="flex min-h-screen bg-neutral-50">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <motion.aside
          animate={{
            width: isMobile ? "280px" : (sidebarOpen ? "280px" : "80px"),
            x: isMobile ? (mobileMenuOpen ? 0 : "-100%") : 0,
          }}
          initial={false}
          className="fixed left-0 top-0 z-50 h-screen border-r border-neutral-200 bg-white shadow-lg lg:shadow-none"
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 lg:px-6">
              <Link
                href="/admin"
                className="font-serif text-lg font-semibold tracking-[0.25em] text-neutral-900 lg:text-xl"
              >
                {sidebarOpen ? "FEEL IT" : "FI"}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:block"
                >
                  {sidebarOpen ? "←" : "→"}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4 lg:px-4">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:px-4 lg:py-3 ${
                      isActive
                        ? "bg-black text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-neutral-200 p-3 lg:p-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 lg:px-4 lg:py-3"
              >
                <Globe className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>View Site</span>}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 lg:px-4 lg:py-3"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div 
          className="flex-1 transition-all" 
          style={{ 
            marginLeft: isMobile ? 0 : (sidebarOpen ? "280px" : "80px")
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link
                href="/admin"
                className="font-serif text-lg font-semibold tracking-[0.25em] text-neutral-900 lg:hidden"
              >
                FEEL IT
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <AdminNotifications />
            </div>
          </div>

          <main className="min-h-screen p-4 lg:p-8">{children}</main>
        </div>
      </div>
      </AdminWebSocketProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1a1a1a",
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            fontFamily: "var(--font-sans)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AdminRouteGuard>
  );
}

