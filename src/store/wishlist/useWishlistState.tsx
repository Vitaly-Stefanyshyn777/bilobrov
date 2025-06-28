import { create } from "zustand";

export interface WishlistState {
  preferences: number[];
  toggleWishlistItem: (id: number) => void;
  setWishlist: (ids: number[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>(
  (set: (state: Partial<WishlistState>) => void, get: () => WishlistState) => ({
    preferences:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("wishlist") || "[]")
        : [],

    toggleWishlistItem: (id: number) => {
      const current = get().preferences;
      const updated = current.includes(id)
        ? current.filter((item: number) => item !== id)
        : [...current, id];

      localStorage.setItem("wishlist", JSON.stringify(updated));
      set({ preferences: updated });
    },

    setWishlist: (ids: number[]) => {
      localStorage.setItem("wishlist", JSON.stringify(ids));
      set({ preferences: ids });
    },

    clearWishlist: () => {
      localStorage.removeItem("wishlist");
      set({ preferences: [] });
    },
  })
);
