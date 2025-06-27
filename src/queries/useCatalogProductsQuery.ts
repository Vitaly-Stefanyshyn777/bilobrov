import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";
import { useProductFilterStore } from "@/store/filter/useProductFilterStore";


export const useProductsQuery = () => {
  const {
    sort,
    selectedCategories,
    selectedBrands,
    onSale,
    inStock,
    minPrice,
    maxPrice,
    selectedAttributes,
    attributes,
    page,
    searchQuery,
  } = useProductFilterStore();

  return useQuery({
    queryKey: [
      "products",
      sort,
      selectedCategories,
      selectedBrands,
      onSale,
      inStock,
      minPrice,
      maxPrice,
      selectedAttributes,
      attributes,
      page,
      searchQuery,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        per_page: "20",
        page: page.toString(),
      });

      if (searchQuery.trim() !== "") {
        params.set("search", searchQuery);
      }

      const attrEntries = Object.entries(selectedAttributes).filter(
        ([, values]) => values.length > 0
      );

      attrEntries.forEach(([slug, selectedIds]) => {
        const matchedAttribute = attributes.find(
          (attr: (typeof attributes)[number] | undefined) =>
            attr && attr.slug === slug
        );

        if (matchedAttribute) {
          const validIds = matchedAttribute.options
            .filter(
              (opt: { id: number; name: string; slug: string } | undefined) =>
                opt && selectedIds.includes(opt.id.toString())
            )
            .map((opt) => opt.id)
            .join(",");

          if (validIds) {
            params.append("attribute", `pa_${slug}`);
            params.append("attribute_term", validIds);
          }
        }
      });

      if (sort === "price_asc") {
        params.set("orderby", "price");
        params.set("order", "asc");
      } else if (sort === "price_desc") {
        params.set("orderby", "price");
        params.set("order", "desc");
      } else if (["date", "popularity", "rating"].includes(sort)) {
        params.set("orderby", sort);
        params.set("order", "desc");
      }

      if (selectedCategories.length > 0) {
        params.set("category", selectedCategories.join(","));
      }

      if (selectedBrands.length > 0) {
        params.set("brand", selectedBrands.join(","));
      }

      if (onSale) {
        params.set("on_sale", "true");
      }

      if (inStock) {
        params.set("stock_status", "instock");
      }

      params.set("min_price", minPrice.toString());
      params.set("max_price", maxPrice.toString());

      const url = `${API_URL_WC}products?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
        },
      });

      const totalCount = parseInt(response.headers["x-wp-total"]);
      const totalPages = parseInt(response.headers["x-wp-totalpages"]);

      return {
        products: response.data,
        totalCount,
        totalPages,
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 хвилина кешування
  });
};
