"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const searchParams = {
    category: rawSearchParams.get("category"),
    brand: rawSearchParams.getAll("brand"),
    color: rawSearchParams.getAll("color"),
    size: rawSearchParams.getAll("size"),
    rating: rawSearchParams.get("rating"),
    minPrice: rawSearchParams.get("minPrice"),
    maxPrice: rawSearchParams.get("maxPrice"),
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [options, setOptions] = useState<MultipleFilters>({
    brands: [],
    colors: [],
    sizes: [],
    ratings: [],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const response = await fetch(
        `/api/products/filters?categorySlug=${searchParams.category}`
      );
      const data = await response.json();
      setOptions(data);
    };

    fetchFilterOptions();

    return () => {
      setFilters(initialFilters);
    };
  }, [searchParams.category]);

  const updateFilters = (newFilters: Filters): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));

    const newSearchParams: Record<string, any> = {
      ...searchParams,
      ...newFilters,
    };

    // Remove empty filters
    Object.keys(newSearchParams).forEach(
      (key: keyof typeof newSearchParams) => {
        if (
          newSearchParams[key] === "" ||
          newSearchParams[key]?.length === 0 ||
          newSearchParams[key] === null
        ) {
          delete newSearchParams[key];
        }
      }
    );

    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`);
  };

  const handleCheckboxChange = (
    filterType: keyof MultipleFilters,
    value: string
  ) => {
    const updatedValues = filters[filterType].includes(value)
      ? filters[filterType].filter((item: string) => item !== value)
      : [...filters[filterType as keyof typeof Filters], value];

    updateFilters({ ...filters, [filterType]: updatedValues });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFilters({ ...filters, [name]: value });
  };

  if (pathname !== "/products") return null;

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
        <label>Min Price:</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Max Price:</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleInputChange}
        />
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
