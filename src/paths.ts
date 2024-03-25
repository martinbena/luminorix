const paths = {
  home() {
    return "/";
  },
  productShowAll() {
    return "/products";
  },
  productShow(productSlug: string) {
    return `/products/${productSlug}`;
  },
  marketItemShowAll() {
    return "/market";
  },
  marketItemShow(itemSlug: string) {
    return `/market/${itemSlug}`;
  },
  marketItemCreate() {
    return `/market/add-item`;
  },
  tagsShowAll() {
    return "/tags";
  },
  tagShow(tagSlug: string) {
    return `/tag/${tagSlug}`;
  },
  userProfile() {
    return "/profile";
  },
  userOrderShowAll() {
    return "/profile/orders";
  },
  userOrderShow(orderNumber: string) {
    return `/profile/orders/${orderNumber}`;
  },
  userMarketItemShow() {
    return "/profile/market-items";
  },
  userWishlist() {
    return "/profile/wishlist";
  },
  userSettings() {
    return "/profile/settings";
  },
  userMessages() {
    return "/profile/messages";
  },
  userReviews() {
    return "/profile/reviews";
  },
  admin() {
    return "/admin";
  },
  adminProductCreate() {
    return "/admin/add-product";
  },
  adminProductShow() {
    return "/admin/products";
  },
  adminCategoryShow() {
    return "/admin/categories";
  },
  adminTagShow() {
    return "/admin/tags";
  },
  adminOrderShow() {
    return "/admin/orders";
  },
  cart() {
    return "/cart";
  },
  search() {
    return "/search";
  },
  register() {
    return "/register";
  },
  login() {
    return "/login";
  },
  loginForgotPassword() {
    return "/login/forgot-password";
  },
};

export default paths;
