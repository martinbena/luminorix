import paths from "./paths";

export const categoryLinks = [
  {
    href: paths.productShowAll(),
    description: "All sortiment",
  },
  {
    href: `${paths.productShowAll()}?category=mens-fashion`,
    description: "Men's fashion",
  },
  {
    href: `${paths.productShowAll()}?category=womens-fashion`,
    description: "Women's fashion",
  },
  {
    href: `${paths.productShowAll()}?category=jewelry`,
    description: "Jewelry",
  },
  {
    href: `${paths.productShowAll()}?category=watches`,
    description: "Watches",
  },
  {
    href: `${paths.productShowAll()}?category=sunglasses`,
    description: "Sunglasses",
  },
];

export const tagLinks = [
  {
    href: paths.discountShowAll(),
    description: "Discounts",
  },
  {
    href: paths.marketItemShowAll(),
    description: "Market",
  },
  {
    href: paths.freeShippingShowAll(),
    description: "Free Shipping",
  },
];
