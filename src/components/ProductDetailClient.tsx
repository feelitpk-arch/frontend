"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

export function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(product, selectedSize, quantity);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsAdding(false);
    router.push("/cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="grid gap-8 pt-4 md:grid-cols-2 lg:gap-12"
    >
      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 600px, 100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[product.image, ...product.gallery].map((src, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={() => setSelectedImage(src)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === src
                  ? "border-black ring-2 ring-black/20"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <Image
                src={src}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Eau de Parfum
          </p>
          <h1 className="font-serif text-3xl tracking-wide text-neutral-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-base leading-relaxed text-neutral-600">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline gap-3 border-b border-neutral-200 pb-6">
          <p className="text-3xl font-bold tracking-wide text-neutral-900">
            Rs. {product.price.toLocaleString("en-PK")}
          </p>
          {product.isBestSeller && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700"
            >
              Best Seller
            </motion.span>
          )}
          {product.isNewArrival && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white"
            >
              New
            </motion.span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
              Select Size
            </p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <motion.button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 rounded-lg border-2 px-6 py-3 text-sm font-medium tracking-wide transition-all ${
                    size === selectedSize
                      ? "border-black bg-black text-white shadow-lg"
                      : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500 hover:shadow-md"
                  }`}
                >
                  {size} ml
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
              Quantity
            </p>
            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-xl font-medium text-neutral-800 transition hover:border-black hover:bg-neutral-50"
              >
                −
              </motion.button>
              <span className="w-16 text-center text-lg font-bold">{quantity}</span>
              <motion.button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-xl font-medium text-neutral-800 transition hover:border-black hover:bg-neutral-50"
              >
                +
              </motion.button>
            </div>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-lg bg-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "Adding to Cart..." : "Add to Cart"}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
        >
          {product.notes && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                Fragrance Notes
              </p>
              <p className="text-sm leading-relaxed text-neutral-700">{product.notes}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Why you&apos;ll love it
          </p>
          <ul className="space-y-2.5 text-sm leading-relaxed text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-neutral-400">•</span>
              <span>Long-lasting wear designed for all-day city routines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-neutral-400">•</span>
              <span>Premium oil concentrations for a smooth, diffused trail</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-neutral-400">•</span>
              <span>Crafted to be comfortably unisex on most skin types</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-neutral-400">•</span>
              <span>Packaged in a minimal bottle that looks good on any shelf</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
