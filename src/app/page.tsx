"use client";
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
import {
  useProductFilterStore,
  SortOption,
} from "@/store/filter/useProductFilterStore";
import { ProductItem } from "@/components/ProductItem/ProductItem";
import { Filters } from "@/components/FilterPopup/FilterPopup";
import { Layout } from "@/components/Layout/Layout";
import { CustomSortDropdown } from "@/components/DropDown/DropDown";
import { CategoryShort } from "@/types/categoryShortType";
import { Pagination } from "@/components/Pagination/Pagination";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Loader } from "@/components/Loader/Loader";
import { usePageData } from "@/hooks/usePageData";
import { API_URL } from "@/constants/api";
import type { Brand, ProductInfo } from "@/types/productTypes";

export const CatalogPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsRef = useRef<HTMLUListElement | null>(null);
  const { t } = useTranslation();

  const query = new URLSearchParams(searchParams.toString());
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
  const brands: Brand[] = Array.isArray(brandData)
    ? brandData
    : brandData?.items || [];

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

  useEffect(() => {
    if (isFilterOpen) {
      setMinPrice(Number(query.get("min")) || 0);
      setMaxPrice(Number(query.get("max")) || 10000);
    }
  }, [isFilterOpen, query, setMinPrice, setMaxPrice]);

  useAttributesQuery();

  useEffect(() => {
    if (allCategories.length === 0) return;
    const categoriesFromQuery = query.get("categories");
    const brandsFromQuery = query.get("brand");
    const slugs = [childSlug || parentSlug || slug].filter(Boolean);

    if (brandsFromQuery && !categoriesFromQuery && !slug) {
      setSelectedCategories([]);
    } else if (categoriesFromQuery) {
      setSelectedCategories(categoriesFromQuery.split(","));
    } else if (slugs.length) {
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

  const currentSort = sort;
  useEffect(() => {
    const min = Number(query.get("min")) || 0;
    const max = Number(query.get("max")) || 10000;
    const sale = query.get("sale") === "true";
    const stock = query.get("stock") === "true";
    const categories = query.get("categories")?.split(",") || [];
    const brands =
      query.get("brand")?.split(",") || query.get("brands")?.split(",") || [];
    const sort = query.get("sort") || "popularity";

    const attributesFromURL: Record<string, string[]> = {};
    query.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        const id = key.replace("attr_", "");
        attributesFromURL[id] = value.split(",");
      }
    });

    if (min !== minPrice) setMinPrice(min);
    if (max !== maxPrice) setMaxPrice(max);
    if (sale !== onSale) setOnSale(sale);
    if (stock !== inStock) setInStock(stock);
    if (
      categories.length !== selectedCategories.length ||
      !categories.every((val, idx) => val === selectedCategories[idx])
    ) {
      setSelectedCategories(categories);
    }
    if (
      brands.length !== selectedBrands.length ||
      !brands.every((val, idx) => val === selectedBrands[idx])
    ) {
      setSelectedBrands(brands);
    }

    const attributesChanged =
      Object.keys(attributesFromURL).length !==
        Object.keys(selectedAttributes).length ||
      Object.entries(attributesFromURL).some(
        ([key, arr]) =>
          !selectedAttributes[key] ||
          selectedAttributes[key].length !== arr.length ||
          !arr.every((v, i) => selectedAttributes[key][i] === v)
      );
    if (attributesChanged) {
      setSelectedAttributes(attributesFromURL);
    }

    if (sort !== currentSort) setSort(sort as SortOption);
  }, [searchParams.toString()]);

  const pageTitle = useMemo(() => {
    if (slug === "sales") return t("sales");
    if (slug === "news") return "Новинки";

    const brandId = query.get("brand");

    if (brandId) {
      const brand = brands.find((b) => b.id.toString() === brandId);
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
  }, [slug, selectedCategories, allCategories, query, brands]);

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
    if (slug === "sales") {
      setOnSale(true);
      setSelectedCategories([]);
    } else {
      setOnSale(false);
    }
    if (slug === "news") {
      setSort("date");
      setSelectedCategories([]);
    }
  }, [slug, setOnSale, setSort, setSelectedCategories]);

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

  const categories = useProductFilterStore((s) => s.allCategories);

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
          {isFilterOpen && <Filters onClose={() => setIsFilterOpen(false)} />}
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
};

export default CatalogPage;
