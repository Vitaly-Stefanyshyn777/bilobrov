import React, { Suspense } from "react";
import CatalogPageInner from "@/components/CatalogPageInner/CatalogPageInner";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogPageInner />
    </Suspense>
  );
}
