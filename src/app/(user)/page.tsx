"use client";

import { useState, useEffect } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { api } from "@/lib/api";
import type { Product } from "@/data/products";
import Link from "next/link";

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBestSellers();
  }, []);

  useEffect(() => {
    // Listen to WebSocket events for product updates
    const handleProductCreated = (event: CustomEvent) => {
      const product = event.detail as Product;
      if (product.isBestSeller) {
        setBestSellers((prev) => {
          // Check if product already exists
          if (prev.find((p) => p.id === product.id)) {
            return prev;
          }
          return [...prev, product];
        });
      }
    };

    const handleProductUpdated = (event: CustomEvent) => {
      const product = event.detail as Product;
      setBestSellers((prev) => {
        const index = prev.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = product;
          return updated;
        }
        // If it's now a best seller, add it
        if (product.isBestSeller) {
          return [...prev, product];
        }
        return prev;
      });
    };

    const handleProductDeleted = (event: CustomEvent) => {
      const { productId } = event.detail;
      setBestSellers((prev) => prev.filter((p) => p.id !== productId));
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

  const loadBestSellers = async () => {
    try {
      setIsLoading(true);
      const products = await api.getProducts();
      const bestSellerProducts = products.filter((p: Product) => p.isBestSeller);
      setBestSellers(bestSellerProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Feel It",
            description:
              "Premium fragrance e-boutique offering curated perfumes for men and women",
            url: "https://feel-it.com",
            logo: "https://feel-it.com/logo.png",
            priceRange: "Rs. 1,199 - Rs. 5,299",
            address: {
              "@type": "PostalAddress",
              addressCountry: "PK",
            },
            sameAs: [
              "https://www.facebook.com/feelit",
              "https://www.instagram.com/feelit",
              "https://www.linkedin.com/company/feelit",
            ],
          }),
        }}
      />
      <div className="space-y-10">
        <HeroSlider />

        <ScrollAnimation direction="up" delay={0.2}>
          <section id="best-sellers" className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl tracking-wide text-neutral-900">
                  Best Sellers
                </h2>
                <p className="text-xs text-neutral-500">
                  Long-wearing, city-proof scents our community reaches for the most.
                </p>
              </div>
              <Link
                href="/category/best-sellers"
                className="hidden rounded-full border border-neutral-300 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-700 transition hover:border-black hover:text-black md:inline-flex"
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
            ) : bestSellers.length === 0 ? (
              <p className="text-sm text-neutral-500">No best sellers available</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {bestSellers.map((product, index) => (
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
          </section>
        </ScrollAnimation>
      </div>
    </>
  );
}
