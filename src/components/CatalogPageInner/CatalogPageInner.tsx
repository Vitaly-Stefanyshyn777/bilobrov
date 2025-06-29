"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useProductsQuery } from "@/queries/useCatalogProductsQuery";
import { useAttributesQuery } from "@/queries/useAttributesQuery";
import { useBrandsQuery } from "@/queries/useBrandsQuery";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";

import s from "./CatalogPageInner.module.css";

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
import type { ProductInfo } from "@/types/productTypes";
import { useCatalogQueryParams } from "@/hooks/useCatalogQueryParams";

function CatalogPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsRef = useRef<HTMLUListElement | null>(null);
  const { t } = useTranslation();

  const {
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
    onSale: urlOnSale,
    inStock: urlInStock,
    selectedCategories: urlCategories,
    selectedBrands: urlBrands,
    selectedAttributes: urlAttributes,
    sort: urlSort,
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
    console.log("🎯 onTabClick called with:", { categoryId, categorySlug });

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

    const newUrl = `${fullSlugPath}?${currentParams.toString()}`;
    console.log("🔄 Navigating to:", newUrl);

    router.push(newUrl);
  };

  useEffect(() => {
    console.log("🔄 Syncing state with URL params:");
    console.log("URL onSale:", urlOnSale, "State onSale:", onSale);
    console.log("URL inStock:", urlInStock, "State inStock:", inStock);
    console.log("URL categories:", urlCategories);
    console.log("State categories:", selectedCategories);

    if (minPrice !== urlMinPrice) {
      console.log("Setting minPrice:", urlMinPrice);
      setMinPrice(urlMinPrice);
    }
    if (maxPrice !== urlMaxPrice) {
      console.log("Setting maxPrice:", urlMaxPrice);
      setMaxPrice(urlMaxPrice);
    }
    if (onSale !== urlOnSale) {
      console.log("Setting onSale:", urlOnSale);
      setOnSale(urlOnSale);
    }
    if (inStock !== urlInStock) {
      console.log("Setting inStock:", urlInStock);
      setInStock(urlInStock);
    }
    if (sort !== urlSort) {
      console.log("Setting sort:", urlSort);
      setSort(urlSort);
    }
    if (page !== urlPage) {
      console.log("Setting page:", urlPage);
      setPage(urlPage);
    }
    if (
      selectedCategories.length !== urlCategories.length ||
      !selectedCategories.every((v, i) => v === urlCategories[i])
    ) {
      console.log("Setting selectedCategories:", urlCategories);
      setSelectedCategories(urlCategories);
    }
    if (
      selectedBrands.length !== urlBrands.length ||
      !selectedBrands.every((v, i) => v === urlBrands[i])
    ) {
      console.log("Setting selectedBrands:", urlBrands);
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
      console.log("Setting selectedAttributes:", urlAttributes);
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

  useEffect(() => {
    if (allCategories.length === 0) return;

    const categoriesFromQuery = searchParams.get("categories");
    const slugs = [childSlug || parentSlug || slug].filter(Boolean);

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

  return (
    <main className={s.page}>
      <Head>
        <title>{seoData.title || "Bilobrov"}</title>
        <link rel="canonical" href={seoData.canonical || pathname} />

        {seoData.og_title && (
          <meta property="og:title" content={seoData.og_title} />
        )}
        {seoData.og_description && (
          <meta property="og:description" content={seoData.og_description} />
        )}
        {seoData.og_url && <meta property="og:url" content={seoData.og_url} />}
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
      {selectedCategories.length === 1 &&
        childCategories.length > 0 &&
        isMobile && (
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
                  onClick={() => onTabClick(cat.id, cat.slug)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        )}

      {childCategories.length > 0 && isMobile && (
        <Layout>
          <div className={s.scroller}>
            <div className={s.scrollbarContainer}>
              <div className={s.scrollbar}></div>і
            </div>
          </div>
        </Layout>
      )}

      <Layout>
        {selectedCategories.length === 1 &&
          childCategories.length > 0 &&
          !isMobile && (
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
                    onClick={() => onTabClick(cat.id, cat.slug)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogPageInner />
    </Suspense>
  );
}
