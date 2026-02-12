"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

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

  const total = getTotalPrice();
  const shipping = total >= 3999 ? 0 : 200;
  const finalTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        items: items.map((item) => ({
          productId: item.product.id,
          size: item.size,
          quantity: item.quantity,
        })),
      };

      console.log("🛒 Creating order with items:", orderData.items.map(item => ({
        productId: item.productId,
        productIdType: typeof item.productId,
        size: item.size,
        quantity: item.quantity
      })));

      // Create order via API
      await api.createOrder(orderData);

      // Clear cart and redirect
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/checkout/success");
    } catch (err: any) {
      console.error("Failed to create order:", err);
      let errorMessage = err.message || "Failed to place order. Please try again.";
      
      // If product not found, suggest clearing cart
      if (errorMessage.includes("Product with ID") && errorMessage.includes("not found")) {
        errorMessage = "One or more products in your cart are no longer available. Please clear your cart and add products again.";
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="text-6xl">🛒</div>
        <h2 className="font-serif text-2xl tracking-wide text-neutral-900">
          Your cart is empty
        </h2>
        <p className="text-sm text-neutral-600">
          Add items to your cart before checkout.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl tracking-wide text-neutral-900">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-serif text-xl tracking-wide text-neutral-900">
              Shipping Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-serif text-xl tracking-wide text-neutral-900">
              Order Summary
            </h2>
            <div className="space-y-3 border-b border-neutral-200 pb-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-3"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {item.size} ml × {item.quantity}
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      Rs.{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-PK"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-b border-neutral-200 pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold">
                  Rs. {total.toLocaleString("en-PK")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>Rs. {shipping.toLocaleString("en-PK")}</span>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rs. {finalTotal.toLocaleString("en-PK")}</span>
            </div>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="mt-3 block w-full text-center text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </form>

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

