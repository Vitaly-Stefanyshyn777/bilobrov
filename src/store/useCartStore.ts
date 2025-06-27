import { create } from "zustand";

interface CartItem {
  id: number;
  variation_id: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => {
      const exists = state.items.some(
        (i) => i.id === item.id && i.variation_id === item.variation_id
      );
      if (exists) return state;
      return { ...state, items: [...state.items, item] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
}));
