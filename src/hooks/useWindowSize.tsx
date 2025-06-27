"use client";

import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const isClient = typeof window !== "undefined";

  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : 1200,
    height: isClient ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  return windowSize;
};
