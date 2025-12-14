"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/lib/graphql/queries";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/ui/Navbar";
import { Category } from "@/lib/types";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { products, loading } = useProducts(
    selectedCategory || undefined,
    search || undefined
  );
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = (categoriesData?.categories || []) as Category[];

  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-theme-text mb-8">
          All Products
        </h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-theme"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-theme"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
            <p className="mt-4 text-theme-text-secondary">
              Loading products...
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
