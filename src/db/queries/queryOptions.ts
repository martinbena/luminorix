export const productSortOptions = [
  {
    value: "productTitleAsc",
    label: "Title (A-Z)",
    sort: { lowercaseTitle: 1 },
  },
  {
    value: "productTitleDesc",
    label: "Title (Z-A)",
    sort: { lowercaseTitle: -1 },
  },
  {
    value: "categoryAsc",
    label: "Category (A-Z)",
    sort: { category: 1 },
  },
  {
    value: "categoryDesc",
    label: "Category (Z-A)",
    sort: { category: -1 },
  },
  { value: "brandAsc", label: "Brand (A-Z)", sort: { lowercaseBrand: 1 } },
  { value: "brandDesc", label: "Brand (Z-A)", sort: { lowercaseBrand: -1 } },
  {
    value: "soldTotalAsc",
    label: "Total Sold (Low to High)",
    sort: { soldTotal: 1 },
  },
  {
    value: "soldTotalDesc",
    label: "Total Sold (High to Low)",
    sort: { soldTotal: -1 },
  },
  {
    value: "priceAsc",
    label: "Price (Low to High)",
    sort: { "variants.price": 1 },
  },
  {
    value: "priceDesc",
    label: "Price (High to Low)",
    sort: { "variants.price": -1 },
  },
  {
    value: "variantCreatedAtAsc",
    label: "Creation Date (Oldest First)",
    sort: { "variants.createdAt": 1 },
  },
  {
    value: "variantCreatedAtDesc",
    label: "Creation Date (Newest First)",
    sort: { "variants.createdAt": -1 },
  },
  {
    value: "stockAsc",
    label: "Stock (Low to High)",
    sort: { "variants.stock": 1 },
  },
  {
    value: "stockDesc",
    label: "Stock (High to Low)",
    sort: { "variants.stock": -1 },
  },
  {
    value: "soldAsc",
    label: "Units Sold (Low to High)",
    sort: { "variants.sold": 1 },
  },
  {
    value: "soldDesc",
    label: "Units Sold (High to Low)",
    sort: { "variants.sold": -1 },
  },
];

export const userProductSortOptions = [
  {
    value: "titleAsc",
    label: "Title (A-Z)",
    sort: { lowercaseTitle: 1 },
  },
  {
    value: "titleDesc",
    label: "Title (Z-A)",
    sort: { lowercaseTitle: -1 },
  },
  {
    value: "priceAsc",
    label: "Price (Low to High)",
    sort: { "variants.price": 1 },
  },
  {
    value: "priceDesc",
    label: "Price (High to Low)",
    sort: { "variants.price": -1 },
  },
  {
    value: "newest",
    label: "Newest Arrivals",
    sort: { "variants.createdAt": -1 },
  },
  {
    value: "bestSelling",
    label: "Best Selling",
    sort: { "variants.sold": -1 },
  },
];

export function getSortOption(value: string) {
  return [...productSortOptions, ...userProductSortOptions].find(
    (option) => option.value === value
  )?.sort;
}

export const productWithVariantFormat = {
  _id: 1,
  title: 1,
  slug: 1,
  description: 1,
  brand: 1,
  freeShipping: 1,
  category: 1,
  soldTotal: 1,
  ratings: 1,
  averageRating: 1,
  _variantId: "$variants._id",
  sku: "$variants.sku",
  price: "$variants.price",
  previousPrice: "$variants.previousPrice",
  color: "$variants.color",
  size: "$variants.size",
  stock: "$variants.stock",
  sold: "$variants.sold",
  image: "$variants.image",
  variantCreatedAt: "$variants.createdAt",
};

export interface ProductSearchParams {
  category?: string;
  maxPrice?: string;
  minPrice?: string;
  brands?: string;
  colors?: string;
  sizes?: string;
  ratings?: string;
  sortBy?: string;
  page?: string;
}
