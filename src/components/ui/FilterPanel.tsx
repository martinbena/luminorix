"use client";

import { usePathname } from "next/navigation";
import Filters from "./Filters";
import { FilterProvider } from "@/app/contexts/FilterContext";

export default function FilterPanel() {
  const pathname = usePathname();

  if (pathname !== "/products") return null;

  return (
    <FilterProvider>
      <Filters />
    </FilterProvider>
  );
}
