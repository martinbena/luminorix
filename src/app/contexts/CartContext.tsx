"use client";

import { ProductWithVariant } from "@/models/Product";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type CartProductProps = Pick<
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
  addItem: (product: ProductWithVariant) => void;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addItem(product: ProductWithVariant): void {
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
    setCartItems([
      ...cartItems,
      { ...newItem, quantity: 1, totalPrice: product.price },
    ]);
  }

  function deleteItem(sku: string): void {
    const updatedItems = cartItems.filter((item) => item.sku !== sku);
    setCartItems(updatedItems);
  }

  function increaseItemQuantity(sku: string): void {
    const itemIndex = cartItems.findIndex((item) => item.sku === sku);
    if (itemIndex === -1) return;
    const item = cartItems[itemIndex];
    if (item.quantity === item.stock) return;

    const updatedItem = {
      ...item,
      quantity: item.quantity + 1,
      totalPrice: (item.quantity + 1) * item.price,
    };
    const newCartItems = [
      ...cartItems.slice(0, itemIndex),
      updatedItem,
      ...cartItems.slice(itemIndex + 1),
    ];
    setCartItems(newCartItems);
  }

  function decreaseItemQuantity(sku: string): void {
    const itemIndex = cartItems.findIndex((item) => item.sku === sku);
    if (itemIndex === -1) return;
    const item = cartItems[itemIndex];
    if (item.quantity === 1) {
      deleteItem(sku);
      return;
    }

    const updatedItem = {
      ...item,
      quantity: item.quantity - 1,
      totalPrice: (item.quantity - 1) * item.price,
    };
    const newCartItems = [
      ...cartItems.slice(0, itemIndex),
      updatedItem,
      ...cartItems.slice(itemIndex + 1),
    ];
    setCartItems(newCartItems);
  }

  function clearCart(): void {
    setCartItems([]);
  }

  function getTotalCartQuantity(): number {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalCartPrice(): number {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  function getCurrentItemQuantity(sku: string): number {
    return cartItems.find((item) => item.sku === sku)?.quantity ?? 0;
  }

  function getCartStatus(sku: string): boolean {
    return cartItems.some((item) => item.sku === sku);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
