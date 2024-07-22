const paths = {
  home() {
    return "/";
  },
  productShowAll() {
    return "/products";
  },
  productShow(productSlug: string, sku: string) {
    return `/${productSlug}/${sku}`;
  },
  marketItemShowAll() {
    return "/market";
  },
  marketItemShow(id: string) {
    return `/market/${id}`;
  },
  marketItemCreate() {
    return `/profile/market-items/add-item`;
  },
  discountShowAll() {
    return `/discounts`;
  },
  freeShippingShowAll() {
    return `/free-shipping`;
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
    return "/admin/products/add-product";
  },
  adminProductShow() {
    return "/admin/products";
  },
  adminCategoryShow() {
    return "/admin/categories";
  },
  adminOrderShow() {
    return "/admin/orders";
  },
  cart() {
    return "/cart";
  },
  orderSuccess(successToken: string) {
    return `/order-success/${successToken}`;
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
  loginForgottenPassword() {
    return "/login/forgotten-password";
  },
};

export default paths;
