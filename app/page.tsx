"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function Home() {
  const { products, loading } = useProducts();

  // Show first 8 products on home page
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to {process.env.NEXT_PUBLIC_STORE_NAME || "My Online Store"}
          </h1>
          <p className="text-xl mb-8">
            {process.env.NEXT_PUBLIC_STORE_DESCRIPTION ||
              "Discover amazing products at great prices"}
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </div>
    </div>
  );
}
