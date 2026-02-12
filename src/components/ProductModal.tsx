"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { Product, ProductCategory } from "@/data/products";
import { api } from "@/lib/api";

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id" | "slug">) => void;
  product?: Product | null;
};

const categories: ProductCategory[] = [
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

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const isEditMode = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageMethod, setImageMethod] = useState<"link" | "upload">("link");
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    notes: "",
    price: "",
    sizes: "" as string,
    defaultSize: "",
    category: "men" as ProductCategory,
    isBestSeller: false,
    isNewArrival: false,
    image: "",
    gallery: "" as string,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        notes: product.notes ?? "",
        price: product.price.toString(),
        sizes: product.sizes.join(", "),
        defaultSize: product.defaultSize.toString(),
        category: product.category,
        isBestSeller: product.isBestSeller || false,
        isNewArrival: product.isNewArrival || false,
        image: product.image,
        gallery: product.gallery.join(", "),
      });
      setImageMethod("link");
      setImagePreview(product.image);
      setUploadedFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        notes: "",
        price: "",
        sizes: "",
        defaultSize: "",
        category: "men",
        isBestSeller: false,
        isNewArrival: false,
        image: "",
        gallery: "",
      });
      setImageMethod("link");
      setImagePreview("");
      setUploadedFile(null);
    }
  }, [product, isOpen]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setUploadedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFormData({ ...formData, image: "" }); // Clear link when uploading
    }
  };

  const handleRemoveUploadedFile = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setUploadedFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, image: e.target.value });
    if (e.target.value) {
      setImagePreview(e.target.value);
      // Clear uploaded file when using link
      if (uploadedFile) {
        handleRemoveUploadedFile();
      }
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sizes = formData.sizes
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    
    const gallery = formData.gallery
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    if (sizes.length === 0) {
      alert("Please enter at least one size");
      return;
    }

    // Validate that at least one image method is provided
    if (!formData.image && !uploadedFile) {
      alert("Please provide either an image link or upload an image file");
      return;
    }

    // Get the final image URL
    let finalImageUrl = formData.image;
    
    // If file is uploaded, upload to Cloudinary
    if (uploadedFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await api.uploadImage(uploadedFile, 'bavari-products');
      } catch (error: any) {
        alert(`Failed to upload image: ${error.message}`);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSave({
      name: formData.name,
      description: formData.description,
      notes: formData.notes,
      price: parseFloat(formData.price),
      sizes,
      defaultSize: parseInt(formData.defaultSize) || sizes[0],
      category: formData.category,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      image: finalImageUrl,
      gallery: gallery.length > 0 ? gallery : [finalImageUrl],
    });
    
    onClose();
  };

  if (!isOpen) return null;

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
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
                <h2 className="font-serif text-xl font-semibold text-neutral-900">
                  {isEditMode ? "Edit Product" : "Add New Product"}
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                    placeholder="e.g., Noir Amber Eau De Parfum"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10 resize-none"
                    placeholder="A deep amber blend with soft vanilla and smoky woods."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                    placeholder="e.g., Amber, vanilla, incense, sandalwood"
                  />
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                      placeholder="3899"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sizes and Default Size Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Sizes (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                      placeholder="e.g., 50, 100"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      Enter sizes separated by commas (e.g., 50, 100)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Default Size *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.defaultSize}
                      onChange={(e) => setFormData({ ...formData, defaultSize: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Image - Link or Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Main Image * <span className="text-xs font-normal text-neutral-500">(Link or Upload)</span>
                    </label>
                    
                    {/* Method Selection */}
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setImageMethod("link");
                          if (uploadedFile) {
                            handleRemoveUploadedFile();
                          }
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          imageMethod === "link"
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        <LinkIcon className="h-4 w-4" />
                        Image Link
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageMethod("upload");
                          setFormData({ ...formData, image: "" });
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          imageMethod === "upload"
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </button>
                    </div>

                    {/* Image Link Input */}
                    {imageMethod === "link" && (
                      <div>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={handleImageLinkChange}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                          placeholder="/images/products/product-1.jpg"
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                          Enter the image URL or path
                        </p>
                      </div>
                    )}

                    {/* File Upload Input */}
                    {imageMethod === "upload" && (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-sm font-medium text-neutral-700 transition hover:border-black hover:bg-neutral-100"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-6 w-6 text-neutral-400" />
                              <span>Click to upload or drag and drop</span>
                              <span className="text-xs text-neutral-500">
                                PNG, JPG, GIF up to 5MB
                              </span>
                            </div>
                          </button>
                          {uploadedFile && (
                            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                {imagePreview && (
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-neutral-900">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {(uploadedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveUploadedFile}
                                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-neutral-700 mb-2">Preview:</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Gallery Images (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.gallery}
                    onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black/10"
                    placeholder="/images/products/product-1.jpg, /images/products/product-2.jpg"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Leave empty to use main image only
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black/10"
                    />
                    <span className="text-sm font-medium text-neutral-700">
                      Best Seller
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black/10"
                    />
                    <span className="text-sm font-medium text-neutral-700">
                      New Arrival
                    </span>
                  </label>
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
                    disabled={isUploading}
                    className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isUploading ? "Uploading..." : isEditMode ? "Update Product" : "Create Product"}
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

