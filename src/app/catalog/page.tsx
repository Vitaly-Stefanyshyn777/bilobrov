import CatalogPageInner from "@/components/CatalogPageInner/CatalogPageInner";

import React, { Suspense } from "react";

export default function CatalogRoot() {
  return (
    <Suspense fallback={null}>
      <CatalogPageInner />
    </Suspense>
  );
}
