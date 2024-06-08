import { useSearchParams } from "next/navigation";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export const formatNumber = (number: string | number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  })
    .format(+number)
    .replace(/,/g, " ");
};

export const useMergedSearchParams = (href: string): string => {
  const searchParams = useSearchParams();

  if (!searchParams) {
    return href;
  }
  const baseUrl = process.env.BASE_URL;

  const url = new URL(href, baseUrl);
  const currentParams = new URLSearchParams(searchParams.toString());

  url.searchParams.forEach((value, key) => {
    currentParams.set(key, value);
  });

  return `${url.pathname}?${currentParams.toString()}`;
};

export const validatePrice = (
  minPrice: string,
  maxPrice: string,
  lowest: number,
  highest: number
): [number, number] => {
  const validatedMin = Math.max(+minPrice || lowest, lowest);
  const validatedMax = Math.min(+maxPrice || highest, highest);
  return [validatedMin, validatedMax];
};
