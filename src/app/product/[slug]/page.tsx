"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { api } from "@/lib/api";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  notes?: string;
  price: number;
  sizes: number[];
  defaultSize: number;
  category: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  image: string;
  gallery?: string[];
};

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const productData = await api.getProductBySlug(slug);
      setProduct(productData);
    } catch (err: any) {
      console.error("Failed to load product:", err);
      setError(err.message || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4">
          <div className="h-96 w-full animate-pulse rounded-xl bg-neutral-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <p className="text-sm text-red-500">
          {error || "Product not found"}
        </p>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
        >
          Go Back
        </button>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "Feel It",
    },
    offers: {
      "@type": "Offer",
      url: `https://feel-it.com/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "127",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
