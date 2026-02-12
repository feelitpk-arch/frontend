"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ProductCategory } from "@/data/products";

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: { key: ProductCategory; label: string }) => void;
  category?: { key: ProductCategory; label: string } | null;
  existingCategories?: ProductCategory[];
};

const availableCategories: ProductCategory[] = [
  "best-sellers",
  "weekly-deals",
  "testers",
  "explorer-kits",
  "men",
  "women",
  "new-arrivals",
  "colognes",
  "roll-ons",
];

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  existingCategories,
}: CategoryModalProps) {
  const isEditMode = !!category;
  const [formData, setFormData] = useState({
    key: "men" as ProductCategory,
    label: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        key: category.key,
        label: category.label,
      });
    } else {
      // Find first available category that's not already used
      const existing = existingCategories || [];
      const available = availableCategories.find(
        (cat) => !existing.includes(cat)
      );
      setFormData({
        key: available || "men",
        label: "",
      });
    }
  }, [category, isOpen, existingCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.label.trim()) {
      alert("Please enter a category label");
      return;
    }

    // Check if category key already exists (only for new categories)
    const existing = existingCategories || [];
    if (!isEditMode && existing.includes(formData.key)) {
      alert("This category already exists");
      return;
    }

    onSave({
      key: formData.key,
      label: formData.label.trim(),
    });

    onClose();
  };

  if (!isOpen) return null;

  // Get available categories (not already used, or current category if editing)
  const getAvailableCategories = () => {
    const existing = existingCategories || [];
    if (isEditMode) {
      return availableCategories;
    }
    return availableCategories.filter(
      (cat) => !existing.includes(cat) || cat === formData.key
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
                <h2 className="font-serif text-xl font-semibold text-neutral-900">
                  {isEditMode ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-neutral-600 transition hover:bg-neutral-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Category Key */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category Key *
                  </label>
                  <select
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value as ProductCategory })}
                    disabled={isEditMode}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10 disabled:bg-neutral-50 disabled:cursor-not-allowed"
                  >
                    {getAvailableCategories().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-neutral-500">
                    {isEditMode
                      ? "Category key cannot be changed after creation"
                      : "Select a unique category key"}
                  </p>
                </div>

                {/* Category Label */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                    placeholder="e.g., Best Sellers"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Display name for this category
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900"
                  >
                    {isEditMode ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

