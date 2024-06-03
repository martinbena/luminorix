"use client";

import { validatePrice } from "@/lib/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    router.push(`${pathname}?${queryString}`);
  };

  const updateFiltersAndURL = (newFilters: Filters): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));

    const newSearchParams = buildNewSearchParams(newFilters);
    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`);
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/products/filters?categorySlug=${searchParams.category}`
      );
      const data = await response.json();
      setOptions(data);
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
      setIsLoading(false);
    };

    fetchFilterOptions();

    return () => {
      setFilters(initialFilters);
    };
  }, [searchParams.category]);

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
        {options.brands.map((brand) => (
          <div key={brand}>
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={() => handleCheckboxChange("brands", brand)}
            />
            {brand}
          </div>
        ))}
      </div>
      <div>
        <label>Color:</label>
        {options.colors.map((color) => (
          <div key={color}>
            <input
              type="checkbox"
              checked={filters.colors.includes(color)}
              onChange={() => handleCheckboxChange("colors", color)}
            />
            {color}
          </div>
        ))}
      </div>
      <div>
        <label>Size:</label>
        {options.sizes.map((size) => (
          <div key={size}>
            <input
              type="checkbox"
              checked={filters.sizes.includes(size)}
              onChange={() => handleCheckboxChange("sizes", size)}
            />
            {size}
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
        <h4>Ratings</h4>
        {[1, 2, 3, 4, 5].map((rating) => (
          <label key={rating}>
            <input
              type="checkbox"
              checked={filters.ratings.includes(rating.toString())}
              onChange={() =>
                handleCheckboxChange("ratings", rating.toString())
              }
            />
            {rating}
          </label>
        ))}
      </div>
    </div>
  );
}
