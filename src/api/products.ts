import axios from "axios";
import { ProductInfo, ProductReview } from "../types/productTypes";
import {
  API_URL_WC,
  API_URL_WP,
  consumerKey,
  consumerSecret,
} from "../constants/api";

const wcClient = axios.create({
  baseURL: API_URL_WC,
  headers: {
    Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
  },
});

const wpClient = axios.create({
  baseURL: API_URL_WP,
  headers: {
    Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
  },
});

export const fetchProducts = async (): Promise<ProductInfo[]> => {
  const { data } = await wcClient.get<ProductInfo[]>("/products", {
    params: { per_page: 100 },
  });
  return data;
};

export const fetchCartProducts = async (
  ids: number[]
): Promise<ProductInfo[]> => {
  if (!ids.length) return [];
  const { data } = await wcClient.get<ProductInfo[]>("/products", {
    params: {
      include: ids.join(","),
      per_page: ids.length,
    },
  });
  return data;
};

export const fetchProductById = async (id: number): Promise<ProductInfo> => {
  const { data } = await wcClient.get<ProductInfo>(`/products/${id}`);
  return data;
};

export const fetchProductVariations = async (
  id: number
): Promise<ProductInfo[]> => {
  const { data } = await wcClient.get<ProductInfo[]>(
    `/products/${id}/variations`
  );
  return data;
};

export const fetchVariationById = async ({
  productId,
  variationId,
}: {
  productId: number;
  variationId: number;
}): Promise<ProductInfo> => {
  const { data } = await wcClient.get<ProductInfo>(
    `/products/${productId}/variations/${variationId}`
  );
  return data;
};

export const fetchReviews = async (): Promise<ProductReview[]> => {
  const { data } = await wcClient.get<ProductReview[]>("/products/reviews", {
    params: { per_page: 100 },
  });
  return data;
};

export const addReview = async (
  formData: FormData
): Promise<{ message: string }> => {
  const { data } = await wpClient.post<{ message: string }>(
    "/add-review",
    formData,
    {
      headers: {},
    }
  );
  return data;
};
