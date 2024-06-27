"use client";

import { useFilterContext } from "@/app/contexts/FilterContext";
import { validatePrice } from "@/lib/helpers";
import { useEffect, useMemo } from "react";
import Filter from "./Filter";
import { useSearchParams } from "next/navigation";

export default function Filters() {
  const {
    fetchFilterOptions,
    fetchFilterCounts,  
    memoizedFilters,
    pathname,
    dispatch,
    updatePriceURLParams,
    isLoading,
    setIsLoading,
    error,
  } = useFilterContext();

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchFilterOptions(searchParams.category);

      if (data && !error) {
        dispatch({
          type: "SET_OPTIONS",
          payload: {
            brands: data.brands.map((b: { _id: string }) => b._id),
            colors: data.colors.map((c: { _id: string }) => c._id),
            sizes: data.sizes.map((s: { _id: string }) => s._id),
            ratings: data.ratings.map((r: { _id: string }) => r._id),
          },
        });

        dispatch({
          type: "SET_COUNTS",
          payload: {
            brands: data.brands.map((b: { _id: string; count: number }) => ({
              name: b._id,
              count: b.count,
            })),
            colors: data.colors.map((c: { _id: string; count: number }) => ({
              name: c._id,
              count: c.count,
            })),
            sizes: data.sizes.map((s: { _id: string; count: number }) => ({
              name: s._id,
              count: s.count,
            })),
            ratings: data.ratings.map((r: { _id: string; count: number }) => ({
              name: r._id,
              count: r.count,
            })),
          },
        });

        dispatch({
          type: "SET_PRICE_RANGE",
          payload: [data.lowestPrice, data.highestPrice],
        });

        const [validatedMin, validatedMax] = validatePrice(
          searchParams.minPrice,
          searchParams.maxPrice,
          data.lowestPrice,
          data.highestPrice
        );

        dispatch({
          type: "SET_FILTERS",
          payload: {
            brands: searchParams.brands?.split(",") || [],
            colors: searchParams.colors?.split(",") || [],
            sizes: searchParams.sizes?.split(",") || [],
            minPrice: validatedMin.toString(),
            maxPrice: validatedMax.toString(),
            ratings: searchParams.ratings?.split(",") || [],
          },
        });

        if (searchParams.minPrice || searchParams.maxPrice) {
          updatePriceURLParams(validatedMin, validatedMax);
        }
      }

      setIsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.category, fetchFilterOptions]);

  useEffect(() => {
    fetchFilterCounts(memoizedFilters, searchParams.category?.toString());
  }, [fetchFilterCounts, memoizedFilters, searchParams.category]);

  useEffect(() => {
    setIsLoading(true);
    dispatch({
      type: "SET_FILTERS",
      payload: {
        brands: searchParams.brands?.split(",") || [],
        colors: searchParams.colors?.split(",") || [],
        sizes: searchParams.sizes?.split(",") || [],
        minPrice: searchParams.minPrice || "",
        maxPrice: searchParams.maxPrice || "",
        ratings: searchParams.ratings?.split(",") || [],
      },
    });
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error)
    return <div className="mx-4 text-center text-red-600">{error}</div>;

  return (
    <Filter>
      {isLoading ? (
        <Filter.Skeleton />
      ) : (
        <>
          <Filter.Box filterType="price" />
          <Filter.Box filterType="brands" />
          <Filter.Box filterType="colors" />
          <Filter.Box filterType="sizes" />
          <Filter.Box filterType="ratings" isReversed />{" "}
        </>
      )}
    </Filter>
  );
}
