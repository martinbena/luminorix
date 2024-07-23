"use client";

import { OrderStatusCount } from "@/db/queries/orders";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface OrderFiltersProps {
  filterField: string;
  options: OrderStatusCount[];
}

export default function OrderFilters({
  filterField,
  options,
}: OrderFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchParams.get("page")) params.set("page", "1");
      if (value !== "All") params.set(filterField, value);
      if (value === "All") params.delete(filterField);

      return params.toString();
    },
    [searchParams, filterField]
  );
  const currentFilter = searchParams.get(filterField) || options[0].status;

  return (
    <div className="border border-zinc-100 rounded-md p-1 flex gap-1 shadow-sm max-w-max mob:flex-wrap">
      {options.map((option) => {
        const disabled = option.count === 0;
        const isActive = currentFilter === option.status;
        return (
          <button
            key={option.status}
            className={`rounded-md font-medium py-1 px-2 transition-all duration-300 focus:outline-none ${
              !disabled
                ? "hover:bg-amber-600 hover:text-amber-50 focus:bg-amber-600 focus:text-amber-50"
                : "cursor-not-allowed opacity-50"
            }  ${isActive ? "bg-amber-600 text-amber-50" : ""}`}
            disabled={disabled}
            onClick={() => {
              router.push(`${pathname}?${createQueryString(option.status)}`);
            }}
          >
            {option.status}
          </button>
        );
      })}
    </div>
  );
}
