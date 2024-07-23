"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import { Category } from "@/models/Category";
import CartItem from "./CartItem";

interface CartItemsProps {
  type?: string;
}

export default function CartItems({ type = "cart" }: CartItemsProps) {
  const { cartItems } = useCartContext();
  console.log(cartItems);

  return (
    <ul className="flex flex-col gap-4">
      {cartItems
        .slice()
        .sort((a, b) => {
          const titleA = (a.category as Category).title;
          const titleB = (b.category as Category).title;
          return titleA.localeCompare(titleB);
        })
        .map((item) => {
          return <CartItem type={type} key={item.sku} item={item} />;
        })}
    </ul>
  );
}
