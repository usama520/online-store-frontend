import { useCartStore, CartItem } from "../zustand/cartStore";

interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
}

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Format cart items for checkout mutation
  const formatForCheckout = (): CheckoutItem[] => {
    return items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
  };

  // Validate if all items are still in stock
  const validateStock = (): {
    isValid: boolean;
    outOfStockItems: CartItem[];
  } => {
    const outOfStockItems = items.filter(
      (item) => !item.stockQuantity || item.quantity > item.stockQuantity,
    );

    return {
      isValid: outOfStockItems.length === 0,
      outOfStockItems,
    };
  };

  // Check if a product is already in cart
  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  // Get cart item by product ID
  const getCartItem = (productId: string): CartItem | undefined => {
    return items.find((item) => item.productId === productId);
  };

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    formatForCheckout,
    validateStock,
    isInCart,
    getCartItem,
  };
};
