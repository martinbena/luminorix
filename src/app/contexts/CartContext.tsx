"use client";

import { ProductWithVariant } from "@/models/Product";
import { PropsWithChildren, createContext, useContext, useState } from "react";

interface CartItem extends ProductWithVariant {
  quantity: number;
  totalPrice: number;
}

const CartContext = createContext({});

function CartProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addItem(product: CartItem) {
    setCartItems([...cartItems, product]);
  }

  function deleteItem(sku: string) {
    const updatedItems = cartItems.filter((item) => item.sku !== sku);
    setCartItems(updatedItems);
  }

  function increaseItemQuantity(sku: string) {
    const item = cartItems.find((item) => item.sku === sku);
    if (!item) return;
    item.quantity++;
    item.totalPrice = item.quantity * item.price;
  }

  function decreaseItemQuantity(sku: string) {
    const item = cartItems.find((item) => item.sku === sku);
    if (!item) return;
    item.quantity--;
    item.totalPrice = item.quantity * item.price;
  }

  function clearCart() {
    setCartItems([]);
  }

  function getTotalCartQuantity() {
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalCartPrice() {
    cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  function getCurrentItemQuantity(sku: string) {
    cartItems.find((item) => item.sku === sku)?.quantity ?? 0;
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
