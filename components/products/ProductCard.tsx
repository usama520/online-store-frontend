import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useStoreSettingsStore } from "@/lib/zustand/storeSettingsStore";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0] || "/placeholder-product.png";
  const { settings } = useStoreSettingsStore();
  const currencySymbol = settings?.currencySymbol || "Rs.";

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="bg-theme-surface-card rounded-2xl overflow-hidden h-full flex flex-col shadow-soft border border-theme-border-light hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square bg-theme-surface-secondary overflow-hidden">
          {product.images[0] && (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-theme-text/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-theme-surface-card text-theme-text text-sm font-semibold px-4 py-2 rounded-full shadow-soft">
                Out of Stock
              </span>
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="bg-theme-surface-card/90 backdrop-blur-sm text-theme-text-secondary text-xs font-medium px-3 py-1.5 rounded-full shadow-soft-sm">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Quick View Overlay - appears on hover */}
          <div className="absolute inset-0 bg-theme-primary/0 group-hover:bg-theme-primary/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-theme-surface-card text-theme-text text-sm font-semibold px-4 py-2 rounded-full shadow-soft transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="text-base sm:text-lg font-semibold text-theme-text mb-2 line-clamp-2 group-hover:text-theme-primary transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <div className="flex-grow min-h-[2.5rem] mb-3">
            {product.description ? (
              <p className="text-sm text-theme-text-secondary line-clamp-2">
                {product.description}
              </p>
            ) : (
              <p className="text-sm text-theme-text-muted italic">
                No description
              </p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-theme-border-light">
            <span className="text-xl sm:text-2xl font-bold text-theme-primary">
              {formatPrice(product.price, currencySymbol)}
            </span>
            {product.inStock && (
              <span className="text-xs sm:text-sm text-theme-text-muted font-medium">
                {product.stockQuantity} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
