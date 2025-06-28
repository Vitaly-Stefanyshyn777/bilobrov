import { ProductReview } from "@/types/productTypes";
import { create } from "zustand";

export interface ProductStore {
  currentProductId: number | null;
  resetCurrent: () => void;

  reviews: ProductReview[];
  setReviews: (reviews: ProductReview[]) => void;

  reviewMessage: string | null;
  reviewError: string | null;
  setReviewMessage: (msg: string | null) => void;
  setReviewError: (err: string | null) => void;
}

export const useProductStore = create<ProductStore>((set: (state: Partial<ProductStore>) => void) => ({
  currentProductId: null,
  resetCurrent: () => set({ currentProductId: null }),

  reviews: [],
  setReviews: (reviews: ProductReview[]) => set({ reviews }),

  reviewMessage: null,
  reviewError: null,
  setReviewMessage: (msg: string | null) => set({ reviewMessage: msg }),
  setReviewError: (err: string | null) => set({ reviewError: err }),
}));
