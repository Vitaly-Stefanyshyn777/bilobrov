import { create } from "zustand";
import type { Brand } from "@/types/productTypes";

export type SortOption =
  | "popularity"
  | "date"
  | "price_asc"
  | "price_desc"
  | "rating";

interface ProductFilterStore {
  sort: SortOption;
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  onSale: boolean;
  inStock: boolean;
  minPrice: number;
  maxPrice: number;
  selectedAttributes: Record<string, string[]>;
  page: number;
  attributes: {
    id: number;
    name: string;
    slug: string;
    options: { id: number; name: string; slug: string }[];
  }[];
  allCategories: {
    id: number;
    name: string;
    slug: string;
    parent: number;
    yoast_head_json?: {
      og_url?: string;
    };
  }[];
  allBrands: Brand[];

  // Actions
  setSort: (value: SortOption) => void;
  setSearchQuery: (value: string) => void;
  setSelectedCategories: (value: string[]) => void;
  setSelectedBrands: (value: string[]) => void;
  setOnSale: (value: boolean) => void;
  setInStock: (value: boolean) => void;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setSelectedAttributes: (value: Record<string, string[]>) => void;
  setPage: (value: number) => void;
  incrementPage: () => void;
  resetFilters: () => void;
  setAttributes: (
    value: {
      id: number;
      name: string;
      slug: string;
      options: { id: number; name: string; slug: string }[];
    }[]
  ) => void;
  setAllCategories: (
    value: {
      id: number;
      name: string;
      slug: string;
      parent: number;
      yoast_head_json?: {
        og_url?: string;
      };
    }[]
  ) => void;
  setAllBrands: (brands: Brand[]) => void;
  setBrands: (value: Brand[]) => void;
}

export const useProductFilterStore = create<ProductFilterStore>((set) => ({
  sort: "popularity",
  searchQuery: "",
  selectedCategories: [],
  selectedBrands: [],
  onSale: false,
  inStock: false,
  minPrice: 0,
  maxPrice: 10000,
  selectedAttributes: {},
  page: 1,
  attributes: [],
  allCategories: [],
  allBrands: [],

  setSort: (value) => set({ sort: value }),

  setSearchQuery: (value) => set({ searchQuery: value }),
  setSelectedCategories: (value) => set({ selectedCategories: value }),
  setSelectedBrands: (value) => set({ selectedBrands: value }),
  setOnSale: (value) =>
    set((state) => (state.onSale !== value ? { onSale: value } : state)),
  setInStock: (value) =>
    set((state) => (state.inStock !== value ? { inStock: value } : state)),
  setMinPrice: (value) =>
    set((state) => (state.minPrice !== value ? { minPrice: value } : state)),
  setMaxPrice: (value) =>
    set((state) => (state.maxPrice !== value ? { maxPrice: value } : state)),
  setSelectedAttributes: (value) => set({ selectedAttributes: value }),
  setPage: (value) => set({ page: value }),
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
  setAttributes: (value) => set({ attributes: value }),
  setAllCategories: (value) => set({ allCategories: value }),
  setAllBrands: (brands) => set({ allBrands: brands }),
  setBrands: (value) => set({ allBrands: value }),

  resetFilters: () =>
    set({
      sort: "popularity",
      searchQuery: "",
      selectedCategories: [],
      selectedBrands: [],
      onSale: false,
      inStock: false,
      minPrice: 0,
      maxPrice: 10000,
      selectedAttributes: {},
      page: 1,
    }),
}));
export const getProductFilterStore = () => useProductFilterStore.getState();
