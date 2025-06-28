"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Filters } from "@/components/FilterPopup/FilterPopup";
import { Layout } from "@/components/Layout/Layout";
import { CustomSortDropdown } from "@/components/DropDown/DropDown";
import { CategoryShort } from "@/types/categoryShortType";
import { Pagination } from "@/components/Pagination/Pagination";
import { Loader } from "@/components/Loader/Loader";
import { usePageData } from "@/hooks/usePageData";
import { API_URL } from "@/constants/api";
import type { ProductInfo } from "@/types/productTypes";
import { useCatalogQueryParams } from "@/hooks/useCatalogQueryParams";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsRef = useRef<HTMLUListElement | null>(null);
  const { t } = useTranslation();

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

  const { slug, parentSlug, childSlug } = useParams<{
    slug?: string;
    parentSlug?: string;
    childSlug?: string;
  }>();

  const activeSlug = childSlug || parentSlug || slug;

  const childCategory = useMemo(() => {
    return allCategories.find(
      (cat: CategoryShort | undefined) =>
        cat && cat.slug === activeSlug && cat.parent !== 0
    );
  }, [allCategories, activeSlug]);

  const parentCategory = useMemo(() => {
    if (childCategory) {
      return allCategories.find(
        (c: CategoryShort | undefined) => c && c.id === childCategory.parent
      );
    }
    return allCategories.find(
      (cat: CategoryShort | undefined) =>
        cat && cat.slug === activeSlug && cat.parent === 0
    );
  }, [allCategories, childCategory, activeSlug]);

  const childCategories = useMemo(() => {
    if (!parentCategory) return [];
    return allCategories.filter(
      (cat: CategoryShort | undefined) =>
        cat && cat.parent === parentCategory.id
    );
  }, [parentCategory, allCategories]);

  const onTabClick = (categoryId: number, categorySlug: string) => {
    const clickedCategory = allCategories.find(
      (cat: CategoryShort) => cat.id === categoryId
    );
    let fullSlugPath = `/catalog/${categorySlug}`;

    if (clickedCategory?.parent) {
      const parentCat = allCategories.find(
        (cat: CategoryShort) => cat.id === clickedCategory.parent
      );
      if (parentCat) {
        fullSlugPath = `/catalog/${parentCat.slug}/${clickedCategory.slug}`;
      }
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("categories", categoryId.toString());

    router.push(`${fullSlugPath}?${currentParams.toString()}`);
  };

  // Синхронізуємо стан з URL параметрами
  useEffect(() => {
    if (minPrice !== urlMinPrice) setMinPrice(urlMinPrice);
    if (maxPrice !== urlMaxPrice) setMaxPrice(urlMaxPrice);
    if (onSale !== urlOnSale) setOnSale(urlOnSale);
    if (inStock !== urlInStock) setInStock(urlInStock);
    if (sort !== urlSort) setSort(urlSort);
    if (page !== urlPage) setPage(urlPage);
    if (
      selectedCategories.length !== urlCategories.length ||
      !selectedCategories.every((v, i) => v === urlCategories[i])
    ) {
      setSelectedCategories(urlCategories);
    }
    if (
      selectedBrands.length !== urlBrands.length ||
      !selectedBrands.every((v, i) => v === urlBrands[i])
    ) {
      setSelectedBrands(urlBrands);
    }
    const attrKeys = Object.keys(urlAttributes);
    const stateAttrKeys = Object.keys(selectedAttributes);
    const attributesChanged =
      attrKeys.length !== stateAttrKeys.length ||
      attrKeys.some(
        (key) =>
          !selectedAttributes[key] ||
          selectedAttributes[key].length !== urlAttributes[key].length ||
          !urlAttributes[key].every((v, i) => selectedAttributes[key][i] === v)
      );
    if (attributesChanged) {
      setSelectedAttributes(urlAttributes);
    }
  }, [
    urlMinPrice,
    urlMaxPrice,
    urlOnSale,
    urlInStock,
    urlSort,
    urlPage,
    urlCategories,
    urlBrands,
    urlAttributes,
    minPrice,
    maxPrice,
    onSale,
    inStock,
    sort,
    page,
    selectedCategories,
    selectedBrands,
    selectedAttributes,
    setMinPrice,
    setMaxPrice,
    setOnSale,
    setInStock,
    setSort,
    setPage,
    setSelectedCategories,
    setSelectedBrands,
    setSelectedAttributes,
  ]);

  useAttributesQuery();

  // Ініціалізація категорій з URL slug (тільки якщо немає categories в URL)
  useEffect(() => {
    if (allCategories.length === 0) return;

    const categoriesFromQuery = searchParams.get("categories");
    const slugs = [childSlug || parentSlug || slug].filter(Boolean);

    // Якщо немає categories в URL, але є slug - встановлюємо категорію з slug
    if (!categoriesFromQuery && slugs.length > 0) {
      const matchedCategories = slugs
        .map((s: string | undefined) =>
          allCategories.find(
            (c: CategoryShort | undefined) => c && c.slug === s
          )
        )
        .filter((c): c is CategoryShort => c !== undefined);

      if (matchedCategories.length) {
        setSelectedCategories(
          matchedCategories.map((c: CategoryShort) => c.id.toString())
        );
      }
    }
  }, [slug, parentSlug, childSlug, allCategories, searchParams.toString()]);

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

    const brandId = searchParams.get("brand");

    if (brandId) {
      const brand = brands.find(
        (b: { id: number; name: string }) => b.id.toString() === brandId
      );
      if (brand) return brand.name;
    }

    if (selectedCategories.length !== 1) {
      return t("all");
    }

    const selectedCategory = allCategories.find(
      (cat: CategoryShort | undefined) =>
        cat && cat.id.toString() === selectedCategories[0]
    );

    if (!selectedCategory) return t("all");

    if (selectedCategory.parent !== 0) {
      const parent = allCategories.find(
        (cat: CategoryShort | undefined) =>
          cat && cat.id === selectedCategory.parent
      );
      return parent?.name || t("all");
    }

    return selectedCategory.name;
  }, [slug, selectedCategories, allCategories, searchParams]);

  const breadcrumbs = useMemo(() => {
    const list = [{ name: t("breadCrumbs.main"), link: "/" }];

    if (!slug) {
      list.push({ name: "Каталог", link: "/catalog" });
    } else if (slug === "sales") {
      list.push({ name: t("sales"), link: "/catalog/sales" });
    } else if (slug === "news") {
      list.push({ name: "Новинки", link: "/catalog/news" });
    } else if (parentCategory) {
      list.push({
        name: parentCategory.name,
        link: `/catalog/${parentCategory.slug}`,
      });

      if (childCategory) {
        list.push({
          name: childCategory.name,
          link: `/catalog/${parentCategory.slug}/${childCategory.slug}`,
        });
      }
    }

    return list;
  }, [slug, parentCategory, childCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(`.${s.scroller}`);
      const scrollbar = document.querySelector(
        `.${s.scrollbar}`
      ) as HTMLElement;

      if (container && scrollbar) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const rawProgress =
          maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;
        const scrollProgress = Math.max(rawProgress, 15);
        scrollbar.style.width = `${scrollProgress}%`;
      }
    };

    const container = document.querySelector(`.${s.scroller}`);
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [childCategories, selectedCategories]);

  let metaUrl: string | undefined;

  if (!metaUrl) {
    if (slug === "news") {
      metaUrl = `${API_URL}/product-category/news`;
    } else if (slug === "sales") {
      metaUrl = `${API_URL}/product-category/sales`;
    } else if (parentSlug && childSlug) {
      metaUrl = `${API_URL}/product-category/${parentSlug}/${childSlug}`;
    } else if (parentSlug) {
      metaUrl = `${API_URL}/product-category/${parentSlug}`;
    } else if (slug) {
      metaUrl = `${API_URL}/product-category/${slug}`;
    } else {
      metaUrl = `${API_URL}/product-category`;
    }
  }

  const seoData = usePageData(metaUrl);

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
    console.log(categoriesData);
  }, [categoriesData, setAllCategories]);

  const { data: brandsData } = useBrandsQuery();
  useEffect(() => {
    if (brandsData?.items) setBrands(brandsData.items);
  }, [brandsData, setBrands]);

  const { data: attributesData } = useAttributesQuery();
  useEffect(() => {
    if (attributesData) setAttributes(attributesData);
  }, [attributesData, setAttributes]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", newPage.toString());
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={seoData?.og_description || ""} />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={seoData?.og_description || ""}
        />
        <meta property="og:url" content={metaUrl} />
        <link rel="canonical" href={metaUrl} />
      </Head>

      <Layout>
        <div className={s.container}>
          <div className={s.breadcrumbsContainer}>
            <Breadcrumbs aria-label="breadcrumb">
              {breadcrumbs.map((item, index) => (
                <Link key={index} href={item.link} className={s.breadcrumbLink}>
                  {item.name}
                </Link>
              ))}
            </Breadcrumbs>
          </div>

          <div className={s.header}>
            <h1 className={s.title}>{pageTitle}</h1>
            <div className={s.controls}>
              <button
                onClick={() => setIsFilterOpen(true)}
                className={s.filterButton}
              >
                {t("catalog.filter")}
              </button>
              <CustomSortDropdown sort={sort} />
            </div>
          </div>

          {parentCategory && childCategories.length > 0 && (
            <div className={s.categoriesContainer}>
              <div className={s.scroller}>
                <div className={s.categoriesList}>
                  {childCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onTabClick(category.id, category.slug)}
                      className={`${s.categoryTab} ${
                        selectedCategories.includes(category.id.toString())
                          ? s.active
                          : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                <div className={s.scrollbar}></div>
              </div>
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            <>
              <ul ref={productsRef} className={s.productsList}>
                <AnimatePresence>
                  {products.map((product) => (
                    <ProductItem key={product.id} info={product} />
                  ))}
                </AnimatePresence>
              </ul>

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          <AnimatePresence>
            {isFilterOpen && <Filters onClose={() => setIsFilterOpen(false)} />}
          </AnimatePresence>
        </div>
      </Layout>
    </>
  );
}
