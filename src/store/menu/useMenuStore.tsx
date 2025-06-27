import { create } from "zustand";
import axios from "axios";
import { API_URL_WP } from "../../constants/api";

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  parent_id: string;
  svg: string;
  children?: MenuItem[];
}

interface Menu {
  id: number;
  name: string;
  slug: string;
  items: MenuItem[];
}

interface MenuState {
  asideTopMenu: Menu | null;
  asideBottomMenu: Menu | null;
  mainMenu: Menu | null;
  loading: boolean;
  error?: string | null;
  fetchMenus: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  asideTopMenu: null,
  asideBottomMenu: null,
  mainMenu: null,
  loading: false,
  error: null,
  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL_WP}menus`);
      const data: Menu[] = response.data;
      set({
        asideBottomMenu:
          data.find((menu) => menu.slug === "aside_bottom_menu") || null,
        asideTopMenu:
          data.find((menu) => menu.slug === "aside_top_menu") || null,
        mainMenu: data.find((menu) => menu.slug === "main_menu") || null,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити меню",
      });
    }
  },
}));
