"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import { useStoreName } from "@/lib/hooks/useStoreName";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/ui/Navbar";
import Container from "@/components/ui/Container";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export default function Home() {
  const { products, loading } = useProducts();
  const storeName = useStoreName();

  // Show first 8 products on home page
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-theme-primary-dark">
        {/* Subtle gradient for smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-br from-theme-primary-dark to-theme-primary-dark-end opacity-95" />

        <Container className="relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              New Collection Available
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
              Welcome to{" "}
              <span className="text-theme-primary-light">{storeName}</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl animate-slide-up">
              {process.env.NEXT_PUBLIC_STORE_DESCRIPTION ||
                "Discover amazing products crafted with care. Quality you can trust, prices you'll love."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-theme-primary text-theme-text-on-primary font-semibold text-lg hover:bg-theme-primary-hover transition-all duration-200 shadow-soft hover:shadow-soft-md hover:-translate-y-0.5"
              >
                Shop Now
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-theme-surface-secondary">
        <Container>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-theme-text mb-2">
                Featured Products
              </h2>
              <p className="text-theme-text-secondary">
                Hand-picked products just for you
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-theme-primary font-semibold hover:text-theme-primary-hover transition-colors group"
            >
              View All Products
              <svg
                className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          {/* Bottom CTA */}
          {!loading && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-theme-primary text-theme-text-on-primary font-semibold text-lg hover:bg-theme-primary-hover transition-all duration-200 shadow-soft hover:shadow-soft-md hover:-translate-y-0.5"
              >
                Explore All Products
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Footer spacer for theme switcher */}
      <div className="h-20" />
    </div>
  );
}
