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

export function getSortOption(value: string) {
  return productSortOptions.find((option) => option.value === value)?.sort;
}
