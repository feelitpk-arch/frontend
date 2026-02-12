"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import CategoryModal from "@/components/CategoryModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import WarningModal from "@/components/WarningModal";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

type Category = {
  id: string;
  key: string;
  label: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only load data if we have a token
    const token = localStorage.getItem("adminToken");
    if (token) {
      loadCategories();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const data = await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      // Handle 401 errors gracefully - don't show error if it's an auth issue
      // The api.ts will handle redirect
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      setError(err.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: { key: string; label: string }) => {
    try {
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        return;
      }

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryData);
        toast.success("Category updated successfully!");
      } else {
        await api.createCategory(categoryData);
        toast.success("Category created successfully!");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (err: any) {
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      const errorMessage = err.message || "Failed to save category";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDeleteClick = async (category: Category) => {
    try {
      // Check token before making requests
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        return;
      }

      const stats = await api.getCategoryStats(category.id);
      if (stats.productCount > 0) {
        setWarningMessage(
          `Cannot delete category with existing products. This category has ${stats.productCount} product${stats.productCount > 1 ? "s" : ""}. Please reassign or remove products first.`
        );
        setWarningModalOpen(true);
        return;
      }
      setCategoryToDelete(category);
      setDeleteModalOpen(true);
    } catch (err: any) {
      if (err.message && err.message.includes("Unauthorized")) {
        console.warn("Authentication error - redirecting to login");
        return;
      }
      setError(err.message || "Failed to check category stats");
    }
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        // Check token before making requests
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Please login again");
          return;
        }

        await api.deleteCategory(categoryToDelete.id);
        toast.success("Category deleted successfully!");
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        await loadCategories();
      } catch (err: any) {
        if (err.message && err.message.includes("Unauthorized")) {
          console.warn("Authentication error - redirecting to login");
          return;
        }
        const errorMessage = err.message || "Failed to delete category";
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
            Categories
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Manage product categories
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-300 border-r-black"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <p className="text-neutral-600">No categories found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4">
                <h3 className="font-serif text-lg font-semibold text-neutral-900">
                  {category.label}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {category.key}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEditCategory(category)}
                  className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  <Edit className="mr-1 inline h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(category)}
                  className="flex-1 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="mr-1 inline h-3 w-3" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory ? { key: editingCategory.key as any, label: editingCategory.label } : null}
        existingCategories={categories.map((cat) => cat.key as any)}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete category?"
        message="This category will be removed. This action cannot be undone."
        itemName={categoryToDelete?.label || ""}
      />

      <WarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        title="Cannot delete"
        message={warningMessage}
      />
    </div>
  );
}
