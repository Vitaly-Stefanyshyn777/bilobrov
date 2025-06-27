import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { usePathname, useSearchParams } from "next/navigation";
import { useProductFilterStore } from "@/store/filter/useProductFilterStore";
import { ProductInfo } from "@/types/productTypes";

const fetchProducts = async (queryParams: URLSearchParams) => {
  const response = await axiosInstance.get(
    `/products?${queryParams.toString()}`
  );
  return {
    products: response.data as ProductInfo[],
    totalCount: parseInt(response.headers["x-wp-total"] || "0", 10),
    totalPages: parseInt(response.headers["x-wp-totalpages"] || "0", 10),
  };
};

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
    page,
    searchQuery,
  } = useProductFilterStore();

  const pathname = usePathname();
  const searchParamsNav = useSearchParams();
  const pathKey = `${pathname}?${searchParamsNav.toString()}`;

  const queryParams = new URLSearchParams({
    per_page: "20",
    page: page.toString(),
  });

  if (searchQuery.trim() !== "") {
    queryParams.set("search", searchQuery.trim());
  }

  Object.entries(selectedAttributes).forEach(([slug, ids]) => {
    if (ids.length > 0) {
      queryParams.append("attribute", `pa_${slug}`);
      queryParams.append("attribute_term", ids.join(","));
    }
  });

  if (sort === "price_asc") {
    queryParams.set("orderby", "price");
    queryParams.set("order", "asc");
  } else if (sort === "price_desc") {
    queryParams.set("orderby", "price");
    queryParams.set("order", "desc");
  } else if (["date", "popularity", "rating"].includes(sort)) {
    queryParams.set("orderby", sort);
    queryParams.set("order", "desc");
  }

  if (selectedCategories.length > 0) {
    queryParams.set("category", selectedCategories.join(","));
  }
  if (selectedBrands.length > 0) {
    queryParams.set("brand", selectedBrands.join(","));
  }

  if (onSale) queryParams.set("on_sale", "true");
  if (inStock) queryParams.set("stock_status", "instock");

  queryParams.set("min_price", minPrice.toString());
  queryParams.set("max_price", maxPrice.toString());

  return useQuery({
    queryKey: [
      "products",
      pathKey,
      sort,
      selectedCategories,
      selectedBrands,
      onSale,
      inStock,
      minPrice,
      maxPrice,
      selectedAttributes,
      page,
      searchQuery,
    ],
    queryFn: () => fetchProducts(queryParams),
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};
