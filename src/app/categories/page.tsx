"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { api } from "@/lib/api";
import type { Product } from "@/data/products";

type TabType = "new-arrivals" | "men" | "women";

const tabs: { id: TabType; label: string; href: string }[] = [
  { id: "new-arrivals", label: "New Arrivals", href: "/category/new-arrivals" },
  { id: "men", label: "Men", href: "/category/men" },
  { id: "women", label: "Women", href: "/category/women" },
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("new-arrivals");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Listen to WebSocket events for product updates
    const handleProductCreated = (event: CustomEvent) => {
      const product = event.detail as Product;
      setProducts((prev) => {
        if (prev.find((p) => p.id === product.id)) {
          return prev;
        }
        return [...prev, product];
      });
    };

    const handleProductUpdated = (event: CustomEvent) => {
      const product = event.detail as Product;
      setProducts((prev) => {
        const index = prev.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = product;
          return updated;
        }
        return [...prev, product];
      });
    };

    const handleProductDeleted = (event: CustomEvent) => {
      const { productId } = event.detail;
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    window.addEventListener("product-created", handleProductCreated as EventListener);
    window.addEventListener("product-updated", handleProductUpdated as EventListener);
    window.addEventListener("product-deleted", handleProductDeleted as EventListener);

    return () => {
      window.removeEventListener("product-created", handleProductCreated as EventListener);
      window.removeEventListener("product-updated", handleProductUpdated as EventListener);
      window.removeEventListener("product-deleted", handleProductDeleted as EventListener);
    };
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const allProducts = await api.getProducts();
      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsForTab = (tabId: TabType) => {
    switch (tabId) {
      case "new-arrivals":
        return products.filter((p) => p.isNewArrival);
      case "men":
        return products.filter((p) => p.category === "men");
      case "women":
        return products.filter((p) => p.category === "women");
      default:
        return [];
    }
  };

  const activeProducts = getProductsForTab(activeTab);
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-8 pt-4">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
          Shop by Category
        </h1>
        <p className="text-sm text-neutral-600">
          Explore our curated collections of premium fragrances.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
                activeTab === tab.id
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl tracking-wide text-neutral-900">
              {activeTabData?.label}
            </h2>
            <p className="text-xs text-neutral-500">
              {activeProducts.length} {activeProducts.length === 1 ? "product" : "products"} available
            </p>
          </div>
          <Link
            href={activeTabData?.href || "#"}
            className="rounded-full border border-neutral-300 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-700 transition hover:border-black hover:text-black"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-neutral-200"
              />
            ))}
          </div>
        ) : activeProducts.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No products available in this category.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activeProducts.map((product, index) => (
              <ScrollAnimation
                key={product.id}
                direction="up"
                delay={0.1 * index}
              >
                <ProductCard product={product} />
              </ScrollAnimation>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
