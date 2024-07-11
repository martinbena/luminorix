import { addDays, format } from "date-fns";
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

export function alphanumericSort(a: string, b: string): number {
  const regex = /(\d+)|(\D+)/g;
  const aParts = a.match(regex);
  const bParts = b.match(regex);

  if (aParts && bParts) {
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const aPart = aParts[i];
      const bPart = bParts[i];

      if (aPart !== bPart) {
        const aIsNumber = !isNaN(Number(aPart));
        const bIsNumber = !isNaN(Number(bPart));

        if (aIsNumber && bIsNumber) {
          return Number(aPart) - Number(bPart);
        }

        if (aIsNumber && !bIsNumber) {
          return -1;
        }

        if (!aIsNumber && bIsNumber) {
          return 1;
        }

        return aPart.localeCompare(bPart);
      }
    }
  }

  return a.localeCompare(b);
}

export function getDeliveryDateRange() {
  const today = new Date();
  const startDate = addDays(today, 2);
  const endDate = addDays(today, 4);

  const startDay = format(startDate, "d");
  const endDay = format(endDate, "d");
  const monthYear = format(startDate, "MMM, yyyy");

  return `${startDay} - ${endDay} ${monthYear}`;
}

export function getProductVariantTitle(
  productTitle: string,
  color: string | undefined,
  size: string | undefined
) {
  return `${productTitle}${color || size ? "," : ""}${
    color ? ` ${color}` : ""
  }${size ? ` ${size}` : ""}`;
}

export function areAddressesDifferent(obj1: any, obj2: any) {
  const keys2 = Object.keys(obj2);

  for (const key of keys2) {
    if (obj1[key] !== obj2[key]) {
      return true;
    }
  }

  return false;
}
