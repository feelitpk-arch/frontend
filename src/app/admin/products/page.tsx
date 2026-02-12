"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import ProductModal from "@/components/ProductModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { api } from "@/lib/api";
import { useAdminWebSocket } from "@/components/AdminWebSocketProvider";
import type { Product } from "@/data/products";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { on } = useAdminWebSocket();

  useEffect(() => {
    // Only load data if we have a token
    const token = localStorage.getItem("adminToken");
    if (token) {
      loadProducts();
    } else {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Listen to WebSocket events to refresh product list
    if (!on) return;

    const unsubscribeCreated = on("product-created", () => {
      loadProducts();
    });

    const unsubscribeUpdated = on("product-updated", () => {
      loadProducts();
    });

    const unsubscribeDeleted = on("product-deleted", () => {
      loadProducts();
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [on]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const products = await api.getProducts(searchQuery || undefined);
      setProductList(products);
    } catch (err: any) {
      // Handle 401 errors gracefully - don't show error if it's an auth issue
      // The api.ts will handle redirect
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        return;
      }

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        toast.success("Product updated successfully!");
      } else {
        await api.createProduct(productData);
        toast.success("Product created successfully!");
      }
      setError("");
      setIsModalOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (err: any) {
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      const errorMessage = err.message || "Failed to save product";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        // Check token before making requests
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Please login again");
          return;
        }

        await api.deleteProduct(productToDelete.id);
        toast.success("Product deleted successfully!");
        setError("");
        setDeleteModalOpen(false);
        setProductToDelete(null);
        await loadProducts();
      } catch (err: any) {
        if (err.message && err.message.includes("Unauthorized")) {
          console.warn("Authentication error - redirecting to login");
          return;
        }
        const errorMessage = err.message || "Failed to delete product";
        toast.error(errorMessage);
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl tracking-wide text-neutral-900 lg:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Manage your product catalog
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProduct}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-300 border-r-black"></div>
        </div>
      ) : productList.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <p className="text-neutral-600">No products found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productList.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                {product.isBestSeller && (
                  <div className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs font-semibold text-white">
                    Best Seller
                  </div>
                )}
                {product.isNewArrival && (
                  <div className="absolute right-2 top-2 rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                    New
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-semibold text-neutral-900">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                  {product.description}
                </p>
                <p className="mt-2 text-sm font-bold text-neutral-900">
                  Rs. {product.price.toLocaleString("en-PK")}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <Edit className="mr-1 inline h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(product)}
                    className="flex-1 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="mr-1 inline h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete product?"
        message="This product will be removed. This action cannot be undone."
        itemName={productToDelete?.name || ""}
      />
    </div>
  );
}
