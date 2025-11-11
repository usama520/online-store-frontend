import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_PRODUCT } from '../graphql/queries';
import { Product } from '../types';

export const useProducts = (categoryId?: string, search?: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: { categoryId, search },
  });

  return {
    products: (data?.products || []) as Product[],
    loading,
    error,
    refetch,
  };
};

export const useProduct = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.product as Product | null,
    loading,
    error,
    refetch,
  };
};
