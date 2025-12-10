"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/lib/graphql/queries";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/graphql/mutations";
import { useToast } from "@/lib/hooks/useToast";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable, {
  TableColumn,
  TableAction,
} from "@/components/admin/AdminTable";
import { Edit2, Trash2, Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data, loading, refetch } = useQuery(GET_CATEGORIES);
  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY);

  const categories: Category[] = data?.categories || [];

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update existing category
        const { data } = await updateCategory({
          variables: {
            id: editingCategory.id,
            name: formData.name,
            description: formData.description,
          },
        });

        if (data?.updateCategory?.errors?.length > 0) {
          showToast(data.updateCategory.errors.join(", "), "error");
        } else {
          showToast("Category updated successfully", "success");
          handleCloseModal();
          refetch();
        }
      } else {
        // Create new category
        const { data } = await createCategory({
          variables: {
            name: formData.name,
            description: formData.description,
          },
        });

        if (data?.createCategory?.errors?.length > 0) {
          showToast(data.createCategory.errors.join(", "), "error");
        } else {
          showToast("Category created successfully", "success");
          handleCloseModal();
          refetch();
        }
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? Products in this category will remain but will be uncategorized.`
      )
    ) {
      return;
    }

    try {
      const { data } = await deleteCategory({
        variables: { id },
      });

      if (data?.deleteCategory?.errors?.length > 0) {
        showToast(data.deleteCategory.errors.join(", "), "error");
      } else {
        showToast("Category deleted successfully", "success");
        refetch();
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
      console.error("Error deleting category:", error);
    }
  };

  const tableColumns: TableColumn[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
      render: (value) => value || "-",
      hidden: "mobile",
    },
  ];

  const tableActions: TableAction[] = [
    {
      label: "Edit",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (category) => handleOpenModal(category),
      variant: "primary",
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (category) => handleDelete(category.id, category.name),
      variant: "danger",
    },
  ];

  return (
    <AdminLayout title="Categories" subtitle="Manage product categories">
      {/* Add Category Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <AdminTable
        columns={tableColumns}
        data={categories}
        actions={tableActions}
        loading={loading}
        emptyMessage="No categories found. Create your first category!"
      />

      {/* Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={handleCloseModal} className="modal-close">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="btn-primary disabled:opacity-50"
                >
                  {creating || updating
                    ? "Saving..."
                    : editingCategory
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
