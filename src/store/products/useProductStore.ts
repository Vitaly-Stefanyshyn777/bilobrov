import { ProductReview } from "@/types/productTypes";
import { create } from "zustand";

interface ProductStore {
  currentProductId: number | null;
  resetCurrent: () => void;

  reviews: ProductReview[];
  setReviews: (reviews: ProductReview[]) => void;

  reviewMessage: string | null;
  reviewError: string | null;
  setReviewMessage: (msg: string | null) => void;
  setReviewError: (err: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  currentProductId: null,
  resetCurrent: () => set({ currentProductId: null }),

  reviews: [],
  setReviews: (reviews) => set({ reviews }),

  reviewMessage: null,
  reviewError: null,
  setReviewMessage: (msg) => set({ reviewMessage: msg }),
  setReviewError: (err) => set({ reviewError: err }),
}));
