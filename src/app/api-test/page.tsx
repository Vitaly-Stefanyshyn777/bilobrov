"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "@/constants/api";

interface ApiTestResult {
  success: boolean;
  url: string;
  totalCount?: number;
  totalPages?: number;
  productsCount?: number;
  firstProduct?: {
    id: number;
    name: string;
    on_sale: boolean;
    stock_status: string;
    price: string;
  } | null;
  error?: string;
}

interface TestResults {
  [key: string]: ApiTestResult;
}

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const testApiCall = useCallback(
    async (params: Record<string, string>): Promise<ApiTestResult> => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(params);
        const url = `${API_URL_WC}products?${queryParams.toString()}`;

        console.log("🔍 Testing API call:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          },
        });

        const totalCount = parseInt(response.headers["x-wp-total"] || "0");
        const totalPages = parseInt(response.headers["x-wp-totalpages"] || "0");

        return {
          success: true,
          url,
          totalCount,
          totalPages,
          productsCount: response.data.length,
          firstProduct: response.data[0]
            ? {
                id: response.data[0].id,
                name: response.data[0].name,
                on_sale: response.data[0].on_sale,
                stock_status: response.data[0].stock_status,
                price: response.data[0].price,
              }
            : null,
        };
      } catch (error: unknown) {
        console.error("❌ API Error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          success: false,
          error: errorMessage,
          url: `${API_URL_WC}products?${new URLSearchParams(
            params
          ).toString()}`,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const runTests = useCallback(async () => {
    const results: TestResults = {};

    // Тест 1: Базовий запит
    results.basic = await testApiCall({
      per_page: "5",
    });

    // Тест 2: Фільтр on_sale
    results.onSale = await testApiCall({
      per_page: "5",
      on_sale: "true",
    });

    // Тест 3: Фільтр stock_status
    results.inStock = await testApiCall({
      per_page: "5",
      stock_status: "instock",
    });

    // Тест 4: Комбінація фільтрів
    results.combined = await testApiCall({
      per_page: "5",
      on_sale: "true",
      stock_status: "instock",
    });

    // Тест 5: Ціна
    results.price = await testApiCall({
      per_page: "5",
      min_price: "100",
      max_price: "1000",
    });

    // Тест 6: Категорія
    results.category = await testApiCall({
      per_page: "5",
      category: "1",
    });

    setTestResults(results);
  }, [testApiCall]);

  useEffect(() => {
    runTests();
  }, [runTests]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔧 API Test Page</h1>

      <button
        onClick={runTests}
        disabled={loading}
        style={{
          margin: "10px",
          padding: "10px",
          background: loading ? "#6c757d" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loading ? "Testing..." : "Run Tests"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>📊 Test Results:</h3>
        {Object.entries(testResults).map(
          ([testName, result]: [string, ApiTestResult]) => (
            <div
              key={testName}
              style={{
                marginBottom: "20px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              <h4 style={{ color: result.success ? "#28a745" : "#dc3545" }}>
                {testName.toUpperCase()}:{" "}
                {result.success ? "✅ SUCCESS" : "❌ FAILED"}
              </h4>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>🔍 API Info:</h3>
        <p>
          <strong>Base URL:</strong> {API_URL_WC}
        </p>
        <p>
          <strong>Consumer Key:</strong> {consumerKey.substring(0, 10)}...
        </p>
        <p>
          <strong>Consumer Secret:</strong> {consumerSecret.substring(0, 10)}...
        </p>
      </div>
    </div>
  );
}
