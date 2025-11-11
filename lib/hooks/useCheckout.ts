import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../graphql/mutations';
import { useCart } from './useCart';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

interface CreateOrderInput extends CustomerInfo {
  orderItems: OrderItem[];
  paymentMethod: 'cash_on_delivery' | 'bank_transfer';
}

interface CreateOrderResponse {
  createOrder?: {
    order?: {
      id: string;
      customerName: string;
      totalAmount: number;
      status: string;
    };
    errors?: string[];
  };
}

export const useCheckout = () => {
  const { clearCart, formatForCheckout, validateStock } = useCart();
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [createOrderMutation, { loading }] = useMutation<CreateOrderResponse>(CREATE_ORDER);

  const validateCustomerInfo = (info: CustomerInfo): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!info.customerName || info.customerName.trim().length < 2) {
      errors.push('Customer name must be at least 2 characters');
    }

    if (!info.customerEmail || !info.customerEmail.includes('@')) {
      errors.push('Valid email address is required');
    }

    if (!info.customerPhone || info.customerPhone.trim().length < 10) {
      errors.push('Valid phone number is required');
    }

    if (!info.customerAddress || info.customerAddress.trim().length < 10) {
      errors.push('Detailed address is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const createOrder = async (
    customerInfo: CustomerInfo,
    paymentMethod: 'cash_on_delivery' | 'bank_transfer'
  ): Promise<{ success: boolean; orderId?: string }> => {
    setError(null);
    setOrderResult(null);

    // Validate customer information
    const validation = validateCustomerInfo(customerInfo);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false };
    }

    // Validate cart stock
    const stockValidation = validateStock();
    if (!stockValidation.isValid) {
      const outOfStockNames = stockValidation.outOfStockItems.map((item) => item.name).join(', ');
      setError(`The following items are out of stock or have insufficient quantity: ${outOfStockNames}`);
      return { success: false };
    }

    // Format order items from cart
    const orderItems = formatForCheckout();
    if (orderItems.length === 0) {
      setError('Your cart is empty');
      return { success: false };
    }

    try {
      const { data } = await createOrderMutation({
        variables: {
          input: {
            ...customerInfo,
            orderItems,
            paymentMethod,
          },
        },
      });

      if (data?.createOrder?.errors && data.createOrder.errors.length > 0) {
        setError(data.createOrder.errors.join(', '));
        return { success: false };
      }

      if (data?.createOrder?.order) {
        setOrderResult(data.createOrder.order);
        clearCart(); // Clear cart on successful order
        return {
          success: true,
          orderId: data.createOrder.order.id,
        };
      }

      setError('Failed to create order. Please try again.');
      return { success: false };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      return { success: false };
    }
  };

  return {
    createOrder,
    loading,
    error,
    orderResult,
  };
};

