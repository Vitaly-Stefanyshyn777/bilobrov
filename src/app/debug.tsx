"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductFilterStore } from "@/store/filter/useProductFilterStore";
import { useCatalogQueryParams } from "@/hooks/useCatalogQueryParams";
import Link from "next/link";

interface DebugInfo {
  urlOnSale: boolean;
  stateOnSale: boolean;
  urlInStock: boolean;
  stateInStock: boolean;
  urlCategories: string[];
  stateCategories: string[];
  searchParams: string;
  timestamp: string;
}

export default function DebugPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onSale, inStock, selectedCategories } = useProductFilterStore();
  const {
    onSale: urlOnSale,
    inStock: urlInStock,
    selectedCategories: urlCategories,
  } = useCatalogQueryParams();

  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    urlOnSale: false,
    stateOnSale: false,
    urlInStock: false,
    stateInStock: false,
    urlCategories: [],
    stateCategories: [],
    searchParams: "",
    timestamp: "",
  });

  // Логуємо зміни
  useEffect(() => {
    console.log("🔍 DEBUG INFO:");
    console.log("URL onSale:", urlOnSale);
    console.log("State onSale:", onSale);
    console.log("URL inStock:", urlInStock);
    console.log("State inStock:", inStock);
    console.log("URL categories:", urlCategories);
    console.log("State categories:", selectedCategories);
    console.log("Search params:", searchParams.toString());

    setDebugInfo({
      urlOnSale,
      stateOnSale: onSale,
      urlInStock,
      stateInStock: inStock,
      urlCategories,
      stateCategories: selectedCategories,
      searchParams: searchParams.toString(),
      timestamp: new Date().toISOString(),
    });
  }, [
    urlOnSale,
    onSale,
    urlInStock,
    inStock,
    urlCategories,
    selectedCategories,
    searchParams,
  ]);

  const handleOnSaleToggle = () => {
    console.log("🎯 Toggling onSale from:", onSale, "to:", !onSale);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("sale", (!onSale).toString());

    const newUrl = `/catalog?${currentParams.toString()}`;
    console.log("🔄 Navigating to:", newUrl);

    router.push(newUrl);
  };

  const handleInStockToggle = () => {
    console.log("🎯 Toggling inStock from:", inStock, "to:", !inStock);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("stock", (!inStock).toString());

    const newUrl = `/catalog?${currentParams.toString()}`;
    console.log("🔄 Navigating to:", newUrl);

    router.push(newUrl);
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log("🎯 Setting category:", categoryId);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("categories", categoryId);

    const newUrl = `/catalog?${currentParams.toString()}`;
    console.log("🔄 Navigating to:", newUrl);

    router.push(newUrl);
  };

  const handleReset = () => {
    console.log("🔄 Resetting filters...");
    router.push("/catalog");
  };

  return (
    <Suspense fallback={null}>
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>🔧 Debug Page</h1>

        <div style={{ marginBottom: "20px" }}>
          <h3>📊 Current State:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>🎯 Filter Tests:</h3>

          <div style={{ marginBottom: "10px" }}>
            <h4>On Sale Filter:</h4>
            <button
              onClick={handleOnSaleToggle}
              style={{
                margin: "5px",
                padding: "10px",
                background: onSale ? "#28a745" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {onSale ? "✅ On Sale: ON" : "❌ On Sale: OFF"}
            </button>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <h4>In Stock Filter:</h4>
            <button
              onClick={handleInStockToggle}
              style={{
                margin: "5px",
                padding: "10px",
                background: inStock ? "#28a745" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {inStock ? "✅ In Stock: ON" : "❌ In Stock: OFF"}
            </button>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <h4>Category Tests:</h4>
            <button
              onClick={() => handleCategoryClick("1")}
              style={{
                margin: "5px",
                padding: "10px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Set Category 1
            </button>
            <button
              onClick={() => handleCategoryClick("2")}
              style={{
                margin: "5px",
                padding: "10px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Set Category 2
            </button>
            <button
              onClick={() => handleCategoryClick("3")}
              style={{
                margin: "5px",
                padding: "10px",
                background: "#ffc107",
                color: "black",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Set Category 3
            </button>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <h4>Combination Tests:</h4>
            <button
              onClick={() => {
                const params = new URLSearchParams();
                params.set("sale", "true");
                params.set("stock", "true");
                params.set("categories", "1");
                router.push(`/catalog?${params.toString()}`);
              }}
              style={{
                margin: "5px",
                padding: "10px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Sale + Stock + Category 1
            </button>
          </div>

          <button
            onClick={handleReset}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Reset All
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>🔍 Manual URL Test:</h3>
          <p>Try these URLs manually:</p>
          <ul>
            <li>
              <Link href="/catalog?sale=true">/catalog?sale=true</Link>
            </li>
            <li>
              <Link href="/catalog?stock=true">/catalog?stock=true</Link>
            </li>
            <li>
              <Link href="/catalog?sale=true&stock=true">
                /catalog?sale=true&stock=true
              </Link>
            </li>
            <li>
              <Link href="/catalog?categories=1&sale=true">
                /catalog?categories=1&sale=true
              </Link>
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>📝 Console Logs:</h3>
          <p>Open browser console (F12) to see detailed logs</p>
        </div>
      </div>
    </Suspense>
  );
}
