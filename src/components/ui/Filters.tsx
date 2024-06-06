"use client";

import { FiltersResponse } from "@/app/api/products/filters/route";
import { HIGHEST_POSSIBLE_PRICE, LOWEST_POSSIBLE_PRICE } from "@/lib/constants";
import { validatePrice } from "@/lib/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range, getTrackBackground } from "react-range";

interface MultipleFilters {
  brands: string[];
  colors: string[];
  sizes: string[];
  ratings: string[];
}

interface Filters extends MultipleFilters {
  minPrice: string;
  maxPrice: string;
}

const initialFilters: Filters = {
  brands: [],
  colors: [],
  sizes: [],
  ratings: [],
  minPrice: "",
  maxPrice: "",
};

interface FilterCounts {
  brands: { name: string; count: number }[];
  colors: { name: string; count: number }[];
  sizes: { name: string; count: number }[];
  ratings: { name: string; count: number }[];
}

export default function Filters() {
  const pathname = usePathname();
  const router = useRouter();
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
    }),
    [rawSearchParams]
  );

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [options, setOptions] = useState<MultipleFilters>({
    brands: [],
    colors: [],
    sizes: [],
    ratings: [],
  });
  const [counts, setCounts] = useState<FilterCounts>({
    brands: [],
    colors: [],
    sizes: [],
    ratings: [],
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    LOWEST_POSSIBLE_PRICE,
    HIGHEST_POSSIBLE_PRICE,
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const memoizedFilters = useMemo(
    () => ({
      brands: filters.brands,
      colors: filters.colors,
      sizes: filters.sizes,
      ratings: filters.ratings,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
    [
      filters.brands,
      filters.colors,
      filters.sizes,
      filters.ratings,
      filters.minPrice,
      filters.maxPrice,
    ]
  );

  const memoizedData = useMemo<Record<string, FiltersResponse>>(() => ({}), []);

  const buildNewSearchParams = (
    newParams: Partial<Filters>
  ): Record<string, any> => {
    const updatedSearchParams: Record<string, any> = {
      ...searchParams,
      ...newParams,
    };

    Object.keys(updatedSearchParams).forEach(
      (key: keyof typeof updatedSearchParams) => {
        if (
          updatedSearchParams[key] === "" ||
          updatedSearchParams[key]?.length === 0 ||
          updatedSearchParams[key] === null
        ) {
          delete updatedSearchParams[key];
        }
      }
    );

    return updatedSearchParams;
  };

  const updatePriceURLParams = (minPrice: number, maxPrice: number): void => {
    const newSearchParams = buildNewSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    });

    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const updateFiltersAndURL = (newFilters: Filters): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));

    const newSearchParams = buildNewSearchParams(newFilters);
    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const fetchFilterOptions = useCallback(
    async (categorySlug: string | null): Promise<FiltersResponse> => {
      const cacheKey = categorySlug || "all";
      if (memoizedData[cacheKey]) {
        return memoizedData[cacheKey];
      }

      setIsLoading(true);
      const response = await fetch(
        `/api/products/filters?categorySlug=${categorySlug}`
      );
      const data = await response.json();

      memoizedData[cacheKey] = data;
      setIsLoading(false);
      return data;
    },
    [memoizedData]
  );

  const fetchFilterCounts = useCallback(
    async (filters: Filters, category: string | undefined) => {
      const queryParams = new URLSearchParams();
      if (category?.length) {
        queryParams.append("categorySlug", category);
      } else {
        queryParams.delete("categorySlug");
      }
      if (filters.brands.length)
        queryParams.append("brands", filters.brands.join(","));
      if (filters.colors.length)
        queryParams.append("colors", filters.colors.join(","));
      if (filters.sizes.length)
        queryParams.append("sizes", filters.sizes.join(","));
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.ratings)
        queryParams.append("ratings", filters.ratings.join(","));

      const response = await fetch(
        `/api/products/filters?${queryParams.toString()}`
      );
      const data = await response.json();

      setCounts({
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
      });
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFilterOptions(searchParams.category);

      setOptions({
        brands: data.brands.map((b) => b._id),
        colors: data.colors.map((c) => c._id),
        sizes: data.sizes.map((s) => s._id),
        ratings: data.ratings.map((r) => r._id),
      });

      setCounts({
        brands: data.brands.map((b) => ({ name: b._id, count: b.count })),
        colors: data.colors.map((c) => ({ name: c._id, count: c.count })),
        sizes: data.sizes.map((s) => ({ name: s._id, count: s.count })),
        ratings: data.ratings.map((r) => ({ name: r._id, count: r.count })),
      });

      setPriceRange([data.lowestPrice, data.highestPrice]);

      const [validatedMin, validatedMax] = validatePrice(
        searchParams.minPrice,
        searchParams.maxPrice,
        data.lowestPrice,
        data.highestPrice
      );

      setFilters((prevFilters) => ({
        ...prevFilters,
        minPrice: validatedMin.toString(),
        maxPrice: validatedMax.toString(),
      }));

      if (searchParams.minPrice || searchParams.maxPrice) {
        updatePriceURLParams(validatedMin, validatedMax);
      }
    };

    fetchData();

    return () => {
      setFilters(initialFilters);
    };
  }, [pathname, searchParams.category, fetchFilterOptions]);

  useEffect(() => {
    fetchFilterCounts(memoizedFilters, searchParams.category?.toString());
  }, [fetchFilterCounts, memoizedFilters, searchParams.category]);

  useEffect(() => {
    setFilters({
      brands: searchParams.brands ? searchParams.brands.split(",") : [],
      colors: searchParams.colors ? searchParams.colors.split(",") : [],
      sizes: searchParams.sizes ? searchParams.sizes.split(",") : [],
      ratings: searchParams.ratings ? searchParams.ratings.split(",") : [],
      minPrice: searchParams.minPrice || "",
      maxPrice: searchParams.maxPrice || "",
    });
  }, []);

  const handlePriceChange = (values: number[]): void => {
    if (values[0] < priceRange[0]) values[0] = priceRange[0];
    if (values[1] > priceRange[1]) values[1] = priceRange[1];

    updateFiltersAndURL({
      ...filters,
      minPrice: values[0].toString(),
      maxPrice: values[1].toString(),
    });
  };

  const handleCheckboxChange = (
    filterType: keyof MultipleFilters,
    value: string
  ): void => {
    const updatedValues = filters[filterType].includes(value)
      ? filters[filterType].filter((item: string) => item !== value)
      : [...filters[filterType as keyof typeof Filters], value];

    updateFiltersAndURL({ ...filters, [filterType]: updatedValues });
  };

  if (pathname !== "/products") return null;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <label>Brand:</label>
        {options.brands.sort().map((brand) => (
          <div key={brand}>
            <input
              id={brand}
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={() => handleCheckboxChange("brands", brand)}
              disabled={
                counts.brands.find((b) => b.name === brand)?.count === undefined
              }
            />
            {filters.brands.includes(brand) ? (
              <strong>{brand}</strong>
            ) : (
              `${brand} (${
                filters.brands.length &&
                !filters.brands.includes(brand) &&
                (counts.brands.find((b) => b.name === brand)?.count ?? 0) > 0
                  ? "+"
                  : ""
              }${counts.brands.find((b) => b.name === brand)?.count || 0})`
            )}
          </div>
        ))}
      </div>
      <div>
        <label>Color:</label>
        {options.colors
          .filter((color) => color)
          .sort()
          .map((color) => (
            <div key={color}>
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => handleCheckboxChange("colors", color)}
              />
              {filters.colors.includes(color) ? (
                <strong>{color}</strong>
              ) : (
                `${color} (${
                  filters.colors.length &&
                  !filters.colors.includes(color) &&
                  (counts.colors.find((c) => c.name === color)?.count ?? 0) > 0
                    ? "+"
                    : ""
                }${counts.colors.find((c) => c.name === color)?.count || 0})`
              )}
            </div>
          ))}
      </div>
      <div>
        <label>Size:</label>
        {options.sizes
          .filter((size) => size)
          .sort()
          .map((size) => (
            <div key={size}>
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => handleCheckboxChange("sizes", size)}
              />
              {filters.sizes.includes(size) ? (
                <strong>{size}</strong>
              ) : (
                `${size} (${
                  filters.sizes.length &&
                  !filters.sizes.includes(size) &&
                  (counts.sizes.find((s) => s.name === size)?.count ?? 0) > 0
                    ? "+"
                    : ""
                }${counts.sizes.find((s) => s.name === size)?.count || 0})`
              )}
            </div>
          ))}
      </div>
      <div>
        <h4>Price Range</h4>
        <Range
          values={[+filters.minPrice, +filters.maxPrice]}
          step={50}
          min={priceRange[0]}
          max={priceRange[1]}
          onChange={(values) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              minPrice: values[0].toString(),
              maxPrice: values[1].toString(),
            }))
          }
          onFinalChange={handlePriceChange}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "5px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values: [
                      Number(filters.minPrice),
                      Number(filters.maxPrice),
                    ],
                    colors: ["#ccc", "#548BF4", "#ccc"],
                    min: priceRange[0],
                    max: priceRange[1],
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key}
                {...restProps}
                style={{
                  ...props.style,
                  height: "24px",
                  width: "24px",
                  borderRadius: "12px",
                  backgroundColor: "#FFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 6px #AAA",
                }}
              >
                <div
                  style={{
                    height: "16px",
                    width: "5px",
                    backgroundColor: isDragged ? "#548BF4" : "#CCC",
                  }}
                />
              </div>
            );
          }}
        />
        <div className="price-values">
          <span>{filters.minPrice}</span> - <span>{filters.maxPrice}</span>
        </div>
      </div>
      <div>
        <h4>Rating:</h4>
        {options.ratings
          .filter((rating) => rating)
          .sort()
          .map((rating) => (
            <div key={rating}>
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating.toString())}
                onChange={() =>
                  handleCheckboxChange("ratings", rating.toString())
                }
              />
              {filters.ratings.includes(rating.toString()) ? (
                <strong>{rating}</strong>
              ) : (
                `${rating} (${
                  filters.ratings.length &&
                  !filters.ratings.includes(rating.toString()) &&
                  (counts.ratings.find((r) => r.name === rating)?.count ?? 0) >
                    0
                    ? "+"
                    : ""
                }${counts.ratings.find((r) => r.name === rating)?.count || 0})`
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
