"use client";

import { ReactNode, useCallback, useState, useEffect, Suspense } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import "@/utils/i18n";

const MenuPopup = dynamic(() => import("@/components/MenuPopup/MenuPopup"));
// const SearchPopup = dynamic(
//   () => import("@/components/SearchPopup/SearchPopup")
// );
const WishListPopup = dynamic(
  () => import("@/components/WishListPopup/WishListPopup")
);

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <InnerProviders>{children}</InnerProviders>;
}

function InnerProviders({ children }: { children: ReactNode }) {
  const [wishOpen, setWishOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openRegister = useCallback(() => {}, []);

  useEffect(() => {
    document.body.style.overflow =
      wishOpen || menuOpen || searchOpen ? "hidden" : "visible";
  }, [wishOpen, menuOpen, searchOpen]);

  return (
    <>
      <Header
        // openCart={() => {}}
        openRegister={openRegister}
        openWishList={() => setWishOpen(true)}
        openSearch={() => {
          setSearchOpen(true);
        }}
      />

      {children}

      <AnimatePresence>
        <Suspense fallback={null}>
          {wishOpen && <WishListPopup onClose={() => setWishOpen(false)} />}
          {menuOpen && (
            <MenuPopup
              openPopup={openRegister}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </Suspense>
      </AnimatePresence>

      <Link href="#Акції"></Link>
      <Link href="#Новинки"></Link>
      <Link href="#Бренди"></Link>
      <Link href="#Обличчя"></Link>
      <Link href="#Волосся"></Link>
      <Link href="#Тіло"></Link>
      <Link href="#Декоративна косметика"></Link>
      <Footer />
    </>
  );
}
