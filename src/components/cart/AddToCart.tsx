"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import Button from "../ui/Button";
import { CartActionsProps } from "./CartActions";

export default function AddToCart({ product }: CartActionsProps) {
  const { addItem } = useCartContext();
  return (
    <Button type="secondary" onClick={() => addItem(product)}>
      Add to cart
    </Button>
  );
}
