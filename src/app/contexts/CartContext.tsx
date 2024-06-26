"use client";

import { ProductWithVariant } from "@/models/Product";
import { WishlistItem } from "@/models/User";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
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
>;

export interface CartItem extends CartProductProps {
  quantity: number;
  totalPrice: number;
}

interface CartContextProps {
  cartItems: CartItem[];
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
}

const CartContext = createContext({} as CartContextProps);

function CartProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);

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
    if (cartItems !== null) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  function addItem(product: ProductWithVariant | WishlistItem): void {
    const newItem = {
      _id: product._id,
      sku: product.sku,
      title: product.title,
      price: product.price,
      brand: product.brand,
      freeShipping: product.freeShipping,
      image: product.image,
      color: product.color,
      size: product.size,
      slug: product.slug,
      stock: product.stock,
    } as CartProductProps;
    setCartItems((prevItems) => [
      ...(prevItems || []),
      { ...newItem, quantity: 1, totalPrice: product.price },
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

  // if (cartItems === null) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <div className="form__loader" />
  //     </div>
  //   );
  // }

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems ?? [],
        isCartLoading,
        addItem,
        deleteItem,
        increaseItemQuantity,
        decreaseItemQuantity,
        clearCart,
        getTotalCartQuantity,
        getTotalCartPrice,
        getCurrentItemQuantity,
        getCartStatus,
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
