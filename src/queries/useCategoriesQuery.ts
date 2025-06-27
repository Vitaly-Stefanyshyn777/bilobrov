import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";
import { useProductFilterStore } from "@/store/filter/useProductFilterStore";
import { useEffect } from "react";

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  yoast_head_json?: {
    og_url?: string;
  };
}

export const useCategoriesQuery = () => {
  const setAllCategories = useProductFilterStore((s) => s.setAllCategories);

  const query = useQuery<ProductCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<ProductCategory[]>(
        `${API_URL_WC}products/categories?per_page=100`,
        {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setAllCategories(query.data);
    }
  }, [query.data, setAllCategories]);

  return query;
};
