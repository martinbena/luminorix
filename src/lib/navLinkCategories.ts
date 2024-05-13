import paths from "./paths";

export const categoryLinks = [
  {
    href: paths.productShowAll(),
    description: "All sortiment",
  },
  {
    href: paths.productShowAll(),
    description: "Men's fashion",
  },
  {
    href: paths.productShowAll(),
    description: "Women's fashion",
  },
  {
    href: paths.productShowAll(),
    description: "Jewelry",
  },
  {
    href: paths.productShowAll(),
    description: "Watches",
  },
  {
    href: paths.productShowAll(),
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

export const userLinks = [
  {
    href: paths.userProfile(),
    description: "Profile",
  },
  {
    href: paths.userSettings(),
    description: "Settings",
  },
  {
    href: paths.userOrderShowAll(),
    description: "Orders",
  },
  {
    href: paths.userWishlist(),
    description: "Wishlist",
  },
  {
    href: paths.userMessages(),
    description: "Messages",
  },
  {
    href: paths.userReviews(),
    description: "Reviews",
  },
  {
    href: paths.userMarketItemShow(),
    description: "Market Items",
  },
];

export const adminLinks = [
  {
    href: paths.admin(),
    description: "Dashboard",
  },
  {
    href: paths.adminProductShow(),
    description: "Products",
  },
  {
    href: paths.adminCategoryShow(),
    description: "Categories",
  },
  {
    href: paths.adminOrderShow(),
    description: "User Orders",
  },
];
