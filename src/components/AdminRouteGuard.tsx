"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Check if admin is logged in - simple token existence check
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      
      // Require token for authentication
      if (!token) {
        // Clear any stale flags
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
        // Only redirect if we're not already on login page
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
      
      // Token exists - authorize
      // Don't verify token here - let API calls handle validation
      // If token is invalid, API calls will fail gracefully
      // This prevents premature token clearing on network issues
      setIsAuthorized(true);
      setIsLoading(false);
    };

    // Small delay to ensure localStorage is accessible and prevent race conditions
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  // Listen for storage changes (e.g., token cleared by another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminToken" && !e.newValue && pathname !== "/admin/login") {
        setIsAuthorized(false);
        router.replace("/admin/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-300 border-r-black"></div>
          <p className="text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized && pathname !== "/admin/login") {
    return null; // Will redirect
  }

  return <>{children}</>;
}

