"use client";

import { Category } from "@/models/Category";
import { ProductWithVariant } from "@/models/Product";
import { WishlistItem } from "@/models/User";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

export type CartProductProps = Pick<
  ProductWithVariant,
  | "_id"
  | "sku"
  | "brand"
  | "color"
  | "freeShipping"
  | "image"
  | "price"
  | "size"
  | "slug"
  | "stock"
  | "title"
  | "category"
>;

export interface CartItem extends CartProductProps {
  quantity: number;
  totalPrice: number;
  originalPrice: number;
}

export interface DiscountCoupon {
  code: string;
  metadata: {
    category: string;
  };
  coupon: {
    id: string;
    name: string;
    percent_off: number;
  };
}

interface CartContextProps {
  cartItems: CartItem[];
  discountCoupon: DiscountCoupon | null;
  isCartLoading: boolean;
  addItem: (product: ProductWithVariant | WishlistItem) => void;
  deleteItem: (sku: string) => void;
  increaseItemQuantity: (sku: string) => void;
  decreaseItemQuantity: (sku: string) => void;
  clearCart: () => void;
  getTotalCartQuantity: () => number;
  getTotalCartPrice: () => number;
  getCurrentItemQuantity: (sku: string) => number;
  getCartStatus: (sku: string) => boolean;
  getShippingStatus: () => boolean;
  setDiscountCoupon: Dispatch<SetStateAction<DiscountCoupon | null>>;
  handleDiscountCouponApply: (discountCoupon: DiscountCoupon) => void;
  getDiscountedAmount: () => number;
  clearCartAndDiscount: () => void;
}

const CartContext = createContext({} as CartContextProps);

function CartProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [discountCoupon, setDiscountCoupon] = useState<DiscountCoupon | null>(
    null
  );

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    } else {
      setCartItems([]);
    }
    setIsCartLoading(false);
  }, []);

  useEffect(() => {
    const storedDiscountCoupon = localStorage.getItem("discountCoupon");
    if (storedDiscountCoupon) {
      setDiscountCoupon(JSON.parse(storedDiscountCoupon));
    } else {
      setDiscountCoupon(null);
    }
  }, []);

  useEffect(() => {
    if (cartItems !== null) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (discountCoupon !== null) {
      localStorage.setItem("discountCoupon", JSON.stringify(discountCoupon));
    }
  }, [discountCoupon]);

  function addItem(product: ProductWithVariant | WishlistItem): void {
    const isDiscountApplicable =
      discountCoupon &&
      discountCoupon?.metadata.category ===
        (product.category as Category).title;

    const newItem = {
      _id: product._id,
      sku: product.sku,
      title: product.title,
      price: isDiscountApplicable
        ? product.price * (1 - discountCoupon.coupon.percent_off / 100)
        : product.price,
      brand: product.brand,
      freeShipping: product.freeShipping,
      image: product.image,
      color: product.color,
      size: product.size,
      slug: product.slug,
      stock: product.stock,
      category: product.category,
    } as CartProductProps;
    setCartItems((prevItems) => [
      ...(prevItems || []),
      {
        ...newItem,
        quantity: 1,
        totalPrice: newItem.price,
        originalPrice: product.price,
      },
    ]);
  }

  function deleteItem(sku: string): void {
    setCartItems((prevItems) =>
      (prevItems || []).filter((item) => item.sku !== sku)
    );
  }

  function increaseItemQuantity(sku: string): void {
    setCartItems((prevItems) => {
      const items = prevItems || [];
      const itemIndex = items.findIndex((item) => item.sku === sku);
      if (itemIndex === -1) return items;
      const item = items[itemIndex];
      if (item.quantity === item.stock) return items;

      const updatedItem = {
        ...item,
        quantity: item.quantity + 1,
        totalPrice: (item.quantity + 1) * item.price,
      };
      return [
        ...items.slice(0, itemIndex),
        updatedItem,
        ...items.slice(itemIndex + 1),
      ];
    });
  }

  function decreaseItemQuantity(sku: string): void {
    setCartItems((prevItems) => {
      const items = prevItems || [];
      const itemIndex = items.findIndex((item) => item.sku === sku);
      if (itemIndex === -1) return items;
      const item = items[itemIndex];
      if (item.quantity === 1) {
        return items.filter((item) => item.sku !== sku);
      }

      const updatedItem = {
        ...item,
        quantity: item.quantity - 1,
        totalPrice: (item.quantity - 1) * item.price,
      };
      return [
        ...items.slice(0, itemIndex),
        updatedItem,
        ...items.slice(itemIndex + 1),
      ];
    });
  }

  function clearCart(): void {
    setCartItems([]);
  }

  function getTotalCartQuantity(): number {
    return (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalCartPrice(): number {
    return (cartItems || []).reduce((sum, item) => sum + item.totalPrice, 0);
  }

  function getCurrentItemQuantity(sku: string): number {
    return (cartItems || []).find((item) => item.sku === sku)?.quantity ?? 0;
  }

  function getCartStatus(sku: string): boolean {
    return (cartItems || []).some((item) => item.sku === sku);
  }

  function getShippingStatus(): boolean {
    return (cartItems || []).some((item) => item.freeShipping);
  }

  const handleDiscountCouponApply = useCallback(
    (discountCoupon: DiscountCoupon) => {
      setDiscountCoupon(discountCoupon);
      setCartItems((prevItems) => {
        return (prevItems || []).map((item) => {
          if (
            (item.category as Category).title ===
            discountCoupon.metadata.category
          ) {
            const discountedPrice =
              item.price * (1 - discountCoupon.coupon.percent_off / 100);
            return {
              ...item,
              price: discountedPrice,
              totalPrice: discountedPrice * item.quantity,
            };
          }
          return item;
        });
      });
    },
    []
  );

  function getDiscountedAmount(): number {
    return (
      (cartItems || [])
        .filter((item) => item.price < item.originalPrice)
        .reduce((sum, item) => sum + item.quantity * item.originalPrice, 0) -
      (cartItems || [])
        .filter((item) => item.price < item.originalPrice)
        .reduce((sum, item) => sum + item.totalPrice, 0)
    );
  }

  function clearCartAndDiscount(): void {
    clearCart();
    setDiscountCoupon(null);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("discountCoupon");
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems ?? [],
        discountCoupon,
        isCartLoading,
        addItem,
        setDiscountCoupon,
        deleteItem,
        increaseItemQuantity,
        decreaseItemQuantity,
        clearCart,
        getTotalCartQuantity,
        getTotalCartPrice,
        getCurrentItemQuantity,
        getCartStatus,
        getShippingStatus,
        handleDiscountCouponApply,
        getDiscountedAmount,
        clearCartAndDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("CartContext was used outside the CartContextProvider");
  }

  return context;
}

export { CartProvider, useCartContext };
