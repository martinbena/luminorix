export const PAGE_LIMIT = 10;
export const LOWEST_POSSIBLE_PRICE = 0;
export const HIGHEST_POSSIBLE_PRICE = 500000;
export const MAX_RATING = 5;
export const SKELETON_EFFECT = "wave";
export const SHIPPING_RATE = 5;
export const ORDER_STATUSES = [
  "Not Processed",
  "Processing",
  "Dispatched",
  "Delivered",
  "Cancelled",
] as const;
export const ORDER_STATUS_FILTER_OPTIONS = ["All", ...ORDER_STATUSES];
export const PRODUCT_CONDITION_OPTIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor",
];
