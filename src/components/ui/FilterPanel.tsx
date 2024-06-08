"use client";

import { usePathname } from "next/navigation";
import Filters from "./Filters";

export default function FilterPanel() {
  const pathname = usePathname();

  if (pathname !== "/products") return null;

  return <Filters />;
}
