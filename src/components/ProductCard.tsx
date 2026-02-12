"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.defaultSize, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-neutral-300"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-neutral-100"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 250px, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-semibold tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs text-neutral-500 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="text-base font-bold tracking-wide text-neutral-900">
            Rs. {product.price.toLocaleString("en-PK")}
          </p>
          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-black px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-800 whitespace-nowrap"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
