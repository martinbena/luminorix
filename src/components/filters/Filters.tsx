"use client";

import { useFilterContext } from "@/app/contexts/FilterContext";
import { validatePrice } from "@/lib/helpers";
import { useEffect } from "react";
import Filter from "./Filter";

export default function Filters() {
  const {
    fetchFilterOptions,
    fetchFilterCounts,
    searchParams,
    initialState,
    memoizedFilters,
    pathname,
    dispatch,
    updatePriceURLParams,
    isLoading,
    setIsLoading,
  } = useFilterContext();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchFilterOptions(searchParams.category);

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

      setIsLoading(false);
    };

    fetchData();
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
  }, []);

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
