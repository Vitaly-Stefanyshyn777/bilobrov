"use client";

import { ReactNode, useCallback, useState, useEffect, Suspense } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

const RegisterPopup = dynamic(
  () => import("@/components/RegisterPopup/Register")
);
const WishListPopup = dynamic(
  () => import("@/components/WishListPopup/WishListPopup")
);

const MenuPopup = dynamic(() => import("@/components/MenuPopup/MenuPopup"));
const SearchPopup = dynamic(
  () => import("@/components/SearchPopup/SearchPopup")
);

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <InnerProviders>{children}</InnerProviders>;
}

function InnerProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [wishOpen, setWishOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const openRegister = useCallback(() => {}, []);

  useEffect(() => {
    document.body.style.overflow =
      wishOpen || menuOpen || searchOpen ? "hidden" : "visible";
  }, [wishOpen, menuOpen, searchOpen]);

  return (
    <>
      <Header
        openCart={() => {}}
        openRegister={openRegister}
        openWishList={() => setWishOpen(true)}
        openMenu={() => setMenuOpen(true)}
        openSearch={() => {
          setSearchOpen(true);
        }}
      />

      {children}

      <AnimatePresence>
        <Suspense fallback={null}>
          {wishOpen && <WishListPopup onClose={() => setWishOpen(false)} />}
          {searchOpen && <SearchPopup close={() => setSearchOpen(false)} />}
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
