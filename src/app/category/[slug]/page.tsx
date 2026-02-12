"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import type { Product, ProductCategory } from "@/data/products";

const categoryLabels: Record<ProductCategory, string> = {
  "best-sellers": "Best Sellers",
  "weekly-deals": "Weekly Deals",
  testers: "Testers",
  "explorer-kits": "Explorers Kits",
  men: "Men",
  women: "Women",
  "new-arrivals": "New Arrivals",
  colognes: "Colognes",
  "roll-ons": "Roll-Ons",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as ProductCategory;
  const label = categoryLabels[slug];
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [slug]);

  useEffect(() => {
    // Listen to WebSocket events for product updates
    const handleProductCreated = (event: CustomEvent) => {
      const product = event.detail as Product;
      if (shouldIncludeProduct(product)) {
        setProducts((prev) => {
          if (prev.find((p) => p.id === product.id)) {
            return prev;
          }
          return [...prev, product];
        });
      }
    };

    const handleProductUpdated = (event: CustomEvent) => {
      const product = event.detail as Product;
      setProducts((prev) => {
        const index = prev.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = product;
          return shouldIncludeProduct(product) ? updated : updated.filter((p) => p.id !== product.id);
        }
        if (shouldIncludeProduct(product)) {
          return [...prev, product];
        }
        return prev;
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
  }, [slug]);

  const shouldIncludeProduct = (product: Product): boolean => {
    if (slug === "best-sellers") {
      return product.isBestSeller === true;
    }
    return product.category === slug;
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allProducts = await api.getProducts();
      let filtered: Product[];
      
      if (slug === "best-sellers") {
        filtered = allProducts.filter((p: Product) => p.isBestSeller);
      } else {
        filtered = allProducts.filter((p: Product) => p.category === slug);
      }
      
      setProducts(filtered);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  if (!label) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-neutral-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl tracking-wide text-neutral-900">
          {label}
        </h1>
        <p className="text-sm text-neutral-600">
          Explore curated scents within the {label.toLowerCase()} selection.
        </p>
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
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No products are currently listed in this category.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
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
    </div>
  );
}


