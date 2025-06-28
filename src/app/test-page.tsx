"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductFilterStore } from "@/store/filter/useProductFilterStore";
import { useCatalogQueryParams } from "@/hooks/useCatalogQueryParams";

export default function TestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCategories, setSelectedCategories } = useProductFilterStore();
  const { selectedCategories: urlCategories } = useCatalogQueryParams();

  const [testCategory, setTestCategory] = useState("");

  // Синхронізуємо стан з URL
  useEffect(() => {
    if (
      selectedCategories.length !== urlCategories.length ||
      !selectedCategories.every((v, i) => v === urlCategories[i])
    ) {
      setSelectedCategories(urlCategories);
    }
  }, [urlCategories, selectedCategories, setSelectedCategories]);

  const handleCategoryClick = (categoryId: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("categories", categoryId);
    router.push(`/catalog?${currentParams.toString()}`);
  };

  const handleTestCategory = () => {
    if (testCategory) {
      handleCategoryClick(testCategory);
    }
  };

  return (
    <Suspense fallback={null}>
      <div style={{ padding: "20px" }}>
        <h1>Тестова сторінка</h1>

        <div>
          <h3>Поточні категорії з URL:</h3>
          <pre>{JSON.stringify(urlCategories, null, 2)}</pre>
        </div>

        <div>
          <h3>Поточні категорії в стані:</h3>
          <pre>{JSON.stringify(selectedCategories, null, 2)}</pre>
        </div>

        <div>
          <h3>Тестування категорії:</h3>
          <input
            type="text"
            value={testCategory}
            onChange={(e) => setTestCategory(e.target.value)}
            placeholder="Введіть ID категорії"
          />
          <button onClick={handleTestCategory}>Встановити категорію</button>
        </div>

        <div>
          <h3>Швидкі тести:</h3>
          <button onClick={() => handleCategoryClick("1")}>Категорія 1</button>
          <button onClick={() => handleCategoryClick("2")}>Категорія 2</button>
          <button onClick={() => handleCategoryClick("3")}>Категорія 3</button>
          <button onClick={() => router.push("/catalog")}>Скинути</button>
        </div>
      </div>
    </Suspense>
  );
}
