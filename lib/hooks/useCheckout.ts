import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../graphql/mutations';
import { useCartStore } from '../zustand/cartStore';
import { useRouter } from 'next/navigation';

interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  city: string;
  postalCode?: string;
  paymentMethod: string;
}

export const useCheckout = () => {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [createOrderMutation, { loading }] = useMutation(CREATE_ORDER);

  const checkout = async (data: CheckoutData) => {
    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const { data: result } = await createOrderMutation({
      variables: {
        input: {
          ...data,
          orderItems,
        },
      },
    });

    if (result.createOrder.errors.length > 0) {
      throw new Error(result.createOrder.errors.join(', '));
    }

    const order = result.createOrder.order;
    clearCart();
    router.push(`/orders/${order.id}`);

    return order;
  };

  return {
    checkout,
    loading,
  };
};
