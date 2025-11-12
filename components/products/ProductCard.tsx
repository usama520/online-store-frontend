import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useStoreSettingsStore } from '@/lib/zustand/storeSettingsStore';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0] || '/placeholder-product.png';
  const { settings } = useStoreSettingsStore();
  const currencySymbol = settings?.currencySymbol || 'Rs.';

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-64 bg-gray-200 flex-shrink-0">
          {product.images[0] && (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {product.name}
          </h3>
          <div className="flex-grow min-h-[3rem] mb-3">
            {product.description ? (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            ) : (
              <div className="text-sm text-gray-400">No description</div>
            )}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price, currencySymbol)}
            </span>
            {product.inStock && (
              <span className="text-sm text-gray-500">
                {product.stockQuantity} in stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

