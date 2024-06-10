"use client";

import { FiltersResponse } from "@/app/api/products/filters/route";
import { HIGHEST_POSSIBLE_PRICE, LOWEST_POSSIBLE_PRICE } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

interface FilterContextProps {
  state: FilterState;
  searchParams: {
    category: string | null;
    brands: string | null;
    colors: string | null;
    sizes: string | null;
    ratings: string | null;
    minPrice: string;
    maxPrice: string;
  };
  dispatch: Dispatch<Action>;
  initialState: FilterState;
  memoizedFilters: Filters;
  pathname: string;
  isLoading: boolean;
  fetchFilterCounts: (
    filters: Filters,
    category: string | undefined
  ) => Promise<void>;
  fetchFilterOptions: (categorySlug: string | null) => Promise<FiltersResponse>;
  updatePriceURLParams: (minPrice: number, maxPrice: number) => void;
  updateFiltersAndURL: (newFilters: Filters) => void;
  handlePriceChange: (values: number[]) => void;
  handleCheckboxChange: (filterType: keyof Options, value: string) => void;
  handleResetFilters: () => void;
  handleRemoveFilter: (filterType: keyof Options, value: string) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const FilterContext = createContext({} as FilterContextProps);

export interface Options {
  brands: string[];
  colors: string[];
  sizes: string[];
  ratings: string[];
}

export interface Filters extends Options {
  minPrice: string;
  maxPrice: string;
}

interface Counts {
  brands: { name: string; count: number }[];
  colors: { name: string; count: number }[];
  sizes: { name: string; count: number }[];
  ratings: { name: string; count: number }[];
}

const initialValues = {
  brands: [],
  colors: [],
  sizes: [],
  ratings: [],
};

interface FilterState {
  filters: Filters;
  options: Options;
  counts: Counts;
  priceRange: [number, number];
}

type Action =
  | { type: "SET_FILTERS"; payload: Partial<Filters> }
  | { type: "SET_OPTIONS"; payload: Partial<Options> }
  | { type: "SET_COUNTS"; payload: Partial<Counts> }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "RESET_FILTERS" }
  | {
      type: "REMOVE_FILTER";
      payload: { filterType: keyof Options; value: string };
    };

interface FilterPropviderProps {
  children: ReactNode;
}

function FilterProvider({ children }: FilterPropviderProps) {
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
      sortBy: rawSearchParams.get("sortBy"),
    }),
    [rawSearchParams]
  );

  const initialState: FilterState = {
    filters: {
      ...initialValues,
      minPrice: "",
      maxPrice: "",
    },
    options: initialValues,
    counts: initialValues,
    priceRange: [LOWEST_POSSIBLE_PRICE, HIGHEST_POSSIBLE_PRICE],
  };

  function reducer(state: FilterState, action: Action): FilterState {
    switch (action.type) {
      case "SET_FILTERS":
        return {
          ...state,
          filters: { ...state.filters, ...action.payload },
        };
      case "SET_OPTIONS":
        return {
          ...state,
          options: { ...state.options, ...action.payload },
        };
      case "SET_COUNTS":
        return {
          ...state,
          counts: { ...state.counts, ...action.payload },
        };
      case "SET_PRICE_RANGE":
        return {
          ...state,
          priceRange: action.payload,
        };
      case "RESET_FILTERS":
        return {
          ...state,
          filters: {
            ...initialState.filters,
            minPrice: state.priceRange[0].toString(),
            maxPrice: state.priceRange[1].toString(),
          },
        };
      case "REMOVE_FILTER":
        const newFilters = { ...state.filters };

        if (Array.isArray(newFilters[action.payload.filterType])) {
          newFilters[action.payload.filterType] = newFilters[
            action.payload.filterType
          ].filter((item: string) => item !== action.payload.value);
        }

        return { ...state, filters: newFilters };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { filters, priceRange } = state;
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
    [filters]
  );

  const memoizedData = useMemo<Record<string, FiltersResponse>>(() => ({}), []);

  function buildNewSearchParams(
    newParams: Partial<Filters>
  ): Record<string, any> {
    const currentSearchParams = new URLSearchParams(window.location.search);

    const searchParams: Record<string, any> = {};
    currentSearchParams.forEach((value, key) => {
      searchParams[key] = value;
    });

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
  }

  function updatePriceURLParams(minPrice: number, maxPrice: number): void {
    const newSearchParams = buildNewSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    });

    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }

  function updateFiltersAndURL(newFilters: Filters): void {
    dispatch({ type: "SET_FILTERS", payload: newFilters });

    const newSearchParams = buildNewSearchParams(newFilters);
    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }

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
    },
    []
  );

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
    filterType: keyof Options,
    value: string
  ): void => {
    const updatedValues = filters[filterType].includes(value)
      ? filters[filterType].filter((item: string) => item !== value)
      : [...filters[filterType], value];

    updateFiltersAndURL({ ...filters, [filterType]: updatedValues });
  };

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

  function handleRemoveFilter(filterType: keyof Options, value: string): void {
    dispatch({ type: "REMOVE_FILTER", payload: { filterType, value } });

    const updatedValues = filters[filterType].filter(
      (item: string) => item !== value
    );

    updateFiltersAndURL({ ...filters, [filterType]: updatedValues });
  }

  return (
    <FilterContext.Provider
      value={{
        state,
        fetchFilterCounts,
        fetchFilterOptions,
        updateFiltersAndURL,
        searchParams,
        dispatch,
        initialState,
        memoizedFilters,
        pathname,
        updatePriceURLParams,
        isLoading,
        handlePriceChange,
        handleCheckboxChange,
        handleResetFilters,
        handleRemoveFilter,
        setIsLoading,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("FilterContext was used outside the FilterContextProvider");
  }

  return context;
}

export { FilterProvider, useFilterContext };
