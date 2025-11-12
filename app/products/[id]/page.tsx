'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/lib/hooks/useProducts';
import { useCartStore } from '@/lib/zustand/cartStore';
import { useStoreSettingsStore } from '@/lib/zustand/storeSettingsStore';
import { useToast } from '@/lib/hooks/useToast';
import { formatPrice } from '@/lib/utils';
import Navbar from '@/components/ui/Navbar';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { product, loading } = useProduct(id);
  const { addItem } = useCartStore();
  const { settings } = useStoreSettingsStore();
  const { showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const currencySymbol = settings?.currencySymbol || 'Rs.';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      stockQuantity: product.stockQuantity,
    });
    showSuccess('Item added to cart');
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      stockQuantity: product.stockQuantity,
    });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image available
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'ring-2 ring-blue-600' : ''
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            {product.category && (
              <p className="text-sm text-gray-500 mb-4">Category: {product.category.name}</p>
            )}
            
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {formatPrice(product.price, currencySymbol)}
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">SKU:</span> {product.sku || 'N/A'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Stock:</span>{' '}
                {product.inStock ? `${product.stockQuantity} available` : 'Out of stock'}
              </p>
            </div>

            {product.inStock && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}

            {!product.inStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                This product is currently out of stock.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

