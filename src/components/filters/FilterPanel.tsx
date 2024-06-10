"use client";

import { usePathname } from "next/navigation";
import Filters from "./Filters";
import { Suspense } from "react";
import Filter from "./Filter";

export default function FilterPanel() {
  const pathname = usePathname();

  if (pathname !== "/products") return null;

  return (
    <Suspense fallback={<Filter.Skeleton />}>
      <Filters />
    </Suspense>
  );
}
