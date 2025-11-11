import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_PRODUCT } from '../graphql/queries';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stockQuantity: number;
  images?: string[];
  inStock: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface GetProductsData {
  products: Product[];
}

interface GetProductData {
  product: Product;
}

interface UseProductsOptions {
  categoryId?: string;
  search?: string;
}

export const useProducts = (options?: UseProductsOptions) => {
  const { data, loading, error, refetch } = useQuery<GetProductsData>(GET_PRODUCTS, {
    variables: {
      categoryId: options?.categoryId,
      search: options?.search,
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    products: data?.products || [],
    loading,
    error: error?.message || null,
    refetch,
  };
};

export const useProduct = (id: string) => {
  const { data, loading, error, refetch } = useQuery<GetProductData>(GET_PRODUCT, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    product: data?.product || null,
    loading,
    error: error?.message || null,
    refetch,
  };
};

