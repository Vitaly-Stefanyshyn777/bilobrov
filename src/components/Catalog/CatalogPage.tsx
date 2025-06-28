"use client";
import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useProductsQuery } from "@/queries/useCatalogProductsQuery";
import { useAttributesQuery } from "@/queries/useAttributesQuery";
import { useBrandsQuery } from "@/queries/useBrandsQuery";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";

import s from "./CatalogPage.module.css";

import { Breadcrumbs } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useProductFilterStore } from "@/store/filter/useProductFilterStore";
import { ProductItem } from "@/components/ProductItem/ProductItem";
import { FiltersWithSuspense } from "@/components/FilterPopup/FilterPopup";
import { Layout } from "@/components/Layout/Layout";
import { CustomSortDropdown } from "@/components/DropDown/DropDown";
import { CategoryShort } from "@/types/categoryShortType";
import { Pagination } from "@/components/Pagination/Pagination";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Loader } from "@/components/Loader/Loader";
import { usePageData } from "@/hooks/usePageData";
import { API_URL } from "@/constants/api";
import type { Brand, ProductInfo } from "@/types/productTypes";
import { useCatalogQueryParams } from "@/hooks/useCatalogQueryParams";

interface CatalogPageProps {
  variant?: "general" | "category" | "subcategory";
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  variant = "general",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsRef = useRef<HTMLUListElement | null>(null);
  const { t } = useTranslation();

  const slug = params.slug as string;
  const childSlug = params.childSlug as string;

  // Використовуємо хук для роботи з query параметрами
  const {
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
    sort: urlSort,
    selectedCategories: urlCategories,
    selectedBrands: urlBrands,
    selectedAttributes: urlAttributes,
    onSale: urlOnSale,
    inStock: urlInStock,
    page: urlPage,
  } = useCatalogQueryParams();

  const {
    sort,
    selectedCategories,
    selectedBrands,
    setSort,
    setSelectedCategories,
    setSelectedBrands,
    setMinPrice,
    setMaxPrice,
    setInStock,
    setOnSale,
    setPage,
    page,
    allCategories,
    minPrice,
    maxPrice,
    onSale,
    inStock,
    selectedAttributes,
    setSelectedAttributes,
    setAllBrands,
    setAllCategories,
    setBrands,
    setAttributes,
  } = useProductFilterStore();

  const { data, isLoading } = useProductsQuery();
  const products: ProductInfo[] = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 20);
  const { data: brandData } = useBrandsQuery();

  const brands = useMemo(() => {
    return Array.isArray(brandData) ? brandData : brandData?.items || [];
  }, [brandData]);

  const { width } = useWindowSize();
  const isMobile = width < 1024;

  // Знаходимо категорії залежно від варіанту
  const category = useMemo(() => {
    if (variant === "general") return null;
    return allCategories.find(
      (cat: CategoryShort | undefined) => cat && cat.slug === slug
    );
  }, [allCategories, slug, variant]);

  const childCategory = useMemo(() => {
    if (variant !== "subcategory") return null;
    return allCategories.find(
      (cat: CategoryShort | undefined) => cat && cat.slug === childSlug
    );
  }, [allCategories, childSlug, variant]);

  const parentCategory = useMemo(() => {
    if (childCategory) {
      return allCategories.find(
        (c: CategoryShort | undefined) => c && c.id === childCategory.parent
      );
    }
    return category;
  }, [allCategories, childCategory, category]);

  const childCategories = useMemo(() => {
    if (!parentCategory) return [];
    return allCategories.filter(
      (cat: CategoryShort | undefined) =>
        cat && cat.parent === parentCategory.id
    );
  }, [parentCategory, allCategories]);

  // Синхронізуємо стан з URL параметрами
  useEffect(() => {
    if (minPrice !== urlMinPrice) setMinPrice(urlMinPrice);
    if (maxPrice !== urlMaxPrice) setMaxPrice(urlMaxPrice);
    if (onSale !== urlOnSale) setOnSale(urlOnSale);
    if (inStock !== urlInStock) setInStock(urlInStock);
    if (page !== urlPage) setPage(urlPage);
    if (sort !== urlSort) setSort(urlSort);

    if (
      selectedCategories.length !== urlCategories.length ||
      !selectedCategories.every((val, idx) => val === urlCategories[idx])
    ) {
      setSelectedCategories(urlCategories);
    }

    if (
      selectedBrands.length !== urlBrands.length ||
      !selectedBrands.every((val, idx) => val === urlBrands[idx])
    ) {
      setSelectedBrands(urlBrands);
    }

    if (
      Object.keys(selectedAttributes).length !==
        Object.keys(urlAttributes).length ||
      Object.entries(urlAttributes).some(
        ([key, arr]) =>
          !selectedAttributes[key] ||
          selectedAttributes[key].length !== arr.length ||
          !arr.every((v, i) => selectedAttributes[key][i] === v)
      )
    ) {
      setSelectedAttributes(urlAttributes);
    }
  }, [
    urlMinPrice,
    urlMaxPrice,
    urlOnSale,
    urlInStock,
    urlPage,
    urlSort,
    urlCategories,
    urlBrands,
    urlAttributes,
    minPrice,
    maxPrice,
    onSale,
    inStock,
    page,
    sort,
    selectedCategories,
    selectedBrands,
    selectedAttributes,
    setMinPrice,
    setMaxPrice,
    setOnSale,
    setInStock,
    setPage,
    setSort,
    setSelectedCategories,
    setSelectedBrands,
    setSelectedAttributes,
  ]);

  useAttributesQuery();

  // Ініціалізація категорій залежно від варіанту
  useEffect(() => {
    if (allCategories.length === 0) return;

    if (variant === "category" && category) {
      setSelectedCategories([category.id.toString()]);
    } else if (variant === "subcategory" && childCategory) {
      setSelectedCategories([childCategory.id.toString()]);
    }
  }, [allCategories, category, childCategory, variant, setSelectedCategories]);

  // Спеціальна логіка для sales та news
  useEffect(() => {
    if (slug === "sales") {
      setOnSale(true);
      setSelectedCategories([]);
    } else if (slug === "news") {
      setSort("date");
      setSelectedCategories([]);
    }
  }, [slug, setOnSale, setSort, setSelectedCategories]);

  const pageTitle = useMemo(() => {
    if (slug === "sales") return t("sales");
    if (slug === "news") return "Новинки";
    if (variant === "subcategory" && childCategory) return childCategory.name;
    if (variant === "category" && category) return category.name;

    const brandId = urlCategories.find((id: string) => id !== "all");
    if (brandId) {
      const brand = brands.find((b: Brand) => b.id.toString() === brandId);
      if (brand) return brand.name;
    }
    return t("all");
  }, [slug, variant, category, childCategory, urlCategories, brands, t]);

  const breadcrumbs = useMemo(() => {
    const list = [{ name: t("breadCrumbs.main"), link: "/" }];

    if (variant === "general") {
      if (pathname === "/catalog") {
        list.push({ name: "Каталог", link: "/catalog" });
      }
    } else if (slug === "sales") {
      list.push({ name: t("sales"), link: "/catalog/sales" });
    } else if (slug === "news") {
      list.push({ name: "Новинки", link: "/catalog/news" });
    } else if (category) {
      list.push({ name: "Каталог", link: "/catalog" });
      list.push({ name: category.name, link: `/catalog/${category.slug}` });

      if (variant === "subcategory" && childCategory) {
        list.push({
          name: childCategory.name,
          link: `/catalog/${category.slug}/${childCategory.slug}`,
        });
      }
    }

    return list;
  }, [variant, slug, category, childCategory, pathname, t]);

  const seoUrl = useMemo(() => {
    if (slug === "sales") return `${API_URL}/product-category/sales`;
    if (slug === "news") return `${API_URL}/product-category/news`;
    if (variant === "subcategory" && category && childCategory) {
      return `${API_URL}/product-category/${category.slug}/${childCategory.slug}`;
    }
    if (variant === "category" && category) {
      return `${API_URL}/product-category/${category.slug}`;
    }
    return `${API_URL}/product-category`;
  }, [slug, variant, category, childCategory]);

  const seoData = usePageData(seoUrl);

  // Завантаження даних
  useEffect(() => {
    if (brands && brands.length > 0) {
      setAllBrands(brands);
    }
  }, [brands, setAllBrands]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL_WC}products/categories?per_page=100`,
        {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          },
        }
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (categoriesData) setAllCategories(categoriesData);
  }, [categoriesData, setAllCategories]);

  const { data: brandsData } = useBrandsQuery();
  useEffect(() => {
    if (brandsData?.items) setBrands(brandsData.items);
  }, [brandsData, setBrands]);

  const { data: attributesData } = useAttributesQuery();
  useEffect(() => {
    if (attributesData) setAttributes(attributesData);
  }, [attributesData, setAttributes]);

  return (
    <Suspense fallback={null}>
      <main className={s.page}>
        <Head>
          <title>{seoData.title || `${pageTitle} - Bilobrov`}</title>
          <link rel="canonical" href={seoData.canonical || pathname} />
          {seoData.og_title && (
            <meta property="og:title" content={seoData.og_title} />
          )}
          {seoData.og_description && (
            <meta property="og:description" content={seoData.og_description} />
          )}
          {seoData.og_url && (
            <meta property="og:url" content={seoData.og_url} />
          )}
          {seoData.og_locale && (
            <meta property="og:locale" content={seoData.og_locale} />
          )}
          {seoData.og_type && (
            <meta property="og:type" content={seoData.og_type} />
          )}
          {seoData.og_site_name && (
            <meta property="og:site_name" content={seoData.og_site_name} />
          )}
          {seoData.twitter_card && (
            <meta name="twitter:card" content={seoData.twitter_card} />
          )}
          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
        </Head>

        <Layout>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
            {breadcrumbs.map((breadcrumb, index) => (
              <Link key={index} href={breadcrumb.link}>
                {breadcrumb.name}
              </Link>
            ))}
          </Breadcrumbs>
        </Layout>

        <Layout>
          <AnimatePresence>
            {isFilterOpen && (
              <FiltersWithSuspense onClose={() => setIsFilterOpen(false)} />
            )}
          </AnimatePresence>

          <div className={s.categoryHeader}>
            <h1>{pageTitle}</h1>
            <span>
              {totalCount} {t("catalog.productsLength")}
            </span>
          </div>
        </Layout>

        {/* Підкатегорії для категорій */}
        {variant === "category" && childCategories.length > 0 && (
          <>
            {isMobile ? (
              <div className={s.childCategories}>
                <ul className={s.scroller}>
                  {childCategories.map((cat: CategoryShort) => (
                    <li
                      key={cat.id}
                      className={
                        selectedCategories.includes(cat.id.toString())
                          ? s.active
                          : ""
                      }
                      onClick={() => {
                        const currentParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        currentParams.set("categories", cat.id.toString());
                        router.push(
                          `/catalog/${category?.slug}/${
                            cat.slug
                          }?${currentParams.toString()}`
                        );
                      }}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Layout>
                <div className={s.childCategories}>
                  <ul>
                    {childCategories.map((cat: CategoryShort) => (
                      <li
                        key={cat.id}
                        className={
                          selectedCategories.includes(cat.id.toString())
                            ? s.active
                            : ""
                        }
                        onClick={() => {
                          const currentParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          currentParams.set("categories", cat.id.toString());
                          router.push(
                            `/catalog/${category?.slug}/${
                              cat.slug
                            }?${currentParams.toString()}`
                          );
                        }}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Layout>
            )}
          </>
        )}

        <Layout>
          <div className={s.filterController}>
            <button onClick={() => setIsFilterOpen(true)}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M3 6H21M9 18H15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("catalog.filters")}
            </button>
            <div className={s.sort}>
              <CustomSortDropdown sort={sort} />
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <ul ref={productsRef} className={s.list}>
              {products
                .filter((product) => product && product.slug && product.id)
                .map((product) => (
                  <ProductItem key={product.id} info={product} />
                ))}
            </ul>
          )}

          {!isLoading && totalCount > 20 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => {
                setPage(newPage);
                const catalogTop = document.querySelector(`body`);
                catalogTop?.scrollIntoView({
                  block: "start",
                });
              }}
            />
          )}
        </Layout>
      </main>
    </Suspense>
  );
};
