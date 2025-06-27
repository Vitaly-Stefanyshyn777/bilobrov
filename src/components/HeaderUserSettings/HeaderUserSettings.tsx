// потрібно
import s from "./HeaderUserSettings.module.css";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist/useWishlistState";

interface HeaderProps {
  openRegister: React.Dispatch<React.SetStateAction<boolean>>;
  openWishList: React.Dispatch<React.SetStateAction<boolean>>;
  openCart: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

export const HeaderUserSettings: React.FC<HeaderProps> = ({
  openRegister,
  openWishList,
  openCart,
  isMobile,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlist = useWishlistStore((state) => state.preferences);

  if (!mounted) return null;

  return (
    <div className={s.userSettings}>
      {!isMobile && (
        <button onClick={() => openRegister(true)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.3163 19.4384C5.92462 18.0052 7.34492 17 9 17H15C16.6551 17 18.0754 18.0052 18.6837 19.4384M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <button
        className={!wishlist.length ? s.disabled : ""}
        onClick={() => openWishList(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.1111 3C19.6333 3 22 6.3525 22 9.48C22 15.8138 12.1778 21 12 21C11.8222 21 2 15.8138 2 9.48C2 6.3525 4.36667 3 7.88889 3C9.91111 3 11.2333 4.02375 12 4.92375C12.7667 4.02375 14.0889 3 16.1111 3Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {wishlist?.length > 0 && (
          <span className={s.qty}>{wishlist?.length}</span>
        )}
      </button>

      <button className={s.cartBtn} title="Кошик (заглушка)" disabled>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5 17H17.33C18.28 17 18.75 17 19.14 16.83C19.48 16.68 19.77 16.43 19.98 16.12C20.22 15.77 20.31 15.31 20.48 14.37L21.83 6.94C21.89 6.62 21.92 6.46 21.87 6.33C21.83 6.22 21.75 6.13 21.65 6.07C21.54 6 21.37 6 21.04 6H5M2 2H3.32C3.56 2 3.68 2 3.78 2.04C3.87 2.08 3.94 2.15 3.99 2.23C4.05 2.32 4.07 2.44 4.11 2.68L6.89 20.32C6.93 20.56 6.95 20.68 7.01 20.77C7.06 20.85 7.13 20.92 7.22 20.96C7.32 21 7.44 21 7.68 21H19"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
