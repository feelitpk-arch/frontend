"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { ScrollAnimation } from "@/components/ScrollAnimation";
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

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const total = getTotalPrice();

  useEffect(() => {
    loadBestSellers();
  }, []);

  const loadBestSellers = async () => {
    try {
      const products = await api.getProducts();
      const bestSellerProducts = products.filter((p: Product) => p.isBestSeller);
      setBestSellers(bestSellerProducts);
    } catch (err) {
      console.error("Failed to load best sellers:", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="text-6xl">🛒</div>
        <h2 className="font-serif text-2xl tracking-wide text-neutral-900">
          Your cart is empty
        </h2>
        <p className="text-sm text-neutral-600">
          Start adding items to your cart to continue shopping.
        </p>
        <Link
          href="/"
          className="rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
          Shopping Cart
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4"
            >
              <Link
                href={`/product/${item.product.slug}`}
                className="relative block h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="text-sm font-semibold text-neutral-900 hover:text-neutral-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    Size: {item.size} ml
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 transition hover:border-black"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 transition hover:border-black"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold">
                      Rs.{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-PK"
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.product.id, item.size)
                      }
                      className="text-xs text-neutral-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-serif text-xl tracking-wide text-neutral-900">
              Order Summary
            </h2>
            <div className="space-y-3 border-b border-neutral-200 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold">
                  Rs. {total.toLocaleString("en-PK")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-semibold">
                  {total >= 3999 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>Rs. 200</span>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                Rs.{" "}
                {(total >= 3999 ? total : total + 200).toLocaleString("en-PK")}
              </span>
            </div>
            {total < 3999 && (
              <p className="mt-2 text-xs text-neutral-500">
                Add Rs. {(3999 - total).toLocaleString("en-PK")} more for free
                shipping
              </p>
            )}
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/"
              className="mt-3 block w-full text-center text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Products Section */}
      <ScrollAnimation direction="up" delay={0.2}>
        <section className="mt-12 space-y-4 border-t border-neutral-200 pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl tracking-wide text-neutral-900">
                Trending Products
              </h2>
              <p className="text-xs text-neutral-500">
                Discover our most popular fragrances that customers love.
              </p>
            </div>
            <Link
              href="/category/best-sellers"
              className="hidden rounded-full border border-neutral-300 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-700 transition hover:border-black hover:text-black md:inline-flex"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers
              .filter(
                (product) =>
                  !items.some((item) => item.product.id === product.id)
              )
              .slice(0, 4)
              .map((product, index) => (
                <ScrollAnimation
                  key={product.id}
                  direction="up"
                  delay={0.1 * index}
                >
                  <ProductCard product={product} />
                </ScrollAnimation>
              ))}
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
}

