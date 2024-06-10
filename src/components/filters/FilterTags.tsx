"use client";

import {
  Filters,
  Options,
  useFilterContext,
} from "@/app/contexts/FilterContext";
import { IoClose } from "react-icons/io5";
import Button from "../ui/Button";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function FilterTags() {
  const rawSearchParams = useSearchParams();
  const searchParams = useMemo(
    () => ({
      category: rawSearchParams.get("category"),
      brands: rawSearchParams.get("brands"),
      colors: rawSearchParams.get("colors"),
      sizes: rawSearchParams.get("sizes"),
      ratings: rawSearchParams.get("ratings"),
      minPrice: rawSearchParams.getAll("minPrice").sort((a, b) => +a - +b)[0],
      maxPrice: rawSearchParams.getAll("maxPrice").sort((a, b) => +b - +a)[0],
      sortBy: rawSearchParams.get("sortBy"),
    }),
    [rawSearchParams]
  );
  const { state, handleRemoveFilter, dispatch, pathname, router } =
    useFilterContext();

  function handleResetFilters() {
    dispatch({ type: "RESET_FILTERS" });
    const { category, sortBy } = searchParams;
    const queryParams = new URLSearchParams();
    if (category?.length) {
      queryParams.append("category", category);
    }
    if (sortBy?.length) {
      queryParams.append("sortBy", sortBy);
    }

    const queryString = queryParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }

  const hasFilters = Object.keys(state.filters).some(
    (filterType) =>
      filterType !== "minPrice" &&
      filterType !== "maxPrice" &&
      state.filters[filterType as keyof Filters].length > 0
  );

  if (!hasFilters) return <span>&nbsp;</span>;

  const renderTags = () => {
    const filterTags: JSX.Element[] = [];
    for (const [filterType, values] of Object.entries(state.filters)) {
      if (
        filterType !== "minPrice" &&
        filterType !== "maxPrice" &&
        values.length > 0
      ) {
        filterTags.push(
          <div key={filterType} className="p-2.5 rounded-md bg-amber-200">
            <span className="mr-1.5 capitalize font-bold">{filterType}:</span>
            {values.map((value: string) => (
              <span
                key={value}
                className="filter-tag-item inline-flex align-center mr-2.5 bg-amber-100 p-1.5 rounded-sm"
              >
                {value}
                <IoClose
                  className="cursor-pointer ml-1.5"
                  onClick={() =>
                    handleRemoveFilter(filterType as keyof Options, value)
                  }
                />
              </span>
            ))}
          </div>
        );
      }
    }
    return filterTags;
  };

  const tags = renderTags();

  return (
    <div className="flex flex-wrap gap-2.5">
      {tags}
      <Button type="tertiary" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
}
