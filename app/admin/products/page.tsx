"use client";

import { useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_STORE_SETTINGS,
} from "@/lib/graphql/queries";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "@/lib/graphql/mutations";
import { formatPrice } from "@/lib/utils";
import { Product, Category, StoreSettings } from "@/lib/types";
import { useToast } from "@/lib/hooks/useToast";
import { useDirectUpload } from "@/lib/hooks/useDirectUpload";

export default function AdminProductsPage() {
  const { data, refetch } = useQuery(GET_PRODUCTS);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const { showError, showSuccess } = useToast();

  const products = (data?.products || []) as Product[];
  const categories = (categoriesData?.categories || []) as Category[];
  const storeSettings = settingsData?.storeSettings as StoreSettings | null;
  const currencySymbol = storeSettings?.currencySymbol || "Rs.";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    stockQuantity: "",
    categoryId: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<
    { file: File; preview: string; signedId?: string }[]
  >([]);
  const [existingImages, setExistingImages] = useState<
    { url: string; id: string }[]
  >([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const { uploadFile } = useDirectUpload();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      sku: "",
      stockQuantity: "",
      categoryId: "",
    });
    setEditingProduct(null);
    setImagePreviews([]);
    setExistingImages([]);
    setImagesToRemove([]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      sku: product.sku || "",
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.category?.id || "",
    });
    // Map existing images with their IDs
    const imagesWithIds = (product.images || []).map((url, index) => ({
      url,
      id: product.imageIds?.[index] || "",
    }));
    setExistingImages(imagesWithIds);
    setImagePreviews([]);
    setImagesToRemove([]);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        showError(`${file.name}: Only JPEG and PNG images are allowed`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    e.target.value = ""; // Reset input
  };

  const removePreview = (index: number) => {
    const preview = imagePreviews[index];
    URL.revokeObjectURL(preview.preview);
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    if (imageToRemove?.id) {
      setImagesToRemove((prev) => [...prev, imageToRemove.id]);
    }
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadingImages(true);

    try {
      // First, upload all new images to get signed blob IDs
      const signedIds: string[] = [];
      for (let i = 0; i < imagePreviews.length; i++) {
        const preview = imagePreviews[i];
        // Skip if already uploaded
        if (preview.signedId) {
          signedIds.push(preview.signedId);
          continue;
        }

        try {
          const result = await uploadFile(preview.file);
          signedIds.push(result.signedBlobId);
          // Update preview with signed ID
          setImagePreviews((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, signedId: result.signedBlobId } : p
            )
          );
        } catch (error) {
          showError(
            `Failed to upload ${preview.file.name}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          setUploading(false);
          setUploadingImages(false);
          return;
        }
      }

      setUploadingImages(false);

      // Now create/update product with signed blob IDs
      const input: any = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        sku: formData.sku || null,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        categoryId: formData.categoryId || null,
        images: signedIds,
      };

      if (editingProduct) {
        input.id = editingProduct.id;
        if (imagesToRemove.length > 0) {
          input.removeImageIds = imagesToRemove;
        }

        const { data } = await updateProduct({
          variables: { input },
        });

        const updateErrors = data?.updateProduct?.errors || [];
        if (updateErrors.length > 0) {
          showError(updateErrors.join(", "));
          return;
        }
      } else {
        const { data } = await createProduct({
          variables: { input },
        });

        const createErrors = data?.createProduct?.errors || [];
        if (createErrors.length > 0) {
          showError(createErrors.join(", "));
          return;
        }
      }

      // Clean up previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.preview));

      setIsModalOpen(false);
      resetForm();
      refetch();
      showSuccess(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully"
      );
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error("[GraphQL Error in handleSubmit]:", error);
        showError("Something went wrong");
      } else {
        showError(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    } finally {
      setUploading(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct({ variables: { id } });
      refetch();
      showSuccess("Product deleted successfully");
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error("[GraphQL Error in handleDelete]:", error);
        showError("Something went wrong");
      } else {
        showError(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Stock
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {product.name}
                    </div>
                    {product.sku && (
                      <div className="text-xs text-gray-500">
                        SKU: {product.sku}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-800">
                  {formatPrice(product.price, currencySymbol)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`font-semibold ${
                      product.stockQuantity < 10
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-800">
                  {product.category?.name || "-"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">None</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>

                {/* File Input */}
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading || uploadingImages}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG and PNG only, max 5MB per file
                  </p>
                </div>

                {/* Image Previews (new images to be uploaded) */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      New images (will be uploaded on save):
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border-2 border-blue-300"
                          />
                          {preview.signedId && (
                            <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                Ready
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removePreview(index)}
                            disabled={uploading || uploadingImages}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs disabled:opacity-50"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      Existing product images:
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border-2 border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-product.png";
                            }}
                          />
                          {imagesToRemove.includes(image.id) && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                Will Remove
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            disabled={uploading || uploadingImages}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs disabled:opacity-50"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingImages.length === 0 && imagePreviews.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Select JPEG or PNG image files to upload. Images will be
                    uploaded and compressed when you save the product.
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploadingImages
                    ? "Uploading images..."
                    : uploading
                    ? "Saving..."
                    : editingProduct
                    ? "Update"
                    : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
