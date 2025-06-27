import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchProducts,
  fetchCartProducts,
  fetchProductById,
  fetchProductVariations,
  fetchVariationById,
  fetchReviews,
  addReview,
} from "@/api/products";

export const useProductsQuery = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchProducts });

export const useCartProductsQuery = (ids: number[]) =>
  useQuery({
    queryKey: ["cartProducts", ids],
    queryFn: () => fetchCartProducts(ids),
    enabled: ids.length > 0,
  });

export const useProductQuery = (id: number) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

export const useProductVariationsQuery = (id: number) =>
  useQuery({
    queryKey: ["variations", id],
    queryFn: () => fetchProductVariations(id),
    enabled: !!id,
  });

export const useVariationQuery = (productId: number, variationId: number) =>
  useQuery({
    queryKey: ["variation", productId, variationId],
    queryFn: () => fetchVariationById({ productId, variationId }),
  });

export const useReviewsQuery = () =>
  useQuery({ queryKey: ["reviews"], queryFn: fetchReviews });

export const useAddReviewMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => addReview(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
