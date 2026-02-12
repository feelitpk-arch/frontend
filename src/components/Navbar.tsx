"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

type Category = {
  id: string;
  key: string;
  label: string;
};

export function Navbar() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await api.getCategories();
        // Map categories to navItems format
        const items = categories.map((category: Category) => ({
          label: category.label,
          href: `/category/${category.key}`,
        }));
        setNavItems(items);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // Fallback to default categories if API fails
        setNavItems([
          { label: "Best Sellers", href: "/category/best-sellers" },
          { label: "Men", href: "/category/men" },
          { label: "Women", href: "/category/women" },
          { label: "New Arrivals", href: "/category/new-arrivals" },
        ]);
      }
    };

    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto container flex items-center justify-between px-4 py-3 lg:py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-[0.25em] text-neutral-900 hover:text-neutral-700 transition-colors">
          FEEL IT
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 lg:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <nav className="mx-auto container flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-700 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}


