import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SortOption } from "@/store/filter/useProductFilterStore";

export interface CatalogQueryParams {
  minPrice: number;
  maxPrice: number;
  onSale: boolean;
  inStock: boolean;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedAttributes: Record<string, string[]>;
  sort: SortOption;
  page: number;
}

export const useCatalogQueryParams = (): CatalogQueryParams => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const query = new URLSearchParams(searchParams.toString());

    const minPrice = Number(query.get("min")) || 0;
    const maxPrice = Number(query.get("max")) || 10000;
    const onSale = query.get("sale") === "true";
    const inStock = query.get("stock") === "true";
    const selectedCategories =
      query.get("categories")?.split(",").filter(Boolean) || [];
    const selectedBrands =
      query.get("brand")?.split(",").filter(Boolean) ||
      query.get("brands")?.split(",").filter(Boolean) ||
      [];
    const sort = (query.get("sort") || "popularity") as SortOption;
    const page = Number(query.get("page")) || 1;

    // Парсимо атрибути
    const selectedAttributes: Record<string, string[]> = {};
    query.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        const id = key.replace("attr_", "");
        selectedAttributes[id] = value.split(",").filter(Boolean);
      }
    });

    const result = {
      minPrice,
      maxPrice,
      onSale,
      inStock,
      selectedCategories,
      selectedBrands,
      selectedAttributes,
      sort,
      page,
    };

    console.log("🔍 useCatalogQueryParams result:", result);
    console.log("🔍 Raw search params:", searchParams.toString());

    return result;
  }, [searchParams]);
};
